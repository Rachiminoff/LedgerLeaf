import React from 'react';
import { Icon } from '@iconify/react';
import { GettingStartedStep } from '@/types/help';

interface GettingStartedProps {
  steps: GettingStartedStep[];
}

export default function GettingStarted({ steps }: GettingStartedProps) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
          <Icon icon="mdi:rocket-outline" className="w-5 h-5 text-[#5CB85C]" />
        </div>
        <h2 className="text-xl font-semibold text-white">Getting Started</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.step} className="bg-[#1A1A1A] border border-[#242424] rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#5CB85C]/10 flex items-center justify-center">
                  <Icon icon={step.icon} className="w-5 h-5 text-[#5CB85C]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-medium text-[#5CB85C] bg-[#5CB85C]/10 px-2 py-0.5 rounded">
                    Step {step.step}
                  </span>
                  <h3 className="text-white font-medium">{step.title}</h3>
                </div>
                <p className="text-[#9A9A9A] text-sm leading-relaxed">{step.description}</p>
                <div className="mt-2 bg-[#111111] rounded-lg p-3 border border-[#242424]">
                  <p className="text-white text-sm">{step.details}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}