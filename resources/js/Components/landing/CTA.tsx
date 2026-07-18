import React from 'react';
import { router } from '@inertiajs/react';

interface CTAProps {
  onCreateAccountClick?: () => void;
  onLoginClick?: () => void;
}

export const CTA: React.FC<CTAProps> = ({
  onCreateAccountClick,
  onLoginClick,
}) => {
  return (
    <section className="py-24 border-t border-[#242424]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-[#111111] rounded-3xl border border-[#242424] p-12 md:p-16 text-center">
          <h2 className="text-[40px] sm:text-[48px] font-light text-white tracking-tight leading-[1.1]">
            Ready to give every
            <br />
            <span className="text-[#5CB85C]">peso a purpose?</span>
          </h2>
          <p className="text-[#9A9A9A] text-base font-light mt-4 max-w-md mx-auto">
            Start budgeting intentionally. Get clarity, build discipline, and achieve your financial goals.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => router.visit('/signup')}
              className="px-8 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create an Account
            </button>
            <button
              onClick={() => router.visit('/login')}
              className="px-8 py-3 bg-transparent text-white text-sm font-medium border border-[#242424] rounded-xl hover:border-[#5CB85C] hover:text-[#5CB85C] transition-all duration-200"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};