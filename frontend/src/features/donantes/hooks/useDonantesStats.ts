import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

export interface DonantesStats {
    total_donantes: number;
    recurrentes: number;
    nuevos_mes: number;
    ltv_promedio: number;
    mayor_donacion: number;
}

export const useDonantesStats = (start_date?: string, end_date?: string) => {
    return useQuery({
        queryKey: ['donantes-stats', start_date, end_date],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (start_date) params.append('start_date', start_date);
            if (end_date) params.append('end_date', end_date);

            const { data } = await axiosClient.get<DonantesStats>(`/donantes/kpis/?${params.toString()}`);
            return data;
        },
    });
};
