
import { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { formatCurrency } from '@/utils/formatCurrency';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { DashboardHeader } from './components/DashboardHeader';
import { KPICard } from './components/KPICard';
import { HeartIcon } from '@heroicons/react/24/outline';

export const DashboardPage = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { data, isLoading, isError } = useDashboardData(startDate, endDate);

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (isError) return <div className="p-8 text-center text-red-500">Error cargando datos.</div>;

    const { kpis, top_ciudades, casos_destacados } = data;

    return (
        <div className="space-y-8">
            <DashboardHeader />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                {/* Date Filter styled as dropdown */}
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 text-sm text-gray-600 hover:border-cyan-500 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-500">Period:</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            className="border-none p-0 text-gray-900 focus:ring-0 text-sm font-semibold bg-transparent"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            className="border-none p-0 text-gray-900 focus:ring-0 text-sm font-semibold bg-transparent"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Mock Filters */}
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 text-sm text-gray-600 hover:border-cyan-500 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-500">People:</span>
                    <span className="text-gray-900 font-semibold">All</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 text-sm text-gray-600 hover:border-cyan-500 transition-colors cursor-pointer">
                    <span className="font-medium text-gray-500">Campaign:</span>
                    <span className="text-gray-900 font-semibold">All</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Donado" value={formatCurrency(kpis.total_donado)} color="#06b6d4" />
                <KPICard title="Total Gastado" value={formatCurrency(kpis.total_gastado)} color="#f97316" />
                <KPICard title="Balance Neto" value={formatCurrency(kpis.balance_neto)} color="#10b981" />
                <KPICard title="Casos Activos" value={kpis.casos_activos_count.toString()} color="#8b5cf6" />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Donaciones por Ciudad</h3>
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-cyan-500 focus:border-cyan-500">
                            <option>This Month</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={top_ciudades} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="ciudad"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                    formatter={(value) => [formatCurrency(value as number), 'Total']}
                                />
                                <Bar
                                    dataKey="total_dinero"
                                    fill="#06b6d4"
                                    radius={[12, 12, 12, 12]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side List (Casos) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Casos Recientes</h3>
                    <div className="space-y-6">
                        {casos_destacados.slice(0, 5).map((caso: any) => (
                            <div key={caso.id_caso} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors -mx-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                                        <HeartIcon className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{caso.nombre_caso}</p>
                                        <p className="text-xs text-gray-500 font-medium">{caso.estado}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{caso.movimientos} movs</p>
                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                            style={{ width: `${Math.min(caso.movimientos * 10, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors">
                        Ver todos los casos
                    </button>
                </div>
            </div>
        </div>
    );
};
