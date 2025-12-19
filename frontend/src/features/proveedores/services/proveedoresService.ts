import http from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { Proveedor, ProveedorFilters } from '../types';
import { PaginatedResponse } from '@/types/api';

export const proveedoresApi = {
    getAll: async (params?: ProveedorFilters) => {
        const { data } = await http.get<PaginatedResponse<Proveedor>>(ENDPOINTS.PROVEEDORES.LIST, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await http.get<Proveedor>(`${ENDPOINTS.PROVEEDORES.LIST}${id}/`);
        return data;
    },

    create: async (proveedor: Partial<Proveedor>) => {
        const { data } = await http.post<Proveedor>(ENDPOINTS.PROVEEDORES.LIST, proveedor);
        return data;
    },

    update: async (id: number, proveedor: Partial<Proveedor>) => {
        const { data } = await http.put<Proveedor>(`${ENDPOINTS.PROVEEDORES.LIST}${id}/`, proveedor);
        return data;
    },

    delete: async (id: number) => {
        await http.delete(`${ENDPOINTS.PROVEEDORES.LIST}${id}/`);
    },

    getGastos: async (id: number) => {
        const { data } = await http.get(ENDPOINTS.PROVEEDORES.GASTOS(id));
        return data;
    },

    exportCsv: async () => {
        const response = await http.get(`${ENDPOINTS.PROVEEDORES.LIST}exportar_csv/`, {
            responseType: 'blob',
        });
        return response.data;
    },

    exportExcel: async () => {
        const response = await http.get(`${ENDPOINTS.PROVEEDORES.LIST}exportar_excel/`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
