import { useParams, useNavigate } from 'react-router-dom';
import { useDonacion } from '../hooks/useDonaciones';
import { DonacionForm } from '../components/DonacionForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const EditDonacionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: donacion, isLoading, error } = useDonacion(Number(id));

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar la donación</div>;
    if (!donacion) return <div className="p-8 text-center text-red-500">Donación no encontrada</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/donaciones')}
                    className="p-2 h-auto rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Editar Donación</h1>
                    <p className="text-sm text-slate-500">Donación #{donacion.id_donacion}</p>
                </div>
            </div>

            <Card className="p-6 border-slate-200 shadow-sm">
                <DonacionForm initialData={donacion} isEditing />
            </Card>
        </div>
    );
};
