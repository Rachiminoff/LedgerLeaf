import React from 'react';

interface DarkLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const DarkLayout: React.FC<DarkLayoutProps> = ({
  children,
  title,
  subtitle,
  headerTitle,
  headerSubtitle,
}) => {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center font-['Inter',system-ui,sans-serif] p-4 sm:p-6 overflow-hidden">
      
      {/* Centered Container */}
      <div className="w-full max-w-[1440px] relative min-h-[90vh] flex items-center">
        
        {/* Left Branding Section - Hidden on mobile/tablet */}
        <div className="hidden lg:block absolute left-0 w-[45%] flex items-start justify-center" style={{ top: '22%', transform: 'translateY(-50%)' }}>
          
          {/* Logo Block */}
          <div className="flex flex-col items-center text-center space-y-0.5">
            
            {/* Owl Logo - Responsive size */}
            <div className="relative">
              <img 
                src="/assets/images/logo.png" 
                alt="LedgerLeaf Logo" 
                className="w-[100px] xl:w-[140px] h-[100px] xl:h-[140px] object-contain"
              />
            </div>
            
            {/* Brand Name - Responsive size */}
            <h1 className="text-[56px] xl:text-[80px] font-light tracking-tight leading-none text-center mt-0.5">
              <span className="text-white">Ledger</span>
              <span className="text-[#5CB85C] font-medium">Leaf</span>
            </h1>
            
            {/* Subtitle - Responsive size */}
            <p className="text-[#9A9A9A] text-base xl:text-lg font-light tracking-wide text-center mt-0.5">
              Smart records. Clear future.
            </p>
          </div>
        </div>

        {/* Branch Illustration - Responsive sizing */}
        <div className="hidden lg:block absolute bottom-[-30px] left-[20px] w-[500px] xl:w-[700px] h-[350px] xl:h-[500px] pointer-events-none overflow-hidden">
          <img 
            src="/assets/images/branch.png" 
            alt="Decorative branch" 
            className="w-full h-full object-contain object-bottom opacity-30 xl:opacity-40"
            style={{ transform: 'scaleX(1.2)' }}
          />
        </div>

        {/* Right Section - Authentication Card */}
        <div className="w-full lg:w-[55%] lg:ml-auto flex items-center justify-center lg:justify-end lg:pr-8">
          <div className="w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[580px] px-2 sm:px-0">
            
            {/* Logo for mobile/tablet */}
            <div className="lg:hidden text-center mb-6 sm:mb-8">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <img 
                  src="/assets/images/logo.png" 
                  alt="LedgerLeaf Logo" 
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                />
                <h1 className="text-2xl sm:text-4xl font-light">
                  <span className="text-white">Ledger</span>
                  <span className="text-[#5CB85C] font-medium">Leaf</span>
                </h1>
              </div>
            </div>

            {/* Login Card - Responsive padding */}
            <div className="bg-[#111111] rounded-2xl sm:rounded-3xl border border-[#222222] shadow-xl p-6 sm:p-8 lg:p-10">
              
              {/* Card Header - Responsive sizing */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-light text-white tracking-tight leading-tight">
                  {headerTitle || title}
                </h2>
                <p className="text-[#9A9A9A] text-xs sm:text-sm font-light tracking-wide mt-1">
                  {headerSubtitle || subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};