import { useState, useEffect, useRef } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Option {
    value: string | number;
    label: string;
}

interface ComboboxProps {
    label: string;
    value?: string | number;
    onChange: (value: string | number) => void;
    onSearch: (query: string) => void;
    options: Option[];
    isLoading?: boolean;
    placeholder?: string;
    error?: string;
    initialLabel?: string;
}

export const Combobox = ({
    label,
    value,
    onChange,
    onSearch,
    options = [],
    isLoading,
    placeholder = 'Seleccionar...',
    error,
    initialLabel
}: ComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedLabel, setSelectedLabel] = useState(initialLabel || '');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync initialLabel if provided (useful for edit mode)
    useEffect(() => {
        if (initialLabel) {
            setSelectedLabel(initialLabel);
        }
    }, [initialLabel]);

    // Update label if value matches an option in the current list
    useEffect(() => {
        if (value && options.length > 0) {
            const option = options.find(o => o.value === value);
            if (option) {
                setSelectedLabel(option.label);
            }
        }
    }, [value, options]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (option: Option) => {
        onChange(option.value);
        setSelectedLabel(option.label);
        setIsOpen(false);
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    className={clsx(
                        "w-full pl-4 pr-10 py-2 border rounded-xl shadow-sm outline-none transition-all bg-white",
                        error
                            ? "border-red-300 focus:ring-2 focus:ring-red-100 focus:border-red-500"
                            : "border-slate-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 hover:border-slate-300"
                    )}
                    placeholder={placeholder}
                    value={isOpen ? query : selectedLabel}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        setQuery(''); // Clear query to allow new search
                        onSearch(''); // Trigger empty search to show default options
                        setIsOpen(true);
                    }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
            </div>

            {error && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{error}</p>}

            {isOpen && (
                <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-100">
                    {isLoading ? (
                        <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-slate-500">
                            Cargando...
                        </li>
                    ) : options.length === 0 ? (
                        <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-slate-500">
                            No se encontraron resultados
                        </li>
                    ) : (
                        options.map((option) => (
                            <li
                                key={option.value}
                                className={clsx(
                                    "relative cursor-default select-none py-2.5 pl-3 pr-9 hover:bg-primary-50 hover:text-primary-900 cursor-pointer transition-colors",
                                    option.value === value ? "font-semibold text-primary-900 bg-primary-50" : "text-slate-700"
                                )}
                                onClick={() => handleSelect(option)}
                            >
                                <span className="block truncate">{option.label}</span>
                                {option.value === value && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};
