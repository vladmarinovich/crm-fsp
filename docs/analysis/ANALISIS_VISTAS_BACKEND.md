# Análisis Completo de Vistas Backend - CRM Salvando Patitas

**Fecha:** 2025-12-14  
**Objetivo:** Revisar todas las vistas del backend para asegurar consistencia en filtros, estados y agregaciones.

---

## 📊 RESUMEN EJECUTIVO

### Problemas Identificados y Corregidos en Esta Sesión:

1. ✅ **DashboardView** - Agregación múltiple corregida con Subqueries
2. ⚠️ **DonacionViewSet.kpis** - Necesita filtrado por fechas
3. ⚠️ **GastoViewSet.kpis** - Necesita filtrado por fechas y estados
4. ⚠️ **CasoViewSet.balance** - Necesita filtrado de estados

---

## 1️⃣ DASHBOARDVIEW (✅ CORREGIDO)

**Archivo:** `backend/apps/core/views.py`

### Problema Original:
```python
# ❌ INCORRECTO - Agregación múltiple causa resultados incorrectos
casos_activos = Caso.objects.filter(fecha_salida__isnull=True).annotate(
    total_recaudado=Sum('donaciones__monto', filter=rel_donacion_filters),
    total_gastado=Sum('gastos__monto', filter=rel_gasto_filters)
).exclude(total_recaudado__isnull=True).order_by('-total_recaudado')[:5]
```

**Razón del Error:**
- Django ORM hace un JOIN entre `Caso -> Donaciones` y `Caso -> Gastos`
- Esto crea un producto cartesiano que multiplica los valores
- Ejemplo: Si un caso tiene 3 donaciones y 2 gastos, Django crea 6 filas (3×2)
- El `Sum()` suma sobre estas 6 filas, duplicando/triplicando valores

### Solución Implementada:
```python
# ✅ CORRECTO - Subqueries independientes
sq_recaudado = Donacion.objects.filter(
    donacion_filters,
    id_caso=OuterRef('pk')
).values('id_caso').annotate(sum=Sum('monto')).values('sum')

sq_gastado = Gasto.objects.filter(
    gasto_filters,
    id_caso=OuterRef('pk')
).values('id_caso').annotate(sum=Sum('monto')).values('sum')

casos_activos = Caso.objects.filter(fecha_salida__isnull=True).annotate(
    total_recaudado=Coalesce(Subquery(sq_recaudado), 0.0),
    total_gastado=Coalesce(Subquery(sq_gastado), 0.0)
).filter(total_recaudado__gt=0).order_by('-total_recaudado')[:5]
```

### Estados Válidos Definidos:
```python
valid_statuses = ['APROBADA', 'Aprobada', 'aprobada', 'Completada', 'COMPLETADA', 'completada']
donacion_filters = Q(estado__in=valid_statuses)
gasto_filters = Q() & ~Q(estado__in=['ANULADO', 'Anulado', 'anulado'])
```

### Filtrado por Fechas:
- ✅ Soporta `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- ✅ Calcula periodo anterior automáticamente para trends
- ✅ Aplica filtros a donaciones, gastos y relaciones

---

## 2️⃣ DONACIONVIEWSET.KPIS (⚠️ NECESITA CORRECCIÓN)

**Archivo:** `backend/apps/donaciones/views.py`

### Problemas Actuales:

#### A. No respeta filtros de fecha del frontend
```python
# ❌ PROBLEMA: Solo usa mes/año actual, ignora parámetros de request
total_mes = Donacion.objects.filter(
    filtros_exito,
    fecha_donacion__month=current_month,
    fecha_donacion__year=current_year
).aggregate(sum=Sum('monto'))['sum'] or 0
```

#### B. Estados inconsistentes con Dashboard
```python
# ⚠️ INCONSISTENCIA: Dashboard usa solo 'APROBADA' y 'COMPLETADA'
estados_exito = [
    'APROBADA', 'Aprobada', 'aprobada', 
    'COMPLETADA', 'Completada', 'completada', 
    'EXITOSA', 'Exitosa', 'exitosa',  # ← No usado en Dashboard
    'CONFIRMADO', 'Confirmado', 'confirmado', 'Confirmada'  # ← No usado en Dashboard
]
```

### Corrección Recomendada:

```python
@action(detail=False, methods=['get'])
def kpis(self, request):
    """Retorna indicadores clave + Gráfico de serie temporal (Solo Exitosas)"""
    from django.utils import timezone
    from django.db.models import Avg, Sum, Count, Q
    from django.db.models.functions import TruncMonth
    from django.utils.dateparse import parse_date

    # Obtener parámetros de fecha
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    start_date = parse_date(start_date_str) if start_date_str else None
    end_date = parse_date(end_date_str) if end_date_str else None

    # Estados válidos (consistente con Dashboard)
    estados_exito = ['APROBADA', 'Aprobada', 'aprobada', 'COMPLETADA', 'Completada', 'completada']
    filtros_exito = Q(estado__in=estados_exito)

    # Aplicar filtros de fecha
    if start_date:
        filtros_exito &= Q(fecha_donacion__gte=start_date)
    if end_date:
        filtros_exito &= Q(fecha_donacion__lte=end_date)

    # 1. KPIs Tarjetas (Filtrados)
    total_historico = Donacion.objects.filter(filtros_exito).aggregate(sum=Sum('monto'))['sum'] or 0
    count = Donacion.objects.filter(filtros_exito).count()
    promedio = Donacion.objects.filter(filtros_exito).aggregate(avg=Avg('monto'))['avg'] or 0

    # 2. Serie Temporal (Filtrada)
    overview_data = Donacion.objects.filter(filtros_exito).annotate(
        mes=TruncMonth('fecha_donacion')
    ).values('mes').annotate(
        total=Sum('monto'),
        cantidad=Count('id_donacion')
    ).order_by('mes')

    grafico = [
        {
            "fecha": item['mes'].strftime('%Y-%m') if item['mes'] else 'S/F',
            "monto": item['total'],
            "cantidad": item['cantidad']
        }
        for item in overview_data if item['mes']
    ]

    return Response({
        "cards": {
            "total_historico": total_historico,
            "cantidad_donaciones": count,
            "ticket_promedio": round(promedio, 2)
        },
        "grafico": grafico
    })
```

---

## 3️⃣ GASTOVIEWSET.KPIS (⚠️ NECESITA CORRECCIÓN)

**Archivo:** `backend/apps/finanzas/views.py`

### Problemas Actuales:

#### A. No filtra estados anulados
```python
# ❌ PROBLEMA: Incluye gastos ANULADOS en los totales
gasto_historico = Gasto.objects.aggregate(Sum('monto'))['monto__sum'] or 0
```

#### B. No respeta filtros de fecha del frontend
```python
# ❌ PROBLEMA: Solo usa mes/año actual
gasto_mes = Gasto.objects.filter(
    fecha_pago__month=now.month,
    fecha_pago__year=now.year
).aggregate(Sum('monto'))['monto__sum'] or 0
```

### Corrección Recomendada:

```python
@action(detail=False, methods=['get'])
def kpis(self, request):
    """KPIs financieros + Gráfico gastos"""
    from django.utils import timezone
    from django.db.models import Sum, Count, Q
    from django.db.models.functions import TruncMonth
    from django.utils.dateparse import parse_date

    # Obtener parámetros de fecha
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    start_date = parse_date(start_date_str) if start_date_str else None
    end_date = parse_date(end_date_str) if end_date_str else None

    # Filtro base: Excluir anulados (consistente con Dashboard)
    filtros_gasto = Q() & ~Q(estado__in=['ANULADO', 'Anulado', 'anulado'])

    # Aplicar filtros de fecha
    if start_date:
        filtros_gasto &= Q(fecha_pago__gte=start_date)
    if end_date:
        filtros_gasto &= Q(fecha_pago__lte=end_date)

    # 1. KPIs
    gasto_historico = Gasto.objects.filter(filtros_gasto).aggregate(Sum('monto'))['monto__sum'] or 0

    # 2. Serie Temporal
    overview_data = Gasto.objects.filter(filtros_gasto).annotate(
        mes=TruncMonth('fecha_pago')
    ).values('mes').annotate(
        total=Sum('monto'),
        cantidad=Count('id_gasto')
    ).order_by('mes')

    grafico = [
        {
            "fecha": item['mes'].strftime('%Y-%m') if item['mes'] else 'S/F',
            "monto": item['total'],
            "cantidad": item['cantidad']
        }
        for item in overview_data if item['mes']
    ]

    return Response({
        "cards": {
            "gasto_historico": gasto_historico
        },
        "grafico": grafico
    })
```

---

## 4️⃣ CASOVIEWSET.BALANCE (⚠️ NECESITA CORRECCIÓN)

**Archivo:** `backend/apps/casos/views.py`

### Problema Actual:

```python
# ❌ PROBLEMA: No filtra estados de donaciones/gastos
total_donado = donaciones.aggregate(Sum('monto'))['monto__sum'] or 0
total_gastado = gastos.aggregate(Sum('monto'))['monto__sum'] or 0
```

### Corrección Recomendada:

```python
@action(detail=True, methods=['get'])
def balance(self, request, pk=None):
    """Retorna donaciones y gastos de un caso específico"""
    from django.db.models import Sum, Q
    
    caso = self.get_object()
    
    # Filtros de estado
    estados_validos = ['APROBADA', 'Aprobada', 'aprobada', 'COMPLETADA', 'Completada', 'completada']
    
    # Donaciones válidas
    donaciones = caso.donaciones.filter(estado__in=estados_validos)
    total_donado = donaciones.aggregate(Sum('monto'))['monto__sum'] or 0
    
    # Gastos válidos (excluir anulados)
    gastos = caso.gastos.exclude(estado__in=['ANULADO', 'Anulado', 'anulado'])
    total_gastado = gastos.aggregate(Sum('monto'))['monto__sum'] or 0
    
    return Response({
        "caso": caso.nombre_caso,
        "total_recaudado": total_donado,
        "total_gastado": total_gastado,
        "balance": total_donado - total_gastado,
        "donaciones": DonacionSerializer(donaciones, many=True).data,
        "gastos": GastoSerializer(gastos, many=True).data
    })
```

---

## 📋 CHECKLIST DE CONSISTENCIA

### Estados Válidos (Estandarizar en TODO el proyecto):

```python
# Donaciones Válidas
ESTADOS_DONACION_VALIDOS = ['APROBADA', 'Aprobada', 'aprobada', 'COMPLETADA', 'Completada', 'completada']

# Gastos Inválidos
ESTADOS_GASTO_INVALIDOS = ['ANULADO', 'Anulado', 'anulado']

# Casos Activos
CASOS_ACTIVOS_FILTER = Q(fecha_salida__isnull=True)
```

### Filtrado por Fechas (Estandarizar):

```python
# Parámetros de request
start_date_str = request.query_params.get('start_date')
end_date_str = request.query_params.get('end_date')
start_date = parse_date(start_date_str) if start_date_str else None
end_date = parse_date(end_date_str) if end_date_str else None

# Aplicar a filtros
if start_date:
    filtros &= Q(fecha_campo__gte=start_date)
if end_date:
    filtros &= Q(fecha_campo__lte=end_date)
```

---

## 🎯 ACCIONES RECOMENDADAS

### Prioridad ALTA:
1. ✅ **DashboardView** - Ya corregido con Subqueries
2. 🔧 **DonacionViewSet.kpis** - Agregar filtrado por fechas
3. 🔧 **GastoViewSet.kpis** - Agregar filtrado por fechas y estados

### Prioridad MEDIA:
4. 🔧 **CasoViewSet.balance** - Filtrar estados de donaciones/gastos
5. 📝 **Crear constantes globales** - Para estados válidos/inválidos

### Prioridad BAJA:
6. 📚 **Documentación** - Agregar docstrings explicando filtros
7. 🧪 **Tests** - Crear tests unitarios para cada vista

---

## 🔍 PATRÓN RECOMENDADO PARA NUEVAS VISTAS

```python
@action(detail=False, methods=['get'])
def mi_vista(self, request):
    """Descripción de la vista"""
    from django.db.models import Sum, Q
    from django.utils.dateparse import parse_date
    
    # 1. Obtener parámetros de fecha
    start_date = parse_date(request.query_params.get('start_date')) if request.query_params.get('start_date') else None
    end_date = parse_date(request.query_params.get('end_date')) if request.query_params.get('end_date') else None
    
    # 2. Definir filtros base (estados)
    filtros = Q(estado__in=ESTADOS_VALIDOS)
    
    # 3. Aplicar filtros de fecha
    if start_date:
        filtros &= Q(fecha__gte=start_date)
    if end_date:
        filtros &= Q(fecha__lte=end_date)
    
    # 4. Ejecutar query
    resultado = Modelo.objects.filter(filtros).aggregate(Sum('campo'))
    
    # 5. Retornar respuesta
    return Response({...})
```

---

## 📊 IMPACTO DE LAS CORRECCIONES

### Antes (❌):
- Dashboard mostraba `total_gastado = 0` para todos los casos
- Donaciones/Gastos no respetaban filtros de fecha del frontend
- Inconsistencia entre vistas (algunos filtraban estados, otros no)

### Después (✅):
- Dashboard muestra valores correctos de gastos por caso
- Todas las vistas respetan filtros de fecha
- Consistencia total en manejo de estados
- Código más mantenible y predecible

---

**Generado por:** Antigravity AI  
**Última actualización:** 2025-12-14 11:25
