import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

interface NavigationProps {
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onLoginClick,
  onGetStartedClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    } else {
      router.visit(href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#000000]/90 backdrop-blur-md border-b border-[#242424]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <button
          onClick={() => router.visit('/')}
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
          aria-label="Go to homepage"
        >
          <img
            src="/assets/images/logo.png"
            alt="LedgerLeaf Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white text-xl font-light tracking-tight">
            Ledger<span className="text-[#5CB85C] font-medium">Leaf</span>
          </span>
        </button>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigation(link.href)}
              className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200 font-light tracking-wide"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions - Right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => {
              if (onLoginClick) onLoginClick();
              else router.visit('/login');
            }}
            className="px-4 py-2 text-sm font-medium text-white hover:text-[#5CB85C] transition-colors duration-200"
          >
            Login
          </button>
          <button
            onClick={() => {
              if (onGetStartedClick) onGetStartedClick();
              else router.visit('/signup');
            }}
            className="px-5 py-2 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-[#5CB85C] transition-colors duration-200 p-2 -mr-2"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <Icon
            icon={isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'}
            className="h-6 w-6"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-[#111111] border-b border-[#242424] transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigation(link.href)}
              className="text-sm text-[#9A9A9A] hover:text-white transition-colors duration-200 font-light tracking-wide py-2 text-left border-b border-[#242424]/50 last:border-0"
            >
              {link.label}
            </button>
          ))}
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onLoginClick) onLoginClick();
                else router.visit('/login');
              }}
              className="w-full px-4 py-3 text-sm font-medium text-white hover:text-[#5CB85C] transition-colors duration-200 border border-[#242424] rounded-xl hover:border-[#5CB85C]"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onGetStartedClick) onGetStartedClick();
                else router.visit('/signup');
              }}
              className="w-full px-5 py-3 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Also export as default for flexibility
export default Navigation;