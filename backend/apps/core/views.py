from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from backend.apps.donaciones.models import Donacion, Donante
from backend.apps.finanzas.models import Gasto
from backend.apps.casos.models import Caso
from backend.apps.casos.serializers import CasoSerializer

class DashboardView(APIView):
    """
    Vista consolidada para el Dashboard principal.
    Soporta filtrado por fecha: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    """
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Filtros base para Donaciones y Gastos
        # Support both 'APROBADA' (model) and 'Completada' (legacy/imported data)
        donacion_filters = Q(estado__in=['APROBADA', 'Completada'])
        gasto_filters = Q() & ~Q(estado='ANULADO') # Exclude ANULADO

        # Filtros específicos para agregaciones (relaciones)
        rel_donacion_filters = Q(donaciones__estado__in=['APROBADA', 'Completada'])
        rel_gasto_filters = Q() & ~Q(gastos__estado='ANULADO')

        if start_date:
            donacion_filters &= Q(fecha_donacion__gte=start_date)
            gasto_filters &= Q(fecha_pago__gte=start_date)
            rel_donacion_filters &= Q(donaciones__fecha_donacion__gte=start_date)
            rel_gasto_filters &= Q(gastos__fecha_pago__gte=start_date)
        
        if end_date:
            donacion_filters &= Q(fecha_donacion__lte=end_date)
            gasto_filters &= Q(fecha_pago__lte=end_date)
            rel_donacion_filters &= Q(donaciones__fecha_donacion__lte=end_date)
            rel_gasto_filters &= Q(gastos__fecha_pago__lte=end_date)

        # 1. Totales Generales
        total_donado = Donacion.objects.filter(donacion_filters).aggregate(Sum('monto'))['monto__sum'] or 0
        total_gastado = Gasto.objects.filter(gasto_filters).aggregate(Sum('monto'))['monto__sum'] or 0
        balance = total_donado - total_gastado

        # 2. Top Ciudades (Donantes) - Filtrando las donaciones sumadas
        # Nota: total_dinero solo sumará donaciones en el rango de fechas
        top_ciudades = Donante.objects.values('ciudad').annotate(
            count=Count('id_donante'),
            total_dinero=Sum('donaciones__monto', filter=rel_donacion_filters)
        ).exclude(total_dinero__isnull=True).order_by('-total_dinero')[:5]

        # 3. Casos con mayor actividad (más movimientos financieros en el periodo)
        casos_activos = Caso.objects.annotate(
            movimientos=Count('donaciones', filter=rel_donacion_filters) + Count('gastos', filter=rel_gasto_filters)
        ).filter(movimientos__gt=0).order_by('-movimientos')[:5]

        return Response({
            "kpis": {
                "total_donado": total_donado,
                "total_gastado": total_gastado,
                "balance_neto": balance,
                "casos_activos_count": Caso.objects.filter(fecha_salida__isnull=True).count()
            },
            "top_ciudades": top_ciudades,
            "casos_destacados": CasoSerializer(casos_activos, many=True).data
        })
