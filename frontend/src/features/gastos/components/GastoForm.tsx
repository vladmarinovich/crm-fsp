import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { GastoFormData, gastoSchema } from '../schema/gastoSchema';
import { useCreateGasto, useUpdateGasto, useProveedores } from '../hooks/useGastos';
import { useCasos } from '@/features/casos/hooks/useCasos';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Combobox } from '@/components/ui/Combobox';
import { Textarea } from '@/components/ui/Textarea';
import { Gasto } from '../types';

interface GastoFormProps {
    initialData?: Gasto;
    isEditing?: boolean;
}

export const GastoForm = ({ initialData, isEditing = false }: GastoFormProps) => {
    const navigate = useNavigate();
    const createMutation = useCreateGasto();
    const updateMutation = useUpdateGasto();

    // Search states
    const [proveedorSearch, setProveedorSearch] = useState('');
    const [casoSearch, setCasoSearch] = useState('');

    // Debounce search
    const [debouncedProveedorSearch, setDebouncedProveedorSearch] = useState('');
    const [debouncedCasoSearch, setDebouncedCasoSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedProveedorSearch(proveedorSearch), 500);
        return () => clearTimeout(timer);
    }, [proveedorSearch]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedCasoSearch(casoSearch), 500);
        return () => clearTimeout(timer);
    }, [casoSearch]);

    // Fetch data
    const { data: proveedoresData, isLoading: isLoadingProveedores } = useProveedores(debouncedProveedorSearch);
    const { data: casosData, isLoading: isLoadingCasos } = useCasos({ search: debouncedCasoSearch });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<GastoFormData>({
        resolver: zodResolver(gastoSchema),
        defaultValues: (initialData as any) || {
            fecha_pago: new Date().toISOString().split('T')[0],
            estado: 'PENDIENTE',
            medio_pago: 'TRANSFERENCIA',
        },
    });

    // Combobox selection
    const selectedProveedorId = watch('id_proveedor');
    const selectedCasoId = watch('id_caso');

    const onSubmit: SubmitHandler<GastoFormData> = async (data) => {
        try {
            if (isEditing && initialData) {
                await updateMutation.mutateAsync({ id: initialData.id_gasto, data: data as any });
            } else {
                await createMutation.mutateAsync(data as any);
            }
            navigate('/gastos');
        } catch (error) {
            console.error('Error saving gasto:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre del Gasto"
                    {...register('nombre_gasto')}
                    error={errors.nombre_gasto?.message}
                    placeholder="Ej: Compra de alimentos"
                />

                <Input
                    label="Monto"
                    type="number"
                    {...register('monto', { valueAsNumber: true })}
                    error={errors.monto?.message}
                    placeholder="0.00"
                />

                <Combobox
                    label="Proveedor"
                    value={selectedProveedorId}
                    onChange={(val) => setValue('id_proveedor', Number(val), { shouldValidate: true })}
                    onSearch={setProveedorSearch}
                    options={proveedoresData?.results.map(p => ({ value: p.id_proveedor, label: p.nombre_proveedor })) || []}
                    isLoading={isLoadingProveedores}
                    error={errors.id_proveedor?.message}
                    placeholder="Buscar proveedor..."
                    initialLabel={initialData?.proveedor_nombre}
                />

                <Combobox
                    label="Caso Relacionado"
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
                    label="Fecha de Pago"
                    type="date"
                    {...register('fecha_pago')}
                    error={errors.fecha_pago?.message}
                    max={new Date().toISOString().split('T')[0]}
                />

                <Select
                    label="Estado"
                    {...register('estado')}
                    error={errors.estado?.message}
                    options={[
                        { value: 'PAGADO', label: 'Pagado' },
                        { value: 'PENDIENTE', label: 'Pendiente' },
                        { value: 'ANULADO', label: 'Anulado' },
                    ]}
                />

                <Select
                    label="Medio de Pago"
                    {...register('medio_pago')}
                    error={errors.medio_pago?.message}
                    options={[
                        { value: 'EFECTIVO', label: 'Efectivo' },
                        { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
                        { value: 'TARJETA', label: 'Tarjeta Crédito/Débito' },
                        { value: 'OTRO', label: 'Otro' },
                    ]}
                />
            </div>



            <div className="w-full">
                <Textarea
                    label="Comprobante / Notas"
                    rows={3}
                    {...register('comprobante')}
                    placeholder="Detalles adicionales o link al comprobante..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/gastos')}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditing ? 'Actualizar Gasto' : 'Registrar Gasto'}
                </Button>
            </div>
        </form>
    );
};
