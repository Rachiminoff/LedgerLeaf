import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { Sidebar } from '@/Components/dashboard/Sidebar';
import { TopNav } from '@/Components/dashboard/TopNav';

const ONBOARDING_COMPLETED_KEY = 'ledgerleaf_onboarding_completed';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

const FEATURES: Feature[] = [
    {
        icon: 'mdi:chart-pie',
        title: 'Budget Management',
        description: 'Create budgets and monitor your monthly spending.',
    },
    {
        icon: 'mdi:credit-card-outline',
        title: 'Expense Tracking',
        description: 'Record expenses and understand where your money goes.',
    },
    {
        icon: 'mdi:target',
        title: 'Savings Goals',
        description: 'Organize savings into dedicated pockets and track your progress.',
    },
    {
        icon: 'mdi:chart-line',
        title: 'Financial Overview',
        description: 'View your balance, spending trends, and overall financial activity.',
    },
];

const Onboarding: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const handleCompleteOnboarding = (): void => {
        localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
        window.location.href = '/dashboard';
    };

    const handleLogout = (): void => {
        if (confirm('Are you sure you want to log out?')) {
            router.post('/logout');
        }
    };

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = (): void => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
            <Sidebar
                activePage="dashboard"
                onLogout={handleLogout}
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={closeMobileMenu}
            />

            <div className="lg:ml-[280px] min-h-screen">
                <TopNav
                    title="Onboarding"
                    onMenuToggle={toggleMobileMenu}
                    notificationCount={0}
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#5CB85C]/10 flex items-center justify-center mx-auto mb-4">
                                <Icon icon="mdi:leaf" className="h-8 w-8 text-[#5CB85C]" />
                            </div>
                            <h1 className="text-2xl font-semibold text-white">Welcome to LedgerLeaf</h1>
                            <p className="text-sm text-[#9A9A9A] mt-1">
                                Let's get you started with your personal finance journey
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                            {FEATURES.map((feature: Feature, index: number) => (
                                <div
                                    key={feature.title}
                                    className="bg-[#111111] rounded-xl p-5 border border-[#242424] hover:border-[#5CB85C]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#5CB85C]/5"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-[#5CB85C]/10 flex items-center justify-center flex-shrink-0">
                                            <Icon icon={feature.icon} className="h-5 w-5 text-[#5CB85C]" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                                            <p className="text-xs text-[#9A9A9A] mt-0.5">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={handleCompleteOnboarding}
                                className="px-8 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mx-auto"
                            >
                                <Icon icon="mdi:check" className="h-4 w-4" />
                                Get Started
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-fadeInUp {
                        animation: none !important;
                        opacity: 1 !important;
                        transform: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Onboarding;