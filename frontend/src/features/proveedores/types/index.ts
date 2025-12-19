export interface Proveedor {
    id_proveedor: number;
    nombre_proveedor: string;
    tipo_proveedor?: string;
    nit?: string;
    nombre_contacto?: string;
    correo?: string;
    telefono?: string;
    ciudad?: string;
}

export interface ProveedorFilters {
    search?: string;
    page?: number;
    page_size?: number;
    start_date?: string;
    end_date?: string;
}
