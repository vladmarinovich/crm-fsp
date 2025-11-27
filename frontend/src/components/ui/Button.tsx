import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const Button = ({
    className,
    variant = 'primary',
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-200 shadow-sm hover:shadow-md',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-200 shadow-sm hover:shadow-md',
        outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-100 shadow-sm',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-100 shadow-sm',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-100',
    };

    return (
        <button
            className={twMerge(
                clsx(
                    "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant]
                ),
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </>
            ) : children}
        </button>
    );
};
