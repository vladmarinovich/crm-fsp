import { useParams, useNavigate } from 'react-router-dom';
import { useCaso, useCasoBalance } from '../hooks/useCasos';
import { ArrowLeftIcon, PencilIcon, TrashIcon, HeartIcon, BanknotesIcon, CalendarIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card'; // Ensure Card is imported
import { formatCurrency } from '@/utils/formatCurrency';

export const CasoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: caso, isLoading, error } = useCaso(Number(id));
    const { data: balanceData, isLoading: isLoadingBalance } = useCasoBalance(Number(id));

    if (isLoading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-danger">Error al cargar el caso</div>;
    if (!caso) return <div className="p-8 text-center text-slate-500">Caso no encontrado</div>;

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'ABIERTO': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'EN_TRATAMIENTO': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'ADOPTADO': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'FALLECIDO': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'CERRADO': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Premium Header */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex items-center gap-5">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/casos')}
                        className="p-2 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-slate-400" />
                    </Button>

                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary-500/20 ring-4 ring-white">
                            {caso.nombre_caso.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                <span>Casos</span>
                                <span>/</span>
                                <span>Detalle</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{caso.nombre_caso}</h1>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto pl-20 lg:pl-0">
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
                        onClick={() => { if (window.confirm('¿Eliminar caso?')) { /* TODO: Implement delete */ } }}
                    >
                        <TrashIcon className="h-4 w-4" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Info & Details (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Key Info Card */}
                    <Card title="Información General" className="shadow-card hover:shadow-card-hover border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <HeartIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Estado</p>
                                    <span className={`mt-1 px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full border ${getStatusColor(caso.estado)}`}>
                                        {caso.estado.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <HomeIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Ubicación</p>
                                    <p className="text-slate-700 font-medium mt-0.5">
                                        {caso.nombre_hogar_de_paso || 'No asignado'}
                                    </p>
                                    <p className="text-xs text-slate-400">{caso.veterinaria || 'Sin veterinaria'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                    <CalendarIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fechas</p>
                                    <p className="text-xs text-slate-600 mt-0.5">Ingreso: {new Date(caso.fecha_ingreso).toLocaleDateString()}</p>
                                    {caso.fecha_salida && <p className="text-xs text-slate-600">Salida: {new Date(caso.fecha_salida).toLocaleDateString()}</p>}
                                </div>
                            </div>
                        </div>

                        {caso.diagnostico && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Diagnóstico</p>
                                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                                    {caso.diagnostico}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Donaciones Table */}
                    <Card title="Donaciones Recibidas" className="shadow-card">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Donante</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {balanceData?.donaciones && balanceData.donaciones.length > 0 ? (
                                        balanceData.donaciones.map((donacion) => (
                                            <tr key={donacion.id_donacion} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {new Date(donacion.fecha_donacion).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {donacion.donante_nombre || 'Anónimo'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                                                    {formatCurrency(donacion.monto)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${donacion.estado === 'APROBADA' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        donacion.estado === 'PENDIENTE' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            'bg-red-50 text-red-700 border-red-100'
                                                        }`}>
                                                        {donacion.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                                                No hay donaciones registradas todavía.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Gastos Table */}
                    <Card title="Gastos Realizados" className="shadow-card">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Proveedor</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Concepto</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {balanceData?.gastos && balanceData.gastos.length > 0 ? (
                                        balanceData.gastos.map((gasto) => (
                                            <tr key={gasto.id_gasto} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {new Date(gasto.fecha_pago).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {gasto.proveedor_nombre || 'No registrado'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {gasto.nombre_gasto}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 text-right">
                                                    {formatCurrency(gasto.monto)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                                                No hay gastos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Financial Stats Summary (1/3) */}
                <div className="space-y-6">
                    <Card title="Balance Financiero" className="shadow-card border-slate-200">
                        <div className="flex flex-col gap-6">
                            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Balance Total</p>
                                {isLoadingBalance ? (
                                    <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mx-auto"></div>
                                ) : (
                                    <p className={`text-4xl font-black ${(balanceData?.balance || 0) >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                                        {formatCurrency(balanceData?.balance || 0)}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <BanknotesIcon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">Ingresos</span>
                                    </div>
                                    <span className="text-base font-bold text-green-600">
                                        {formatCurrency(balanceData?.total_recaudado || 0)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                            <BanknotesIcon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">Egresos</span>
                                    </div>
                                    <span className="text-base font-bold text-red-600">
                                        {formatCurrency(balanceData?.total_gastado || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-2">¿Necesitas ayuda?</h3>
                        <p className="text-primary-100 text-sm mb-4">
                            Si el caso requiere atención urgente o fondos adicionales, notifica al equipo.
                        </p>
                        <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                            Solicitar Revisión
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
