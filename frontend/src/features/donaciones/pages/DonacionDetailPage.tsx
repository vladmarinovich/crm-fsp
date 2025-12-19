import { useParams, useNavigate } from 'react-router-dom';
import { useDonacion } from '../hooks/useDonaciones';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';

export const DonacionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: donacion, isLoading, error } = useDonacion(Number(id));

    if (isLoading) return <div className="p-4">Cargando información...</div>;
    if (error) return <div className="p-4 text-red-500">Error al cargar la donación</div>;
    if (!donacion) return <div className="p-4 text-red-500">Donación no encontrada</div>;

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'APROBADA': return 'bg-green-100 text-green-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'RECHAZADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/donaciones')}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Donación #{donacion.id_donacion}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donacion.estado)}`}>
                                {donacion.estado}
                            </span>
                            <span className="text-sm text-gray-500">Registrada el {new Date(donacion.fecha_donacion).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/donaciones/${id}/editar`)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Info */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Detalles Financieros</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Monto</p>
                            <p className="text-3xl font-bold text-green-600">{formatCurrency(donacion.monto)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Medio de Pago</p>
                            <p className="text-base text-gray-900">{donacion.medio_pago}</p>
                        </div>
                        {donacion.comprobante && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Comprobante / Notas</p>
                                <p className="text-base text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{donacion.comprobante}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Relations */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Relaciones</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Donante</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-base text-gray-900">{donacion.donante_nombre || `ID: ${donacion.id_donante}`}</span>
                                <button
                                    onClick={() => navigate(`/donantes/${donacion.id_donante}`)}
                                    className="text-sm text-primary-600 hover:text-primary-800"
                                >
                                    Ver Donante
                                </button>
                            </div>
                        </div>
                        {donacion.id_caso && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Caso Asociado</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-base text-gray-900">{donacion.caso_nombre || `ID: ${donacion.id_caso}`}</span>
                                    <button
                                        onClick={() => navigate(`/casos/${donacion.id_caso}`)}
                                        className="text-sm text-primary-600 hover:text-primary-800"
                                    >
                                        Ver Caso
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
