import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusIcon,
    UserPlusIcon,
    CurrencyDollarIcon,
    HeartIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export const FloatingActionMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const actions = [
        { label: 'Nuevo Gasto', icon: BriefcaseIcon, path: '/gastos/nuevo', color: 'bg-red-500' },
        { label: 'Nueva Donación', icon: CurrencyDollarIcon, path: '/donaciones/nueva', color: 'bg-green-500' },
        { label: 'Nuevo Caso', icon: HeartIcon, path: '/casos/nuevo', color: 'bg-purple-500' },
        { label: 'Nuevo Donante', icon: UserPlusIcon, path: '/donantes/nuevo', color: 'bg-blue-500' },
    ];

    const handleAction = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
            {/* Actions */}
            <div className={clsx(
                "flex flex-col items-end space-y-3 transition-all duration-300",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}>
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => handleAction(action.path)}
                        className="flex items-center group"
                    >
                        <span className="mr-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap">
                            {action.label}
                        </span>
                        <div className={clsx(
                            "p-3 rounded-full text-white shadow-lg hover:scale-110 transition-transform",
                            action.color
                        )}>
                            <action.icon className="h-6 w-6" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-4 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform",
                    isOpen ? "bg-gray-600 rotate-45" : "bg-primary-600 hover:scale-110"
                )}
            >
                <PlusIcon className="h-8 w-8" />
            </button>

            {/* Backdrop for mobile to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-[-1]"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
