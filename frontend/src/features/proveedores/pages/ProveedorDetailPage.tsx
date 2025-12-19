import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProveedor, useProveedorGastos } from '../hooks/useProveedores';
import {
    ArrowLeftIcon, PencilIcon, TrashIcon,
    EnvelopeIcon, PhoneIcon, MapPinIcon, IdentificationIcon,
    BanknotesIcon, CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';

export const ProveedorDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: proveedor, isLoading, error } = useProveedor(Number(id));
    const { data: gastos, isLoading: isLoadingGastos } = useProveedorGastos(Number(id));

    // Client-side calculations for Financial Stats
    const stats = useMemo(() => {
        if (!gastos) return { total: 0, lastDate: null };

        const total = gastos.reduce((sum: number, g: any) => sum + Number(g.monto), 0);

        // Find most recent payment date
        const sortedDates = [...gastos].sort((a: any, b: any) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime());
        const lastDate = sortedDates.length > 0 ? sortedDates[0].fecha_pago : null;

        return { total, lastDate };
    }, [gastos]);

    if (isLoading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-4">Error al cargar el proveedor</div>;
    if (!proveedor) return <div className="p-8 text-center text-slate-500">Proveedor no encontrado</div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header / Breadcrumb approach */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate('/proveedores')}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-700 w-fit transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Volver al listado
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-200">
                            {proveedor.nombre_proveedor.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{proveedor.nombre_proveedor}</h1>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                                    {proveedor.tipo_proveedor || 'Proveedor General'}
                                </span>
                                {proveedor.nit && (
                                    <span className="flex items-center gap-1">
                                        <IdentificationIcon className="h-4 w-4" />
                                        {proveedor.nit}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/proveedores/${id}/editar`)}
                            className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                        >
                            <PencilIcon className="h-4 w-4 text-slate-500" />
                            Editar
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Contact Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                            Datos de Contacto
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <IdentificationIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase">Contacto Principal</p>
                                    <p className="text-sm text-slate-900 font-medium mt-0.5">{proveedor.nombre_contacto || 'No registrado'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase">Correo</p>
                                    <p className="text-sm text-slate-900 font-medium mt-0.5">{proveedor.correo || 'No registrado'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase">Teléfono</p>
                                    <p className="text-sm text-slate-900 font-medium mt-0.5">{proveedor.telefono || 'No registrado'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <MapPinIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase">Ubicación</p>
                                    <p className="text-sm text-slate-900 font-medium mt-0.5">{proveedor.ciudad || 'No registrado'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Financial Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <BanknotesIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Pagado Histórico</p>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total)}</p>
                            </div>
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CalendarDaysIcon className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Última Transacción</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {stats.lastDate ? new Date(stats.lastDate).toLocaleDateString() : 'Sin actividad'}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Transaction History */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Historial de Pagos</h3>
                            <Button
                                variant="outline"
                                className="text-xs h-8"
                                onClick={() => navigate('/gastos/nuevo')}
                            >
                                + Nuevo Gasto
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            {isLoadingGastos ? (
                                <div className="p-8 text-center text-slate-400">Cargando historial...</div>
                            ) : gastos && gastos.length > 0 ? (
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Concepto</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {gastos.map((gasto: any) => (
                                            <tr
                                                key={gasto.id_gasto}
                                                className="hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/gastos/${gasto.id_gasto}`)}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    {gasto.nombre_gasto}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(gasto.fecha_pago).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${gasto.estado === 'PAGADO' || 'APROBADA' === String(gasto.estado).toUpperCase() ? 'bg-green-100 text-green-800' :
                                                            gasto.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {gasto.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                                                    {formatCurrency(Number(gasto.monto))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                                        <BanknotesIcon className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-900">Sin historial</h3>
                                    <p className="mt-1 text-sm text-slate-500">Este proveedor no tiene pagos registrados aún.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
