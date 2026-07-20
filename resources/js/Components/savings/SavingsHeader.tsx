import React from 'react';
import { Icon } from '@iconify/react';

interface SavingsHeaderProps {
    onCreateGoal?: () => void;
}

export default function SavingsHeader({ onCreateGoal }: SavingsHeaderProps) {
    return (
        <div className="relative mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Savings
                    </h1>
                    <p className="text-sm text-[#9A9A9A] mt-1">
                        Track your financial goals and grow your savings.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCreateGoal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#5CB85C] text-black rounded-xl hover:bg-[#6FCF70] transition-all duration-200 font-medium text-sm shadow-lg shadow-[#5CB85C]/20 hover:shadow-[#5CB85C]/40"
                    >
                        <Icon icon="mdi:plus" className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Savings Goal</span>
                        <span className="sm:hidden">Add Goal</span>
                    </button>
                </div>
            </div>

            {/* Decorative Branch */}
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