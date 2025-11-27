import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        clsx(
                            "w-full px-4 py-2.5 border rounded-xl shadow-sm outline-none transition-all duration-200",
                            "text-slate-900 placeholder:text-slate-400",
                            "focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500",
                            "disabled:bg-slate-50 disabled:text-slate-500",
                            error
                                ? "border-red-500 focus:ring-red-100"
                                : "border-slate-200 hover:border-slate-300"
                        ),
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500 animate-fadeIn">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
