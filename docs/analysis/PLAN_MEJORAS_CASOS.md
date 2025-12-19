# 🎨 Plan de Mejoras UX/UI - Vista de Casos (REVISADO)

**Fecha:** 2025-12-14  
**Enfoque:** Gestión Operativa > Financiero  
**Feedback del Usuario:** "Lo importante es ver la gestión que se realiza, más que el financiero"

---

## 🎯 ENFOQUE CORRECTO

### Prioridad de Información:

1. **OPERATIVO** (Crítico)
   - Estado del caso
   - Diagnóstico
   - Veterinaria asignada
   - Hogar de paso
   - Fechas (ingreso, salida)
   - Tiempo en tratamiento

2. **FINANCIERO** (Secundario - Solo resumen)
   - Monto total gastado (simple)
   - Monto total recaudado (simple)
   - NO balance complejo, NO barras de progreso

3. **ACCIONES** (Importante)
   - Ver detalle completo
   - Editar caso
   - Cambiar estado rápidamente

---

## 💡 MEJORAS PROPUESTAS (REVISADAS)

### 🎯 **Fase 1: Información Operativa Completa**

#### 1.1 Agregar Columnas Operativas a la Tabla

**Columnas Actuales:**
```
| Caso | Estado | Ingreso | Veterinaria | Acciones |
```

**Columnas Propuestas:**
```
| Caso          | Estado    | Diagnóstico | Veterinaria | Hogar de Paso | Ingreso    | Días Activo | Gastos  | Recaudado | Acciones |
| Lupo Noriega  | 🟡 Trat.  | Fractura    | Vet Central | Casa María    | 14/09/2024 | 92 días     | $ 8 M   | $ 12 M    | [👁️][✏️] |
```

**Detalles:**
- **Diagnóstico:** Mostrar primeras 30 caracteres + "..." si es largo
- **Hogar de Paso:** Nombre del hogar (no solo ID)
- **Días Activo:** Calculado automáticamente (fecha_ingreso → hoy)
- **Gastos/Recaudado:** Solo el monto, sin barras ni colores complejos
- **Acciones:** Siempre visibles (no en hover)

---

#### 1.2 Indicadores Visuales Operativos

**Badges de Urgencia:**
```tsx
// Mostrar badge si:
- Más de 90 días en tratamiento → 🔴 "Urgente: Revisar"
- Más de 60 días en tratamiento → 🟡 "Atención"
- Sin hogar de paso asignado → ⚠️ "Sin hogar"
- Sin veterinaria asignada → ⚠️ "Sin vet"
```

**Colores de Estado (Mejorados):**
```tsx
- ABIERTO: 🔵 Azul (recién ingresado)
- EN_TRATAMIENTO: 🟡 Amarillo (en proceso)
- ADOPTADO: 🟢 Verde (éxito)
- FALLECIDO: ⚫ Gris (cerrado)
- CERRADO: 🔴 Rojo (cerrado sin adopción)
```

---

### 🎯 **Fase 2: Filtros Operativos Avanzados**

#### 2.1 Panel de Filtros

**Filtros Propuestos:**
```tsx
┌─────────────────────────────────────────────────────────────┐
│ [🔍 Buscar caso...]                                         │
├─────────────────────────────────────────────────────────────┤
│ Estado: [Todos ▼] [ABIERTO] [EN_TRATAMIENTO] [ADOPTADO]... │
│ Veterinaria: [Todas ▼]                                      │
│ Hogar de Paso: [Todos ▼]                                    │
│ Activo/Cerrado: [⚪ Todos] [🟢 Solo Activos] [🔴 Cerrados]  │
│ Tiempo: [⚪ Todos] [🟡 >60 días] [🔴 >90 días]              │
├─────────────────────────────────────────────────────────────┤
│ Desde: [__/__/__] Hasta: [__/__/__] [Exportar CSV]         │
└─────────────────────────────────────────────────────────────┘
```

**Beneficio:** Encontrar casos que requieren atención operativa inmediata

---

### 🎯 **Fase 3: Acciones Rápidas**

#### 3.1 Acciones Siempre Visibles

**En lugar de hover, mostrar iconos pequeños:**
```tsx
| Acciones                    |
| [👁️ Ver] [✏️ Editar] [📊 Balance] |
```

#### 3.2 Acción Rápida: Cambiar Estado

**Agregar dropdown en la columna de Estado:**
```tsx
// Click en el badge de estado → Dropdown
[EN_TRATAMIENTO ▼]
  ├─ ABIERTO
  ├─ EN_TRATAMIENTO ✓
  ├─ ADOPTADO
  ├─ FALLECIDO
  └─ CERRADO
```

**Beneficio:** Cambiar estado sin entrar a editar

---

### 🎯 **Fase 4: Vista Mejorada en Móvil**

#### 4.1 Card View para Móvil

**En pantallas pequeñas, mostrar tarjetas:**
```tsx
┌─────────────────────────────────────┐
│ 🐕 Lupo Noriega                     │
│ 🟡 EN_TRATAMIENTO                   │
├─────────────────────────────────────┤
│ 🏥 Diagnóstico: Fractura femoral    │
│ 👨‍⚕️ Vet: Veterinaria Central         │
│ 🏠 Hogar: Casa María                │
│ 📅 Ingreso: 14/09/2024 (92 días)    │
├─────────────────────────────────────┤
│ 💰 Gastado: $ 8 M                   │
│ 💵 Recaudado: $ 12 M                │
├─────────────────────────────────────┤
│ [👁️ Ver Detalle] [✏️ Editar]        │
└─────────────────────────────────────┘
```

---

### 🎯 **Fase 5: KPIs Operativos (No Financieros)**

#### 5.1 Reemplazar/Agregar KPIs Operativos

**KPIs Actuales:**
- Total Histórico ✅
- Casos Activos ✅
- En Tratamiento ✅
- Adoptados ✅

**KPIs Adicionales Propuestos:**
```tsx
┌──────────────────────────────────────────────────────────┐
│ [Total: 1,234] [Activos: 45] [En Trat: 32] [Adoptados: 890] │
│ [⚠️ Urgentes: 8] [🏠 Sin Hogar: 3] [⏱️ Prom: 67 días]        │
└──────────────────────────────────────────────────────────┘
```

**Nuevos KPIs:**
- **Urgentes:** Casos con >90 días en tratamiento
- **Sin Hogar:** Casos sin hogar de paso asignado
- **Tiempo Promedio:** Días promedio en tratamiento (casos activos)

---

## 📋 ESTRUCTURA FINAL PROPUESTA

### Tabla Completa (Desktop):

```
┌────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬────────────┬────────────┬──────────┬───────────┬──────────────┐
│ Caso           │ Estado       │ Diagnóstico  │ Veterinaria  │ Hogar Paso   │ Ingreso    │ Días       │ Gastado  │ Recaudado │ Acciones     │
├────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼────────────┼────────────┼──────────┼───────────┼──────────────┤
│ Lupo Noriega   │ 🟡 EN_TRAT   │ Fractura...  │ Vet Central  │ Casa María   │ 14/09/2024 │ 92 días    │ $ 8 M    │ $ 12 M    │ [👁️][✏️][📊] │
│ ⚠️ Sin hogar   │              │              │              │              │            │ 🔴 Urgente │          │           │              │
├────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼────────────┼────────────┼──────────┼───────────┼──────────────┤
│ Tito Perdomo   │ 🟢 ADOPTADO  │ Desnutrición │ Vet Norte    │ -            │ 03/01/2024 │ Cerrado    │ $ 6 M    │ $ 6 M     │ [👁️][✏️][📊] │
└────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴────────────┴────────────┴──────────┴───────────┴──────────────┘
```

**Características:**
- ✅ Información operativa completa
- ✅ Indicadores de urgencia visibles
- ✅ Finanzas resumidas (solo montos)
- ✅ Acciones siempre visibles
- ✅ Badges de alerta para casos que requieren atención

---

## 🔧 PLAN DE IMPLEMENTACIÓN

### **Fase 1: Backend (30 min)**
1. Modificar endpoint `/api/casos/` para incluir:
   - `nombre_hogar_de_paso` (join con HogarDePaso)
   - `total_recaudado` (annotation)
   - `total_gastado` (annotation)
   - `dias_activo` (calculado)

### **Fase 2: Tabla Mejorada (1 hora)**
1. Agregar columnas: Diagnóstico, Hogar de Paso, Días Activo
2. Agregar columnas financieras simples: Gastado, Recaudado
3. Hacer acciones siempre visibles
4. Agregar badges de urgencia

### **Fase 3: Filtros Avanzados (45 min)**
1. Dropdown de Estado (multi-select)
2. Dropdown de Veterinaria
3. Dropdown de Hogar de Paso
4. Toggle Activo/Cerrado
5. Filtro por tiempo (>60 días, >90 días)

### **Fase 4: KPIs Operativos (30 min)**
1. Agregar KPI "Urgentes"
2. Agregar KPI "Sin Hogar"
3. Agregar KPI "Tiempo Promedio"

### **Fase 5: Responsive (30 min)**
1. Card View para móvil
2. Ajustar filtros para móvil

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend:
- [ ] Agregar `nombre_hogar_de_paso` al serializer
- [ ] Agregar `total_recaudado` annotation
- [ ] Agregar `total_gastado` annotation
- [ ] Agregar `dias_activo` como campo calculado
- [ ] Endpoint de filtros (estado, veterinaria, hogar, tiempo)

### Frontend:
- [ ] Columna "Diagnóstico"
- [ ] Columna "Hogar de Paso" (nombre)
- [ ] Columna "Días Activo" (con badge urgencia)
- [ ] Columnas financieras simples (Gastado, Recaudado)
- [ ] Acciones siempre visibles
- [ ] Filtro por Estado
- [ ] Filtro por Veterinaria
- [ ] Filtro por Hogar de Paso
- [ ] Filtro por Tiempo (>60, >90 días)
- [ ] KPI "Urgentes"
- [ ] KPI "Sin Hogar"
- [ ] KPI "Tiempo Promedio"
- [ ] Card View para móvil

---

## 🎨 PRINCIPIOS DE DISEÑO

1. **Operativo Primero:** La información de gestión debe ser prominente
2. **Finanzas Secundarias:** Solo montos simples, sin visualizaciones complejas
3. **Urgencia Visible:** Casos que requieren atención deben destacar
4. **Acciones Rápidas:** Cambiar estado, ver detalle, editar sin clicks extra
5. **Escaneo Rápido:** Identificar problemas de un vistazo (sin hogar, urgente, etc.)

---

**¿Procedemos con la implementación?**

Propongo empezar con:
1. **Backend:** Agregar campos necesarios (30 min)
2. **Tabla:** Columnas operativas + financieras simples (1 hora)
3. **Filtros:** Estado, Veterinaria, Hogar, Tiempo (45 min)

Total estimado: **~2.5 horas**

¿Te parece bien este enfoque?
