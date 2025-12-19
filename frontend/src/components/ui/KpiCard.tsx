import clsx from 'clsx';
import { ReactNode } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: number; // Porcentaje, ej: 20
        isPositive: boolean; // true = verde, false = rojo
        label?: string; // "vs mes anterior"
    };
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export const KpiCard = ({ title, value, icon, trend, className }: KpiCardProps) => {
    return (
        <div className={clsx(
            "bg-white rounded-lg border border-slate-200 shadow-sm p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full",
            className
        )}>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {icon && (
                        <div className="text-slate-400 w-5 h-5">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
                </div>

                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {value}
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center text-sm pt-3 border-t border-slate-50">
                    <span className={clsx(
                        "font-bold flex items-center gap-1",
                        trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                        {trend.isPositive ? (
                            <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                        )}
                        {Math.abs(trend.value)}%
                    </span>
                    <span className="ml-2 text-slate-400 text-xs">{trend.label || 'vs periodo anterior'}</span>
                </div>
            )}

            {/* Optional subtle color indicator at bottom right or similar could be added here, 
                but for now we keep it ultra-clean like the reference image. */}
        </div>
    );
};
