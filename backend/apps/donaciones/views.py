from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Donante, Donacion
from .serializers import DonanteSerializer, DonacionSerializer

class DonanteViewSet(viewsets.ModelViewSet):
    queryset = Donante.objects.all()
    serializer_class = DonanteSerializer
    search_fields = ['donante', 'identificacion', 'correo', 'ciudad']
    filterset_fields = ['tipo_id', 'tipo_donante', 'ciudad']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Support both naming conventions
        start_date = self.request.query_params.get('start_date') or self.request.query_params.get('fecha_desde')
        end_date = self.request.query_params.get('end_date') or self.request.query_params.get('fecha_hasta')
        
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
            
        return queryset

    @action(detail=False, methods=['get'])
    def top(self, request):
        """Retorna los 10 donantes con mayor monto total donado"""
        top_donantes = Donante.objects.annotate(
            total=Sum('donaciones__monto')
        ).order_by('-total')[:10]
        serializer = self.get_serializer(top_donantes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def kpis(self, request):
        """KPIs de donantes (Cohorte Analysis)"""
        from django.utils import timezone
        from django.db.models import Sum, Max, Count, Q
        
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Base Queryset (Cohorte)
        qs_donantes = Donante.objects.all()
        if start_date:
            qs_donantes = qs_donantes.filter(created_at__date__gte=start_date)
        if end_date:
            qs_donantes = qs_donantes.filter(created_at__date__lte=end_date)

        # Estados válidos para cálculos financieros
        estados_validos = [
            'APROBADA', 'Aprobada', 'aprobada', 
            'COMPLETADO', 'Completado', 'completado', 'Completada',
            'CONFIRMADO', 'Confirmado', 'confirmado',
            'EXITOSA', 'Exitosa', 'exitosa'
        ]

        # 1. Básicos de la Cohorte
        total_donantes = qs_donantes.count()
        
        # Donantes con TIPO 'PERSONA_NATURAL' (ejemplo de desglose simple si se requiere, aquí mantengo lógica general)
        
        # Recurrentes en esta cohorte (Donantes creados en X fecha que se volvieron recurrentes)
        recurrentes = qs_donantes.annotate(
            num_validas=Count('donaciones', filter=Q(donaciones__estado__in=estados_validos))
        ).filter(num_validas__gt=1).count()

        # Nuevos este mes (Si hay filtro, mostramos total del filtro como 'Nuevos en Periodo')
        # Si NO hay filtro, mantenemos lógica original de "Mes Actual"
        if start_date or end_date:
            nuevos_mes = total_donantes # Todos son "nuevos" en el periodo seleccionado
        else:
            now = timezone.now()
            nuevos_mes = Donante.objects.filter(
                created_at__month=now.month,
                created_at__year=now.year
            ).count()

        # 2. Financieros de la COHORTE
        # LTV = Total Recaudado por ESTOS donantes (histórico) / Cantidad
        # Nota: Calculamos el valor de estos donantes a lo largo del tiempo
        donantes_ids = qs_donantes.values_list('id_donante', flat=True)
        
        total_recaudado_cohorte = Donacion.objects.filter(
            id_donante__in=donantes_ids,
            estado__in=estados_validos
        ).aggregate(Sum('monto'))['monto__sum'] or 0
        
        ltv_promedio = total_recaudado_cohorte / total_donantes if total_donantes > 0 else 0

        # Mayor donación realizada por alguien de esta cohorte
        mayor_donacion = Donacion.objects.filter(
            id_donante__in=donantes_ids,
            estado__in=estados_validos
        ).aggregate(Max('monto'))['monto__max'] or 0

        return Response({
            "total_donantes": total_donantes,
            "nuevos_mes": nuevos_mes, # En contexto de filtro = Total Cohorte
            "recurrentes": recurrentes,
            "ltv_promedio": round(ltv_promedio, 2),
            "mayor_donacion": mayor_donacion
        })

    @action(detail=True, methods=['get'])
    def donaciones(self, request, pk=None):
        """Historial de donaciones de un donante específico"""
        donante = self.get_object()
        donaciones = donante.donaciones.all().order_by('-fecha_donacion')
        serializer = DonacionSerializer(donaciones, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exportar donantes a CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="donantes_{timezone.now().date()}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nombre', 'Identificación', 'Correo', 'Teléfono', 'Tipo', 'Ciudad'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        for obj in queryset:
            writer.writerow([
                obj.id_donante,
                obj.donante,
                f"{obj.tipo_id} {obj.identificacion}",
                obj.correo,
                obj.telefono,
                obj.tipo_donante,
                obj.ciudad
            ])
        return response

    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        """Exportar donantes a Excel (.xlsx)"""
        import openpyxl
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="donantes_{timezone.now().date()}.xlsx"'
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Donantes"
        
        ws.append(['ID', 'Nombre', 'Identificación', 'Correo', 'Teléfono', 'Tipo', 'Ciudad'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        for obj in queryset:
            ws.append([
                obj.id_donante,
                obj.donante,
                f"{obj.tipo_id} {obj.identificacion}",
                obj.correo,
                obj.telefono,
                obj.tipo_donante,
                obj.ciudad
            ])
            
        wb.save(response)
        return response

class DonacionViewSet(viewsets.ModelViewSet):
    queryset = Donacion.objects.all()
    serializer_class = DonacionSerializer
    filterset_fields = ['estado', 'medio_pago', 'fecha_donacion']
    search_fields = [
        'id_donante__donante', 
        'id_donante__identificacion', 
        'id_donante__correo',
        'id_caso__nombre_caso',
        'medio_pago',
        'estado'
    ]
    ordering_fields = ['monto', 'fecha_donacion']
    ordering = ['-fecha_donacion']

    def get_queryset(self):
        queryset = super().get_queryset()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            queryset = queryset.filter(fecha_donacion__range=[start_date, end_date])
            
        return queryset

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        """Retorna indicadores clave + Gráfico de serie temporal"""
        from django.db.models import Avg, Sum, Count
        from django.db.models.functions import TruncMonth
        from datetime import timedelta, date
        from django.utils.dateparse import parse_date
        from django.utils import timezone
        import calendar

        # Helpers
        def subtract_month(dt):
            year = dt.year
            month = dt.month
            if month == 1:
                year -= 1
                month = 12
            else:
                month -= 1
            
            # Ajustar al último día del mes si es necesario
            last_day = calendar.monthrange(year, month)[1]
            day = min(dt.day, last_day)
            return date(year, month, day)

        # 1. Filtros de Fecha
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        
        if start_date_str and end_date_str:
            fecha_inicio = parse_date(start_date_str)
            fecha_fin = parse_date(end_date_str)
        else:
            fecha_fin = timezone.now().date()
            fecha_inicio = fecha_fin.replace(month=1, day=1) # Por defecto año actual

        # Calcular periodo anterior (Month over Month)
        prev_fecha_inicio = subtract_month(fecha_inicio)
        prev_fecha_fin = subtract_month(fecha_fin)

        # Base Querysets
        base_queryset = Donacion.objects.filter(fecha_donacion__range=[fecha_inicio, fecha_fin])
        base_prev_queryset = Donacion.objects.filter(fecha_donacion__range=[prev_fecha_inicio, prev_fecha_fin])

        # Definición de estados
        estados_exito = ['APROBADA', 'Aprobada', 'aprobada', 'COMPLETADA', 'Completada', 'completada']
        estados_rechazo = ['RECHAZADA', 'Rechazada', 'rechazada', 'CANCELADA', 'Cancelada', 'cancelada']
        estados_fallidos = ['FALLIDA', 'Fallida', 'fallida', 'ERROR', 'Error', 'error']

        # --- A. Periodo ACTUAL ---
        qs_exitosas = base_queryset.filter(estado__in=estados_exito)
        qs_rechazadas = base_queryset.filter(estado__in=estados_rechazo)
        qs_fallidas = base_queryset.filter(estado__in=estados_fallidos)

        total_recaudado = qs_exitosas.aggregate(sum=Sum('monto'))['sum'] or 0
        promedio_donacion = qs_exitosas.aggregate(avg=Avg('monto'))['avg'] or 0
        cantidad_exitosas = qs_exitosas.count()
        cantidad_rechazadas = qs_rechazadas.count()
        cantidad_fallidas = qs_fallidas.count()
        donantes_unicos = qs_exitosas.values('id_donante').distinct().count()

        # --- B. Periodo ANTERIOR ---
        qs_exitosas_prev = base_prev_queryset.filter(estado__in=estados_exito)
        qs_rechazadas_prev = base_prev_queryset.filter(estado__in=estados_rechazo)
        qs_fallidas_prev = base_prev_queryset.filter(estado__in=estados_fallidos)

        total_recaudado_prev = qs_exitosas_prev.aggregate(sum=Sum('monto'))['sum'] or 0
        promedio_donacion_prev = qs_exitosas_prev.aggregate(avg=Avg('monto'))['avg'] or 0
        cantidad_exitosas_prev = qs_exitosas_prev.count()
        cantidad_rechazadas_prev = qs_rechazadas_prev.count()
        cantidad_fallidas_prev = qs_fallidas_prev.count()
        donantes_unicos_prev = qs_exitosas_prev.values('id_donante').distinct().count()

        # --- C. Variaciones ---
        def calc_var(actual, prev):
            if not prev or float(prev) == 0: 
                return 100.0 if actual and float(actual) > 0 else 0.0
            return ((float(actual) - float(prev)) / float(prev)) * 100.0

        overview_data = qs_exitosas.annotate(mes=TruncMonth('fecha_donacion')).values('mes').annotate(
            total=Sum('monto'), cantidad=Count('id_donacion')
        ).order_by('mes')

        grafico = [
            {"fecha": item['mes'].strftime('%Y-%m') if item['mes'] else 'S/F', "monto": item['total'], "cantidad": item['cantidad']}
            for item in overview_data if item['mes']
        ]

        return Response({
            "total_recaudado": float(total_recaudado),
            "promedio_donacion": float(promedio_donacion),
            "cantidad_donaciones": cantidad_exitosas,
            "cantidad_exitosas": cantidad_exitosas,
            "cantidad_rechazadas": cantidad_rechazadas,
            "cantidad_fallidas": cantidad_fallidas,
            "donantes_unicos": donantes_unicos,
            
            "variacion_recaudo": round(calc_var(total_recaudado, total_recaudado_prev), 1),
            "variacion_promedio": round(calc_var(promedio_donacion, promedio_donacion_prev), 1),
            "variacion_exitosas": round(calc_var(cantidad_exitosas, cantidad_exitosas_prev), 1),
            "variacion_rechazadas": round(calc_var(cantidad_rechazadas, cantidad_rechazadas_prev), 1),
            "variacion_fallidas": round(calc_var(cantidad_fallidas, cantidad_fallidas_prev), 1),
            "variacion_donantes_unicos": round(calc_var(donantes_unicos, donantes_unicos_prev), 1),
            "variacion_total_intentos": round(calc_var(
                cantidad_exitosas + cantidad_rechazadas + cantidad_fallidas,
                cantidad_exitosas_prev + cantidad_rechazadas_prev + cantidad_fallidas_prev
            ), 1),
            "chart_data": grafico
        })

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exportar donaciones a CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="donaciones_{timezone.now().date()}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Donante', 'Caso', 'Monto', 'Fecha', 'Estado', 'Medio Pago'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filtros de fecha manuales
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        if fecha_desde:
            queryset = queryset.filter(fecha_donacion__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_donacion__lte=fecha_hasta)
            
        for obj in queryset:
            writer.writerow([
                obj.id_donacion,
                obj.id_donante.donante if obj.id_donante else 'Anónimo',
                obj.id_caso.nombre_caso if obj.id_caso else '-',
                obj.monto,
                obj.fecha_donacion,
                obj.estado,
                obj.medio_pago
            ])
            
        return response

    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        """Exportar donaciones a Excel (.xlsx)"""
        import openpyxl
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="donaciones_{timezone.now().date()}.xlsx"'
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Donaciones"
        
        # Headers
        headers = ['ID', 'Donante', 'Caso', 'Monto', 'Fecha', 'Estado', 'Medio Pago']
        ws.append(headers)
        
        # Get data (filtra por start_date/end_date si estan en params gracias a get_queryset overridden)
        queryset = self.filter_queryset(self.get_queryset())
        
        # Soporte legacy para fecha_desde/fecha_hasta si se usan especificamente
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        if fecha_desde:
            queryset = queryset.filter(fecha_donacion__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_donacion__lte=fecha_hasta)
            
        for obj in queryset:
            ws.append([
                obj.id_donacion,
                obj.id_donante.donante if obj.id_donante else 'Anónimo',
                obj.id_caso.nombre_caso if obj.id_caso else '-',
                obj.monto,
                obj.fecha_donacion,
                obj.estado,
                obj.medio_pago
            ])
            
        wb.save(response)
        return response
