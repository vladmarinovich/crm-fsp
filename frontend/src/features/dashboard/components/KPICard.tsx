import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KPICardProps {
    title: string;
    value: string;
    data?: any[];
    color?: string;
}

export const KPICard = ({ title, value, data, color = "#06b6d4" }: KPICardProps) => {
    // Mock data for sparkline if not provided
    const chartData = data || [
        { v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 22 }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>
            <div className="h-12 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line
                            type="monotone"
                            dataKey="v"
                            stroke={color}
                            strokeWidth={3}
                            dot={false}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
