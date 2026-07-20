import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Sidebar } from '@/Components/Dashboard/Sidebar';
import { TopNav } from '@/Components/Dashboard/TopNav';
import HelpHeader from '@/Components/Help/HelpHeader';
import HelpSearch from '@/Components/Help/HelpSearch';
import AboutSection from '@/Components/Help/AboutSection';
import GettingStarted from '@/Components/Help/GettingStarted';
import FAQSection from '@/Components/Help/FAQSection';
import FinancialConcepts from '@/Components/Help/FinancialConcepts';
import AppInfo from '@/Components/Help/AppInfo';
import NavigationMenu from '@/Components/Help/NavigationMenu';
import { 
  AboutData, 
  GettingStartedStep, 
  FAQItem, 
  FinancialConcept, 
  AppInfo as AppInfoType 
} from '@/types/help';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toastError } from '@/Components/ui/Toast';

interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export default function HelpCenter({ auth }: PageProps) {
  // ─── State ──────────────────────────────────────────────────────
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('about');
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [gettingStarted, setGettingStarted] = useState<GettingStartedStep[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [concepts, setConcepts] = useState<FinancialConcept[]>([]);
  const [appInfo, setAppInfo] = useState<AppInfoType | null>(null);

  // ─── Hooks ──────────────────────────────────────────────────────
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // ─── Data Loading ──────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        '/data/help/about.json',
        '/data/help/getting-started.json',
        '/data/help/faq.json',
        '/data/help/financial-concepts.json',
        '/data/help/app-info.json'
      ];

      const responses = await Promise.all(
        endpoints.map(url => fetch(url))
      );

      // Check if any response failed
      const failedResponse = responses.find(res => !res.ok);
      if (failedResponse) {
        throw new Error(`Failed to load: ${failedResponse.url}`);
      }

      const [about, gettingStarted, faq, concepts, appInfo] = await Promise.all(
        responses.map(res => res.json())
      );

      setAboutData(about);
      setGettingStarted(gettingStarted);
      setFaqItems(faq);
      setConcepts(concepts);
      setAppInfo(appInfo);
    } catch (error) {
      console.error('Failed to load help data:', error);
      setError('Unable to load help content. Please try again later.');
      toastError('Failed to load help content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    if (confirm('Are you sure you want to log out?')) {
      router.post('/logout');
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const offset = isMobile ? 80 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [isMobile]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // ─── Memoized Filters ──────────────────────────────────────────
  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return faqItems;
    const query = searchQuery.toLowerCase();
    return faqItems.filter(item =>
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [faqItems, searchQuery]);

  const filteredGettingStarted = useMemo(() => {
    if (!searchQuery) return gettingStarted;
    const query = searchQuery.toLowerCase();
    return gettingStarted.filter(step =>
      step.title.toLowerCase().includes(query) ||
      step.description.toLowerCase().includes(query) ||
      step.details.toLowerCase().includes(query)
    );
  }, [gettingStarted, searchQuery]);

  const hasSearchResults = useMemo(() => {
    if (!searchQuery) return true;
    return filteredFAQs.length > 0 || filteredGettingStarted.length > 0;
  }, [searchQuery, filteredFAQs, filteredGettingStarted]);

  // ─── Render Helpers ────────────────────────────────────────────
  const renderLoading = () => (
    <div className="space-y-4 md:space-y-6 mt-4 md:mt-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#111111] border border-[#242424] rounded-xl p-4 md:p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#242424]"></div>
            <div className="h-5 md:h-6 w-32 md:w-48 bg-[#242424] rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 md:h-4 w-full bg-[#242424] rounded"></div>
            <div className="h-3 md:h-4 w-3/4 bg-[#242424] rounded"></div>
            <div className="h-3 md:h-4 w-1/2 bg-[#242424] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNoResults = () => (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-6 md:p-12 text-center mt-4 md:mt-6">
      <div className="text-[#9A9A9A] text-4xl md:text-6xl mb-4">
        <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-base md:text-lg font-medium text-white">No matching help articles found</h3>
      <p className="text-[#9A9A9A] mt-1 text-xs md:text-sm">
        Try adjusting your search terms or browse the sections below.
      </p>
      <button
        onClick={handleClearSearch}
        className="mt-3 md:mt-4 px-3 md:px-4 py-1.5 md:py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm md:text-base"
      >
        Clear Search
      </button>
    </div>
  );

  const renderContent = () => (
    <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
      {/* About Section */}
      {aboutData && (searchQuery === '' || 
        aboutData.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aboutData.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aboutData.keyFeatures.some(f => 
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) && (
        <section id="about" className="scroll-mt-20 md:scroll-mt-24">
          <AboutSection data={aboutData} />
        </section>
      )}

      {/* Getting Started Section */}
      {filteredGettingStarted.length > 0 && (
        <section id="getting-started" className="scroll-mt-20 md:scroll-mt-24">
          <GettingStarted steps={filteredGettingStarted} />
        </section>
      )}

      {/* FAQ Section */}
      {filteredFAQs.length > 0 && (
        <section id="faq" className="scroll-mt-20 md:scroll-mt-24">
          <FAQSection items={filteredFAQs} />
        </section>
      )}

      {/* Financial Concepts Section */}
      {searchQuery === '' && concepts.length > 0 && (
        <section id="concepts" className="scroll-mt-20 md:scroll-mt-24">
          <FinancialConcepts concepts={concepts} />
        </section>
      )}

      {/* App Info Section */}
      {appInfo && (searchQuery === '' || 
        appInfo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appInfo.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ) && (
        <section id="app-info" className="scroll-mt-20 md:scroll-mt-24">
          <AppInfo data={appInfo} />
        </section>
      )}
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <>
      <Head title="Help Center | LedgerLeaf" />

      <div className="min-h-screen bg-[#000000] font-['Inter',system-ui,sans-serif]">
        <Sidebar 
          activePage="help" 
          onLogout={handleLogout}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="lg:ml-[280px] min-h-screen">
          <TopNav
            title="Help Center"
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            notificationCount={0}
          />

          <main className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <HelpHeader />

              {/* Search - Full width on mobile */}
              <div className="mt-3 md:mt-4">
                <HelpSearch 
                  onSearch={handleSearch} 
                  loading={loading}
                  value={searchQuery}
                />
              </div>

              {/* Navigation - Sticky on mobile */}
              <div className="sticky top-0 z-10 bg-[#000000] pt-2 md:pt-0 pb-2 md:pb-0">
                <NavigationMenu 
                  activeSection={activeSection} 
                  onSectionChange={handleSectionChange}
                  isMobile={isMobile}
                />
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-[#111111] border border-[#FF5A5A]/20 rounded-xl p-4 md:p-6 mt-4 md:mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FF5A5A]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-[#FF5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm md:text-base">Error Loading Content</h4>
                      <p className="text-[#9A9A9A] text-xs md:text-sm">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={loadData}
                    className="mt-3 md:mt-4 px-3 md:px-4 py-1.5 md:py-2 bg-[#5CB85C] text-black rounded-lg hover:bg-[#6FCF70] transition-colors text-sm md:text-base"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Main Content */}
              {loading ? (
                renderLoading()
              ) : !hasSearchResults ? (
                renderNoResults()
              ) : (
                renderContent()
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}