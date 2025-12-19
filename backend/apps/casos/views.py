from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q, F, ExpressionWrapper, fields
from django.utils import timezone
from datetime import date
from .models import Caso, HogarDePaso
from .serializers import CasoSerializer, HogarDePasoSerializer
from backend.apps.donaciones.serializers import DonacionSerializer
from backend.apps.finanzas.serializers import GastoSerializer

class CasoViewSet(viewsets.ModelViewSet):
    queryset = Caso.objects.all()
    serializer_class = CasoSerializer
    search_fields = ['nombre_caso', 'diagnostico']
    ordering_fields = ['fecha_ingreso', 'updated_at']
    filterset_fields = ['estado', 'veterinaria']
    ordering = ['-fecha_ingreso']

    def get_queryset(self):
        """Override to add computed fields using Subqueries to avoid aggregation issues"""
        from decimal import Decimal
        from django.db.models import DecimalField, OuterRef, Subquery
        from django.db.models.functions import Coalesce
        from backend.apps.donaciones.models import Donacion
        from backend.apps.finanzas.models import Gasto
        
        queryset = super().get_queryset()
        
        # Estados válidos para donaciones
        estados_validos = ['APROBADA', 'Aprobada', 'aprobada', 'COMPLETADA', 'Completada', 'completada']
        
        # Subquery para total_recaudado
        sq_recaudado = Donacion.objects.filter(
            id_caso=OuterRef('pk'),
            estado__in=estados_validos
        ).values('id_caso').annotate(sum=Sum('monto')).values('sum')
        
        # Subquery para total_gastado (solo gastos APROBADA o PAGADO, excluir PENDIENTE)
        sq_gastado = Gasto.objects.filter(
            id_caso=OuterRef('pk'),
            estado__in=['APROBADA', 'PAGADO']  # Excluir PENDIENTE
        ).values('id_caso').annotate(sum=Sum('monto')).values('sum')
        
        queryset = queryset.annotate(
            total_recaudado=Coalesce(Subquery(sq_recaudado), Decimal('0'), output_field=DecimalField()),
            total_gastado=Coalesce(Subquery(sq_gastado), Decimal('0'), output_field=DecimalField())
        )
        
        # Filtro de fecha para la lista principal
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            queryset = queryset.filter(fecha_ingreso__range=[start_date, end_date])
        
        return queryset

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        """Retorna indicadores clave de estado para casos"""
        from datetime import date, datetime
        from decimal import Decimal
        from django.db.models import Avg
        
        # Obtener fechas del filtro
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Querysets Base
        base_queryset = Caso.objects.all()
        casos_con_finanzas = self.get_queryset()
        
        # Aplicar filtro de fecha si existe
        if start_date and end_date:
            base_queryset = base_queryset.filter(fecha_ingreso__range=[start_date, end_date])
            casos_con_finanzas = casos_con_finanzas.filter(fecha_ingreso__range=[start_date, end_date])
        
        total = base_queryset.count()
        
        # Activos: Sin fecha de salida
        casos_activos = base_queryset.filter(fecha_salida__isnull=True)
        activos = casos_activos.count()
        
        # Desglosados por estado
        abierto = base_queryset.filter(estado=Caso.EstadoCaso.ABIERTO).count()
        en_tratamiento = base_queryset.filter(estado=Caso.EstadoCaso.EN_TRATAMIENTO).count()
        adoptados = base_queryset.filter(estado=Caso.EstadoCaso.ADOPTADO).count()
        cerrado = base_queryset.filter(estado=Caso.EstadoCaso.CERRADO).count()
        fallecido = base_queryset.filter(estado=Caso.EstadoCaso.FALLECIDO).count()
        
        # KPIs Financieros
        # Promedio recaudado por caso
        promedio_recaudado_result = casos_con_finanzas.aggregate(promedio=Avg('total_recaudado'))
        promedio_recaudado = float(promedio_recaudado_result['promedio'] or 0)
        
        # Promedio gastado por caso
        promedio_gastado_result = casos_con_finanzas.aggregate(promedio=Avg('total_gastado'))
        promedio_gastado = float(promedio_gastado_result['promedio'] or 0)
        
        # Promedio de casos mensuales
        today = date.today()
        
        if start_date and end_date:
            # Calcular meses en el rango seleccionado
            try:
                d_start = datetime.strptime(start_date, '%Y-%m-%d').date()
                d_end = datetime.strptime(end_date, '%Y-%m-%d').date()
                meses_transcurridos = ((d_end.year - d_start.year) * 12 + (d_end.month - d_start.month)) + 1
            except ValueError:
                meses_transcurridos = 12 # Fallback
        else:
            # Calcular histórico
            primer_caso = Caso.objects.order_by('fecha_ingreso').first()
            if primer_caso and primer_caso.fecha_ingreso:
                meses_transcurridos = ((today.year - primer_caso.fecha_ingreso.year) * 12 + 
                                      (today.month - primer_caso.fecha_ingreso.month))
            else:
                meses_transcurridos = 0
                
        meses_transcurridos = max(meses_transcurridos, 1)
        promedio_casos_mensuales = int(total / meses_transcurridos) if total > 0 else 0
        
        # KPIs Operativos
        # Sin hogar: Casos EN_TRATAMIENTO sin hogar asignado
        sin_hogar = base_queryset.filter(
            estado=Caso.EstadoCaso.EN_TRATAMIENTO,
            id_hogar_de_paso__isnull=True
        ).count()
        
        # Tiempo promedio: Calcular días por caso, luego promediar
        # Nota: Calculamos tiempo promedio desde ingreso hasta hoy (para activos) 
        # o hasta cierre (si quisieramos). Aquí seguimos lógica anterior: activas vs hoy.
        if activos > 0:
            # Traer solo fecha_ingreso de casos activos
            fechas = casos_activos.values_list('fecha_ingreso', flat=True)
            # Calcular días de cada caso individual
            # OJO: Si filtramos por fecha ingreso, 'casos_activos' son los que ingresaron en ese rango Y siguen activos.
            dias_por_caso = [(today - fecha).days for fecha in fechas if fecha]
            # Promediar los días de todos los casos
            dias_promedio_por_caso = int(sum(dias_por_caso) / len(dias_por_caso)) if dias_por_caso else 0
            suma_dias_activos = sum(dias_por_caso)
        else:
            dias_promedio_por_caso = 0
            suma_dias_activos = 0
        
        # KPIs Operativos Avanzados
        # Para costo diario, necesitamos incluir TODOS los gastos (incluso PENDIENTE)
        # porque queremos ver el "burn rate" real
        from backend.apps.finanzas.models import Gasto
        # Importante: total gastado de los casos activos filtrados
        total_gastado_con_pendiente = casos_activos.aggregate(
            total=Sum('gastos__monto')  # Incluye TODOS los gastos, incluso PENDIENTE
        )['total'] or 0
        
        # Costo diario promedio por caso (con todos los gastos)
        if dias_promedio_por_caso > 0 and total_gastado_con_pendiente > 0:
            costo_diario_promedio_caso = float(total_gastado_con_pendiente) / suma_dias_activos if suma_dias_activos > 0 else 0
        else:
            costo_diario_promedio_caso = 0
        
        # Costo diario total para la fundación (todos los casos activos)
        # Es el costo diario promedio multiplicado por el número de casos activos
        costo_diario_fundacion = costo_diario_promedio_caso * activos
        
        # Casos con déficit (gastado > recaudado)
        casos_con_deficit = casos_con_finanzas.filter(
            fecha_salida__isnull=True
        ).annotate(
            deficit=F('total_gastado') - F('total_recaudado')
        ).filter(deficit__gt=0).count()
        
        # Promedio gastado TOTAL (incluyendo PENDIENTE) - calculado de forma simple
        # Usamos el total de todos los casos activos
        if activos > 0:
            promedio_gastado_total = float(total_gastado_con_pendiente) / activos
        else:
            promedio_gastado_total = 0
        
        return Response({
            # KPIs Operativos
            "dias_promedio_por_caso": dias_promedio_por_caso,
            "costo_diario_promedio_caso": round(costo_diario_promedio_caso, 2),
            "costo_diario_fundacion": round(costo_diario_fundacion, 2),
            "casos_con_deficit": casos_con_deficit,
            # KPIs Financieros
            "promedio_recaudado": promedio_recaudado,
            "promedio_gastado": promedio_gastado_total,  # Ahora incluye PENDIENTE
            "promedio_casos_mensuales": promedio_casos_mensuales,
            # KPIs de Estado
            "total_historico": total,
            "casos_activos": activos,
            "abierto": abierto,
            "en_tratamiento": en_tratamiento,
            "adoptados": adoptados,
            "cerrado": cerrado,
            "fallecido": fallecido,
            # KPIs Operativos Secundarios
            "sin_hogar": sin_hogar,
            "tiempo_promedio": dias_promedio_por_caso  # Mantener compatibilidad
        })
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Retorna casos que no tienen fecha de salida (activos)"""
        casos = Caso.objects.filter(fecha_salida__isnull=True)
        serializer = self.get_serializer(casos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        """Retorna donaciones y gastos de un caso específico"""
        caso = self.get_object()
        donaciones = caso.donaciones.all()
        gastos = caso.gastos.all()
        
        total_donado = donaciones.aggregate(Sum('monto'))['monto__sum'] or 0
        total_gastado = gastos.aggregate(Sum('monto'))['monto__sum'] or 0
        
        return Response({
            "caso": caso.nombre_caso,
            "total_recaudado": total_donado,
            "total_gastado": total_gastado,
            "balance": total_donado - total_gastado,
            "donaciones": DonacionSerializer(donaciones, many=True).data,
            "gastos": GastoSerializer(gastos, many=True).data
        })

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exportar casos a CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="casos_{timezone.now().date()}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nombre', 'Estado', 'Fecha Ingreso', 'Veterinaria', 'Diagnóstico'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        if fecha_desde:
            queryset = queryset.filter(fecha_ingreso__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_ingreso__lte=fecha_hasta)
            
        # Support new params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
             queryset = queryset.filter(fecha_ingreso__gte=start_date)
        if end_date:
             queryset = queryset.filter(fecha_ingreso__lte=end_date)
            
        for obj in queryset:
            writer.writerow([
                obj.id_caso,
                obj.nombre_caso,
                obj.estado,
                obj.fecha_ingreso,
                obj.veterinaria,
                obj.diagnostico
            ])
            
        return response

    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        """Exportar casos a Excel (.xlsx)"""
        import openpyxl
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="casos_{timezone.now().date()}.xlsx"'
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Casos"
        
        headers = ['ID', 'Nombre', 'Estado', 'Fecha Ingreso', 'Veterinaria', 'Diagnóstico']
        ws.append(headers)
        
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filtros (Legacy + New)
        start_date = request.query_params.get('start_date') or request.query_params.get('fecha_desde')
        end_date = request.query_params.get('end_date') or request.query_params.get('fecha_hasta')
        
        if start_date:
            queryset = queryset.filter(fecha_ingreso__gte=start_date)
        if end_date:
            queryset = queryset.filter(fecha_ingreso__lte=end_date)
            
        for obj in queryset:
            ws.append([
                obj.id_caso,
                obj.nombre_caso,
                obj.estado,
                obj.fecha_ingreso,
                obj.veterinaria,
                obj.diagnostico
            ])
            
        wb.save(response)
        return response

class HogarDePasoViewSet(viewsets.ModelViewSet):
    queryset = HogarDePaso.objects.all()
    serializer_class = HogarDePasoSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-id_hogar_de_paso']

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exportar hogares de paso a CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="hogares_{timezone.now().date()}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nombre', 'Contacto', 'Teléfono', 'Ciudad', 'Cupo Máx'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filtro opcional por ciudad
        ciudad = request.query_params.get('ciudad')
        if ciudad:
            queryset = queryset.filter(ciudad__icontains=ciudad)
            
        for obj in queryset:
            writer.writerow([
                obj.id_hogar_de_paso,
                obj.nombre_hogar,
                obj.nombre_contacto,
                obj.telefono,
                obj.ciudad,
                obj.cupo_maximo
            ])
            
        return response
