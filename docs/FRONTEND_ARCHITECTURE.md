# 🎨 Arquitectura Frontend & UX

> **Nota para Data Engineers:** Esta capa de aplicación actúa como la **Fuente de Verdad Operativa (Operational Source of Truth)**. La calidad de los datos ingeridos por el pipeline de analítica comienza aquí, mediante validaciones en interfaz y estructuras de datos tipadas.

---

## 🏗️ Stack Tecnológico

*   **Framework:** React 18 + Vite (Alto rendimiento, "Zero Bundle Size" overhead).
*   **Lenguaje:** TypeScript (Tipado estático estricto para asegurar integridad de datos).
*   **Estilos:** TailwindCSS (Componentes utilitarios).
*   **Estado:** React Query (Gestión eficiente de caché de servidor y estados de carga).

---

## 🧩 Sistema de Componentes (Design System)

Implementamos un sistema de diseño atómico para mantener consistencia visual y de datos.

### Componente Destacado: Paginación Inteligente
Ubicación: `src/components/ui/Pagination.tsx`

Para manejar grandes volúmenes de registros (Casos, Donaciones) sin abrumar al usuario ni al navegador, implementamos una paginación robusta.

**Lógica de Renderizado ("Smart Ellipsis"):**
En lugar de renderizar 100 botones, el algoritmo calcula dinámicamente qué mostrar:
*   Muestra siempre los **extremos** (1, 100).
*   Muestra el contexto **local** (Vecinos de la página actual).
*   Colapsa el resto en `...`.

*Ejemplo Visual:* `1 ... 4 5 [6] 7 8 ... 50`

**Impacto en Datos:**
Esta navegación eficiente fomenta que los operadores revisen datos históricos, mejorando la calidad de la curaduría de datos en el origen.

---

## 🛡️ Integridad de Datos en Origen

La UI es la primera línea de defensa contra la corrupción de datos (Garbage In, Garbage Out).

1.  **Tipado Estricto (Interfaces de TypeScript):**
    Cada formulario y vista está respaldado por interfaces que reflejan los modelos de base de datos (`Donacion`, `Caso`, `Gasto`). Esto previene el envío de estructuras malformadas al backend.

2.  **Validaciones de Formulario:**
    Se implementan validaciones síncronas para campos críticos (RUT, Emails, Montos positivos) antes de siquiera tocar la API.

---

## 🔄 Flujo de Datos (App -> Pipeline)

1.  **Usuario (Frontend):** Ingresa/Modifica datos validos.
2.  **API (Django):** Valida reglas de negocio y persiste en PostgreSQL.
3.  **ETL (Data Platform):** Ingesta estos registros limpios usando la columna `last_modified_at`.

Este enfoque "Full Stack Awareness" asegura que el ecosistema de datos sea saludable de extremo a extremo.
