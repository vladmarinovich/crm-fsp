import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { FloatingActionMenu } from '@/components/ui/FloatingActionMenu';
import { useUIStore } from '@/core/stores/useUIStore';
import clsx from 'clsx';
import { useEffect } from 'react';

export const Layout = () => {
    const { isSidebarOpen, closeSidebar } = useUIStore();

    // Close sidebar on mobile when route changes (optional, but good UX)
    // For now, we'll just handle the layout classes

    // Auto-close sidebar on mobile on initial load
    useEffect(() => {
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    }, [closeSidebar]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Topbar />

            <main className={clsx(
                "pt-16 transition-all duration-300 ease-in-out min-h-screen",
                // Desktop: push content if sidebar is open
                // Mobile: never push content (sidebar overlays)
                "md:pl-0",
                isSidebarOpen ? "md:pl-64" : "md:pl-0"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-24">
                    <Outlet />
                </div>
            </main>

            <FloatingActionMenu />
        </div>
    );
};
