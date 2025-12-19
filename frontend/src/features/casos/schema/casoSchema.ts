import { z } from 'zod';

export const casoSchema = z.object({
    nombre_caso: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    estado: z.enum(['ABIERTO', 'CERRADO', 'EN_TRATAMIENTO', 'ADOPTADO', 'FALLECIDO'], {
        errorMap: () => ({ message: 'Seleccione un estado válido' })
    }),
    fecha_ingreso: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Ingrese una fecha válida',
    }),
    fecha_salida: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Ingrese una fecha válida',
    }),
    veterinaria: z.string().optional(),
    diagnostico: z.string().optional(),
    presupuesto: z.coerce.number().optional(),
    id_hogar_de_paso: z.coerce.number().optional(), // Coerce to number if input is string
});

export type CasoFormData = z.infer<typeof casoSchema>;
