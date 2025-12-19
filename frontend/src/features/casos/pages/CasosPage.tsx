import { useState } from 'react';
import { useCasos } from '../hooks/useCasos';
import { useCasosStats } from '../hooks/useCasosStats';
import { casosApi } from '../services/casosService';
import {
    PlusIcon, MagnifyingGlassIcon, ChevronDownIcon,
    FolderIcon, ExclamationCircleIcon, ArrowDownTrayIcon, TableCellsIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { formatCurrency } from '@/utils/formatCurrency';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const CasosPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [veterinariaFilter, setVeterinariaFilter] = useState('');

    // Default to current year (Year to Date)
    const currentYear = new Date().getFullYear();
    const [dateStart, setDateStart] = useState(`${currentYear}-01-01`);
    const [dateEnd, setDateEnd] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [showCharts, setShowCharts] = useState(false); // Accordion state
    const debouncedSearch = useDebounce(search, 500);

    const { data: stats } = useCasosStats(dateStart, dateEnd);

    const { data, isLoading, error } = useCasos({
        page,
        page_size: pageSize,
        search: debouncedSearch,
        estado: estadoFilter || undefined,
        veterinaria: veterinariaFilter || undefined,
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
            const blob = await casosApi.exportCsv({
                start_date: dateStart,
                end_date: dateEnd
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `casos_${dateStart || 'inicio'}_${dateEnd || 'fin'}.csv`;
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
            const blob = await casosApi.exportExcel({
                start_date: dateStart,
                end_date: dateEnd
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `casos_${dateStart || 'inicio'}_${dateEnd || 'fin'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando Excel:', error);
        }
    };

    // ...

    // ... further down in the JSX

    {/* Export Button Group */ }
    <div className="flex gap-2 w-full lg:w-auto">
        <Button
            variant="outline"
            onClick={handleExportCsv}
            className="flex-1 h-10 text-xs flex items-center justify-center gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            title="Exportar CSV"
        >
            <ArrowDownTrayIcon className="h-4 w-4" />
            CSV
        </Button>
        <Button
            variant="outline"
            onClick={handleExportExcel}
            className="flex-1 h-10 text-xs flex items-center justify-center gap-2 bg-white border-green-200 hover:bg-green-50 text-green-700"
            title="Exportar Excel"
        >
            <TableCellsIcon className="h-4 w-4" />
            Excel
        </Button>
    </div>

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

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar casos</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Casos</h1>
                        <p className="text-sm text-slate-500 mt-1">Gestiona los casos de rescate</p>
                    </div>
                    <Button
                        onClick={() => navigate('/casos/nuevo')}
                        className="flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nuevo Caso
                    </Button>
                </div>

                {/* Date Filter in Header - REMOVED for Compact Layout */}
            </div>





            {/* Section Title: Operational KPIs */}
            <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-700">Indicadores Operativos</h2>
                <p className="text-sm text-slate-500">Métricas clave de eficiencia y costos</p>
            </div>

            {/* Operational KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="⏱️ Días Promedio por Caso"
                    value={stats ? `${stats.dias_promedio_por_caso} días` : '...'}
                    color="info"
                    icon={<ExclamationCircleIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="💵 Costo Diario por Caso"
                    value={stats ? formatCurrency(stats.costo_diario_promedio_caso) : '...'}
                    color="warning"
                    icon={<FolderIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="💰 Costo Diario Total"
                    value={stats ? formatCurrency(stats.costo_diario_fundacion) : '...'}
                    color="danger"
                    icon={<ExclamationCircleIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="📊 Casos con Déficit"
                    value={stats ? stats.casos_con_deficit : '...'}
                    color="danger"
                    icon={<FolderIcon className="h-6 w-6" />}
                />
            </div>

            {/* Section Title: Estado KPIs */}
            <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-700">Distribución por Estado</h2>
                <p className="text-sm text-slate-500">Resumen de casos por estado actual</p>
            </div>

            {/* Estado KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Casos Activos"
                    value={stats ? stats.casos_activos : '...'}
                    color="info"
                    icon={<ExclamationCircleIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="Cerrados"
                    value={stats ? stats.cerrado : '...'}
                    color="primary"
                    icon={<FolderIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="Fallecidos"
                    value={stats ? stats.fallecido : '...'}
                    color="danger"
                    icon={<ExclamationCircleIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="Adoptados"
                    value={stats ? stats.adoptados : '...'}
                    color="success"
                    icon={<FolderIcon className="h-6 w-6" />}
                />
            </div>

            {/* Charts Section - Collapsible */}
            <Card className="overflow-hidden">
                <button
                    onClick={() => setShowCharts(!showCharts)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700">Gráficos y Análisis</h3>
                        <p className="text-sm text-slate-500">Distribución por estado y resumen financiero</p>
                    </div>
                    <ChevronDownIcon
                        className={`h-5 w-5 text-slate-500 transition-transform ${showCharts ? 'rotate-180' : ''}`}
                    />
                </button>

                {showCharts && (
                    <div className="p-6 pt-0 border-t border-slate-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Distribution Chart */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-slate-700 mb-4">Distribución por Estado</h3>
                                {stats && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Activos', value: stats.casos_activos, color: '#3b82f6' },
                                                    { name: 'Cerrados', value: stats.cerrado, color: '#6366f1' },
                                                    { name: 'Adoptados', value: stats.adoptados, color: '#10b981' },
                                                    { name: 'Fallecidos', value: stats.fallecido, color: '#ef4444' },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {[
                                                    { name: 'Activos', value: stats.casos_activos, color: '#3b82f6' },
                                                    { name: 'Cerrados', value: stats.cerrado, color: '#6366f1' },
                                                    { name: 'Adoptados', value: stats.adoptados, color: '#10b981' },
                                                    { name: 'Fallecidos', value: stats.fallecido, color: '#ef4444' },
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </Card>

                            {/* Financial Summary Card */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-slate-700 mb-4">Resumen Financiero</h3>
                                {stats && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                            <span className="text-sm font-medium text-green-700">Promedio Recaudado</span>
                                            <span className="text-lg font-bold text-green-600">{formatCurrency(stats.promedio_recaudado)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                            <span className="text-sm font-medium text-orange-700">Promedio Gastado</span>
                                            <span className="text-lg font-bold text-orange-600">{formatCurrency(stats.promedio_gastado)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="text-sm font-medium text-blue-700">Balance Promedio</span>
                                            <span className={`text-lg font-bold ${(stats.promedio_recaudado - stats.promedio_gastado) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(stats.promedio_recaudado - stats.promedio_gastado)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <span className="text-sm font-medium text-slate-700">Casos por Mes</span>
                                            <span className="text-lg font-bold text-slate-600">{stats.promedio_casos_mensuales}</span>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </Card>


            {/* Filters & Export */}
            <Card className="p-4">
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full xl:max-w-md">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar caso..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 border-slate-200"
                        />
                    </div>

                    {/* Filter Controls Row */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center w-full xl:w-auto">

                        {/* Date Filter Inline */}
                        <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200 shadow-sm">
                            <CalendarIcon className="h-4 w-4 text-slate-400 ml-2" />
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                className="bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1 w-28"
                            />
                            <span className="text-slate-300">-</span>
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                className="bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1 w-28"
                            />
                        </div>

                        {/* Extra Filters (Selects) */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select
                                value={estadoFilter}
                                onChange={(e) => {
                                    setEstadoFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">Estado: Todos</option>
                                <option value="ABIERTO">Abierto</option>
                                <option value="EN_TRATAMIENTO">En Tratamiento</option>
                                <option value="ADOPTADO">Adoptado</option>
                                <option value="FALLECIDO">Fallecido</option>
                                <option value="CERRADO">Cerrado</option>
                            </select>

                            <Input
                                placeholder="Veterinaria..."
                                value={veterinariaFilter}
                                onChange={(e) => {
                                    setVeterinariaFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="h-9 w-32 border-slate-200 text-xs"
                            />
                        </div>


                        {/* Export Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleExportCsv}
                                className="hidden sm:flex h-9 text-xs items-center justify-center gap-2 border-slate-200 text-slate-700"
                                title="Exportar CSV"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExportExcel}
                                className="h-9 text-xs flex items-center justify-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                                title="Exportar Excel"
                            >
                                <TableCellsIcon className="h-4 w-4" />
                                <span className="hidden lg:inline">Excel</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Caso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnóstico</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Veterinaria</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hogar de Paso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingreso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Días</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Recaudado</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Gastado</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((caso) => {
                                const diasActivo = caso.dias_activo;
                                const esUrgente = diasActivo && diasActivo > 90;
                                const requiereAtencion = diasActivo && diasActivo > 60 && diasActivo <= 90;

                                return (
                                    <tr key={caso.id_caso} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-900">{caso.nombre_caso}</div>
                                            {!caso.nombre_hogar_de_paso && caso.estado === 'EN_TRATAMIENTO' && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 mt-1">
                                                    ⚠️ Sin hogar
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${getStatusColor(caso.estado)}`}>
                                                {caso.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="text-sm text-slate-600 truncate" title={caso.diagnostico}>
                                                {caso.diagnostico ? (caso.diagnostico.length > 40 ? caso.diagnostico.substring(0, 40) + '...' : caso.diagnostico) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {caso.veterinaria || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {caso.nombre_hogar_de_paso || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {caso.fecha_ingreso}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {diasActivo !== null && diasActivo !== undefined ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-slate-600">{diasActivo} días</span>
                                                    {esUrgente && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                                                            🔴 Urgente
                                                        </span>
                                                    )}
                                                    {requiereAtencion && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-200">
                                                            🟡 Atención
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">Cerrado</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-700">
                                            {caso.total_recaudado ? formatCurrency(caso.total_recaudado) : '$ 0'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-700">
                                            {caso.total_gastado ? formatCurrency(caso.total_gastado) : '$ 0'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                                            {(() => {
                                                const balance = (caso.total_recaudado || 0) - (caso.total_gastado || 0);
                                                const colorClass = balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-slate-400';
                                                return (
                                                    <span className={colorClass}>
                                                        {formatCurrency(balance)}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="px-3 py-1 text-xs h-auto"
                                                    onClick={() => navigate(`/casos/${caso.id_caso}`)}
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="px-3 py-1 text-xs h-auto bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border-none shadow-none"
                                                    onClick={() => navigate(`/casos/${caso.id_caso}/editar`)}
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
