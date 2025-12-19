# 📊 ANÁLISIS Y PROPUESTA - VISTA DE DONACIONES

## 🔍 **ESTADO ACTUAL:**

### **KPIs Existentes:**
1. ✅ Total Histórico
2. ✅ Recaudo Este Mes
3. ✅ Ticket Promedio

### **Gráficos Existentes:**
1. ✅ Evolución de Recaudo (AreaChart mensual)

### **Filtros:**
1. ✅ Búsqueda por ID/donante
2. ✅ Rango de fechas (por defecto Year to Date)
3. ✅ Exportar CSV

---

## 💡 **PROPUESTA DE MEJORA - INDICADORES OPERATIVOS:**

### **FILA 1: Indicadores de Recaudo (4 KPIs)**

#### 1. 💰 **Total Recaudado (Período Filtrado)**
- **Qué mide:** Suma total de donaciones en el período seleccionado
- **Por qué es útil:** Muestra el impacto directo del filtro de fechas
- **Cálculo:** `SUM(monto) WHERE fecha BETWEEN dateStart AND dateEnd`

#### 2. 📈 **Crecimiento vs Período Anterior**
- **Qué mide:** % de crecimiento comparado con el período anterior
- **Por qué es útil:** Identifica tendencias (creciendo o decreciendo)
- **Cálculo:** `((actual - anterior) / anterior) * 100`
- **Visual:** Badge verde (+15%) o rojo (-8%)

#### 3. 💵 **Donación Promedio**
- **Qué mide:** Monto promedio por donación
- **Por qué es útil:** Identifica si las donaciones son grandes o pequeñas
- **Cálculo:** `AVG(monto)`

#### 4. 📊 **Número de Donaciones**
- **Qué mide:** Cantidad total de donaciones
- **Por qué es útil:** Muestra volumen de actividad
- **Cálculo:** `COUNT(*)`

---

### **FILA 2: Indicadores de Donantes (4 KPIs)**

#### 1. 👥 **Donantes Activos**
- **Qué mide:** Donantes únicos que donaron en el período
- **Por qué es útil:** Mide engagement
- **Cálculo:** `COUNT(DISTINCT id_donante)`

#### 2. 🆕 **Donantes Nuevos**
- **Qué mide:** Donantes que hicieron su primera donación en el período
- **Por qué es útil:** Mide crecimiento de base de donantes
- **Cálculo:** Donantes cuya primera donación está en el período

#### 3. 🔁 **Donantes Recurrentes**
- **Qué mide:** Donantes que donaron más de una vez
- **Por qué es útil:** Mide fidelidad
- **Cálculo:** `COUNT(DISTINCT id_donante WHERE count > 1)`

#### 4. 🌍 **Países Activos**
- **Qué mide:** Número de países desde donde se recibieron donaciones
- **Por qué es útil:** Mide alcance geográfico
- **Cálculo:** `COUNT(DISTINCT pais)`

---

## 📊 **PROPUESTA DE GRÁFICOS:**

### **GRÁFICO 1: Evolución Temporal (Ya existe - mejorar)**
- **Tipo:** AreaChart
- **Datos:** Monto por mes/semana
- **Mejora:** Agregar línea de tendencia o promedio móvil

### **GRÁFICO 2: Distribución por País (NUEVO)**
- **Tipo:** PieChart o BarChart horizontal
- **Datos:** Top 5 países por monto total
- **Por qué:** Identifica mercados principales

### **GRÁFICO 3: Distribución por Rango de Monto (NUEVO)**
- **Tipo:** BarChart
- **Rangos:** 
  - < $50K
  - $50K - $100K
  - $100K - $500K
  - $500K - $1M
  - > $1M
- **Por qué:** Identifica perfil de donantes (muchos pequeños vs pocos grandes)

### **GRÁFICO 4: Donantes Nuevos vs Recurrentes (NUEVO)**
- **Tipo:** Stacked BarChart o LineChart
- **Datos:** Por mes, mostrar nuevos vs recurrentes
- **Por qué:** Mide salud del programa de donaciones

---

## 🎯 **ESTRUCTURA PROPUESTA:**

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Título + Botón Nueva Donación + Filtro de Fechas   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INDICADORES DE RECAUDO                                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Total    │ │Crecimiento│ │ Promedio │ │ Cantidad │       │
│ │Recaudado │ │  +15%    │ │ Donación │ │Donaciones│       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INDICADORES DE DONANTES                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Donantes │ │ Donantes │ │ Donantes │ │  Países  │       │
│ │ Activos  │ │  Nuevos  │ │Recurrentes│ │ Activos  │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ GRÁFICOS Y ANÁLISIS (Acordeón Colapsable)                  │
│                                                              │
│ ┌────────────────────────┐ ┌────────────────────────┐      │
│ │ Evolución Temporal     │ │ Distribución por País  │      │
│ │ (AreaChart)            │ │ (PieChart)             │      │
│ └────────────────────────┘ └────────────────────────┘      │
│                                                              │
│ ┌────────────────────────┐ ┌────────────────────────┐      │
│ │ Rangos de Monto        │ │ Nuevos vs Recurrentes  │      │
│ │ (BarChart)             │ │ (LineChart)            │      │
│ └────────────────────────┘ └────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FILTROS + BÚSQUEDA + EXPORTAR                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TABLA DE DONACIONES                                         │
│ ID | Fecha | Donante | País | Monto | Estado | Acciones    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA:**

### **Backend (donaciones/views.py):**

```python
@action(detail=False, methods=['get'])
def kpis(self, request):
    fecha_desde = request.query_params.get('fecha_desde')
    fecha_hasta = request.query_params.get('fecha_hasta')
    
    # Filtrar por fechas
    queryset = self.get_queryset()
    if fecha_desde:
        queryset = queryset.filter(fecha_donacion__gte=fecha_desde)
    if fecha_hasta:
        queryset = queryset.filter(fecha_donacion__lte=fecha_hasta)
    
    # KPIs de Recaudo
    total_recaudado = queryset.aggregate(total=Sum('monto'))['total'] or 0
    donacion_promedio = queryset.aggregate(promedio=Avg('monto'))['promedio'] or 0
    num_donaciones = queryset.count()
    
    # Crecimiento vs período anterior
    # ... calcular período anterior y comparar
    
    # KPIs de Donantes
    donantes_activos = queryset.values('id_donante').distinct().count()
    
    # Donantes nuevos (primera donación en el período)
    donantes_nuevos = queryset.filter(
        id_donante__in=Donacion.objects.values('id_donante').annotate(
            primera=Min('fecha_donacion')
        ).filter(primera__gte=fecha_desde).values('id_donante')
    ).values('id_donante').distinct().count()
    
    # Donantes recurrentes
    donantes_recurrentes = queryset.values('id_donante').annotate(
        count=Count('id_donacion')
    ).filter(count__gt=1).count()
    
    # Países activos
    paises_activos = queryset.values('id_donante__pais').distinct().count()
    
    # Distribución por país
    por_pais = queryset.values('id_donante__pais').annotate(
        total=Sum('monto'),
        cantidad=Count('id_donacion')
    ).order_by('-total')[:5]
    
    # Distribución por rango de monto
    # ... agrupar por rangos
    
    return Response({
        'recaudo': {
            'total_recaudado': total_recaudado,
            'crecimiento': crecimiento_porcentaje,
            'donacion_promedio': donacion_promedio,
            'num_donaciones': num_donaciones
        },
        'donantes': {
            'activos': donantes_activos,
            'nuevos': donantes_nuevos,
            'recurrentes': donantes_recurrentes,
            'paises_activos': paises_activos
        },
        'graficos': {
            'por_pais': list(por_pais),
            'por_rango': rangos_data,
            'nuevos_vs_recurrentes': timeline_data
        }
    })
```

---

## 📋 **PRIORIZACIÓN:**

### **FASE 1 (Crítico):**
1. ✅ KPIs de Recaudo (4 indicadores)
2. ✅ KPIs de Donantes (4 indicadores)
3. ✅ Gráfico de distribución por país

### **FASE 2 (Importante):**
4. Gráfico de rangos de monto
5. Gráfico de nuevos vs recurrentes
6. Cálculo de crecimiento

### **FASE 3 (Nice-to-have):**
7. Filtros adicionales (por país, por estado)
8. Exportar con más opciones
9. Comparación de períodos

---

## 💭 **PREGUNTAS PARA VALIDAR:**

1. ¿Te parecen útiles estos KPIs operativos?
2. ¿Hay algún otro indicador que te gustaría ver?
3. ¿Los gráficos propuestos te dan insights valiosos?
4. ¿Prefieres algún orden diferente para los KPIs?

---

**Siguiente paso:** Implementar Fase 1 (KPIs + Gráfico de país)
