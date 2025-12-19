from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Gasto, Proveedor
from .serializers import GastoSerializer, ProveedorSerializer

class GastoViewSet(viewsets.ModelViewSet):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'fecha_pago']
    search_fields = [
        'nombre_gasto',
        'id_proveedor__nombre_proveedor',
        'id_proveedor__nit',
        'id_caso__nombre_caso',
        'estado'
    ]
    ordering_fields = ['fecha_pago', 'monto', 'nombre_gasto']
    ordering = ['-fecha_pago']

    def get_queryset(self):
        queryset = super().get_queryset()
        caso = self.request.query_params.get('caso')
        if caso:
            queryset = queryset.filter(id_caso__nombre_caso__icontains=caso)
        
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(fecha_pago__gte=start_date)
            
        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(fecha_pago__lte=end_date)
            
        return queryset

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        """KPIs financieros avanzados + Gráfico"""
        from django.utils import timezone
        from django.db.models import Sum, Count, Avg, Max, F
        from django.db.models.functions import TruncMonth
        from datetime import date, timedelta
        from django.utils.dateparse import parse_date
        import calendar

        # Helper fechas
        def subtract_month(dt):
            year = dt.year
            month = dt.month
            if month == 1:
                year -= 1
                month = 12
            else:
                month -= 1
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
            fecha_inicio = fecha_fin.replace(month=1, day=1)

        # Periodo anterior
        prev_fecha_inicio = subtract_month(fecha_inicio)
        prev_fecha_fin = subtract_month(fecha_fin)

        # Queries
        qs_actual = Gasto.objects.filter(fecha_pago__range=[fecha_inicio, fecha_fin])
        qs_prev = Gasto.objects.filter(fecha_pago__range=[prev_fecha_inicio, prev_fecha_fin])
        
        caso_param = request.query_params.get('caso')
        if caso_param:
            qs_actual = qs_actual.filter(id_caso__nombre_caso__icontains=caso_param)
            # Nota: No aplicamos filtro de caso a las métricas "previas" para mantener la comparación global? 
            # O sí deberíamos? Generalmente sí, si filtro por caso, quiero ver la varación DE ESE caso.
            qs_prev = qs_prev.filter(id_caso__nombre_caso__icontains=caso_param)

        # Partition Queries
        qs_pagados = qs_actual.filter(estado__iexact='PAGADO')
        qs_pendientes = qs_actual.filter(estado__iexact='PENDIENTE')
        
        qs_pagados_prev = qs_prev.filter(estado__iexact='PAGADO')

        # Métricas PAGADOS (Base para Total, Promedio, Numero)
        total_gasto = qs_pagados.aggregate(s=Sum('monto'))['s'] or 0
        promedio_gasto = qs_pagados.aggregate(a=Avg('monto'))['a'] or 0
        numero_gastos = qs_pagados.count()
        
        # Métricas PENDIENTES
        total_pendientes = qs_pendientes.aggregate(s=Sum('monto'))['s'] or 0
        count_pendientes = qs_pendientes.count()
        
        # Métricas Anteriores (Solo Pagados para comparativa lógica)
        total_prev = qs_pagados_prev.aggregate(s=Sum('monto'))['s'] or 0
        promedio_prev = qs_pagados_prev.aggregate(a=Avg('monto'))['a'] or 0

        # Variaciones
        def calc_var(actual, prev):
            if not prev or float(prev) == 0: 
                return 100.0 if actual and float(actual) > 0 else 0.0
            return ((float(actual) - float(prev)) / float(prev)) * 100.0

        # Serie Temporal (Muestra todo o solo pagado? Generalmente Cashflow = Pagado. Usaremos Pagado)
        overview_data = qs_pagados.annotate(mes=TruncMonth('fecha_pago')).values('mes').annotate(
            total=Sum('monto'), cantidad=Count('id_gasto')
        ).order_by('mes')

        grafico = [
            {"fecha": item['mes'].strftime('%Y-%m') if item['mes'] else 'S/F', "monto": item['total'], "cantidad": item['cantidad']}
            for item in overview_data if item['mes']
        ]

        return Response({
            "total_gasto": total_gasto,
            "promedio_gasto": round(promedio_gasto, 2),
            "numero_gastos": numero_gastos,         # Renamed from amount
            "gastos_pendientes": total_pendientes,  # New
            "count_pendientes": count_pendientes,   # New
            "variacion_total": round(calc_var(total_gasto, total_prev), 1),
            "variacion_promedio": round(calc_var(promedio_gasto, promedio_prev), 1),
            # "top_proveedor": ... (User removed request, but I can keep or ignore. Keeping backend logic doesn't hurt)
            "chart_data": grafico
        })

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exportar gastos a CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="gastos_{timezone.now().date()}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Concepto', 'Proveedor', 'Caso', 'Monto', 'Fecha', 'Estado'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        if fecha_desde:
            queryset = queryset.filter(fecha_pago__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_pago__lte=fecha_hasta)
            
        for obj in queryset:
            writer.writerow([
                obj.id_gasto,
                obj.nombre_gasto,
                obj.id_proveedor.nombre_proveedor if obj.id_proveedor else '-',
                obj.id_caso.nombre_caso if obj.id_caso else '-',
                obj.monto,
                obj.fecha_pago,
                obj.estado
            ])
            
        return response

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-id_proveedor']

    def get_queryset(self):
        queryset = super().get_queryset()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
            
        return queryset

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        """Indicadores globales de proveedores"""
        from django.utils import timezone
        from django.db.models import Count
        
        now = timezone.now()
        
        # 1. Total
        total = Proveedor.objects.count()
        
        # 2. Nuevos este mes
        nuevos = Proveedor.objects.filter(
            created_at__year=now.year,
            created_at__month=now.month
        ).count()
        
        # 3. Con actividad (tienen gastos asociados)
        con_actividad = Proveedor.objects.annotate(
            num_gastos=Count('gastos')
        ).filter(num_gastos__gt=0).count()
        
        return Response({
            "total_proveedores": total,
            "nuevos_mes": nuevos,
            "con_actividad": con_actividad
        })

    @action(detail=True, methods=['get'])
    def gastos(self, request, pk=None):
        """Historial de gastos de un proveedor específico"""
        proveedor = self.get_object()
        gastos = proveedor.gastos.all().order_by('-fecha_pago')
        serializer = GastoSerializer(gastos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def exportar_csv(self, request):
        """Exportar proveedores a CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="proveedores_{timezone.now().date()}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nombre', 'NIT', 'Contacto', 'Teléfono', 'Email'])
        
        queryset = self.filter_queryset(self.get_queryset())
        
        for obj in queryset:
            writer.writerow([
                obj.id_proveedor,
                obj.nombre_proveedor,
                obj.nit_proveedor,
                obj.nombre_contacto,
                obj.telefono_contacto,
                obj.email_contacto
            ])
            
        return response

    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        """Exportar proveedores a Excel"""
        from django.http import HttpResponse
        from openpyxl import Workbook
        from django.utils import timezone
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="proveedores_{timezone.now().date()}.xlsx"'
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Proveedores"
        
        # Headers
        headers = ['ID', 'Nombre', 'NIT', 'Contacto', 'Teléfono', 'Email', 'Gastos Totales']
        ws.append(headers)
        
        queryset = self.filter_queryset(self.get_queryset())
        
        for obj in queryset:
            # Calcular total gastado (opcional pero útil)
            total_gastos = sum(g.monto for g in obj.gastos.all())
            
            ws.append([
                obj.id_proveedor,
                obj.nombre_proveedor,
                obj.nit_proveedor,
                obj.nombre_contacto,
                obj.telefono_contacto,
                obj.email_contacto,
                total_gastos
            ])
            
        wb.save(response)
        return response
