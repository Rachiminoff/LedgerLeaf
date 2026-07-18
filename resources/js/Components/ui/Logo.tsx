// components/ui/Logo/Logo.tsx
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#2D5A27] rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-bold">L</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LedgerLeaf</h1>
          <p className="text-xs text-gray-500">Smart records. Clear future.</p>
        </div>
      </div>
    </div>
  );
};