import { useState } from 'react';
import { useGastos } from '../hooks/useGastos';
import { useGastosStats } from '../hooks/useGastosStats';
import { gastosApi } from '../services/gastosService';
import {
    PlusIcon, MagnifyingGlassIcon, BanknotesIcon, ArrowDownTrayIcon,
    FunnelIcon, XMarkIcon, CalendarIcon, ListBulletIcon, ExclamationTriangleIcon,
    PaperClipIcon
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

export const GastosPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [casoFilter, setCasoFilter] = useState('');
    const [dateStart, setDateStart] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    });
    const [dateEnd, setDateEnd] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const debouncedSearch = useDebounce(search, 500);

    const { data: stats, isLoading: statsLoading } = useGastosStats({
        start_date: dateStart,
        end_date: dateEnd,
        caso: casoFilter
    });

    const { data, isLoading, error } = useGastos({
        page,
        page_size: pageSize,
        search: debouncedSearch,
        start_date: dateStart,
        end_date: dateEnd,
        caso: casoFilter
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    };

    const handleExport = async () => {
        try {
            const blob = await gastosApi.exportCsv({
                fecha_desde: dateStart,
                fecha_hasta: dateEnd
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gastos_${dateStart || 'inicio'}_${dateEnd || 'fin'}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando:', error);
        }
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar gastos</div>;

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'PAGADO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'PENDIENTE': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'ANULADO': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gastos</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona los egresos y pagos a proveedores</p>
                </div>
                <Button
                    onClick={() => navigate('/gastos/nuevo')}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Gasto
                </Button>
            </div>

            {/* Analytics Section */}
            <div className="space-y-6">
                {/* KPIs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard
                        title="Total Gastado"
                        value={stats ? formatCurrency(stats.total_gasto) : '...'}
                        color="warning"
                        icon={<BanknotesIcon className="h-6 w-6" />}
                        trend={{
                            value: stats?.variacion_total || 0,
                            isPositive: (stats?.variacion_total || 0) < 0,
                            label: 'vs periodo anterior'
                        }}
                    />
                    <KpiCard
                        title="Promedio Gasto"
                        value={stats ? formatCurrency(stats.promedio_gasto) : '...'}
                        color="info"
                        trend={{
                            value: stats?.variacion_promedio || 0,
                            isPositive: (stats?.variacion_promedio || 0) < 0,
                            label: 'vs periodo anterior'
                        }}
                    />
                    <KpiCard
                        title="Número de Gastos"
                        value={stats ? stats.numero_gastos : '...'}
                        color="info"
                        icon={<ListBulletIcon className="h-6 w-6" />}
                    />
                    <KpiCard
                        title="Pendientes por Pagar"
                        value={stats ? formatCurrency(stats.gastos_pendientes) : '...'}
                        color="danger"
                        icon={<ExclamationTriangleIcon className="h-6 w-6" />}
                        trend={{
                            value: 0,
                            isPositive: false,
                            // Using labels to show extra info hack
                            label: stats ? `${stats.count_pendientes} facturas` : '...'
                        }}
                    />
                </div>

                {/* Chart */}
                <Card className="p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Histórico de Gastos</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Mensual</span>
                    </div>
                    <div className="h-64">
                        {statsLoading ? (
                            <div className="h-full flex items-center justify-center text-gray-400">Cargando gráfico...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.chart_data || []}>
                                    <defs>
                                        <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                                        formatter={(val: number) => [formatCurrency(val), 'Gastado']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="monto"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorGasto)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>

            {/* Filters & Export */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar por gasto, proveedor o caso..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 border-slate-200"
                        />
                    </div>

                    {/* Compact Date Filter & Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200 shadow-sm">
                            <CalendarIcon className="h-4 w-4 text-slate-400 ml-2" />
                            <input
                                type="date"
                                name="dateStartGastos"
                                id="dateStartGastos"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className="bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1 w-28"
                            />
                            <span className="text-slate-300">-</span>
                            <input
                                type="date"
                                name="dateEndGastos"
                                id="dateEndGastos"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                className="bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1 w-28"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleExport}
                                className="flex items-center gap-2 border-slate-200 text-slate-700 h-9 text-xs"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Exportar</span>
                            </Button>
                            <Button
                                variant={showFilters ? 'secondary' : 'outline'}
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 h-9 text-xs ${showFilters ? 'bg-slate-100 border-slate-300' : 'border-slate-200'}`}
                            >
                                <FunnelIcon className={`h-4 w-4 ${showFilters ? 'text-cyan-600' : 'text-slate-500'}`} />
                                <span>Más Filtros</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Collapsible Filters - Just Case Name now */}
            {showFilters && (
                <Card className="p-4 bg-slate-50 border-slate-200 animate-fadeIn -mt-2 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FunnelIcon className="h-4 w-4" />
                            Filtros Adicionales
                        </h4>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setCasoFilter('');
                            }}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-auto py-1 px-2"
                        >
                            <XMarkIcon className="h-4 w-4 mr-1 inline" />
                            Limpiar
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                        <Input
                            label="Nombre del Caso"
                            placeholder="Ej: Zeus"
                            value={casoFilter}
                            onChange={(e) => setCasoFilter(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                </Card>
            )}

            {/* Table */}
            <Card className="overflow-hidden border-slate-200 shadow-sm p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Concepto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Proveedor</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Caso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Medio</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Soporte</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((gasto) => (
                                <tr key={gasto.id_gasto} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{gasto.nombre_gasto}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                                                <span className="text-xs font-bold">{gasto.proveedor_nombre?.charAt(0) || '#'}</span>
                                            </div>
                                            <div className="text-sm font-medium text-slate-900">{gasto.proveedor_nombre || `Prov #${gasto.id_proveedor}`}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {gasto.caso_nombre ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {gasto.caso_nombre}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {gasto.medio_pago || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {gasto.comprobante ? (
                                            <a href={gasto.comprobante} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-800 transition-colors inline-block p-1" title="Ver Soporte">
                                                <PaperClipIcon className="h-5 w-5" />
                                            </a>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                        {formatCurrency(gasto.monto)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                        {gasto.fecha_pago}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(gasto.estado)}`}>
                                            {gasto.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/gastos/${gasto.id_gasto}`)}
                                                className="text-slate-400 hover:text-cyan-600 p-2 h-auto"
                                                title="Ver detalle"
                                            >
                                                <MagnifyingGlassIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/gastos/${gasto.id_gasto}/editar`)}
                                                className="text-slate-400 hover:text-cyan-600 p-2 h-auto"
                                                title="Editar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
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
