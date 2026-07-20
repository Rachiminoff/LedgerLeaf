import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { FAQItem } from '@/types/help';

interface FAQSectionProps {
  items: FAQItem[];
}

export default function FAQSection({ items }: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
          <Icon icon="mdi:help-circle-outline" className="w-5 h-5 text-[#5CB85C]" />
        </div>
        <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-[#1A1A1A] border border-[#242424] rounded-xl overflow-hidden">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#242424] transition-colors"
              aria-expanded={openId === item.id}
            >
              <span className="text-white font-medium pr-4">{item.question}</span>
              <Icon 
                icon={openId === item.id ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
                className="w-5 h-5 text-[#9A9A9A] flex-shrink-0 transition-transform"
              />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openId === item.id ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 pt-0 border-t border-[#242424]">
                <p className="text-[#9A9A9A] leading-relaxed">{item.answer}</p>
                <div className="mt-2">
                  <span className="text-xs text-[#5CB85C] bg-[#5CB85C]/10 px-2 py-0.5 rounded">
                    {item.category.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}