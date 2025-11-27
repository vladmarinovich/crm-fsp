import { useParams, useNavigate } from 'react-router-dom';
import { useDonante } from '../hooks/useDonantes';
import { DonanteForm } from '../components/DonanteForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const EditDonantePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: donante, isLoading, error } = useDonante(Number(id));

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar el donante</div>;
    if (!donante) return <div className="p-8 text-center text-red-500">Donante no encontrado</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/donantes')}
                    className="p-2 h-auto rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Editar Donante</h1>
                    <p className="text-sm text-slate-500">Actualiza la información de {donante.donante}</p>
                </div>
            </div>

            <Card className="p-6 border-slate-200 shadow-sm">
                <DonanteForm initialData={donante} isEditing />
            </Card>
        </div>
    );
};
