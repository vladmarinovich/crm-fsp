import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { DonacionFormData, donacionSchema } from '../schema/donacionSchema';
import { useCreateDonacion, useUpdateDonacion } from '../hooks/useDonaciones';
import { useDonantes } from '@/features/donantes/hooks/useDonantes';
import { useCasos } from '@/features/casos/hooks/useCasos';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Combobox } from '@/components/ui/Combobox';
import { Textarea } from '@/components/ui/Textarea';
import { Donacion } from '../types';

interface DonacionFormProps {
    initialData?: Donacion;
    isEditing?: boolean;
}

export const DonacionForm = ({ initialData, isEditing = false }: DonacionFormProps) => {
    const navigate = useNavigate();
    const createMutation = useCreateDonacion();
    const updateMutation = useUpdateDonacion();

    // Search states
    const [donanteSearch, setDonanteSearch] = useState('');
    const [casoSearch, setCasoSearch] = useState('');

    // Debounce
    const [debouncedDonanteSearch, setDebouncedDonanteSearch] = useState('');
    const [debouncedCasoSearch, setDebouncedCasoSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedDonanteSearch(donanteSearch), 500);
        return () => clearTimeout(timer);
    }, [donanteSearch]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedCasoSearch(casoSearch), 500);
        return () => clearTimeout(timer);
    }, [casoSearch]);

    // Fetch data
    const { data: donantesData, isLoading: isLoadingDonantes } = useDonantes({ search: debouncedDonanteSearch });
    const { data: casosData, isLoading: isLoadingCasos } = useCasos({ search: debouncedCasoSearch });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<DonacionFormData>({
        resolver: zodResolver(donacionSchema),
        defaultValues: (initialData as any) || {
            fecha_donacion: new Date().toISOString().split('T')[0],
            estado: 'APROBADA',
            medio_pago: 'TRANSFERENCIA',
        },
    });

    // Combobox selection
    const selectedDonanteId = watch('id_donante');
    const selectedCasoId = watch('id_caso');

    const onSubmit: SubmitHandler<DonacionFormData> = async (data) => {
        try {
            const cleanData = {
                ...data,
                id_caso: data.id_caso || null,
            };

            if (isEditing && initialData) {
                await updateMutation.mutateAsync({ id: initialData.id_donacion, data: cleanData as any });
            } else {
                await createMutation.mutateAsync(cleanData as any);
            }
            navigate('/donaciones');
        } catch (error) {
            console.error('Error saving donacion:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Combobox
                    label="Donante"
                    value={selectedDonanteId}
                    onChange={(val) => setValue('id_donante', Number(val), { shouldValidate: true })}
                    onSearch={setDonanteSearch}
                    options={donantesData?.results.map(d => ({ value: d.id_donante, label: d.donante })) || []}
                    isLoading={isLoadingDonantes}
                    error={errors.id_donante?.message}
                    placeholder="Buscar donante..."
                    initialLabel={initialData?.donante_nombre}
                />

                <Combobox
                    label="Caso (Opcional)"
                    value={selectedCasoId}
                    onChange={(val) => setValue('id_caso', Number(val), { shouldValidate: true })}
                    onSearch={setCasoSearch}
                    options={casosData?.results.map(c => ({ value: c.id_caso, label: c.nombre_caso })) || []}
                    isLoading={isLoadingCasos}
                    error={errors.id_caso?.message}
                    placeholder="Buscar caso..."
                    initialLabel={initialData?.caso_nombre}
                />

                <Input
                    label="Monto"
                    type="number"
                    {...register('monto')}
                    error={errors.monto?.message}
                    placeholder="0.00"
                />

                <Input
                    label="Fecha de Donación"
                    type="date"
                    {...register('fecha_donacion')}
                    error={errors.fecha_donacion?.message}
                    max={new Date().toISOString().split('T')[0]}
                />

                <Select
                    label="Medio de Pago"
                    {...register('medio_pago')}
                    error={errors.medio_pago?.message}
                    options={[
                        { value: 'EFECTIVO', label: 'Efectivo' },
                        { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
                        { value: 'TARJETA', label: 'Tarjeta Crédito/Débito' },
                        { value: 'WOMPI', label: 'Wompi' },
                        { value: 'PAYU', label: 'PayU' },
                        { value: 'OTRO', label: 'Otro' },
                    ]}
                />

                <Select
                    label="Estado"
                    {...register('estado')}
                    error={errors.estado?.message}
                    options={[
                        { value: 'APROBADA', label: 'Aprobada' },
                        { value: 'PENDIENTE', label: 'Pendiente' },
                        { value: 'RECHAZADA', label: 'Rechazada' },
                    ]}
                />
            </div>



            <div className="w-full">
                <Textarea
                    label="Comprobante / Notas"
                    rows={3}
                    {...register('comprobante')}
                    placeholder="Número de comprobante o notas adicionales..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/donaciones')}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditing ? 'Actualizar Donación' : 'Registrar Donación'}
                </Button>
            </div>
        </form>
    );
};
