import React from 'react';
import { Icon } from '@iconify/react';

interface NavigationMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobile: boolean;
}

const sections = [
  { id: 'about', label: 'About', icon: 'mdi:information-outline' },
  { id: 'getting-started', label: 'Getting Started', icon: 'mdi:rocket-outline' },
  { id: 'faq', label: 'FAQs', icon: 'mdi:help-circle-outline' },
  { id: 'concepts', label: 'Concepts', icon: 'mdi:brain-outline' },
  { id: 'app-info', label: 'App Info', icon: 'mdi:application-outline' },
];

export default function NavigationMenu({ activeSection, onSectionChange, isMobile }: NavigationMenuProps) {
  if (isMobile) {
    return (
      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-[#5CB85C] text-black'
                  : 'bg-[#111111] text-[#9A9A9A] hover:text-white border border-[#242424]'
              }`}
            >
              <Icon icon={section.icon} className="w-4 h-4 inline mr-2" />
              {section.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-[#111111] border border-[#242424] rounded-xl p-4 sticky top-4 z-10">
      <nav className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-[#5CB85C] text-black'
                : 'text-[#9A9A9A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <Icon icon={section.icon} className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}