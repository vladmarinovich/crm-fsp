import { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardHeader } from './components/DashboardHeader';
import { Tabs } from '@/components/ui/Tabs';
import { FinancialDashboard } from './components/FinancialDashboard';
import { PlaceholderDashboard } from './components/PlaceholderDashboard';

export const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('financial');
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
    });

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') setStartDate(value);
        else setEndDate(value);
    };

    const { data, isLoading, isError, isFetching } = useDashboardData(startDate, endDate);

    const tabs = [
        { id: 'financial', label: '💰 Financiero', icon: '' },
        { id: 'donors', label: '👥 Donantes', icon: '' },
        { id: 'operations', label: '🐾 Operativo', icon: '' },
        { id: 'providers', label: '🏢 Proveedores', icon: '' },
    ];

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (isError) return <div className="p-8 text-center text-red-500">Error cargando datos.</div>;
    if (!data) return null;

    return (
        <div className="space-y-6">
            <DashboardHeader />

            {/* Date Filter */}
            <div className="flex flex-wrap gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 text-sm text-gray-600 hover:border-cyan-500 transition-colors">
                    <span className="font-medium text-gray-500">Período:</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            className="border-none p-0 text-gray-900 focus:ring-0 text-sm font-semibold bg-transparent cursor-pointer"
                            value={startDate}
                            onChange={e => handleDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            className="border-none p-0 text-gray-900 focus:ring-0 text-sm font-semibold bg-transparent cursor-pointer"
                            value={endDate}
                            onChange={e => handleDateChange('end', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Dashboard Content */}
            <div className="bg-white rounded-b-xl p-6 shadow-sm border border-t-0 border-gray-100">
                {activeTab === 'financial' && (
                    <FinancialDashboard data={data} isFetching={isFetching} />
                )}
                {activeTab === 'donors' && (
                    <PlaceholderDashboard
                        title="Dashboard de Donantes"
                        description="Análisis de base de donantes y engagement"
                        icon="👥"
                    />
                )}
                {activeTab === 'operations' && (
                    <PlaceholderDashboard
                        title="Dashboard Operativo"
                        description="Eficiencia operativa y gestión de casos"
                        icon="🐾"
                    />
                )}
                {activeTab === 'providers' && (
                    <PlaceholderDashboard
                        title="Dashboard de Proveedores"
                        description="Gestión de proveedores y gastos"
                        icon="🏢"
                    />
                )}
            </div>
        </div>
    );
};
