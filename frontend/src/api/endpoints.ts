export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
    },
    DASHBOARD: {
        GET_STATS: '/dashboard/',
    },
    DONANTES: {
        LIST: '/donantes/',
        DETAIL: (id: number) => `/donantes/${id}/`,
        CREATE: '/donantes/',
        UPDATE: (id: number) => `/donantes/${id}/`,
        DELETE: (id: number) => `/donantes/${id}/`,
        TOP: '/donantes/top/',
        DONACIONES: (id: number) => `/donantes/${id}/donaciones/`,
    },
    CASOS: {
        LIST: '/casos/',
        DETAIL: (id: number) => `/casos/${id}/`,
        CREATE: '/casos/',
        UPDATE: (id: number) => `/casos/${id}/`,
        DELETE: (id: number) => `/casos/${id}/`,
        ACTIVOS: '/casos/activos/',
        BALANCE: (id: number) => `/casos/${id}/balance/`,
    },
    DONACIONES: {
        LIST: '/donaciones/',
        DETAIL: (id: number) => `/donaciones/${id}/`,
        CREATE: '/donaciones/',
        UPDATE: (id: number) => `/donaciones/${id}/`,
        DELETE: (id: number) => `/donaciones/${id}/`,
        RECIENTES: '/donaciones/recientes/',
        POR_MES: '/donaciones/por_mes/',
    },
    GASTOS: {
        LIST: '/gastos/',
    },
    PROVEEDORES: {
        LIST: '/proveedores/',
        GASTOS: (id: number) => `/proveedores/${id}/gastos/`,
    },
    HOGARES: {
        LIST: '/hogares/',
    },
};
