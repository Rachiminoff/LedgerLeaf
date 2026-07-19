import React from 'react'

export default function AnalyticsHeader() {
    return (
        <div className="relative mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Analytics
                    </h1>
                    <p className="text-sm text-[#9A9A9A] mt-1">
                        Understand your financial habits over time.
                    </p>
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
    )
}