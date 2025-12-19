import http from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { Caso, CasoFilters, CasoBalance } from '../types';
import { PaginatedResponse } from '@/types/api';

export const casosApi = {
    getAll: async (params?: CasoFilters) => {
        const { data } = await http.get<PaginatedResponse<Caso>>(ENDPOINTS.CASOS.LIST, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await http.get<Caso>(ENDPOINTS.CASOS.DETAIL(id));
        return data;
    },

    create: async (caso: Partial<Caso>) => {
        const { data } = await http.post<Caso>(ENDPOINTS.CASOS.CREATE, caso);
        return data;
    },

    update: async (id: number, caso: Partial<Caso>) => {
        const { data } = await http.put<Caso>(ENDPOINTS.CASOS.UPDATE(id), caso);
        return data;
    },

    delete: async (id: number) => {
        await http.delete(ENDPOINTS.CASOS.DELETE(id));
    },

    getBalance: async (id: number) => {
        const { data } = await http.get<CasoBalance>(ENDPOINTS.CASOS.BALANCE(id));
        return data;
    },

    exportCsv: async (filters?: { fecha_desde?: string; fecha_hasta?: string; start_date?: string; end_date?: string }) => {
        const response = await http.get('/casos/exportar_csv/', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },

    exportExcel: async (filters?: { fecha_desde?: string; fecha_hasta?: string; start_date?: string; end_date?: string }) => {
        const response = await http.get('/casos/exportar_excel/', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },
};
