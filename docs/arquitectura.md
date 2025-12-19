
# ⚙️ Arquitectura del Sistema

## Visión General
El sistema **Salvando Patitas CRM** sigue una arquitectura **Client-Server** desacoplada, utilizando **Django REST Framework (DRF)** para el backend y **React + Vite** para el frontend. La persistencia de datos y la autenticación son manejadas por **Supabase** (PostgreSQL).

## 🏗️ Diagrama Conceptual

```mermaid
graph TD
    Client[Cliente (Browser)] -->|HTTPS / JSON| CDN[Frontend (React + Vite)]
    CDN -->|API Requests (Axios)| API[Backend (Django REST Framework)]
    
    subgraph "Backend Services"
        API -->|Auth & Data| Supabase[Supabase (PostgreSQL + Auth)]
        API -->|Business Logic| Apps[Django Apps (Core, Casos, Donaciones, Finanzas)]
    end
    
    subgraph "Frontend Services"
        CDN -->|State Mgmt| Zustand
        CDN -->|Data Fetching| ReactQuery
        CDN -->|Routing| ReactRouter
    end
```

## 🔄 Flujo Request/Response

1.  **Request**: El usuario interactúa con la UI (React). `React Query` gestiona la petición y `Axios` la envía al backend.
2.  **Auth Middleware**: `SupabaseAuthentication` intercepta el request, extrae el JWT del header `Authorization`, y lo valida contra Supabase. Si es válido, autentica al usuario en Django.
3.  **View/ViewSet**: La petición llega a la vista correspondiente (ej. `CasoViewSet`).
4.  **Serializer**: Los datos se validan y transforman usando Serializers de DRF.
5.  **Database**: Django ORM interactúa con la base de datos PostgreSQL en Supabase.
6.  **Response**: Los datos procesados se devuelven en formato JSON al frontend.

## 📂 Estructura de Directorios

### Backend (`/backend`)
```text
backend/
├── apps/                 # Aplicaciones modulares de Django
│   ├── casos/            # Gestión de Casos y Hogares de Paso
│   ├── core/             # Dashboard y configuraciones base
│   ├── donaciones/       # Gestión de Donantes y Donaciones
│   ├── finanzas/         # Gestión de Gastos y Proveedores
│   └── users/            # Lógica de autenticación extendida
├── settings.py           # Configuración del proyecto
├── urls.py               # Enrutador principal
└── wsgi.py               # Punto de entrada WSGI
```

### Frontend (`/frontend`)
```text
frontend/
├── src/
│   ├── api/              # Configuración de Axios y Endpoints
│   ├── components/       # Componentes UI reutilizables (Botones, Inputs, Cards)
│   ├── core/             # Lógica central (Supabase client, Stores globales)
│   ├── features/         # Módulos funcionales (Casos, Donantes, etc.)
│   │   ├── components/   # Componentes específicos del feature
│   │   ├── hooks/        # Hooks personalizados (React Query)
│   │   ├── pages/        # Vistas/Páginas del feature
│   │   └── services/     # Llamadas a la API específicas
│   ├── layouts/          # Plantillas de diseño (Sidebar, Topbar)
│   └── router/           # Configuración de rutas y protección
├── index.html            # Punto de entrada HTML
└── vite.config.ts        # Configuración de Vite
```
