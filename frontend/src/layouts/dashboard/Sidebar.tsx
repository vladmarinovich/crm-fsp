import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    UsersIcon,
    HeartIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    BuildingStorefrontIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useUIStore } from '@/core/stores/useUIStore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/core/lib/supabase';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Donantes', href: '/donantes', icon: UsersIcon },
    { name: 'Casos', href: '/casos', icon: HeartIcon },
    { name: 'Donaciones', href: '/donaciones', icon: CurrencyDollarIcon },
    { name: 'Gastos', href: '/gastos', icon: BriefcaseIcon },
    { name: 'Proveedores', href: '/proveedores', icon: BuildingStorefrontIcon },
];

export const Sidebar = () => {
    const { isSidebarOpen, closeSidebar } = useUIStore();
    const { user } = useAuth();

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <div className={clsx(
                "flex flex-col w-64 bg-white h-screen fixed left-0 top-0 transition-transform duration-300 ease-in-out z-40 shadow-xl md:shadow-none border-r border-slate-100",
                !isSidebarOpen && "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="flex items-center h-20 px-6">
                    <div className="flex items-center gap-2 text-cyan-600">
                        <div className="p-2 bg-cyan-50 rounded-xl">
                            <HeartIcon className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Salvando Patitas</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                        Menu Principal
                    </div>
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={() => {
                                if (window.innerWidth < 768) closeSidebar();
                            }}
                            className={({ isActive }) =>
                                clsx(
                                    isActive
                                        ? 'bg-cyan-50 text-cyan-700 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                                    'group flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={clsx(
                                            'mr-3 flex-shrink-0 h-5 w-5',
                                            isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-500'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-slate-100 space-y-4">
                    <NavLink
                        to="/configuracion"
                        onClick={() => {
                            if (window.innerWidth < 768) closeSidebar();
                        }}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-slate-400" />
                        Configuración
                    </NavLink>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl group border border-transparent hover:border-slate-200 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-sm border-2 border-white shadow-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {user?.email?.split('@')[0] || 'Usuario'}
                            </p>
                            <p className="text-xs text-slate-500 truncate font-medium">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                        <button
                            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cerrar sesión"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
