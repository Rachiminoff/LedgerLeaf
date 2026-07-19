// resources/js/Layouts/Layout.tsx
import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';

interface LayoutProps {
    children: ReactNode;
    activePage?: string;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard-outline', route: '/dashboard' },
    { id: 'budget', label: 'Budget Plan', icon: 'mdi:chart-pie', route: '/budgets' },
    { id: 'expenses', label: 'Expenses', icon: 'mdi:credit-card-outline', route: '/expenses' },
    { id: 'savings', label: 'Savings', icon: 'mdi:target', route: '/savings-goals' },
    { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line', route: '/reports' },
    { id: 'profile', label: 'Profile', icon: 'mdi:account-outline', route: '/profile' },
    { id: 'settings', label: 'Settings', icon: 'mdi:cog-outline', route: '/settings' },
];

export default function Layout({ children, activePage = 'dashboard' }: LayoutProps) {
    const { url } = usePage();

    const getActivePage = (itemId: string) => {
        if (itemId === activePage) return true;
        if (itemId === 'dashboard' && url === '/dashboard') return true;
        if (itemId === 'expenses' && url.startsWith('/expenses')) return true;
        if (itemId === 'budget' && url.startsWith('/budgets')) return true;
        if (itemId === 'savings' && url.startsWith('/savings-goals')) return true;
        if (itemId === 'analytics' && url.startsWith('/reports')) return true;
        if (itemId === 'profile' && url.startsWith('/profile')) return true;
        if (itemId === 'settings' && url.startsWith('/settings')) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px] bg-[#111111] border-r border-[#242424] z-50">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 h-16 border-b border-[#242424]">
                    <div className="w-8 h-8 rounded-lg bg-[#5CB85C] flex items-center justify-center text-white font-bold text-lg">
                        L
                    </div>
                    <span className="text-white text-xl font-light tracking-tight">
                        Ledger<span className="text-[#5CB85C] font-medium">Leaf</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = getActivePage(item.id);
                        return (
                            <Link
                                key={item.id}
                                href={item.route}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light ${
                                    isActive
                                        ? 'bg-[#5CB85C]/10 text-[#5CB85C]'
                                        : 'text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]'
                                }`}
                            >
                                <Icon icon={item.icon} className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-[#242424] p-4 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]">
                        <Icon icon="mdi:help-circle-outline" className="h-5 w-5" />
                        <span>Help</span>
                    </button>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light text-[#9A9A9A] hover:text-[#FF5A5A] hover:bg-[#FF5A5A]/10"
                    >
                        <Icon icon="mdi:logout" className="h-5 w-5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content - Centered */}
            <div className="flex-1 lg:ml-[280px] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}