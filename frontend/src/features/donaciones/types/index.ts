export interface Donacion {
    id_donacion: number;
    id_donante: number;
    id_caso?: number;
    fecha_donacion: string;
    monto: number;
    medio_pago: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'WOMPI' | 'PAYU' | 'OTRO';
    estado: 'APROBADA' | 'PENDIENTE' | 'RECHAZADA';
    comprobante?: string;
    // Expanded fields from serializer
    donante_nombre?: string;
    caso_nombre?: string;
}

export interface DonacionFilters {
    search?: string;
    estado?: string;
    medio_pago?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
}
