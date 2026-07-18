import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

const stats = [
  { icon: 'mdi:chart-pie', label: 'Budget Allocation' },
  { icon: 'mdi:wallet', label: 'Pocket Management' },
  { icon: 'mdi:target', label: 'Savings Goals' },
  { icon: 'mdi:shield-check', label: 'Spending Limits' },
];

export const Statistics: React.FC = () => {
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'scale-100');
            entry.target.classList.remove('opacity-0', 'scale-95');
          }
        });
      },
      { threshold: 0.1 }
    );

    statsRef.current.forEach((stat) => {
      if (stat) observer.observe(stat);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 border-t border-[#242424]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => (statsRef.current[index] = el)}
              className="bg-[#111111] rounded-2xl border border-[#242424] p-6 text-center transition-all duration-700 opacity-0 scale-95 hover:border-[#5CB85C] hover:shadow-lg hover:shadow-[#5CB85C]/5 group"
            >
              <div className="flex justify-center mb-3">
                <Icon icon={stat.icon} className="h-8 w-8 text-[#5CB85C]" />
              </div>
              <span className="text-sm font-medium text-white group-hover:text-[#5CB85C] transition-colors duration-200">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};