import React from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

interface SidebarProps {
  activePage: string;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard-outline' },
  { id: 'budget', label: 'Budget Plan', icon: 'mdi:chart-pie' },
  { id: 'expenses', label: 'Expenses', icon: 'mdi:credit-card-outline' },
  { id: 'savings', label: 'Savings', icon: 'mdi:target' },
  { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line' },
  { id: 'notifications', label: 'Notifications', icon: 'mdi:bell-outline' },
  { id: 'profile', label: 'Profile', icon: 'mdi:account-outline' },
  { id: 'settings', label: 'Settings', icon: 'mdi:cog-outline' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onLogout }) => {
  const handleNavigate = (page: string) => {
    // Map page IDs to actual routes
    const routes: Record<string, string> = {
      dashboard: '/dashboard',
      budget: '/budgets',
      expenses: '/expenses',
      savings: '/savings-goals',
      analytics: '/reports',
      notifications: '/notifications',
      profile: '/profile',
      settings: '/settings',
    };

    router.visit(routes[page] || `/${page}`);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px] bg-[#111111] border-r border-[#242424]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-[#242424]">
        <img
          src="/assets/images/logo.png"
          alt="LedgerLeaf"
          className="w-8 h-8 object-contain"
        />
        <span className="text-white text-xl font-light tracking-tight">
          Ledger<span className="text-[#5CB85C] font-medium">Leaf</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light ${
              activePage === item.id
                ? 'bg-[#5CB85C]/10 text-[#5CB85C]'
                : 'text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <Icon icon={item.icon} className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-[#242424] p-4 space-y-1">
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]"
        >
          <Icon icon="mdi:help-circle-outline" className="h-5 w-5" />
          <span>Help</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light text-[#9A9A9A] hover:text-[#FF5A5A] hover:bg-[#FF5A5A]/10"
        >
          <Icon icon="mdi:logout" className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};