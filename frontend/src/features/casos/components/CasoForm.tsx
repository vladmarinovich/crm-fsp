import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { CasoFormData, casoSchema } from '../schema/casoSchema';
import { useCreateCaso, useUpdateCaso } from '../hooks/useCasos';
import { useHogares } from '../hooks/useHogares';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Combobox } from '@/components/ui/Combobox';
import { Caso } from '../types';

interface CasoFormProps {
    initialData?: Caso;
    isEditing?: boolean;
}

export const CasoForm = ({ initialData, isEditing = false }: CasoFormProps) => {
    const navigate = useNavigate();
    const createMutation = useCreateCaso();
    const updateMutation = useUpdateCaso();

    const [hogarSearch, setHogarSearch] = useState('');
    const [debouncedHogarSearch, setDebouncedHogarSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedHogarSearch(hogarSearch), 500);
        return () => clearTimeout(timer);
    }, [hogarSearch]);

    const { data: hogaresData, isLoading: isLoadingHogares } = useHogares(debouncedHogarSearch);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CasoFormData>({
        resolver: zodResolver(casoSchema),
        defaultValues: (initialData as any) || {
            estado: 'ABIERTO',
            fecha_ingreso: new Date().toISOString().split('T')[0],
        },
    });

    const selectedHogarId = watch('id_hogar_de_paso');

    const onSubmit: SubmitHandler<CasoFormData> = async (data) => {
        try {
            // Clean up empty optional fields
            const cleanData = {
                ...data,
                fecha_salida: data.fecha_salida || null,
                id_hogar_de_paso: data.id_hogar_de_paso || null,
            };

            if (isEditing && initialData) {
                await updateMutation.mutateAsync({ id: initialData.id_caso, data: cleanData as any });
            } else {
                await createMutation.mutateAsync(cleanData as any);
            }
            navigate('/casos');
        } catch (error) {
            console.error('Error saving caso:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <Input
                        label="Nombre del Caso"
                        {...register('nombre_caso')}
                        error={errors.nombre_caso?.message}
                        placeholder="Ej: Rescate de Luna"
                    />
                </div>

                <Select
                    label="Estado"
                    {...register('estado')}
                    error={errors.estado?.message}
                    options={[
                        { value: 'ABIERTO', label: 'Abierto' },
                        { value: 'EN_TRATAMIENTO', label: 'En Tratamiento' },
                        { value: 'ADOPTADO', label: 'Adoptado' },
                        { value: 'FALLECIDO', label: 'Fallecido' },
                        { value: 'CERRADO', label: 'Cerrado' },
                    ]}
                />

                <Input
                    label="Fecha de Ingreso"
                    type="date"
                    {...register('fecha_ingreso')}
                    error={errors.fecha_ingreso?.message}
                />

                <Input
                    label="Fecha de Salida (Opcional)"
                    type="date"
                    {...register('fecha_salida')}
                    error={errors.fecha_salida?.message}
                />

                <Input
                    label="Veterinaria (Opcional)"
                    {...register('veterinaria')}
                    error={errors.veterinaria?.message}
                    placeholder="Ej: Vet. San Francisco"
                />

                <Combobox
                    label="Hogar de Paso (Opcional)"
                    value={selectedHogarId}
                    onChange={(val) => setValue('id_hogar_de_paso', Number(val), { shouldValidate: true })}
                    onSearch={setHogarSearch}
                    options={hogaresData?.results.map(h => ({ value: h.id_hogar, label: h.nombre_hogar })) || []}
                    isLoading={isLoadingHogares}
                    error={errors.id_hogar_de_paso?.message}
                    placeholder="Buscar hogar..."
                    initialLabel={initialData?.hogar_nombre}
                />
            </div>



            <div className="w-full">
                <Textarea
                    label="Diagnóstico / Descripción"
                    rows={4}
                    {...register('diagnostico')}
                    placeholder="Detalles del caso, diagnóstico médico, historia..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/casos')}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditing ? 'Actualizar Caso' : 'Crear Caso'}
                </Button>
            </div>
        </form>
    );
};
