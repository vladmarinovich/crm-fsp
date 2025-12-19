import { useState } from 'react';
import { useDonaciones } from '../hooks/useDonaciones';
import { useDonacionesStats } from '../hooks/useDonacionesStats';
import { donacionesApi } from '../services/donacionesService';
import {
    PlusIcon, MagnifyingGlassIcon, CurrencyDollarIcon, ArrowDownTrayIcon,
    ChartBarIcon, ChevronDownIcon, ChevronUpIcon, UserGroupIcon, TableCellsIcon,
    CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

export const DonacionesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [dateStart, setDateStart] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    });
    const [dateEnd, setDateEnd] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [showCharts, setShowCharts] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    const { data: stats, isLoading: statsLoading } = useDonacionesStats(dateStart, dateEnd);

    const { data, isLoading, error } = useDonaciones({
        page,
        page_size: pageSize,
        search: debouncedSearch,
        start_date: dateStart,
        end_date: dateEnd
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    };

    const handleExportCsv = async () => {
        try {
            const blob = await donacionesApi.exportCsv({
                start_date: dateStart,
                end_date: dateEnd
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `donaciones_${dateStart || 'inicio'}_${dateEnd || 'fin'}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando:', error);
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await donacionesApi.exportExcel({
                start_date: dateStart,
                end_date: dateEnd
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `donaciones_${dateStart || 'inicio'}_${dateEnd || 'fin'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando Excel:', error);
        }
    };

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'APROBADA': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'PENDIENTE': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'RECHAZADA': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar donaciones</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Donaciones</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona los ingresos financieros</p>
                </div>
                <Button
                    onClick={() => navigate('/donaciones/nueva')}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nueva Donación
                </Button>
            </div>

            {/* Filters & Export */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-end lg:items-center">
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar por Donante, Caso o ID..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 border-slate-200"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="hidden sm:inline">Desde:</span>
                            <Input
                                type="date"
                                name="dateStartDonaciones"
                                id="dateStartDonaciones"
                                className="w-auto h-9 text-xs"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="hidden sm:inline">Hasta:</span>
                            <Input
                                type="date"
                                name="dateEndDonaciones"
                                id="dateEndDonaciones"
                                className="w-auto h-9 text-xs"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                            />
                        </div>
                        <div className="h-6 w-px bg-slate-300 hidden sm:block mx-1"></div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleExportCsv}
                                className="w-full sm:w-auto h-9 text-xs flex items-center justify-center gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                title="Exportar CSV"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExportExcel}
                                className="w-full sm:w-auto h-9 text-xs flex items-center justify-center gap-2 bg-white border-green-200 hover:bg-green-50 text-green-700"
                                title="Exportar Excel"
                            >
                                <TableCellsIcon className="h-4 w-4" />
                                Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Primary KPIs - Row 1 */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Desempeño Financiero</h2>
                    <p className="text-sm text-slate-500">Indicadores clave de recaudación y comportamiento de donantes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Total Recaudado"
                        value={formatCurrency(stats?.total_recaudado || 0)}
                        icon={<CurrencyDollarIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_recaudo || 0,
                            isPositive: (stats?.variacion_recaudo || 0) >= 0,
                            label: "vs periodo anterior"
                        }}
                        color="success"
                    />
                    <KpiCard
                        title="Ticket Promedio"
                        value={formatCurrency(stats?.donacion_promedio || 0)}
                        icon={<UserGroupIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_promedio || 0,
                            isPositive: (stats?.variacion_promedio || 0) >= 0,
                            label: "vs periodo anterior"
                        }}
                        color="info"
                    />
                    <KpiCard
                        title="Donantes Únicos"
                        value={stats?.donantes_unicos || 0}
                        icon={<UserGroupIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_donantes_unicos || 0,
                            isPositive: (stats?.variacion_donantes_unicos || 0) >= 0,
                            label: "vs periodo anterior"
                        }}
                        color="info"
                    />
                    <KpiCard
                        title="Total Donaciones"
                        value={stats?.cantidad_exitosas || 0}
                        icon={<CheckCircleIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_exitosas || 0,
                            isPositive: (stats?.variacion_exitosas || 0) >= 0,
                            label: "vs periodo anterior"
                        }}
                        color="success"
                    />
                </div>
            </div>

            {/* Secondary KPIs - Row 2 (Funnel) */}
            <div className="mb-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Calidad de Transacciones</h2>
                    <p className="text-sm text-slate-500">Monitoreo de efectividad en el procesamiento de cobros.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Donaciones Rechazadas"
                        value={stats?.cantidad_rechazadas || 0}
                        icon={<XCircleIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_rechazadas || 0,
                            isPositive: (stats?.variacion_rechazadas || 0) <= 0, // Green if goes down
                            label: "vs periodo anterior"
                        }}
                        color="warning"
                    />
                    <KpiCard
                        title="Donaciones Fallidas"
                        value={stats?.cantidad_fallidas || 0}
                        icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_fallidas || 0,
                            isPositive: (stats?.variacion_fallidas || 0) <= 0, // Green if goes down
                            label: "vs periodo anterior"
                        }}
                        color="danger"
                    />
                    <KpiCard
                        title="Total Intentos"
                        value={(stats?.cantidad_exitosas || 0) + (stats?.cantidad_rechazadas || 0) + (stats?.cantidad_fallidas || 0)}
                        icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
                        trend={{
                            value: stats?.variacion_total_intentos || 0,
                            isPositive: (stats?.variacion_total_intentos || 0) >= 0,
                            label: "vs periodo anterior"
                        }}
                        color="primary"
                    />
                </div>
            </div>

            {/* Collapsible Charts Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                    onClick={() => setShowCharts(!showCharts)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <ChartBarIcon className="h-5 w-5 text-slate-500" />
                        <span className="font-semibold text-slate-700">Gráficos y Análisis</span>
                    </div>
                    {showCharts ?
                        <ChevronUpIcon className="h-5 w-5 text-slate-400" /> :
                        <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    }
                </button>

                {showCharts && (
                    <div className="p-6 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
                        <div className="h-80 w-full">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Tendencia de Recaudo</h3>
                            {statsLoading ? (
                                <div className="h-full flex items-center justify-center text-gray-400">Cargando gráfico...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.chart_data || []}>
                                        <defs>
                                            <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="fecha"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            tickFormatter={(val) =>
                                                new Intl.NumberFormat('es-CO', {
                                                    notation: "compact",
                                                    compactDisplay: "short",
                                                    maximumFractionDigits: 0,
                                                }).format(val)
                                            }
                                        />
                                        <Tooltip
                                            formatter={(val: number) => [formatCurrency(val), 'Recaudado']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="monto"
                                            stroke="#00bdf2"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorMonto)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Donante</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Caso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((donacion) => (
                                <tr key={donacion.id_donacion} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                        #{donacion.id_donacion}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {donacion.donante_nombre || 'Anónimo'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-500">
                                            {donacion.caso_nombre || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                        {formatCurrency(donacion.monto)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {donacion.fecha_donacion}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${getStatusColor(donacion.estado)}`}>
                                            {donacion.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="outline"
                                                className="px-3 py-1 text-xs h-auto"
                                                onClick={() => navigate(`/donaciones/${donacion.id_donacion}`)}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="px-3 py-1 text-xs h-auto bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border-none shadow-none"
                                                onClick={() => navigate(`/donaciones/${donacion.id_donacion}/editar`)}
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data && (
                    <Pagination
                        currentPage={page}
                        totalItems={data.count}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        className="px-6 py-4 border-t border-slate-100"
                    />
                )}
            </Card>
        </div>
    );
};
