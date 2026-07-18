import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

interface HeroProps {
  onGetStartedClick?: () => void;
  onLearnMoreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onGetStartedClick,
  onLearnMoreClick,
}) => {
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const floatAnimation = () => {
      if (!dashboardRef.current) return;
      const y = Math.sin(Date.now() / 3000) * 8;
      dashboardRef.current.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(floatAnimation);
    };
    const animationId = requestAnimationFrame(floatAnimation);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-[56px] sm:text-[64px] lg:text-[72px] font-light leading-[1.1] tracking-tight">
              <span className="text-white">Every peso</span>
              <br />
              <span className="text-[#5CB85C]">has a purpose.</span>
            </h1>
            <p className="text-[#9A9A9A] text-base sm:text-lg font-light leading-relaxed max-w-lg">
              A personal finance application designed to give every peso a job.
              Budget intentionally, track spending, and achieve your savings goals
              with clarity and confidence.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => router.visit('/signup')}
                className="px-6 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </button>
              <button
                onClick={onLearnMoreClick}
                className="px-6 py-3 bg-transparent text-white text-sm font-medium border border-[#242424] rounded-xl hover:border-[#5CB85C] hover:text-[#5CB85C] transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Dashboard Preview */}
          <div
            ref={dashboardRef}
            className="relative transition-transform duration-300 ease-in-out"
          >
            <div className="bg-[#111111] rounded-2xl border border-[#242424] shadow-2xl p-6">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#5CB85C]"></div>
                  <span className="text-xs text-[#9A9A9A] font-light tracking-wide">Dashboard</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#242424]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#242424]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#242424]"></div>
                </div>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#242424]">
                  <span className="text-xs text-[#9A9A9A] font-light">Safe to Spend</span>
                  <p className="text-xl font-light text-[#5CB85C] mt-1">₱3,240.50</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#242424]">
                  <span className="text-xs text-[#9A9A9A] font-light">Total Allocated</span>
                  <p className="text-xl font-light text-white mt-1">₱4,200.00</p>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Budget', icon: 'mdi:chart-pie', color: '#5CB85C' },
                  { label: 'Pockets', icon: 'mdi:wallet', color: '#5CB85C' },
                  { label: 'Goals', icon: 'mdi:target', color: '#5CB85C' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#1A1A1A] rounded-xl p-3 border border-[#242424] hover:border-[#5CB85C] transition-all duration-200 text-center group"
                  >
                    <Icon icon={item.icon} className="h-5 w-5 text-[#5CB85C] mx-auto mb-1.5" />
                    <span className="text-xs font-medium text-white group-hover:text-[#5CB85C] transition-colors duration-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};