# 🚀 PLAN COMPLETO DE MEJORAS - VISTA DE CASOS

## ✅ YA IMPLEMENTADO:

### Backend:
- ✅ Campos computados: `total_recaudado`, `total_gastado`, `dias_activo`, `nombre_hogar_de_paso`
- ✅ KPIs financieros: promedio recaudado/gastado, promedio casos mensuales
- ✅ KPIs de estado: activos, cerrados, fallecidos, adoptados
- ✅ Filtros: estado, veterinaria

### Frontend:
- ✅ Tabla con columnas operativas: Diagnóstico, Hogar, Días Activo, Gastado, Recaudado
- ✅ Badges de urgencia: >90 días (Urgente), >60 días (Atención), Sin hogar
- ✅ KPIs reorganizados: Financieros + Estados
- ✅ Filtros avanzados: Estado, Veterinaria, Fechas
- ✅ Acciones siempre visibles

---

## 🎯 MEJORAS PENDIENTES (PRIORIZADO):

### **FASE 1: Mejoras Críticas (30 min)**

#### 1. Columna de Balance en Tabla ⭐⭐⭐
**Impacto:** ALTO - Vista rápida de salud financiera
**Esfuerzo:** 5 min

```tsx
// Agregar columna "Balance" después de "Recaudado"
<th>Balance</th>

// En el body:
const balance = (caso.total_recaudado || 0) - (caso.total_gastado || 0);
<td className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
  {formatCurrency(balance)}
</td>
```

#### 2. Gráfico de Distribución de Estados ⭐⭐⭐
**Impacto:** ALTO - Visualización panorámica
**Esfuerzo:** 10 min

```tsx
// Agregar PieChart con distribución de estados
<PieChart width={300} height={300}>
  <Pie data={estadosData} dataKey="value" nameKey="name" />
</PieChart>
```

#### 3. Filtro por Hogar de Paso ⭐⭐⭐
**Impacto:** ALTO - Operación diaria
**Esfuerzo:** 10 min

**Backend:**
```python
# En casos/views.py - ya existe filterset_fields
# Agregar endpoint para listar hogares
@action(detail=False, methods=['get'])
def hogares_disponibles(self, request):
    hogares = HogarDePaso.objects.all().values('id_hogar_de_paso', 'nombre_hogar')
    return Response(list(hogares))
```

**Frontend:**
```tsx
// Agregar dropdown de hogares
<select onChange={(e) => setHogarFilter(e.target.value)}>
  <option value="">Todos los hogares</option>
  {hogares.map(h => <option value={h.id}>{h.nombre}</option>)}
</select>
```

---

### **FASE 2: Mejoras Importantes (45 min)**

#### 4. Gráfico de Tendencia Mensual ⭐⭐
**Impacto:** MEDIO - Análisis de tendencias
**Esfuerzo:** 15 min

**Backend:**
```python
@action(detail=False, methods=['get'])
def tendencia_mensual(self, request):
    # Agrupar casos por mes
    from django.db.models.functions import TruncMonth
    
    tendencia = Caso.objects.annotate(
        mes=TruncMonth('fecha_ingreso')
    ).values('mes').annotate(
        total=Count('id_caso')
    ).order_by('mes')
    
    return Response(list(tendencia))
```

**Frontend:**
```tsx
<LineChart data={tendenciaData}>
  <Line type="monotone" dataKey="total" stroke="#8884d8" />
  <XAxis dataKey="mes" />
  <YAxis />
</LineChart>
```

#### 5. Cambio Rápido de Estado ⭐⭐
**Impacto:** MEDIO - Agiliza operación
**Esfuerzo:** 15 min

```tsx
// Dropdown en cada fila
<select 
  value={caso.estado}
  onChange={(e) => handleEstadoChange(caso.id_caso, e.target.value)}
>
  <option value="ABIERTO">Abierto</option>
  <option value="EN_TRATAMIENTO">En Tratamiento</option>
  <option value="ADOPTADO">Adoptado</option>
  <option value="CERRADO">Cerrado</option>
  <option value="FALLECIDO">Fallecido</option>
</select>
```

#### 6. Asignación Rápida de Hogar ⭐⭐
**Impacto:** MEDIO - Operación frecuente
**Esfuerzo:** 15 min

```tsx
// Dropdown en cada fila
<select 
  value={caso.id_hogar_de_paso || ''}
  onChange={(e) => handleHogarChange(caso.id_caso, e.target.value)}
>
  <option value="">Sin hogar</option>
  {hogares.map(h => <option value={h.id}>{h.nombre}</option>)}
</select>
```

---

### **FASE 3: Mejoras Nice-to-Have (30 min)**

#### 7. Indicador de Balance Visual ⭐
**Impacto:** BAJO - Estético
**Esfuerzo:** 5 min

```tsx
// Barra de progreso en cada fila
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className={`h-2 rounded-full ${balance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
    style={{ width: `${Math.min(Math.abs(balance) / maxBalance * 100, 100)}%` }}
  />
</div>
```

#### 8. Vista Compacta/Expandida ⭐
**Impacto:** BAJO - Preferencia personal
**Esfuerzo:** 10 min

```tsx
const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');

// Toggle button
<button onClick={() => setViewMode(prev => prev === 'compact' ? 'expanded' : 'compact')}>
  {viewMode === 'compact' ? 'Vista Expandida' : 'Vista Compacta'}
</button>

// Aplicar clases condicionales
<td className={viewMode === 'compact' ? 'py-2' : 'py-4'}>
```

#### 9. Filtro Rápido de Urgentes ⭐
**Impacto:** BAJO - Caso de uso específico
**Esfuerzo:** 5 min

```tsx
const [soloUrgentes, setSoloUrgentes] = useState(false);

// Toggle button
<button onClick={() => setSoloUrgentes(!soloUrgentes)}>
  {soloUrgentes ? 'Mostrar Todos' : 'Solo Urgentes'}
</button>

// Filtrar datos
const casosFiltrados = soloUrgentes 
  ? data?.results.filter(c => c.dias_activo && c.dias_activo > 90)
  : data?.results;
```

#### 10. Iconos de Estado ⭐
**Impacto:** BAJO - Visual
**Esfuerzo:** 10 min

```tsx
const getEstadoIcon = (estado: string) => {
  switch(estado) {
    case 'ABIERTO': return '📂';
    case 'EN_TRATAMIENTO': return '💊';
    case 'ADOPTADO': return '🏡';
    case 'CERRADO': return '✅';
    case 'FALLECIDO': return '💀';
  }
};

<span>{getEstadoIcon(caso.estado)} {caso.estado}</span>
```

---

## 📊 RESUMEN DE PRIORIDADES:

### **IMPLEMENTAR AHORA (Máximo impacto):**
1. ✅ Columna de Balance
2. ✅ Gráfico de distribución de estados
3. ✅ Filtro por hogar de paso

### **IMPLEMENTAR DESPUÉS (Buen impacto):**
4. Gráfico de tendencia mensual
5. Cambio rápido de estado
6. Asignación rápida de hogar

### **OPCIONAL (Mejoras incrementales):**
7-10. Indicadores visuales, vistas alternativas, filtros adicionales

---

## ⏱️ TIEMPO ESTIMADO TOTAL:
- **Fase 1 (Crítico):** 30 min
- **Fase 2 (Importante):** 45 min  
- **Fase 3 (Nice-to-have):** 30 min
- **TOTAL:** ~1h 45min

---

## 🎯 SIGUIENTE PASO:
Implementar Fase 1 (30 min) para obtener el 80% del valor con el 20% del esfuerzo.
