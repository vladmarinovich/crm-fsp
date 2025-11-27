import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Card = ({ children, className, title }: CardProps) => {
    return (
        <div className={cn("bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
            {title && (
                <div className="px-6 py-4 border-b border-slate-50">
                    <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
