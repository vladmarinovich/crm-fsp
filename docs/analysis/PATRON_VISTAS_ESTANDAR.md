# 🎯 PATRÓN ESTÁNDAR PARA TODAS LAS VISTAS

## 📋 **ESTRUCTURA COMÚN:**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER                                                   │
│    - Título + Descripción                                   │
│    - Botón de acción principal (Nuevo X)                    │
│    - Filtro de fechas (por defecto: año actual)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. SECCIÓN DE KPIs (1-2 filas)                             │
│    - Título de sección + Subtítulo descriptivo             │
│    - 4 KPIs por fila máximo                                 │
│    - Indicadores clave del negocio                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. GRÁFICOS (Acordeón colapsable, cerrado por defecto)    │
│    - Botón toggle con ChevronDown                           │
│    - 1-2 gráficos máximo                                    │
│    - Solo si agregan valor real                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. FILTROS + BÚSQUEDA + EXPORTAR                           │
│    - Búsqueda con icono                                     │
│    - Filtros específicos de la vista                        │
│    - Botón Exportar CSV                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 5. TABLA                                                    │
│    - Columnas relevantes                                    │
│    - Badges para estados                                    │
│    - Acciones siempre visibles                              │
│    - Paginación al final                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 **APLICACIÓN POR VISTA:**

### **1. CASOS** ✅ (Ya implementado)

**KPIs Fila 1 - Operativos:**
- Días Promedio por Caso
- Costo Diario por Caso
- Costo Diario Total
- Casos con Déficit

**KPIs Fila 2 - Estados:**
- Casos Activos
- Cerrados
- Fallecidos
- Adoptados

**Gráficos (Acordeón):**
- PieChart: Distribución por Estado
- Card: Resumen Financiero

---

### **2. DONACIONES** 🎯 (Por implementar)

**KPIs Fila 1 - Recaudo:**
- 💰 Total Recaudado
- 📈 Crecimiento vs Anterior
- 💵 Donación Promedio
- 📊 Número de Donaciones

**KPIs Fila 2 - Donantes:**
- 👥 Donantes Activos
- 🆕 Donantes Nuevos
- 🔁 Donantes Recurrentes
- 🌍 Países Activos

**Gráficos (Acordeón):**
- AreaChart: Evolución Temporal

---

### **3. GASTOS** 🎯 (Por implementar)

**KPIs Fila 1 - Gastos:**
- 💸 Total Gastado
- 📈 Crecimiento vs Anterior
- 💵 Gasto Promedio
- 📊 Número de Gastos

**KPIs Fila 2 - Categorías:**
- 🏥 Gastos Médicos
- 🍖 Gastos Alimentación
- 🏠 Gastos Infraestructura
- 📋 Gastos Administrativos

**Gráficos (Acordeón):**
- AreaChart: Evolución Temporal
- PieChart: Distribución por Categoría

---

### **4. DONANTES** 🎯 (Por implementar)

**KPIs Fila 1 - Donantes:**
- 👥 Total Donantes
- 🆕 Nuevos Este Mes
- 🔁 Recurrentes
- 💰 Valor Total Aportado

**KPIs Fila 2 - Geografía:**
- 🌍 Países Representados
- 🇨🇴 Donantes Colombia
- 🌎 Donantes Internacional
- 📊 País Top (nombre + cantidad)

**Gráficos (Acordeón):**
- BarChart: Top 5 Países por Donantes
- PieChart: Distribución Colombia vs Internacional

---

### **5. PROVEEDORES** 🎯 (Por implementar)

**KPIs Fila 1 - Proveedores:**
- 🏢 Total Proveedores
- ✅ Proveedores Activos
- 💰 Gasto Total con Proveedores
- 💵 Gasto Promedio por Proveedor

**KPIs Fila 2 - Categorías:**
- 🏥 Veterinarias
- 🍖 Alimentos
- 🏠 Infraestructura
- 📋 Otros

**Gráficos (Acordeón):**
- BarChart: Top 5 Proveedores por Gasto
- PieChart: Distribución por Categoría

---

### **6. HOGARES DE PASO** 🎯 (Por implementar)

**KPIs Fila 1 - Capacidad:**
- 🏠 Total Hogares
- ✅ Hogares Activos
- 🐾 Capacidad Total
- 📊 Ocupación Actual

**KPIs Fila 2 - Casos:**
- 🐕 Casos Activos en Hogares
- 📈 Promedio Casos por Hogar
- ⏱️ Días Promedio por Caso
- 🏆 Hogar Más Activo

**Gráficos (Acordeón):**
- BarChart: Casos por Hogar
- Gauge: % Ocupación Total

---

## 🎨 **ELEMENTOS COMUNES:**

### **Header:**
```tsx
<div className="flex flex-col gap-4">
    <div className="flex justify-between">
        <div>
            <h1>Título</h1>
            <p>Descripción</p>
        </div>
        <Button>Nuevo X</Button>
    </div>
    
    {/* Filtro de Fechas */}
    <Card className="p-4">
        <div className="flex gap-4">
            <Input type="date" label="Fecha Inicio" />
            <Input type="date" label="Fecha Fin" />
            <Button>Resetear a {currentYear}</Button>
        </div>
    </Card>
</div>
```

### **Sección de KPIs:**
```tsx
<div className="mb-2">
    <h2>Título de Sección</h2>
    <p>Subtítulo descriptivo</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard title="..." value="..." color="..." />
    {/* ... más KPIs */}
</div>
```

### **Gráficos (Acordeón):**
```tsx
<Card>
    <button onClick={() => setShowCharts(!showCharts)}>
        <div>
            <h3>Gráficos y Análisis</h3>
            <p>Descripción</p>
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

---

## ✅ **CHECKLIST DE IMPLEMENTACIÓN:**

Para cada vista, asegurarse de:

- [ ] Filtro de fechas en header (por defecto año actual)
- [ ] 1-2 filas de KPIs (máximo 4 por fila)
- [ ] Títulos de sección con subtítulos
- [ ] Gráficos en acordeón colapsable (cerrado por defecto)
- [ ] Búsqueda + Filtros específicos + Exportar
- [ ] Tabla limpia con badges y acciones visibles
- [ ] Paginación al final

---

## 🚀 **ORDEN DE IMPLEMENTACIÓN:**

1. ✅ **Casos** - Completado
2. 🎯 **Donaciones** - Siguiente
3. 🎯 **Gastos** - Después
4. 🎯 **Donantes** - Después
5. 🎯 **Proveedores** - Después
6. 🎯 **Hogares de Paso** - Después

---

**Beneficios de este patrón:**
- ✅ Consistencia en toda la aplicación
- ✅ Fácil de navegar y entender
- ✅ No abruma con información
- ✅ Gráficos opcionales (no distraen)
- ✅ Enfoque en KPIs accionables
