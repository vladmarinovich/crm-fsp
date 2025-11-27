import http from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { PaginatedResponse } from '@/types/api';

export interface HogarDePaso {
    id_hogar: number;
    nombre_hogar: string;
    capacidad: number;
    direccion?: string;
    telefono?: string;
}

export const hogaresApi = {
    getAll: async (search?: string) => {
        const params = search ? { search } : {};
        const { data } = await http.get<PaginatedResponse<HogarDePaso>>(ENDPOINTS.HOGARES.LIST, { params });
        return data;
    },
};
