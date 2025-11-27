import { useParams, useNavigate } from 'react-router-dom';
import { useCaso, useCasoBalance } from '../hooks/useCasos';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';

export const CasoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: caso, isLoading, error } = useCaso(Number(id));
    const { data: balanceData, isLoading: isLoadingBalance } = useCasoBalance(Number(id));

    if (isLoading) return <div className="p-4">Cargando información...</div>;
    if (error) return <div className="p-4 text-red-500">Error al cargar el caso</div>;
    if (!caso) return <div className="p-4 text-red-500">Caso no encontrado</div>;

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'ABIERTO': return 'bg-blue-100 text-blue-800';
            case 'EN_TRATAMIENTO': return 'bg-yellow-100 text-yellow-800';
            case 'ADOPTADO': return 'bg-green-100 text-green-800';
            case 'FALLECIDO': return 'bg-gray-100 text-gray-800';
            case 'CERRADO': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/casos')}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{caso.nombre_caso}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caso.estado)}`}>
                                {caso.estado.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-gray-500">Ingresado el {new Date(caso.fecha_ingreso).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/casos/${id}/editar`)}
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
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Detalles del Caso</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Veterinaria</p>
                            <p className="text-base text-gray-900">{caso.veterinaria || 'No registrada'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Hogar de Paso</p>
                            <p className="text-base text-gray-900">{caso.id_hogar_de_paso ? `ID: ${caso.id_hogar_de_paso}` : 'No asignado'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Fecha de Salida</p>
                            <p className="text-base text-gray-900">{caso.fecha_salida ? new Date(caso.fecha_salida).toLocaleDateString() : 'Aún en curso'}</p>
                        </div>
                    </div>
                    {caso.diagnostico && (
                        <div className="pt-2">
                            <p className="text-sm font-medium text-gray-500">Diagnóstico / Descripción</p>
                            <p className="text-base text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{caso.diagnostico}</p>
                        </div>
                    )}
                </div>

                {/* Financial Stats */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Finanzas del Caso</h3>
                    {isLoadingBalance ? (
                        <p className="text-sm text-gray-500">Cargando finanzas...</p>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Recaudado</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(balanceData?.total_recaudado || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Gastado</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatCurrency(balanceData?.total_gastado || 0)}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-500">Balance</p>
                                <p className={`text-xl font-bold ${(balanceData?.balance || 0) >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                    {formatCurrency(balanceData?.balance || 0)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donaciones Table */}
                <div className="card space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Donaciones Recibidas</h3>
                        <Button variant="outline" onClick={() => navigate('/donaciones/nueva')}>
                            Nueva
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Donante</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {balanceData?.donaciones && balanceData.donaciones.length > 0 ? (
                                    balanceData.donaciones.map((donacion) => (
                                        <tr key={donacion.id_donacion} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(donacion.fecha_donacion).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {donacion.donante_nombre || 'Anónimo'}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(donacion.monto)}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${donacion.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                                                        donacion.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {donacion.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 italic">
                                            No hay donaciones registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Gastos Table */}
                <div className="card space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Gastos Realizados</h3>
                        <Button variant="outline" onClick={() => navigate('/gastos/nuevo')}>
                            Nuevo
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {balanceData?.gastos && balanceData.gastos.length > 0 ? (
                                    balanceData.gastos.map((gasto) => (
                                        <tr key={gasto.id_gasto} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(gasto.fecha_pago).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {gasto.proveedor_nombre || 'No registrado'}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {gasto.nombre_gasto}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(gasto.monto)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 italic">
                                            No hay gastos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
