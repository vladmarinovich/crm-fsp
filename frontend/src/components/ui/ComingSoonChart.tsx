import React from 'react';

interface ComingSoonChartProps {
    title: string;
    height?: number;
}

export const ComingSoonChart: React.FC<ComingSoonChartProps> = ({ title, height = 300 }) => {
    return (
        <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50"
            style={{ height: `${height}px` }}
        >
            <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                <svg
                    className="w-8 h-8 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
                Estamos trabajando en nuevas visualizaciones para esta sección. ¡Pronto disponible! 🚀
            </p>
        </div>
    );
};
