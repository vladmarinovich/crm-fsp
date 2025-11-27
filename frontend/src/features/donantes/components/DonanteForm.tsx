import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { DonanteFormData, donanteSchema } from '../schema/donanteSchema';
import { useCreateDonante, useUpdateDonante } from '../hooks/useDonantes';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Donante } from '../types';

interface DonanteFormProps {
    initialData?: Donante;
    isEditing?: boolean;
}

export const DonanteForm = ({ initialData, isEditing = false }: DonanteFormProps) => {
    const navigate = useNavigate();
    const createMutation = useCreateDonante();
    const updateMutation = useUpdateDonante();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DonanteFormData>({
        resolver: zodResolver(donanteSchema),
        defaultValues: (initialData as any) || {
            pais: 'Colombia',
            tipo_donante: 'PERSONA_NATURAL',
            tipo_id: 'CC',
        },
    });

    const onSubmit: SubmitHandler<DonanteFormData> = async (data) => {
        try {
            if (isEditing && initialData) {
                await updateMutation.mutateAsync({ id: initialData.id_donante, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            navigate('/donantes');
        } catch (error) {
            console.error('Error saving donante:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre Completo / Razón Social"
                    {...register('donante')}
                    error={errors.donante?.message}
                    placeholder="Ej: Juan Pérez"
                />

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <Select
                            label="Tipo ID"
                            {...register('tipo_id')}
                            error={errors.tipo_id?.message}
                            options={[
                                { value: 'CC', label: 'C.C.' },
                                { value: 'CE', label: 'C.E.' },
                                { value: 'NIT', label: 'NIT' },
                                { value: 'PASAPORTE', label: 'Pasaporte' },
                            ]}
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            label="Número de Identificación"
                            {...register('identificacion')}
                            error={errors.identificacion?.message}
                            placeholder="Ej: 1234567890"
                        />
                    </div>
                </div>

                <Input
                    label="Correo Electrónico"
                    type="email"
                    {...register('correo')}
                    error={errors.correo?.message}
                    placeholder="juan@ejemplo.com"
                />

                <Input
                    label="Teléfono / Celular"
                    {...register('telefono')}
                    error={errors.telefono?.message}
                    placeholder="Ej: 3001234567"
                />

                <Input
                    label="Ciudad"
                    {...register('ciudad')}
                    error={errors.ciudad?.message}
                    placeholder="Ej: Bogotá"
                />

                <Input
                    label="País"
                    {...register('pais')}
                    error={errors.pais?.message}
                    placeholder="Ej: Colombia"
                />

                <Select
                    label="Tipo de Donante"
                    {...register('tipo_donante')}
                    error={errors.tipo_donante?.message}
                    options={[
                        { value: 'PERSONA_NATURAL', label: 'Persona Natural' },
                        { value: 'EMPRESA', label: 'Empresa' },
                        { value: 'FUNDACION', label: 'Fundación' },
                        { value: 'OTRO', label: 'Otro' },
                    ]}
                />
            </div>



            <div className="w-full">
                <Textarea
                    label="Notas Adicionales"
                    rows={3}
                    {...register('notas')}
                    placeholder="Información extra sobre el donante..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/donantes')}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditing ? 'Actualizar Donante' : 'Crear Donante'}
                </Button>
            </div>
        </form>
    );
};
