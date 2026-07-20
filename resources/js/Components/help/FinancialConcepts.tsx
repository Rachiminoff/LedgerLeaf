import React from 'react';
import { Icon } from '@iconify/react';
import { FinancialConcept } from '@/types/help';

interface FinancialConceptsProps {
  concepts: FinancialConcept[];
}

export default function FinancialConcepts({ concepts }: FinancialConceptsProps) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
          <Icon icon="mdi:brain-outline" className="w-5 h-5 text-[#5CB85C]" />
        </div>
        <h2 className="text-xl font-semibold text-white">Financial Concepts</h2>
      </div>

      <p className="text-[#9A9A9A] text-sm mb-6">
        Understanding these key concepts will help you get the most out of LedgerLeaf.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((concept, index) => (
          <div key={index} className="bg-[#1A1A1A] border border-[#242424] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#5CB85C]/10 flex items-center justify-center flex-shrink-0">
                <Icon icon={concept.icon} className="w-4 h-4 text-[#5CB85C]" />
              </div>
              <h3 className="text-white font-medium">{concept.title}</h3>
            </div>
            <p className="text-[#9A9A9A] text-sm leading-relaxed mb-3">{concept.explanation}</p>
            <div className="bg-[#111111] rounded-lg p-3 border border-[#242424]">
              <p className="text-xs text-[#9A9A9A]">
                <span className="text-[#5CB85C]">Example:</span> {concept.example}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}