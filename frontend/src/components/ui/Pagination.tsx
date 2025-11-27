import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    className?: string;
}

export const Pagination = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    className,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className={clsx("flex flex-col sm:flex-row items-center justify-between gap-4 py-4", className)}>
            {/* Mobile: Simple Prev/Next */}
            <div className="flex flex-1 justify-between sm:hidden w-full">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Anterior
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Siguiente
                </button>
            </div>

            {/* Desktop: Full Pagination */}
            <div className="hidden sm:flex flex-1 items-center justify-between">
                <div className="flex items-center gap-6">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-semibold text-gray-900">{startItem}</span> - <span className="font-semibold text-gray-900">{endItem}</span> de{' '}
                        <span className="font-semibold text-gray-900">{totalItems}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Filas:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="block w-full rounded-lg border-gray-200 py-1.5 pl-3 pr-8 text-sm leading-5 text-gray-900 focus:border-primary-500 focus:ring-primary-500 hover:border-primary-400 transition-colors cursor-pointer bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-1" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center justify-center rounded-lg w-9 h-9 text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="sr-only">Anterior</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Page Numbers Logic */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 5) {
                                if (currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                }
                                // Adjust if we are near the end
                                if (pageNum > totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                }
                                // Ensure we don't go below 1
                                if (pageNum < 1) pageNum = i + 1;
                            }
                            
                            if (pageNum > totalPages) return null;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    aria-current={currentPage === pageNum ? 'page' : undefined}
                                    className={clsx(
                                        "relative inline-flex items-center justify-center rounded-lg w-9 h-9 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all",
                                        currentPage === pageNum
                                            ? 'z-10 bg-primary-500 text-white shadow-md shadow-primary-500/30'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center justify-center rounded-lg w-9 h-9 text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="sr-only">Siguiente</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};
