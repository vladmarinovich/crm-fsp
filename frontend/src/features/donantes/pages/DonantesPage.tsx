import { useState } from 'react';
import { useDonantes } from '../hooks/useDonantes';
import { useDonantesStats } from '../hooks/useDonantesStats';
import { donantesApi } from '../services/donantesService';
import { formatCurrency } from '@/utils/formatCurrency';
import {
    PlusIcon, MagnifyingGlassIcon, FunnelIcon, CalendarIcon,
    UsersIcon, ArrowPathIcon, UserPlusIcon, ArrowDownTrayIcon, TableCellsIcon,
    CurrencyDollarIcon, StarIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { ComingSoonChart } from '@/components/ui/ComingSoonChart';

export const DonantesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const [showFilters, setShowFilters] = useState(false);

    // Date Filters (Default YTD)
    const currentYear = new Date().getFullYear();
    const [dateStart, setDateStart] = useState(`${currentYear}-01-01`);
    const [dateEnd, setDateEnd] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const [filters, setFilters] = useState({
        tipo_donante: '',
        ciudad: ''
    });

    // Pass dates to Stats Hook
    const { data: stats } = useDonantesStats(dateStart, dateEnd);

    const { data, isLoading, error } = useDonantes({
        page,
        page_size: pageSize,
        search: debouncedSearch,
        start_date: dateStart,
        end_date: dateEnd,
        ...filters
    });

    const handleExportCsv = async () => {
        try {
            const blob = await donantesApi.exportCsv({
                search: search
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `donantes_${new Date().toISOString().split('T')[0]}.csv`;
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
            const blob = await donantesApi.exportExcel({
                search: search
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `donantes_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando Excel:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when size changes
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar donantes</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Donantes</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona la información de tus donantes</p>
                </div>
                <Button
                    onClick={() => navigate('/donantes/nuevo')}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Donante
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard
                    title="Total Donantes"
                    value={stats ? stats.total_donantes : '...'}
                    color="primary"
                    icon={<UsersIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="Recurrentes"
                    value={stats ? stats.recurrentes : '...'}
                    color="info"
                    icon={<ArrowPathIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="Nuevos (Mes)"
                    value={stats ? stats.nuevos_mes : '...'}
                    color="success"
                    icon={<UserPlusIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="LTV Promedio"
                    value={stats ? formatCurrency(stats.ltv_promedio) : '...'}
                    color="warning"
                    icon={<CurrencyDollarIcon className="h-6 w-6" />}
                />
                <KpiCard
                    title="Mayor Donación"
                    value={stats ? formatCurrency(stats.mayor_donacion) : '...'}
                    color="primary"
                    icon={<StarIcon className="h-6 w-6" />}
                />
            </div>

            {/* Analysis Section (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                    <ComingSoonChart title="Tendencia de Donaciones" />
                </Card>
                <Card className="p-4">
                    <ComingSoonChart title="Distribución por Tipo de Donante" />
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="flex flex-col lg:flex-row items-center gap-4 p-4">
                <div className="relative flex-1 w-full lg:max-w-md">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar por nombre, cédula o correo..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10 border-slate-200"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto ml-auto">
                    {/* Date Filter Inline */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        <CalendarIcon className="h-4 w-4 text-slate-400 ml-1" />
                        <input
                            type="date"
                            name="dateStartDonantes"
                            id="dateStartDonantes"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1 w-28"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            name="dateEndDonantes"
                            id="dateEndDonantes"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1 w-28"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleExportCsv}
                            className="h-9 px-3"
                            title="Exportar CSV"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportExcel}
                            className="h-9 px-3 border-green-200 hover:bg-green-50"
                            title="Exportar Excel"
                        >
                            <TableCellsIcon className="h-4 w-4 text-green-700" />
                        </Button>
                        <Button
                            variant={showFilters ? 'secondary' : 'outline'}
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-9 px-3 flex items-center gap-2 ${showFilters ? 'bg-slate-100 border-slate-300' : ''}`}
                            title="Filtros avanzados"
                        >
                            <FunnelIcon className={`h-4 w-4 ${showFilters ? 'text-cyan-600' : 'text-slate-500'}`} />
                            <span className="hidden sm:inline text-xs">Filtros</span>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Filter Panel */}
            {showFilters && (
                <Card className="p-4 bg-slate-50 border-slate-200 animate-fadeIn mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FunnelIcon className="h-4 w-4" />
                            Filtros Avanzados
                        </h4>
                        <Select
                            label="Tipo de Donante"
                            value={filters.tipo_donante}
                            onChange={(e) => setFilters({ ...filters, tipo_donante: e.target.value })}
                            options={[
                                { value: '', label: 'Todos' },
                                { value: 'PERSONA_NATURAL', label: 'Persona Natural' },
                                { value: 'EMPRESA', label: 'Empresa' },
                                { value: 'FUNDACION', label: 'Fundación' },
                                { value: 'OTRO', label: 'Otro' }
                            ]}
                        />
                        <Input
                            label="Ciudad"
                            placeholder="Ej: Bogotá"
                            value={filters.ciudad}
                            onChange={(e) => setFilters({ ...filters, ciudad: e.target.value })}
                            className="bg-white"
                        />
                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setFilters({ tipo_donante: '', ciudad: '' });
                                    setDateStart(`${currentYear}-01-01`); // Reset Dates too
                                    setDateEnd(new Date().toISOString().split('T')[0]);
                                }}
                                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-9 w-full justify-center border border-rose-100"
                            >
                                <XMarkIcon className="h-4 w-4 mr-1 inline" />
                                Limpiar Todo
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Table */}
            <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Donante</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ubicación</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"># Don.</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Promedio</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Última</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Histórico</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((donante) => (
                                <tr key={donante.id_donante} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm border-2 border-white shadow-sm">
                                                {donante.donante.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-slate-900">{donante.donante}</div>
                                                <div className="text-xs text-slate-500 font-mono">{donante.identificacion}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-700">{donante.correo}</div>
                                        <div className="text-xs text-slate-500">{donante.telefono}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-700">{donante.ciudad}</div>
                                        <div className="text-xs text-slate-500">{donante.pais}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${donante.tipo_donante === 'RECURRENTE'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {donante.tipo_donante}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                                        {donante.cantidad_donaciones || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                                        {formatCurrency(donante.promedio_donacion || 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">
                                        {donante.ultima_donacion || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                                        {formatCurrency(donante.total_donado || 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 text-slate-500">
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/donantes/${donante.id_donante}`)}
                                                className="hover:text-cyan-600 hover:bg-cyan-50 p-2 h-auto rounded-lg transition-colors"
                                                title="Ver detalle"
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/donantes/${donante.id_donante}/editar`)}
                                                className="hover:text-indigo-600 hover:bg-indigo-50 p-2 h-auto rounded-lg transition-colors"
                                                title="Editar donante"
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
