import React from 'react';
import { router } from '@inertiajs/react';
import { Navigation } from '@/Components/landing/Navigation';
import { Hero } from '@/Components/landing/Hero';
import { Features } from '@/Components/landing/Features';
import { About } from '@/Components/landing/About';
import { Statistics } from '@/Components/landing/Statistics';
import { CTA } from '@/Components/landing/CTA';
import { Footer } from '@/Components/landing/Footer';

const LandingPage: React.FC = () => {
  const handleLogin = () => {
    router.visit('/login');
  };

  const handleGetStarted = () => {
    router.visit('/signup');
  };

  const handleLearnMore = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateAccount = () => {
    router.visit('/signup');
  };

  return (
    <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif] overflow-x-hidden">
      {/* Background Branch - Subtle Decorative Element */}
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] pointer-events-none opacity-[0.03] z-0">
        <img
          src="/assets/images/branch.png"
          alt=""
          className="w-full h-full object-contain object-bottom"
          style={{ transform: 'scaleX(1.2)' }}
        />
      </div>

      <Navigation
        onLoginClick={handleLogin}
        onGetStartedClick={handleGetStarted}
      />

      <main className="relative z-10">
        <Hero
          onGetStartedClick={handleGetStarted}
          onLearnMoreClick={handleLearnMore}
        />
        <Features />
        <About />
        <Statistics />
        <CTA
          onCreateAccountClick={handleCreateAccount}
          onLoginClick={handleLogin}
        />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;