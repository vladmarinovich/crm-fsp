import http from '@/api/axiosClient';
import { PaginatedResponse } from '@/types/api';
import { ENDPOINTS } from '@/api/endpoints';

export interface HogarDePaso {
    id_hogar_de_paso: number;
    nombre_hogar: string;
    nombre_contacto: string;
    telefono: string;
    ciudad: string;
    cupo_maximo: number;
    tarifa_diaria?: number;
    desempeno?: string;
    ultimo_contacto?: string;
    notas?: string;
}

export const hogaresApi = {
    getAll: async (params?: { page?: number; page_size?: number; search?: string }) => {
        const { data } = await http.get<PaginatedResponse<HogarDePaso>>(ENDPOINTS.HOGARES.LIST, { params });
        return data;
    },

    getById: async (id: number) => {
        // Asumiendo que ENDPOINTS.HOGARES.LIST termina en '/', construimos la URL correctamente
        const url = ENDPOINTS.HOGARES.LIST.endsWith('/') ? `${ENDPOINTS.HOGARES.LIST}${id}/` : `${ENDPOINTS.HOGARES.LIST}/${id}/`;
        const { data } = await http.get<HogarDePaso>(url);
        return data;
    },

    create: async (hogar: Partial<HogarDePaso>) => {
        const { data } = await http.post<HogarDePaso>(ENDPOINTS.HOGARES.LIST, hogar);
        return data;
    },

    update: async (id: number, hogar: Partial<HogarDePaso>) => {
        const url = ENDPOINTS.HOGARES.LIST.endsWith('/') ? `${ENDPOINTS.HOGARES.LIST}${id}/` : `${ENDPOINTS.HOGARES.LIST}/${id}/`;
        const { data } = await http.patch<HogarDePaso>(url, hogar);
        return data;
    },

    delete: async (id: number) => {
        const url = ENDPOINTS.HOGARES.LIST.endsWith('/') ? `${ENDPOINTS.HOGARES.LIST}${id}/` : `${ENDPOINTS.HOGARES.LIST}/${id}/`;
        await http.delete(url);
    },

    exportCsv: async (filters?: { ciudad?: string }) => {
        const url = ENDPOINTS.HOGARES.LIST.endsWith('/') ? `${ENDPOINTS.HOGARES.LIST}exportar_csv/` : `${ENDPOINTS.HOGARES.LIST}/exportar_csv/`;
        const response = await http.get(url, {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    }
};
