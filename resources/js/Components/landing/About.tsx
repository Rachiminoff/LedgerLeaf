import React, { useEffect, useRef } from 'react';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 border-t border-[#242424]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div
          ref={sectionRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 opacity-0 translate-y-8"
        >
          {/* Left */}
          <div>
            <h2 className="text-[40px] sm:text-[48px] font-light text-white tracking-tight leading-[1.1]">
              Every peso
              <br />
              <span className="text-[#5CB85C]">has a purpose.</span>
            </h2>
            <p className="text-[#9A9A9A] text-base font-light mt-4 leading-relaxed">
              LedgerLeaf encourages intentional budgeting at the moment income is received,
              providing clear allocation tracking across categories.
            </p>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <p className="text-[#9A9A9A] text-base font-light leading-relaxed">
              By allocating funds to predefined categories, you reduce the likelihood
              of overspending and ensure every unit of currency has a defined purpose.
            </p>
            <p className="text-[#9A9A9A] text-base font-light leading-relaxed">
              Whether you're planning for recurring expenses, saving for a goal,
              or simply trying to gain visibility into your spending habits,
              LedgerLeaf gives you the tools to take control.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {['Visibility', 'Structure', 'Discipline', 'Clarity'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-[#5CB85C]">✦</span>
                  <span className="text-sm text-white font-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};