# 📊 ANÁLISIS Y PROPUESTA - DASHBOARD

## 🔍 **ESTADO ACTUAL:**

### **KPIs (4):**
1. ✅ Total Donado (con trend)
2. ✅ Total Gastado (con trend)
3. ✅ Balance Neto (con trend)
4. ✅ Casos Activos

### **Gráficos:**
1. ✅ Balance Financiero (AreaChart con 3 líneas: Donaciones, Gastos, Balance)
2. ✅ Donaciones por País (PieChart)
3. ✅ Casos Destacados (Cards con info)

### **Filtros:**
1. ✅ Rango de fechas (Histórico, Este Mes, Mes Pasado, Year to Date, Custom)

---

## 💡 **PROPUESTA DE MEJORA - APLICAR PATRÓN ESTÁNDAR:**

### **ESTRUCTURA PROPUESTA:**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER                                                   │
│    - Título: "Dashboard"                                    │
│    - Subtítulo: "Vista general del CRM"                     │
│    - Filtro de fechas (ya existe)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. KPIs FINANCIEROS (1 fila - 4 KPIs)                      │
│    Título: "Indicadores Financieros"                        │
│    Subtítulo: "Resumen de ingresos, gastos y balance"      │
│                                                              │
│    [Total Donado] [Total Gastado] [Balance] [Casos Activos]│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. GRÁFICOS (Acordeón colapsable - ABIERTO por defecto)   │
│    Título: "Análisis y Tendencias"                          │
│    Subtítulo: "Evolución temporal y distribución"           │
│                                                              │
│    ┌────────────────────────────────────────────────┐      │
│    │ Balance Financiero (AreaChart)                 │      │
│    │ - Donaciones, Gastos, Balance por mes          │      │
│    └────────────────────────────────────────────────┘      │
│                                                              │
│    ┌──────────────────────┐ ┌──────────────────────┐      │
│    │ Donaciones por País  │ │ Casos por Estado     │      │
│    │ (PieChart)           │ │ (PieChart - NUEVO)   │      │
│    └──────────────────────┘ └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. CASOS DESTACADOS                                         │
│    Título: "Casos Destacados"                               │
│    Subtítulo: "Casos activos con mayor actividad"           │
│                                                              │
│    [Card 1] [Card 2] [Card 3]                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **CAMBIOS ESPECÍFICOS:**

### **1. Agregar Títulos de Sección:**
```tsx
{/* Indicadores Financieros */}
<div className="mb-2">
    <h2 className="text-xl font-bold text-slate-700">Indicadores Financieros</h2>
    <p className="text-sm text-slate-500">Resumen de ingresos, gastos y balance</p>
</div>
```

### **2. Convertir Gráficos en Acordeón:**
```tsx
<Card className="overflow-hidden">
    <button onClick={() => setShowCharts(!showCharts)}>
        <div>
            <h3>Análisis y Tendencias</h3>
            <p>Evolución temporal y distribución</p>
        </div>
        <ChevronDownIcon className={showCharts ? 'rotate-180' : ''} />
    </button>
    
    {showCharts && (
        <div className="p-6">
            {/* Gráficos aquí */}
        </div>
    )}
</Card>
```

### **3. Agregar Gráfico de Casos por Estado (NUEVO):**
```tsx
<PieChart>
    <Pie
        data={[
            { name: 'Activos', value: kpis.casos_activos },
            { name: 'Cerrados', value: kpis.casos_cerrados },
            { name: 'Adoptados', value: kpis.casos_adoptados },
            { name: 'Fallecidos', value: kpis.casos_fallecidos }
        ]}
        // ... configuración
    />
</PieChart>
```

### **4. Mejorar Casos Destacados:**
```tsx
{/* Casos Destacados */}
<div className="mb-2">
    <h2 className="text-xl font-bold text-slate-700">Casos Destacados</h2>
    <p className="text-sm text-slate-500">Casos activos con mayor actividad</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {casos_destacados.map(caso => (
        <Card key={caso.id}>
            {/* Mejorar diseño del card */}
        </Card>
    ))}
</div>
```

---

## 📋 **PRIORIZACIÓN:**

### **FASE 1 (Crítico - Consistencia):**
1. ✅ Agregar títulos de sección
2. ✅ Convertir gráficos en acordeón (ABIERTO por defecto en Dashboard)
3. ✅ Mejorar header con subtítulo

### **FASE 2 (Importante - Nuevas Funcionalidades):**
4. Agregar gráfico de Casos por Estado
5. Mejorar diseño de Casos Destacados
6. Agregar más KPIs operativos

### **FASE 3 (Nice-to-have):**
7. Comparación de períodos
8. Exportar dashboard como PDF
9. Widgets personalizables

---

## 🎨 **DIFERENCIAS CON OTRAS VISTAS:**

El Dashboard es especial porque:
- ✅ **Acordeón ABIERTO por defecto** (los gráficos son el contenido principal)
- ✅ **Más gráficos** (es una vista de análisis)
- ✅ **Sin tabla** (solo resúmenes y visualizaciones)
- ✅ **Enfoque en tendencias** (no en datos individuales)

---

## ✅ **CHECKLIST DE IMPLEMENTACIÓN:**

- [ ] Agregar título "Indicadores Financieros" + subtítulo
- [ ] Convertir sección de gráficos en acordeón (abierto por defecto)
- [ ] Agregar título "Análisis y Tendencias" + subtítulo
- [ ] Agregar gráfico de Casos por Estado (PieChart)
- [ ] Agregar título "Casos Destacados" + subtítulo
- [ ] Mejorar diseño de cards de casos destacados
- [ ] Asegurar que el acordeón esté abierto por defecto

---

**¿Procedemos con la implementación?** 🚀
