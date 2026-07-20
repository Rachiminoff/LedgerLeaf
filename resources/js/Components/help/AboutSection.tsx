import React from 'react';
import { Icon } from '@iconify/react';
import { AboutData } from '@/types/help';

interface AboutSectionProps {
  data: AboutData;
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
          <Icon icon="mdi:information-outline" className="w-5 h-5 text-[#5CB85C]" />
        </div>
        <h2 className="text-xl font-semibold text-white">About LedgerLeaf</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-[#9A9A9A] mb-2">What is LedgerLeaf?</h3>
          <p className="text-white leading-relaxed">{data.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#9A9A9A] mb-2">Our Mission</h3>
          <p className="text-white leading-relaxed">{data.mission}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#9A9A9A] mb-2">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.keyFeatures.map((feature, index) => (
              <div key={index} className="bg-[#1A1A1A] rounded-lg p-4 border border-[#242424]">
                <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                <p className="text-[#9A9A9A] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#9A9A9A] mb-2">Our Philosophy</h3>
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#242424]">
            <p className="text-white leading-relaxed">{data.philosophy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}