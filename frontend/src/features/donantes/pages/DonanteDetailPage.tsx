import { useParams, useNavigate } from 'react-router-dom';
import { useDonante, useDonanteDonaciones } from '../hooks/useDonantes';
import { ArrowLeftIcon, PencilIcon, TrashIcon, IdentificationIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CurrencyDollarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';

export const DonanteDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: donante, isLoading, error } = useDonante(Number(id));
    const { data: donaciones, isLoading: isLoadingDonaciones } = useDonanteDonaciones(Number(id));

    if (isLoading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-rose-500">Error al cargar la información del donante</div>;
    if (!donante) return <div className="p-8 text-center text-slate-500">Donante no encontrado</div>;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header & Navigation */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate('/donantes')}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-700 w-fit transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Volver al listado
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-200">
                            {donante.donante.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{donante.donante}</h1>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                <span className={`px-2.5 py-0.5 rounded-full font-medium border ${donante.tipo_donante === 'RECURRENTE'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                    {donante.tipo_donante || 'General'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    Registrado: {new Date(donante.fecha_creacion).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate(`/donantes/${id}/editar`)} className="flex items-center gap-2 border-slate-200 hover:bg-slate-50">
                            <PencilIcon className="h-4 w-4 text-slate-500" />
                            Editar
                        </Button>
                        <Button variant="ghost" className="flex items-center gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Contact Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Información de Contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <IdentificationIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Identificación</p>
                                    <p className="text-sm text-slate-900 font-medium">{donante.tipo_id} {donante.identificacion}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Correo Electrónico</p>
                                    <p className="text-sm text-slate-900 break-all">{donante.correo}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                                    <p className="text-sm text-slate-900">{donante.telefono || 'No registrado'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <MapPinIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Ubicación</p>
                                    <p className="text-sm text-slate-900">{donante.ciudad}, {donante.pais}</p>
                                </div>
                            </div>
                        </div>

                        {donante.notas && (
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500 font-medium mb-2">Notas Internas</p>
                                <div className="bg-amber-50 text-amber-900 text-sm p-3 rounded-lg border border-amber-100 italic">
                                    "{donante.notas}"
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Financial Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Donado Histórico</p>
                                <p className="text-2xl font-bold text-slate-900">{formatCurrency(donante.total_donado || 0)}</p>
                            </div>
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CalendarDaysIcon className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Última Donación</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {donaciones && donaciones.length > 0 ? new Date(donaciones[0].fecha_donacion).toLocaleDateString() : 'Sin actividad'}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Transaction History Table */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Historial de Donaciones</h3>
                            <Button onClick={() => navigate('/donaciones/nueva')} className="bg-primary-600 hover:bg-primary-700 text-white border-none shadow-sm shadow-primary-200">
                                + Nueva Donación
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Caso / Destino</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {isLoadingDonaciones ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Cargando historial...</td>
                                        </tr>
                                    ) : !donaciones || donaciones.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                <p>No hay donaciones registradas.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        donaciones.map((d: any) => (
                                            <tr key={d.id_donacion} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/donaciones/${d.id_donacion}`)}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {new Date(d.fecha_donacion).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                                    {formatCurrency(d.monto)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${['APROBADA', 'COMPLETADO', 'CONFIRMADO'].includes(d.estado?.toUpperCase())
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : ['PENDIENTE'].includes(d.estado?.toUpperCase())
                                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                            : 'bg-rose-50 text-rose-700 border-rose-100'
                                                        }`}>
                                                        {d.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {d.caso_nombre || 'Donación General'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
