import React from 'react';
import { Icon } from '@iconify/react';

export default function HelpHeader() {
  return (
    <div className="relative mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Help Center
          </h1>
          <p className="text-[#9A9A9A] mt-1 text-sm md:text-base">
            Learn how LedgerLeaf works and find answers to common questions.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#242424] flex items-center justify-center">
            <Icon icon="mdi:help-circle-outline" className="w-6 h-6 text-[#5CB85C]" />
          </div>
        </div>
      </div>
      {/* Decorative branch illustration */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none hidden md:block">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 100 C40 80, 60 60, 80 40 C90 30, 100 20, 110 10" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M50 70 C60 60, 70 50, 80 40" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
          <path d="M70 50 C80 40, 90 30, 100 20" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="110" cy="10" r="3" fill="#5CB85C"/>
          <circle cx="80" cy="40" r="2" fill="#5CB85C"/>
          <circle cx="50" cy="70" r="2" fill="#5CB85C"/>
        </svg>
      </div>
    </div>
  );
}