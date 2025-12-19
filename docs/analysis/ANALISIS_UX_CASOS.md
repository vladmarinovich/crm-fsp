# 🎨 Análisis UX/UI - Vista de Casos

**Fecha:** 2025-12-14  
**Vista:** `/casos` - CasosPage.tsx  
**Objetivo:** Identificar mejoras de experiencia de usuario y diseño

---

## 📊 ESTADO ACTUAL

### ✅ Fortalezas Actuales:

1. **Estructura Clara**
   - Header con título y CTA principal
   - 4 KPI cards informativos
   - Barra de búsqueda y filtros
   - Tabla con paginación

2. **Componentes Bien Diseñados**
   - Uso consistente del design system (Button, Input, Card, KpiCard)
   - Estados de carga y error manejados
   - Badges de estado con colores semánticos

3. **Funcionalidad Básica**
   - Búsqueda con debounce
   - Filtros por fecha
   - Exportación a CSV
   - Navegación a detalle/edición

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **Información Financiera Ausente** (CRÍTICO)
**Problema:** La tabla NO muestra información financiera de cada caso
- ❌ No se ve cuánto se ha recaudado por caso
- ❌ No se ve cuánto se ha gastado por caso
- ❌ No se ve el balance (donaciones - gastos)

**Impacto:** Los usuarios no pueden evaluar rápidamente la salud financiera de cada caso

**Contexto:** En el Dashboard SÍ mostramos esta info en "Casos Destacados", pero aquí (donde se gestionan TODOS los casos) no está disponible.

---

### 2. **Filtros Limitados** (ALTO)
**Problema:** Solo hay filtros de fecha, pero faltan filtros clave:
- ❌ No se puede filtrar por **Estado** (ABIERTO, EN_TRATAMIENTO, ADOPTADO, etc.)
- ❌ No se puede filtrar por **Veterinaria**
- ❌ No se puede filtrar por **Hogar de Paso**
- ❌ No hay filtro de **Casos Activos vs Cerrados**

**Impacto:** Difícil encontrar casos específicos en listas grandes

---

### 3. **Tabla Poco Informativa** (MEDIO)
**Problema:** Columnas actuales son básicas:
- ✅ Caso (nombre)
- ✅ Estado
- ✅ Fecha Ingreso
- ✅ Veterinaria
- ❌ Falta: **Diagnóstico** (campo importante)
- ❌ Falta: **Fecha Salida** (para casos cerrados)
- ❌ Falta: **Hogar de Paso** (nombre, no solo ID)
- ❌ Falta: **Indicadores visuales** (tiempo en tratamiento, urgencia)

---

### 4. **Acciones Ocultas** (MEDIO)
**Problema:** Los botones "Ver" y "Editar" solo aparecen en hover
- ⚠️ No es obvio que hay acciones disponibles
- ⚠️ En móvil el hover no funciona bien
- ⚠️ No hay acción rápida para ver el balance financiero

---

### 5. **KPIs Básicos** (BAJO)
**Problema:** Los KPIs actuales son solo contadores:
- ✅ Total Histórico
- ✅ Casos Activos
- ✅ En Tratamiento
- ✅ Adoptados
- ❌ Falta: **Balance financiero total** (recaudado vs gastado)
- ❌ Falta: **Casos con déficit** (gastos > donaciones)
- ❌ Falta: **Tiempo promedio en tratamiento**

---

### 6. **Sin Visualización de Datos** (MEDIO)
**Problema:** No hay gráficos o visualizaciones
- ❌ No hay gráfico de distribución por estado
- ❌ No hay timeline de casos por mes
- ❌ No hay comparativa financiera

---

## 💡 MEJORAS PROPUESTAS

### 🎯 Prioridad ALTA

#### 1. **Agregar Columnas Financieras a la Tabla**
```tsx
// Nuevas columnas propuestas:
- Recaudado (con formato $ X M COP)
- Gastado (con formato $ X M COP)
- Balance (con color: verde si positivo, rojo si negativo)
- Indicador visual: barra de progreso (recaudado vs gastado)
```

**Beneficio:** Visibilidad inmediata de la salud financiera de cada caso

---

#### 2. **Panel de Filtros Avanzados**
```tsx
// Filtros adicionales:
- Estado: Dropdown multi-select (ABIERTO, EN_TRATAMIENTO, ADOPTADO, etc.)
- Veterinaria: Dropdown
- Activo/Cerrado: Toggle switch
- Balance: Filtro por rango (ej: solo casos con déficit)
```

**Beneficio:** Encontrar casos específicos rápidamente

---

#### 3. **Vista de Tarjetas (Card View) como Alternativa**
```tsx
// Toggle entre Table View y Card View
// Card View mostraría:
- Foto del caso (si existe)
- Nombre + Estado
- Diagnóstico resumido
- Balance financiero con barra de progreso
- Acciones visibles (no en hover)
```

**Beneficio:** Mejor experiencia en móvil y más información visual

---

### 🎯 Prioridad MEDIA

#### 4. **Indicadores Visuales en la Tabla**
```tsx
// Agregar:
- Badge de "Urgente" si el caso lleva mucho tiempo en tratamiento
- Badge de "Déficit" si gastos > donaciones
- Icono de alerta si falta información crítica
- Color de fila según estado (sutil, en el borde izquierdo)
```

**Beneficio:** Identificar casos que requieren atención inmediata

---

#### 5. **Acciones Rápidas Visibles**
```tsx
// En lugar de hover, mostrar siempre:
- Icono de "Ver detalles" (ojo)
- Icono de "Editar" (lápiz)
- Icono de "Ver balance" (gráfico) → Modal con detalle financiero
```

**Beneficio:** Acciones más accesibles, especialmente en móvil

---

#### 6. **Mini Gráfico en KPIs**
```tsx
// Agregar sparklines o mini gráficos en cada KPI card:
- Total Histórico: Tendencia de casos nuevos por mes
- Casos Activos: Distribución por estado (mini pie chart)
- En Tratamiento: Tiempo promedio (mini bar chart)
- Adoptados: Tendencia de adopciones (mini line chart)
```

**Beneficio:** Contexto visual adicional sin ocupar mucho espacio

---

### 🎯 Prioridad BAJA

#### 7. **Sección de Gráficos**
```tsx
// Agregar sección expandible con:
- Gráfico de barras: Casos por estado
- Gráfico de línea: Casos nuevos vs cerrados por mes
- Gráfico de dona: Distribución por veterinaria
```

**Beneficio:** Análisis visual de tendencias

---

#### 8. **Acciones en Lote**
```tsx
// Agregar:
- Checkboxes para selección múltiple
- Acciones: Exportar seleccionados, Cambiar estado, Asignar veterinaria
```

**Beneficio:** Eficiencia en gestión de múltiples casos

---

#### 9. **Vista de Timeline**
```tsx
// Vista alternativa que muestre:
- Casos en una línea de tiempo por fecha de ingreso
- Agrupados por mes/semana
- Con indicadores de estado
```

**Beneficio:** Visualización cronológica de casos

---

## 🎨 MOCKUP CONCEPTUAL (Propuesta)

### Layout Propuesto:

```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Casos" + Botón "Nuevo Caso"                       │
├─────────────────────────────────────────────────────────────┤
│ KPIs: [Total] [Activos] [En Trat.] [Adoptados] [Balance $] │
├─────────────────────────────────────────────────────────────┤
│ Filtros:                                                    │
│ [Buscar...] [Estado ▼] [Veterinaria ▼] [Activo/Cerrado]   │
│ [Desde: __/__/__] [Hasta: __/__/__] [Exportar CSV]        │
├─────────────────────────────────────────────────────────────┤
│ Vista: [📋 Tabla] [🎴 Tarjetas]                            │
├─────────────────────────────────────────────────────────────┤
│ Tabla:                                                      │
│ ┌──────┬────────┬────────┬──────────┬──────────┬─────────┐ │
│ │ Caso │ Estado │ Ingreso│ Recaudado│ Gastado  │ Balance │ │
│ ├──────┼────────┼────────┼──────────┼──────────┼─────────┤ │
│ │ Lupo │ 🟡 Trat│ 01/2025│ $ 12 M   │ $ 8 M    │ +$ 4 M  │ │
│ │      │        │        │ [████░░] │ [███░░░] │ 🟢      │ │
│ │      │        │        │          │          │ [👁️][✏️] │ │
│ └──────┴────────┴────────┴──────────┴──────────┴─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Paginación: [< 1 2 3 >] [10 por página ▼]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTACIÓN SUGERIDA (Orden)

### Fase 1: Información Financiera (1-2 horas)
1. ✅ Backend: Agregar `total_recaudado` y `total_gastado` al endpoint `/api/casos/`
2. ✅ Frontend: Agregar columnas financieras a la tabla
3. ✅ Frontend: Agregar barras de progreso visuales

### Fase 2: Filtros Avanzados (1 hora)
1. ✅ Agregar dropdown de Estado
2. ✅ Agregar dropdown de Veterinaria
3. ✅ Agregar toggle Activo/Cerrado

### Fase 3: Mejoras Visuales (1 hora)
1. ✅ Agregar badges de urgencia/déficit
2. ✅ Hacer acciones siempre visibles
3. ✅ Mejorar responsive en móvil

### Fase 4: Vista Alternativa (2 horas)
1. ✅ Implementar Card View
2. ✅ Toggle entre Table/Card
3. ✅ Optimizar para móvil

---

## 📐 PRINCIPIOS DE DISEÑO A SEGUIR

### 1. **Jerarquía Visual**
- Lo más importante (nombre, estado, balance) debe destacar
- Información secundaria (fechas, IDs) en texto más pequeño/gris

### 2. **Escaneo Rápido**
- Usar colores semánticos (verde=positivo, rojo=negativo, amarillo=atención)
- Iconos para acciones comunes
- Alineación consistente

### 3. **Densidad de Información**
- No sobrecargar la tabla
- Usar tooltips para información adicional
- Permitir expandir/colapsar detalles

### 4. **Accesibilidad**
- Contraste suficiente en textos
- Acciones accesibles sin hover
- Labels claros en filtros

### 5. **Consistencia**
- Mismo formato de moneda que Dashboard
- Mismos colores de estado
- Mismos componentes del design system

---

## 🎯 MÉTRICAS DE ÉXITO

Después de implementar las mejoras, deberíamos poder responder:

1. ✅ ¿Puedo ver rápidamente qué casos tienen déficit financiero?
2. ✅ ¿Puedo filtrar casos por estado en 2 clicks?
3. ✅ ¿Puedo ver el balance de un caso sin entrar al detalle?
4. ✅ ¿La vista funciona bien en móvil?
5. ✅ ¿Puedo identificar casos urgentes de un vistazo?

---

## 💬 PREGUNTAS PARA EL USUARIO

Antes de implementar, confirmar:

1. **¿Qué información es MÁS importante para ti al ver la lista de casos?**
   - Balance financiero
   - Estado del tratamiento
   - Tiempo en el sistema
   - Otro?

2. **¿Qué filtros usarías más frecuentemente?**
   - Por estado
   - Por veterinaria
   - Por balance (déficit/superávit)
   - Otro?

3. **¿Prefieres ver muchos casos en una tabla densa o menos casos con más información visual (tarjetas)?**

4. **¿Hay alguna acción que hagas frecuentemente que debería ser más rápida?**

---

**Generado por:** Antigravity AI  
**Siguiente paso:** Esperar feedback del usuario antes de implementar
