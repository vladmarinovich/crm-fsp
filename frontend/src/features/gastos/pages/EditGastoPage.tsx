import { useParams, useNavigate } from 'react-router-dom';
import { useGasto } from '../hooks/useGastos';
import { GastoForm } from '../components/GastoForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const EditGastoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: gasto, isLoading, error } = useGasto(Number(id));

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar el gasto</div>;
    if (!gasto) return <div className="p-8 text-center text-red-500">Gasto no encontrado</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/gastos')}
                    className="p-2 h-auto rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Editar Gasto</h1>
                    <p className="text-sm text-slate-500">Gasto #{gasto.id_gasto}</p>
                </div>
            </div>

            <Card className="p-6 border-slate-200 shadow-sm">
                <GastoForm initialData={gasto} isEditing />
            </Card>
        </div>
    );
};
