import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

export interface DonacionesStats {
    total_recaudado: number;
    donacion_promedio: number;
    cantidad_donaciones: number;
    donantes_unicos: number;
    cantidad_exitosas: number;
    cantidad_rechazadas: number;
    cantidad_fallidas: number;

    // Variaciones
    variacion_recaudo: number;
    variacion_promedio: number;
    variacion_exitosas: number;
    variacion_rechazadas: number;
    variacion_fallidas: number;
    variacion_total_intentos: number;
    variacion_donantes_unicos: number;

    chart_data: Array<{
        fecha: string;
        monto: number;
        cantidad: number;
    }>;
}

export const useDonacionesStats = (start_date?: string, end_date?: string) => {
    return useQuery({
        queryKey: ['donaciones-stats', start_date, end_date],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (start_date) params.append('start_date', start_date);
            if (end_date) params.append('end_date', end_date);

            const { data } = await axiosClient.get<DonacionesStats>(`/donaciones/kpis/?${params.toString()}`);
            return data;
        },
    });
};
