import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={twMerge(
                        clsx(
                            "w-full px-4 py-2 border rounded-xl shadow-sm outline-none transition-all bg-white",
                            "focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500",
                            "disabled:bg-slate-50 disabled:text-slate-500",
                            error
                                ? "border-red-300 focus:ring-red-100 focus:border-red-500"
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

Textarea.displayName = 'Textarea';
