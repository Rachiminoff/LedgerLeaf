import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#242424] py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/logo.png"
              alt="LedgerLeaf Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white text-xl font-light tracking-tight">
              Ledger<span className="text-[#5CB85C] font-medium">Leaf</span>
            </span>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200 font-light">
              Privacy
            </a>
            <a href="#" className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200 font-light">
              Terms
            </a>
            <a href="#" className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200 font-light">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-[#9A9A9A] font-light tracking-wide">
            © 2026 LedgerLeaf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};