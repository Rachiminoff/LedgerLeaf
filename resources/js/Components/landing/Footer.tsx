import React from 'react';
import { router } from '@inertiajs/react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#242424] py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo - Left */}
          <button
            onClick={() => router.visit('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/assets/images/logo.png"
              alt="LedgerLeaf Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white text-xl font-light tracking-tight">
              Ledger<span className="text-[#5CB85C] font-medium">Leaf</span>
            </span>
          </button>

          {/* Copyright - Center/Right */}
          <p className="text-xs text-[#9A9A9A] font-light tracking-wide">
            © 2026 LedgerLeaf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};