import { Donacion } from '@/features/donaciones/types';
import { Gasto } from '@/features/gastos/types';

export interface Caso {
    id_caso: number;
    nombre_caso: string;
    estado: 'ABIERTO' | 'CERRADO' | 'EN_TRATAMIENTO' | 'ADOPTADO' | 'FALLECIDO';
    fecha_ingreso: string;
    fecha_salida?: string;
    veterinaria?: string;
    diagnostico?: string;
    id_hogar_de_paso?: number;
    hogar_nombre?: string;
    // Calculated fields from serializer
    total_donado?: number;
    total_gastado?: number;
    balance?: number;
}

export interface CasoFilters {
    search?: string;
    estado?: string;
    page?: number;
    page_size?: number;
}

export interface CasoBalance {
    caso: string;
    total_recaudado: number;
    total_gastado: number;
    balance: number;
    donaciones: Donacion[];
    gastos: Gasto[];
}
