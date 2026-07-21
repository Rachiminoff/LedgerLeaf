import React, { useEffect, useRef, useState } from 'react';
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
  const [isHovering, setIsHovering] = useState(false);
  const [activeStat, setActiveStat] = useState(0);

  const stats = [
    { label: 'Safe to Spend', value: '₱3,240.50', change: '+12%' },
    { label: 'Total Allocated', value: '₱4,200.00', change: '+8%' },
    { label: 'Monthly Savings', value: '₱1,850.00', change: '+23%' },
  ];

  // Floating animation for dashboard
  useEffect(() => {
    const floatAnimation = () => {
      if (!dashboardRef.current) return;
      const y = Math.sin(Date.now() / 3000) * 6;
      dashboardRef.current.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(floatAnimation);
    };
    const animationId = requestAnimationFrame(floatAnimation);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Rotate through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-16 sm:pt-0">
      {/* Background gradient glow - Mobile optimized */}
      <div className="absolute top-[-30%] right-[-50%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-[#5CB85C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-30%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-[#5CB85C]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Content - Mobile optimized */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#5CB85C]/10 border border-[#5CB85C]/20 rounded-full mx-auto lg:mx-0">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5CB85C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-[#5CB85C]"></span>
              </span>
              <span className="text-[10px] sm:text-xs text-[#5CB85C] font-medium">Open Beta</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light leading-[1.05] tracking-tight">
              <span className="text-white">Every peso</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5CB85C] to-[#70C970]">
                has a purpose.
              </span>
            </h1>

            <p className="text-[#9A9A9A] text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
              A personal finance application designed to give every peso a job.
              Budget intentionally, track spending, and achieve your savings goals
              with clarity and confidence.
            </p>

            {/* Features highlight - Mobile optimized */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#5CB85C]/10 flex items-center justify-center">
                  <Icon icon="mdi:check-circle" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#5CB85C]" />
                </div>
                <span className="text-xs sm:text-sm text-[#9A9A9A]">100% free</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#5CB85C]/10 flex items-center justify-center">
                  <Icon icon="mdi:lock" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#5CB85C]" />
                </div>
                <span className="text-xs sm:text-sm text-[#9A9A9A]">No gacha</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#5CB85C]/10 flex items-center justify-center">
                  <Icon icon="mdi:chart-line" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#5CB85C]" />
                </div>
                <span className="text-xs sm:text-sm text-[#9A9A9A]">Smart insights</span>
              </div>
            </div>

            {/* CTA Buttons - Mobile optimized */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1 sm:pt-2">
              <button
                onClick={() => router.visit('/signup')}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#5CB85C] text-black text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/30 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Budgeting Free
                  <Icon 
                    icon="mdi:arrow-right" 
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} 
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              <button
                onClick={onLearnMoreClick}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-transparent text-white text-xs sm:text-sm font-medium border border-[#242424] rounded-xl hover:border-[#5CB85C] hover:text-[#5CB85C] hover:bg-[#5CB85C]/5 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Dashboard Preview - Mobile optimized */}
          <div
            ref={dashboardRef}
            className="relative transition-transform duration-300 ease-in-out mt-8 lg:mt-0"
          >
            {/* Glow behind dashboard - Mobile optimized */}
            <div className="absolute inset-0 bg-[#5CB85C]/10 rounded-xl sm:rounded-2xl blur-xl sm:blur-2xl -z-10" />

            <div className="bg-gradient-to-br from-[#111111] to-[#0D0D0D] rounded-xl sm:rounded-2xl border border-[#242424] shadow-2xl p-4 sm:p-5 md:p-6 hover:border-[#5CB85C]/30 transition-all duration-300">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#5CB85C] animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs text-[#9A9A9A] font-light tracking-wide">Dashboard</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#242424]"></div>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#242424]"></div>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#242424]"></div>
                </div>
              </div>

              {/* Dashboard Stats - Mobile optimized */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`bg-[#1A1A1A] rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border transition-all duration-500 ${
                      activeStat === index 
                        ? 'border-[#5CB85C]/30 bg-[#5CB85C]/5' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-[#9A9A9A] font-light truncate block">{stat.label}</span>
                    <p className={`text-xs sm:text-sm md:text-lg font-light mt-0.5 sm:mt-1 transition-all duration-500 truncate ${
                      activeStat === index ? 'text-[#5CB85C]' : 'text-white'
                    }`}>
                      {stat.value}
                    </p>
                    <span className={`text-[8px] sm:text-[10px] font-medium ${
                      stat.change.startsWith('+') ? 'text-[#5CB85C]' : 'text-[#FF5A5A]'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress indicators - Mobile optimized */}
              <div className="flex gap-1 justify-center mb-3 sm:mb-4">
                {stats.map((_, index) => (
                  <div
                    key={index}
                    className={`h-0.5 w-4 sm:w-6 md:w-8 rounded-full transition-all duration-500 ${
                      activeStat === index ? 'bg-[#5CB85C]' : 'bg-[#242424]'
                    }`}
                  />
                ))}
              </div>

              {/* Dashboard Grid - Mobile optimized */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { label: 'Budget', icon: 'mdi:chart-pie' },
                  { label: 'Pockets', icon: 'mdi:wallet' },
                  { label: 'Goals', icon: 'mdi:target' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group bg-[#1A1A1A] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[#242424] hover:border-[#5CB85C] transition-all duration-200 text-center cursor-pointer hover:bg-[#5CB85C]/5"
                  >
                    <Icon 
                      icon={item.icon} 
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#5CB85C] mx-auto mb-1 group-hover:scale-110 transition-transform duration-200" 
                    />
                    <span className="text-[10px] sm:text-xs font-medium text-white group-hover:text-[#5CB85C] transition-colors duration-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative chart line - Mobile optimized */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#242424]">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-[8px] sm:text-[10px] text-[#9A9A9A] font-light">Spending Trend</span>
                  <span className="text-[8px] sm:text-[10px] text-[#5CB85C] font-medium">+12.5%</span>
                </div>
                <div className="flex items-end h-6 sm:h-8 gap-0.5">
                  {[40, 60, 45, 80, 65, 90, 70].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-[#242424] rounded-sm hover:bg-[#5CB85C] transition-all duration-300"
                      style={{ 
                        height: `${height}%`,
                        backgroundColor: height > 70 ? '#5CB85C' : undefined 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};