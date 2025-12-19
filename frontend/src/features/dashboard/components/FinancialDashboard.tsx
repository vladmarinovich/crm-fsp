import { useState } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FinancialDashboardProps {
    data: any;
    isFetching: boolean;
}

export const FinancialDashboard = ({ data, isFetching }: FinancialDashboardProps) => {
    const [showCharts, setShowCharts] = useState(true); // Abierto por defecto en Dashboard

    if (!data) return null;

    const { kpis, balance_historico = [], trends } = data;
    const defaultTrend = { value: 0, isPositive: true, label: 'vs periodo anterior' };

    const crecimiento = trends?.total_donado?.value || 0;

    return (
        <div className={`space-y-6 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
            {/* KPIs Financieros */}
            <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-700">Indicadores Financieros</h2>
                <p className="text-sm text-slate-500">Resumen de ingresos, gastos y balance del período</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="💰 Total Recaudado"
                    value={formatCurrency(kpis.total_donado)}
                    color="primary"
                    trend={trends?.total_donado || defaultTrend}
                />
                <KpiCard
                    title="💸 Total Gastado"
                    value={formatCurrency(kpis.total_gastado)}
                    color="warning"
                    trend={trends?.total_gastado || defaultTrend}
                />
                <KpiCard
                    title="📊 Balance Neto"
                    value={formatCurrency(kpis.balance_neto)}
                    color={kpis.balance_neto >= 0 ? 'success' : 'danger'}
                    trend={trends?.balance_neto || defaultTrend}
                />
                <KpiCard
                    title="📈 Crecimiento"
                    value={`${crecimiento >= 0 ? '+' : ''}${crecimiento.toFixed(1)}%`}
                    color={crecimiento >= 0 ? 'success' : 'danger'}
                />
            </div>

            {/* Gráficos */}
            <Card className="overflow-hidden">
                <button
                    onClick={() => setShowCharts(!showCharts)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700">Análisis y Tendencias</h3>
                        <p className="text-sm text-slate-500">Evolución temporal y distribución financiera</p>
                    </div>
                    <ChevronDownIcon
                        className={`h-5 w-5 text-slate-500 transition-transform ${showCharts ? 'rotate-180' : ''}`}
                    />
                </button>

                {showCharts && (
                    <div className="p-6 pt-0 border-t border-slate-100">
                        {/* Balance Temporal */}
                        <div className="mb-8">
                            <h4 className="text-md font-semibold text-slate-700 mb-4">Balance Financiero (Serie Temporal)</h4>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={balance_historico} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDonaciones" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            formatter={(val: number, name: string) => [formatCurrency(val), name.charAt(0).toUpperCase() + name.slice(1)]}
                                        />
                                        <Legend verticalAlign="top" height={36} iconType="circle" />
                                        <Area
                                            type="monotone"
                                            dataKey="donaciones"
                                            stroke="#06b6d4"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorDonaciones)"
                                            name="Donaciones"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="gastos"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorGastos)"
                                            name="Gastos"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="balance"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorBalance)"
                                            name="Balance"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gráficos adicionales */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Distribución de Gastos */}
                            <Card className="p-6">
                                <h4 className="text-md font-semibold text-slate-700 mb-4">Distribución de Gastos por Categoría</h4>
                                {data.gastos_por_categoria && data.gastos_por_categoria.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={data.gastos_por_categoria}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ categoria, percent }) => `${categoria}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="total"
                                            >
                                                {data.gastos_por_categoria.map((_: any, index: number) => {
                                                    const colors = ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981'];
                                                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                })}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-slate-400">
                                        No hay datos de gastos por categoría
                                    </div>
                                )}
                            </Card>

                            {/* Top Donantes */}
                            <Card className="p-6">
                                <h4 className="text-md font-semibold text-slate-700 mb-4">Top 5 Donantes</h4>
                                {data.top_donantes && data.top_donantes.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.top_donantes.map((donante: any, index: number) => (
                                            <a
                                                key={donante.id}
                                                href={`/donantes/${donante.id}`}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-700 group-hover:text-cyan-600 transition-colors">
                                                            {donante.nombre}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {donante.pais} • {donante.num_donaciones} donaciones
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-slate-700">{formatCurrency(donante.total_donado)}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-slate-400">
                                        No hay datos de donantes
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
