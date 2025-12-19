import http from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { Donante, DonanteFilters } from '../types';
import { PaginatedResponse } from '@/types/api';

export const donantesApi = {
    getAll: async (params?: DonanteFilters) => {
        const { data } = await http.get<PaginatedResponse<Donante>>(ENDPOINTS.DONANTES.LIST, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await http.get<Donante>(ENDPOINTS.DONANTES.DETAIL(id));
        return data;
    },

    create: async (donante: Partial<Donante>) => {
        const { data } = await http.post<Donante>(ENDPOINTS.DONANTES.CREATE, donante);
        return data;
    },

    update: async (id: number, donante: Partial<Donante>) => {
        const { data } = await http.put<Donante>(ENDPOINTS.DONANTES.UPDATE(id), donante);
        return data;
    },

    delete: async (id: number) => {
        await http.delete(ENDPOINTS.DONANTES.DELETE(id));
    },

    getDonaciones: async (id: number) => {
        const { data } = await http.get(ENDPOINTS.DONANTES.DONACIONES(id));
        return data;
    },

    exportCsv: async (filters?: DonanteFilters) => {
        const response = await http.get('/donantes/exportar_csv/', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },

    exportExcel: async (filters?: DonanteFilters) => {
        const response = await http.get('/donantes/exportar_excel/', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },
};
