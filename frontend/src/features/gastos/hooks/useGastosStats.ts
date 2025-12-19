import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

export interface GastosStats {
    total_gasto: number;
    promedio_gasto: number;
    numero_gastos: number;
    gastos_pendientes: number;
    count_pendientes: number;
    variacion_total: number;
    variacion_promedio: number;
    chart_data: Array<{
        fecha: string;
        monto: number;
        cantidad: number;
    }>;
}

interface StatsFilters {
    start_date?: string;
    end_date?: string;
    caso?: string;
}

export const useGastosStats = (filters?: StatsFilters) => {
    return useQuery({
        queryKey: ['gastos-stats', filters],
        queryFn: async () => {
            const { data } = await axiosClient.get<GastosStats>('/gastos/kpis/', { params: filters });
            return data;
        },
    });
};
