import { useState } from 'react';
import { useHogares } from '../hooks/useHogares';
import { hogaresApi } from '../services/hogaresService';
import {
    PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, HomeIcon, MapPinIcon, UserIcon, PhoneIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const HogaresPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = useHogares({
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

    const handleExport = async () => {
        try {
            const blob = await hogaresApi.exportCsv();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hogares_paso_${new Date().toISOString().split('T')[0]}.csv`;
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

    if (error) return <div className="p-8 text-center text-red-500">Error al cargar hogares. Verifica tu conexión o permisos.</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hogares de Paso</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona la red de hogares temporales</p>
                </div>
                <Button
                    onClick={() => navigate('/hogares/nuevo')}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Hogar
                </Button>
            </div>

            {/* Filters & Export */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Buscar por nombre, contacto, ciudad..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 border-slate-200"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="w-full sm:w-auto h-9 text-xs flex items-center justify-center gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hogar</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ubicación</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cupo</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((hogar) => (
                                <tr key={hogar.id_hogar_de_paso} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                        #{hogar.id_hogar_de_paso}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-3">
                                                <HomeIcon className="h-4 w-4" />
                                            </div>
                                            <div className="text-sm font-semibold text-slate-900">
                                                {hogar.nombre_hogar}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-sm text-slate-900 font-medium">
                                                <UserIcon className="h-3 w-3 mr-1 text-slate-400" />
                                                {hogar.nombre_contacto || '-'}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                <PhoneIcon className="h-3 w-3 mr-1" />
                                                {hogar.telefono || '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <MapPinIcon className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                            {hogar.ciudad || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                                            Max: {hogar.cupo_maximo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="outline"
                                                className="px-3 py-1 text-xs h-auto"
                                                onClick={() => navigate(`/hogares/${hogar.id_hogar_de_paso}`)}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="px-3 py-1 text-xs h-auto bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border-none shadow-none"
                                                onClick={() => navigate(`/hogares/${hogar.id_hogar_de_paso}/editar`)}
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
