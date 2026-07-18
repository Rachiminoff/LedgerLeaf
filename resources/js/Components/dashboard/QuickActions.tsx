import React from 'react';
import { Icon } from '@iconify/react';

export const QuickActions: React.FC = () => {
  const actions = [
    { label: 'Create Budget', icon: 'mdi:plus-circle-outline', color: '#5CB85C' },
    { label: 'Record Expense', icon: 'mdi:credit-card-outline', color: '#70C970' },
    { label: 'Transfer Funds', icon: 'mdi:swap-horizontal', color: '#4CAF50' },
    { label: 'Generate Report', icon: 'mdi:file-document-outline', color: '#66BB6A' },
  ];

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#242424] p-5">
      <h3 className="text-sm font-medium text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#242424] hover:border-[#5CB85C] hover:bg-[#5CB85C]/5 transition-all duration-200 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <Icon icon={action.icon} className="h-4 w-4" style={{ color: action.color }} />
            </div>
            <span className="text-sm text-white group-hover:text-[#5CB85C] transition-colors duration-200">
              {action.label}
            </span>
            <Icon icon="mdi:chevron-right" className="h-4 w-4 text-[#9A9A9A] ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
};