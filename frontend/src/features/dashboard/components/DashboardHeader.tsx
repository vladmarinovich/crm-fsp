import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export const DashboardHeader = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xs font-semibold shadow-sm">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    <span>Developed by Vladislav Marinovich</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download
                </button>
            </div>
        </div>
    );
};
