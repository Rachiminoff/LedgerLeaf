import { Search, Bell, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function ExpenseHeader() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="relative mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Expenses
                    </h1>
                    <p className="text-sm text-[#9A9A9A] mt-1">
                        Track, organize, and manage your spending.
                    </p>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="p-2 rounded-lg bg-[#111111] border border-[#242424] hover:border-[#5CB85C] transition-colors">
                        <Search className="w-5 h-5 text-[#9A9A9A]" />
                    </button>
                    <button className="p-2 rounded-lg bg-[#111111] border border-[#242424] hover:border-[#5CB85C] transition-colors relative">
                        <Bell className="w-5 h-5 text-[#9A9A9A]" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#5CB85C] rounded-full" />
                    </button>
                    <Link 
                        href="/profile" 
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#111111] border border-[#242424] hover:border-[#5CB85C] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#5CB85C] flex items-center justify-center text-white font-medium">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <button className="md:hidden p-2 rounded-lg bg-[#111111] border border-[#242424]">
                    <Menu className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Decorative Branch - Top Right */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none hidden lg:block">
                <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
                    <path d="M180 10C160 30 140 50 150 70C160 90 180 80 190 60C200 40 190 20 170 10C150 0 120 10 100 30C80 50 60 70 40 60C20 50 10 30 20 20" 
                          stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M150 70C145 85 135 95 125 100" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M100 30C90 15 80 5 70 10" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="125" cy="100" r="3" fill="#5CB85C" opacity="0.6"/>
                    <circle cx="70" cy="10" r="3" fill="#5CB85C" opacity="0.6"/>
                    <circle cx="40" cy="60" r="2" fill="#5CB85C" opacity="0.6"/>
                    <circle cx="20" cy="20" r="2" fill="#5CB85C" opacity="0.6"/>
                </svg>
            </div>
        </div>
    );
}