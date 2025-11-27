import { useState } from 'react';
import { useCasos } from '../hooks/useCasos';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const CasosPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = useCasos({
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

            {/* Filters */}
            <Card className="flex flex-col sm:flex-row items-center gap-4 p-4">
                <div className="relative flex-1 w-full">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar caso..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10 border-none bg-slate-50 focus:bg-white transition-colors"
                    />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5 text-slate-500" />
                    Filtros
                </Button>
            </Card>

            {/* Table */}
            <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Caso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingreso</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Veterinaria</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data?.results.map((caso) => (
                                <tr key={caso.id_caso} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">{caso.nombre_caso}</div>
                                        {caso.id_hogar_de_paso && <div className="text-xs text-slate-500 mt-0.5">Hogar ID: {caso.id_hogar_de_paso}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${getStatusColor(caso.estado)}`}>
                                            {caso.estado.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(caso.fecha_ingreso).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {caso.veterinaria || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
