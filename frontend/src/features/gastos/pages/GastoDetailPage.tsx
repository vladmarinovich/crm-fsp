import { useParams, useNavigate } from 'react-router-dom';
import { useGasto } from '../hooks/useGastos';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';

export const GastoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: gasto, isLoading, error } = useGasto(Number(id));

    if (isLoading) return <div className="p-4">Cargando información...</div>;
    if (error) return <div className="p-4 text-red-500">Error al cargar el gasto</div>;
    if (!gasto) return <div className="p-4 text-red-500">Gasto no encontrado</div>;

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'PAGADO': return 'bg-green-100 text-green-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'ANULADO': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/gastos')}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{gasto.nombre_gasto}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(gasto.estado)}`}>
                                {gasto.estado}
                            </span>
                            <span className="text-sm text-gray-500">Pagado el {new Date(gasto.fecha_pago).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/gastos/${id}/editar`)}
                        className="flex items-center gap-2"
                    >
                        <PencilIcon className="h-4 w-4" />
                        Editar
                    </Button>
                    <Button
                        variant="danger"
                        className="flex items-center gap-2"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="card md:col-span-2 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Detalles del Gasto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Proveedor</p>
                            <p className="text-base text-gray-900">{gasto.proveedor_nombre || `ID: ${gasto.id_proveedor}`}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Caso Relacionado</p>
                            <p className="text-base text-gray-900">{gasto.caso_nombre || `ID: ${gasto.id_caso}`}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Medio de Pago</p>
                            <p className="text-base text-gray-900">{gasto.medio_pago}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Monto</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(gasto.monto)}</p>
                        </div>
                    </div>
                    {gasto.comprobante && (
                        <div className="pt-2">
                            <p className="text-sm font-medium text-gray-500">Comprobante / Notas</p>
                            <p className="text-base text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{gasto.comprobante}</p>
                        </div>
                    )}
                </div>

                {/* Summary / Actions */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Resumen Financiero</h3>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Gasto</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">
                            -{formatCurrency(gasto.monto)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
