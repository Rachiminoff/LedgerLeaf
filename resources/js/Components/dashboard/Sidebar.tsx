import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import { LogoutModal } from '@/Components/ui/LogoutModal';

interface SidebarProps {
  activePage: string;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'mdi:view-dashboard-outline' },
  { id: 'budget', label: 'Budget Plan', icon: 'mdi:chart-pie' },
  { id: 'expenses', label: 'Expenses', icon: 'mdi:credit-card-outline' },
  { id: 'savings', label: 'Savings', icon: 'mdi:target' },
  { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line' },
  { id: 'profile', label: 'Profile Settings', icon: 'mdi:account-outline' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  onLogout, 
  isMobileOpen = false,
  onMobileClose 
}) => {
  const [isOpen, setIsOpen] = useState(isMobileOpen);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsOpen(isMobileOpen);
  }, [isMobileOpen]);

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      dashboard: '/dashboard',
      budget: '/budget',           
      expenses: '/expenses',
      savings: '/savings-goals',
      analytics: '/analytics',
      profile: '/profile',
      help: '/help',
      settings: '/settings',
    };

    router.visit(routes[page] || `/${page}`);
    
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    } else {
      router.post('/logout');
    }
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 sm:h-16 border-b border-[#242424] flex-shrink-0">
        <img
          src="/assets/images/logo.png"
          alt="LedgerLeaf"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
        <span className="text-white text-lg sm:text-xl font-light tracking-tight">
          Ledger<span className="text-[#5CB85C] font-medium">Leaf</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3 space-y-0.5 sm:space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-xl transition-all duration-200 text-sm font-light min-h-[44px] ${
              activePage === item.id
                ? 'bg-[#5CB85C]/10 text-[#5CB85C]'
                : 'text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <Icon icon={item.icon} className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-[#242424] p-3 sm:p-4 space-y-0.5 sm:space-y-1 flex-shrink-0">
        <button
          onClick={() => handleNavigate('help')}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A] min-h-[44px]"
        >
          <Icon icon="mdi:help-circle-outline" className="h-5 w-5 flex-shrink-0" />
          <span>Help Center</span>
        </button>
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-light text-[#9A9A9A] hover:text-[#FF5A5A] hover:bg-[#FF5A5A]/10 min-h-[44px]"
        >
          <Icon icon="mdi:logout" className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px] bg-[#111111] border-r border-[#242424] z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/80 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-[#111111] border-r border-[#242424] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;