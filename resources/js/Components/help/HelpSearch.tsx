import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface HelpSearchProps {
  onSearch: (query: string) => void;
  loading: boolean;
  value?: string;
}

export default function HelpSearch({ onSearch, loading, value }: HelpSearchProps) {
  const [query, setQuery] = useState(value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(value ?? '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Focus on search input with keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="relative">
          <div className="w-full h-12 bg-[#111111] border border-[#242424] rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Icon 
          icon="mdi:magnify" 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles... (Ctrl+K)"
          className="w-full bg-[#111111] border border-[#242424] rounded-xl px-11 py-3 text-white placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#5CB85C] transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white transition-colors"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        )}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#9A9A9A] bg-[#1A1A1A] px-2 py-1 rounded border border-[#242424] hidden sm:block">
          ⌘K
        </div>
      </div>
    </div>
  );
}