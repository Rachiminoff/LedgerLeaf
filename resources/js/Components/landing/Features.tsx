import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

const features = [
  {
    icon: 'mdi:chart-pie',
    title: 'Dashboard',
    description:
      'Consolidated view of your financial status. See your safe-to-spend balance, real-time breakdown of remaining balances per pocket, and intuitive visualization of budget distribution.',
  },
  {
    icon: 'mdi:clipboard-list',
    title: 'Budget Planner',
    description:
      'Allocate income across customizable budget categories. Plan for recurring and variable expenses with structured planning that enforces spending discipline through predefined limits.',
  },
  {
    icon: 'mdi:target',
    title: 'Savings Goals',
    description:
      'Create and manage multiple savings targets. Track progress with visual indicators that encourage consistent saving behavior over time.',
  },
];

export const Features: React.FC = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 border-t border-[#242424]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[40px] sm:text-[48px] font-light text-white tracking-tight">
            Clear visibility.
            <br />
            <span className="text-[#5CB85C]">Intentional spending.</span>
          </h2>
          <p className="text-[#9A9A9A] text-base font-light mt-4 max-w-xl mx-auto">
            The challenge isn't the lack of funds—it's the lack of structure.
            LedgerLeaf gives every peso a defined purpose.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-[#111111] rounded-2xl border border-[#242424] p-8 transition-all duration-700 opacity-0 translate-y-8 hover:-translate-y-1 hover:border-[#5CB85C] hover:shadow-2xl hover:shadow-[#5CB85C]/5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 group-hover:border-[#5CB85C] transition-colors duration-200">
                <Icon icon={feature.icon} className="h-6 w-6 text-[#5CB85C]" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#9A9A9A] font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};