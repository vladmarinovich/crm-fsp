import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

export interface CasosStats {
    // Operational KPIs
    dias_promedio_por_caso: number;
    costo_diario_promedio_caso: number;
    costo_diario_fundacion: number;
    casos_con_deficit: number;
    // Financial KPIs
    promedio_recaudado: number;
    promedio_gastado: number;
    promedio_casos_mensuales: number;
    // Estado KPIs
    total_historico: number;
    casos_activos: number;
    abierto: number;
    en_tratamiento: number;
    adoptados: number;
    cerrado: number;
    fallecido: number;
    // Operational KPIs Secondary
    sin_hogar: number;
    tiempo_promedio: number;
}

export const useCasosStats = (start_date?: string, end_date?: string) => {
    return useQuery({
        queryKey: ['casos-stats', start_date, end_date],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (start_date) params.append('start_date', start_date);
            if (end_date) params.append('end_date', end_date);

            const { data } = await axiosClient.get<CasosStats>(`/casos/kpis/?${params.toString()}`);
            return data;
        },
    });
};
