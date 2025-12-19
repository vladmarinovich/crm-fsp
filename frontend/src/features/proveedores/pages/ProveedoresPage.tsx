import { useState } from 'react';
import { useProveedores } from '../hooks/useProveedores';
import { proveedoresApi } from '../services/proveedoresService';
import { PlusIcon, MagnifyingGlassIcon, TableCellsIcon, DocumentTextIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';

import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { useProveedoresStats } from '../hooks/useProveedoresStats';

export const ProveedoresPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Stats
    const { data: stats } = useProveedoresStats();

    const { data, isLoading, error } = useProveedores({
        page,
        page_size: pageSize,
        search: debouncedSearch
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
            const blob = await proveedoresApi.exportCsv();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `proveedores_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando CSV:', error);
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await proveedoresApi.exportExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `proveedores_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando Excel:', error);
        }
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar proveedores</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Proveedores</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona la base de datos de proveedores y servicios</p>
                </div>
                <Button
                    onClick={() => navigate('/proveedores/nuevo')}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Proveedor
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Total Proveedores"
                    value={stats?.total_proveedores || 0}
                    icon={<BuildingStorefrontIcon className="h-6 w-6" />}
                    color="primary"
                />
            </div>

            {/* Filters */}
            <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, NIT, contacto..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 outline-none transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        className="flex items-center gap-2 text-slate-600 border-slate-200 hover:border-blue-500 hover:text-blue-600"
                        title="Exportar a CSV"
                    >
                        <DocumentTextIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">CSV</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                        title="Exportar a Excel"
                    >
                        <TableCellsIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Excel</span>
                    </Button>
                </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden border-slate-200 shadow-sm p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Proveedor</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((proveedor) => (
                                <tr key={proveedor.id_proveedor} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-sm">
                                                {proveedor.nombre_proveedor.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{proveedor.nombre_proveedor}</div>
                                                <div className="text-xs text-slate-500 font-medium">{proveedor.nit}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                            {proveedor.tipo_proveedor || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{proveedor.nombre_contacto}</div>
                                        <div className="text-xs text-slate-500">{proveedor.telefono}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                        {proveedor.ciudad || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/proveedores/${proveedor.id_proveedor}`)}
                                                className="text-slate-400 hover:text-cyan-600 p-2 h-auto"
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/proveedores/${proveedor.id_proveedor}/editar`)}
                                                className="text-slate-400 hover:text-cyan-600 p-2 h-auto"
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
