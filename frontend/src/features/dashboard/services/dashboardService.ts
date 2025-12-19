import axiosClient from '../../../api/axiosClient';

export interface DashboardKPIs {
    total_donado: number;
    total_gastado: number;
    balance_neto: number;
    casos_activos_count: number;
}

export interface PaisStat {
    pais: string;
    count: number;
    total_dinero: number;
}

export interface CasoDestacado {
    id_caso: number;
    nombre_caso: string;
    total_recaudado?: number;
    total_gastado?: number;
    estado: string;
}

export interface Trend {
    value: number;
    isPositive: boolean;
    label: string;
}

export interface BalancePoint {
    fecha: string;
    donaciones: number;
    gastos: number;
    balance: number;
}

export interface GastoCategoria {
    categoria: string;
    total: number;
    cantidad: number;
}

export interface TopDonante {
    id: number;
    nombre: string;
    pais: string;
    total_donado: number;
    num_donaciones: number;
}

export interface DashboardResponse {
    kpis: DashboardKPIs;
    trends: {
        total_donado: Trend;
        total_gastado: Trend;
        balance_neto: Trend;
    };
    top_paises: PaisStat[];
    casos_destacados: CasoDestacado[];
    balance_historico: BalancePoint[];
    gastos_por_categoria: GastoCategoria[];
    top_donantes: TopDonante[];
}

export const getDashboardStats = async (startDate?: string, endDate?: string): Promise<DashboardResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await axiosClient.get<DashboardResponse>(`/dashboard/`, { params });
    return response.data;
};
