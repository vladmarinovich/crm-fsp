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
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-200 shadow-sm hover:shadow',
        secondary: 'bg-dark text-white hover:bg-slate-700 focus:ring-slate-200 shadow-sm hover:shadow',
        outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-100 shadow-sm',
        danger: 'bg-danger text-white hover:opacity-90 focus:ring-red-100 shadow-sm',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-100',
    };

    return (
        <button
            className={twMerge(
                clsx(
                    "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm",
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
