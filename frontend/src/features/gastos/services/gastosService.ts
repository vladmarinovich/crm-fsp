import http from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { Gasto, GastoFilters, Proveedor } from '../types';
import { PaginatedResponse } from '@/types/api';

export const gastosApi = {
    getAll: async (params?: GastoFilters) => {
        const { data } = await http.get<PaginatedResponse<Gasto>>(ENDPOINTS.GASTOS.LIST, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await http.get<Gasto>(`${ENDPOINTS.GASTOS.LIST}${id}/`);
        return data;
    },

    create: async (gasto: Partial<Gasto>) => {
        const { data } = await http.post<Gasto>(ENDPOINTS.GASTOS.LIST, gasto);
        return data;
    },

    update: async (id: number, gasto: Partial<Gasto>) => {
        const { data } = await http.put<Gasto>(`${ENDPOINTS.GASTOS.LIST}${id}/`, gasto);
        return data;
    },

    delete: async (id: number) => {
        await http.delete(`${ENDPOINTS.GASTOS.LIST}${id}/`);
    },

    exportCsv: async (filters?: { fecha_desde?: string; fecha_hasta?: string }) => {
        const response = await http.get('/gastos/exportar_csv/', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },
};

export const proveedoresApi = {
    getAll: async (search?: string) => {
        const { data } = await http.get<PaginatedResponse<Proveedor>>(ENDPOINTS.PROVEEDORES.LIST, { params: { search } });
        return data;
    },
};
