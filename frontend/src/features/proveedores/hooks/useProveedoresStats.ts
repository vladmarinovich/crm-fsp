import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

export interface ProveedoresStats {
    total_proveedores: number;
    nuevos_mes: number;
    con_actividad: number;
}

export const useProveedoresStats = () => {
    return useQuery({
        queryKey: ['proveedores-stats'],
        queryFn: async () => {
            const { data } = await axiosClient.get<ProveedoresStats>('/proveedores/kpis/');
            return data;
        },
    });
};
