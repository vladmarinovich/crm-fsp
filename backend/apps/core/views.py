from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Q, OuterRef, Subquery
from backend.apps.donaciones.models import Donacion, Donante
from backend.apps.finanzas.models import Gasto
from backend.apps.casos.models import Caso
from backend.apps.casos.serializers import CasoSerializer

from datetime import timedelta, datetime
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncMonth, Coalesce

class DashboardView(APIView):
    """
    Vista consolidada para el Dashboard principal.
    Soporta filtrado por fecha: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    """
    def get(self, request):
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        # 1. Definir Estados Validos (Case-insensitive support logic via list expansion)
        valid_statuses = ['APROBADA', 'Aprobada', 'aprobada', 'Completada', 'COMPLETADA', 'completada']
        
        # Filtros base
        donacion_filters = Q(estado__in=valid_statuses)
        rel_donacion_filters = Q(donaciones__estado__in=valid_statuses)
        gasto_filters = Q(estado__iexact='PAGADO')
        rel_gasto_filters = Q(gastos__estado__iexact='PAGADO')

        # 2. Manejo de Fechas y Periodo Anterior
        start_date = parse_date(start_date_str) if start_date_str else None
        end_date = parse_date(end_date_str) if end_date_str else None

        # Logic for previous period
        prev_start_date = None
        prev_end_date = None

        if start_date and end_date:
            # Rango definido (e.g. This Month)
            donacion_filters &= Q(fecha_donacion__gte=start_date) & Q(fecha_donacion__lte=end_date)
            gasto_filters &= Q(fecha_pago__gte=start_date) & Q(fecha_pago__lte=end_date)
            rel_donacion_filters &= Q(donaciones__fecha_donacion__gte=start_date) & Q(donaciones__fecha_donacion__lte=end_date)
            rel_gasto_filters &= Q(gastos__fecha_pago__gte=start_date) & Q(gastos__fecha_pago__lte=end_date)

            # Calculate previous period filtering
            duration = end_date - start_date
            prev_end_date = start_date - timedelta(days=1)
            prev_start_date = prev_end_date - duration
        
        elif start_date:
             # Solo start_date (Open ended forward)
            donacion_filters &= Q(fecha_donacion__gte=start_date)
            gasto_filters &= Q(fecha_pago__gte=start_date)
            rel_donacion_filters &= Q(donaciones__fecha_donacion__gte=start_date)
            rel_gasto_filters &= Q(gastos__fecha_pago__gte=start_date)
        
        elif end_date:
            donacion_filters &= Q(fecha_donacion__lte=end_date)
            gasto_filters &= Q(fecha_pago__lte=end_date)
            rel_donacion_filters &= Q(donaciones__fecha_donacion__lte=end_date)
            rel_gasto_filters &= Q(gastos__fecha_pago__lte=end_date)

        # 3. Totales Actuales
        total_donado = Donacion.objects.filter(donacion_filters).aggregate(Sum('monto'))['monto__sum'] or 0
        total_gastado = Gasto.objects.filter(gasto_filters).aggregate(Sum('monto'))['monto__sum'] or 0
        balance = total_donado - total_gastado

        # 4. Totales Periodo Anterior (Solo si hay rango completo)
        prev_total_donado = 0
        prev_total_gastado = 0
        
        if prev_start_date and prev_end_date:
            prev_donacion_filters = Q(estado__in=valid_statuses) & Q(fecha_donacion__gte=prev_start_date) & Q(fecha_donacion__lte=prev_end_date)
            prev_gasto_filters = Q(estado__iexact='PAGADO') & Q(fecha_pago__gte=prev_start_date) & Q(fecha_pago__lte=prev_end_date)
            
            prev_total_donado = Donacion.objects.filter(prev_donacion_filters).aggregate(Sum('monto'))['monto__sum'] or 0
            prev_total_gastado = Gasto.objects.filter(prev_gasto_filters).aggregate(Sum('monto'))['monto__sum'] or 0

        # Función helper para variación
        def calculate_trend(current, previous):
            if not previous or previous == 0:
                if current > 0: return {"value": 100, "isPositive": True, "label": "vs periodo anterior"}
                return {"value": 0, "isPositive": True, "label": "vs periodo anterior"}
            
            diff = current - previous
            percent = (diff / previous) * 100
            return {
                "value": round(abs(percent), 1),
                "isPositive": percent >= 0,
                "label": "vs periodo anterior"
            }

        trends = {
            "total_donado": calculate_trend(total_donado, prev_total_donado),
            "total_gastado": calculate_trend(total_gastado, prev_total_gastado),
            "balance_neto": calculate_trend(balance, (prev_total_donado - prev_total_gastado))
        }

        # 5. Top Países
        top_paises = Donante.objects.values('pais').annotate(
            count=Count('id_donante'),
            total_dinero=Sum('donaciones__monto', filter=rel_donacion_filters)
        ).exclude(total_dinero__isnull=True).order_by('-total_dinero')[:5]

        # 6. Casos Destacados (Solo casos abiertos) using Subqueries to avoid multiple aggregation issues
        from decimal import Decimal
        
        sq_recaudado = Donacion.objects.filter(
            donacion_filters,
            id_caso=OuterRef('pk')
        ).values('id_caso').annotate(sum=Sum('monto')).values('sum')

        sq_gastado = Gasto.objects.filter(
            gasto_filters,
            id_caso=OuterRef('pk')
        ).values('id_caso').annotate(sum=Sum('monto')).values('sum')

        from django.db.models import DecimalField
        
        casos_activos = Caso.objects.filter(fecha_salida__isnull=True).annotate(
            total_recaudado=Coalesce(Subquery(sq_recaudado), Decimal('0'), output_field=DecimalField()),
            total_gastado=Coalesce(Subquery(sq_gastado), Decimal('0'), output_field=DecimalField())
        ).filter(total_recaudado__gt=0).order_by('-total_recaudado')[:5]

        # 7. Balance Histórico (Serie Temporal)
        # Re-use filters but ensure we are grouping by month
        
        donaciones_timeline = Donacion.objects.filter(donacion_filters).annotate(
            mes=TruncMonth('fecha_donacion')
        ).values('mes').annotate(total=Sum('monto')).order_by('mes')

        gastos_timeline = Gasto.objects.filter(gasto_filters).annotate(
            mes=TruncMonth('fecha_pago')
        ).values('mes').annotate(total=Sum('monto')).order_by('mes')

        # Merge timelines
        timeline_dict = {}

        for d in donaciones_timeline:
            if not d['mes']: continue
            key = d['mes'].strftime('%Y-%m')
            timeline_dict.setdefault(key, {'fecha': key, 'donaciones': 0, 'gastos': 0, 'balance': 0})
            timeline_dict[key]['donaciones'] = d['total']

        for g in gastos_timeline:
            if not g['mes']: continue
            key = g['mes'].strftime('%Y-%m')
            timeline_dict.setdefault(key, {'fecha': key, 'donaciones': 0, 'gastos': 0, 'balance': 0})
            timeline_dict[key]['gastos'] = g['total']

        # Calculate balance and sort
        balance_historico = []
        for key in sorted(timeline_dict.keys()):
            item = timeline_dict[key]
            item['balance'] = item['donaciones'] - item['gastos']
            balance_historico.append(item)

        # Gastos por tipo de proveedor - DESHABILITADO TEMPORALMENTE
        # gastos_por_categoria = Gasto.objects.filter(gasto_filters).exclude(
        #     id_proveedor__isnull=True
        # ).values('id_proveedor__tipo_proveedor').annotate(
        #     total=Sum('monto'),
        #     cantidad=Count('id_gasto')
        # ).order_by('-total')
        # gastos_por_categoria = [{
        #     'categoria': g['id_proveedor__tipo_proveedor'] or 'Sin categoría',
        #     'total': float(g['total'] or 0),
        #     'cantidad': g['cantidad']
        # } for g in gastos_por_categoria]
        gastos_por_categoria = []

        # Top 5 Donantes - DESHABILITADO TEMPORALMENTE (causando error)
        # top_donantes_agg = Donacion.objects.filter(donacion_filters).values(
        #     'id_donante',
        #     'id_donante__nombre',
        #     'id_donante__pais'
        # ).annotate(
        #     total_donado=Sum('monto'),
        #     num_donaciones=Count('id_donacion')
        # ).order_by('-total_donado')[:5]

        # top_donantes_data = [{
        #     'id': d['id_donante'],
        #     'nombre': d['id_donante__nombre'],
        #     'pais': d['id_donante__pais'] or 'Sin país',
        #     'total_donado': float(d['total_donado'] or 0),
        #     'num_donaciones': d['num_donaciones']
        # } for d in top_donantes_agg]
        top_donantes_data = []

        return Response({
            "kpis": {
                "total_donado": total_donado,
                "total_gastado": total_gastado,
                "balance_neto": balance,
                "casos_activos_count": Caso.objects.filter(fecha_salida__isnull=True).count()
            },
            "trends": trends,
            "top_paises": top_paises,
            "casos_destacados": CasoSerializer(casos_activos, many=True).data,
            "balance_historico": balance_historico,
            "gastos_por_categoria": list(gastos_por_categoria),
            "top_donantes": top_donantes_data
        })
