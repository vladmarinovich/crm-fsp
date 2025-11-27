import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ProveedorFormData, proveedorSchema } from '../schema/proveedorSchema';
import { useCreateProveedor, useUpdateProveedor } from '../hooks/useProveedores';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Proveedor } from '../types';

interface ProveedorFormProps {
    initialData?: Proveedor;
    isEditing?: boolean;
}

export const ProveedorForm = ({ initialData, isEditing = false }: ProveedorFormProps) => {
    const navigate = useNavigate();
    const createMutation = useCreateProveedor();
    const updateMutation = useUpdateProveedor();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProveedorFormData>({
        resolver: zodResolver(proveedorSchema),
        defaultValues: initialData || {},
    });

    const onSubmit: SubmitHandler<ProveedorFormData> = async (data) => {
        try {
            if (isEditing && initialData) {
                await updateMutation.mutateAsync({ id: initialData.id_proveedor, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            navigate('/proveedores');
        } catch (error) {
            console.error('Error saving proveedor:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre del Proveedor / Empresa"
                    {...register('nombre_proveedor')}
                    error={errors.nombre_proveedor?.message}
                    placeholder="Ej: Distribuidora de Alimentos SAS"
                />

                <Input
                    label="NIT / Identificación"
                    {...register('nit')}
                    error={errors.nit?.message}
                    placeholder="Ej: 900.123.456-7"
                />

                <Input
                    label="Tipo de Proveedor"
                    {...register('tipo_proveedor')}
                    error={errors.tipo_proveedor?.message}
                    placeholder="Ej: Alimentos, Servicios, Veterinaria"
                />

                <Input
                    label="Nombre de Contacto"
                    {...register('nombre_contacto')}
                    error={errors.nombre_contacto?.message}
                    placeholder="Persona encargada"
                />

                <Input
                    label="Correo Electrónico"
                    type="email"
                    {...register('correo')}
                    error={errors.correo?.message}
                    placeholder="contacto@proveedor.com"
                />

                <Input
                    label="Teléfono"
                    {...register('telefono')}
                    error={errors.telefono?.message}
                    placeholder="300 123 4567"
                />

                <Input
                    label="Ciudad"
                    {...register('ciudad')}
                    error={errors.ciudad?.message}
                    placeholder="Bogotá"
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/proveedores')}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditing ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
                </Button>
            </div>
        </form>
    );
};
