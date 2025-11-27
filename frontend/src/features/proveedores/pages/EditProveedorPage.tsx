import { useParams, useNavigate } from 'react-router-dom';
import { useProveedor } from '../hooks/useProveedores';
import { ProveedorForm } from '../components/ProveedorForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const EditProveedorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: proveedor, isLoading, error } = useProveedor(Number(id));

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar el proveedor</div>;
    if (!proveedor) return <div className="p-8 text-center text-red-500">Proveedor no encontrado</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/proveedores')}
                    className="p-2 h-auto rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Editar Proveedor</h1>
                    <p className="text-sm text-slate-500">Actualiza la información de {proveedor.nombre_proveedor}</p>
                </div>
            </div>

            <Card className="p-6 border-slate-200 shadow-sm">
                <ProveedorForm initialData={proveedor} isEditing />
            </Card>
        </div>
    );
};
