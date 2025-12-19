# Plan Maestro de Refactorización y Estandarización - Salvando Patitas CRM

Este documento define la hoja de ruta para limpiar, organizar y documentar el código del proyecto, asegurando que sea escalable, mantenible y fácil de entender para cualquier desarrollador.

## 1. Objetivos
- **Claridad:** Estructura de carpetas intuitiva y predecible.
- **Consistencia:** Patrones de código idénticos en Frontend y Backend.
- **Documentación:** Código auto-documentado y guías claras.
- **Limpieza:** Eliminación de código muerto, archivos duplicados y dependencias no usadas.

---

## 2. Arquitectura Frontend (React + Vite)
Adoptaremos una **Feature-Sliced Design (Simplificada)**. Todo lo relacionado con una funcionalidad de negocio debe vivir junto.

### Estructura Propuesta
```text
src/
├── features/                 # Módulos de Negocio
│   ├── proveedores/          # Ejemplo: Módulo Proveedores
│   │   ├── components/       # Componentes exclusivos de este módulo (ej: ProveedorList, ProveedorForm)
│   │   ├── hooks/            # Hooks exclusivos (ej: useProveedores)
│   │   ├── pages/            # Páginas de ruta (e: ProveedoresPage, ProveedorDetailPage)
│   │   ├── services/         # Llamadas API (ej: proveedoresService.ts)
│   │   └── types/            # Interfaces TS (ej: Proveedor.ts)
│   └── ... (casos, donantes, etc.)
│
├── components/               # Componentes Compartidos (Globales)
│   ├── ui/                   # Átomos de diseño (Button, Input, Card, Modal) - ESTILO ORION BI
│   └── layout/               # Estructura de página (Sidebar, Navbar, MainLayout)
│
├── hooks/                    # Hooks Globales (ej: useDebounce, useAuth)
├── api/                      # Configuración base (axiosClient, queryClient)
├── utils/                    # Funciones puras (formatCurrency, formatDate)
├── router/                   # Configuración de rutas (AppRoutes)
└── styles/                   # CSS Global y variables (Tailwind config)
```

### Acciones de Refactorización Frontend
1.  **UI Kit Unificado:** Mover todos los componentes genéricos (`KpiCard`, botones custom, inputs) a `src/components/ui`. Asegurar que *todas* las features importen de ahí.
2.  **Limpieza de Imports:** Corregir rutas relativas confusas (`../../..`) usando alias (`@/components/...`).
3.  **Estandarización de Páginas:** Todas las "Pages" deben seguir el patrón:
    - Header con Título y Acciones.
    - Stats/KPIs (si aplica).
    - Filtros/Búsqueda.
    - Tabla/Lista o Detalle.
4.  **Types:** Centralizar interfaces. No más `any`.

---

## 3. Arquitectura Backend (Django REST Framework)
Consolidación de aplicaciones para reducir fragmentación.

### Estructura Propuesta
```text
backend/
├── apps/
│   ├── core/                 # Modelos base (TimeStampedModel), Mixins, Utils globales
│   ├── users/                # Gestión de Auth y Usuarios
│   ├── finanzas/             # Todo lo financiero (Proveedores, Gastos, Presupuestos)
│   │   ├── management/       # Comandos personalizados
│   │   ├── migrations/
│   │   ├── api/              # (Opcional) Si crece mucho, separar serializers/views aquí
│   │   ├── models.py         # Modelos: Proveedor, Gasto
│   │   ├── serializers.py
│   │   ├── views.py          # ViewSets
│   │   └── urls.py
│   ├── donaciones/           # Donantes, Donaciones
│   └── casos/                # Casos (Mascotas), Hogares de Paso
```

### Acciones de Refactorización Backend
1.  **Apps Zombie:** Revisar carpeta `backend/apps/gastos` (parece vacía/legacy) y fusionar lógica útil a `finanzas`.
2.  **ViewSets Standard:** Asegurar que todos usen `ModelViewSet` con paginación estándar y filtros consistentes `django_filters`.
3.  **URLs Limpias:** Rutas API consistentes: `/api/recurso/`. Evitar prefijos redundantes como `/finanzas/proveedores/` -> `/api/proveedores/`.
4.  **Swagger/OpenAPI:** Mantener los docstrings para auto-generar documentación API útil.

---

## 4. Plan de Ejecución (Fases)

### Fase 1: Cimientos y Limpieza (Inmediato)
- [ ] Eliminar `backend/apps/gastos` si está obsoleta.
- [ ] Centralizar `KpiCard` y componentes UI básicos en Frontend.
- [ ] Verificar y corregir alias de importación (`@/`).

### Fase 2: Estandarización de Features (Iterativo)
- [ ] **Proveedores:** (Ya casi listo). Validar estructura final.
- [ ] **Donantes:** Replicar estructura de Proveedores (Scorecards, Filtros, Detalle Premium).
- [ ] **Casos:** Replicar estructura.
- [ ] **Donaciones:** Replicar estructura.
- [ ] **Gastos:** Replicar estructura.

### Fase 3: Documentación
- [ ] Crear `README.md` en raíz con instrucciones de setup ("Onboarding en 5 minutos").
- [ ] Comentar funciones complejas en Backend.

---

Este plan servirá como nuestra "Biblia" para las próximas sesiones.
