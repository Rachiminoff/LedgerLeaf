import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

const features = [
  {
    icon: 'mdi:view-dashboard-outline',
    title: 'Dashboard',
    description:
      'Consolidated view of your financial status. See your safe-to-spend balance, real-time breakdown of remaining balances per pocket, and intuitive visualization of budget distribution.',
    color: '#5CB85C',
  },
  {
    icon: 'mdi:chart-pie',
    title: 'Budget Planner',
    description:
      'Allocate income across customizable budget categories. Plan for recurring and variable expenses with structured planning that enforces spending discipline through predefined limits.',
    color: '#70C970',
  },
  {
    icon: 'mdi:target',
    title: 'Savings Goals',
    description:
      'Create and manage multiple savings targets. Track progress with visual indicators that encourage consistent saving behavior over time.',
    color: '#4CAF50',
  },
  {
    icon: 'mdi:credit-card-outline',
    title: 'Expense Tracking',
    description:
      'Log and categorize every expense with ease. Understand your spending patterns and identify areas where you can save more effectively.',
    color: '#66BB6A',
  },
  {
    icon: 'mdi:chart-line',
    title: 'Analytics & Insights',
    description:
      'Gain deep insights into your financial behavior with visual analytics. Track trends, identify patterns, and make data-driven decisions about your money.',
    color: '#81C784',
  },
  {
    icon: 'mdi:shield-outline',
    title: 'Safe Balance',
    description:
      'Keep unallocated funds in your safe balance. Allocate money to pockets or savings goals only when you\'re ready to give it a specific purpose.',
    color: '#A5D6A7',
  },
];

export const Features: React.FC = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 border-t border-[#242424] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5CB85C]/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5CB85C]/10 border border-[#5CB85C]/20 rounded-full mb-6">
            <Icon icon="mdi:sparkles" className="w-4 h-4 text-[#5CB85C]" />
            <span className="text-xs text-[#5CB85C] font-medium">Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
            Clear visibility.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5CB85C] to-[#70C970]">
              Intentional spending.
            </span>
          </h2>
          <p className="text-[#9A9A9A] text-base sm:text-lg font-light mt-4 max-w-xl mx-auto">
            The challenge isn't the lack of funds—it's the lack of structure.
            <br className="hidden sm:block" />
            LedgerLeaf gives every peso a defined purpose.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative bg-[#111111] rounded-2xl border border-[#242424] p-6 md:p-8 transition-all duration-700 opacity-0 translate-y-12 hover:-translate-y-2 hover:border-[#5CB85C] hover:shadow-2xl hover:shadow-[#5CB85C]/10"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#5CB85C]/0 via-[#5CB85C]/0 to-[#5CB85C]/0 group-hover:from-[#5CB85C]/5 group-hover:via-[#5CB85C]/0 group-hover:to-[#5CB85C]/5 transition-all duration-500" />
              
              {/* Icon with animated background */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-[#5CB85C] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#5CB85C]/20`}>
                  <Icon 
                    icon={feature.icon} 
                    className="h-6 w-6 text-[#5CB85C] transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                {/* Number badge */}
                <span className="absolute -top-2 -right-2 text-[10px] font-medium text-[#5CB85C] bg-[#1A1A1A] border border-[#242424] rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#5CB85C] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-[#9A9A9A] font-light leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5CB85C] to-[#70C970] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-[#9A9A9A] text-sm font-light mb-4">
            Ready to take control of your finances?
          </p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/30 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Your Journey
            <Icon icon="mdi:arrow-right" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};