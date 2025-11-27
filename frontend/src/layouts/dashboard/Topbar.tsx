import { useNavigate } from 'react-router-dom';
import { BellIcon, ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { supabase } from '@/core/lib/supabase';
import { useUIStore } from '@/core/stores/useUIStore';
import clsx from 'clsx';

export const Topbar = () => {
    const navigate = useNavigate();
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header className={clsx(
            "bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-all duration-300 ease-in-out",
            "left-0", // Always left-0 on mobile
            isSidebarOpen ? "md:left-64" : "md:left-0" // Adjust on desktop
        )}>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <h2 className="text-lg font-medium text-gray-800">Bienvenido, Admin</h2>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <span className="sr-only">Ver notificaciones</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    A
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Cerrar sesión"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Salir</span>
                </button>
            </div>
        </header>
    );
};
