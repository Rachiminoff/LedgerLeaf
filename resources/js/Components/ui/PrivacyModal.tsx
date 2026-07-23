import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function PrivacyModal({
  isOpen,
  onClose,
  onAccept,
}: PrivacyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-[#1A1A1A] rounded-2xl border border-[#242424] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#242424] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
              <Icon icon="mdi:shield-check" className="h-5 w-5 text-[#5CB85C]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Privacy Policy
              </h2>
              <p className="text-xs text-[#6B7280]">Last Updated: July 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9A9A9A] hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-[#242424]"
            aria-label="Close"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 modal-scrollbar smooth-scroll">
          {/* Introduction */}
          <div className="bg-[#5CB85C]/5 border border-[#5CB85C]/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information-outline" className="h-5 w-5 text-[#5CB85C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#9A9A9A] leading-relaxed">
                  <span className="text-white font-medium">Introduction</span>
                  <br />
                  LedgerLeaf respects your privacy. This Privacy Policy explains how we collect, 
                  use, and protect your personal information when you use our services. 
                  By using LedgerLeaf, you consent to the practices described in this policy.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              1. Information We Collect
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We collect the following types of information to provide and improve our services:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>
                <span className="text-white">Account Information:</span> Name, email address, 
                and authentication credentials required for account creation and management
              </li>
              <li>
                <span className="text-white">Financial Data:</span> Transaction history, income, 
                expenses, budgets, savings goals, and financial preferences you voluntarily provide
              </li>
              <li>
                <span className="text-white">Usage Data:</span> Information about how you interact 
                with LedgerLeaf features and services
              </li>
              <li>
                <span className="text-white">Technical Data:</span> IP address, browser type, 
                device information, and system activity logs
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              2. How We Use Your Information
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              The information we collect is used for the following purposes:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>Provide, maintain, and improve LedgerLeaf services</li>
              <li>Generate personalized financial insights and recommendations</li>
              <li>Process transactions and maintain accurate financial records</li>
              <li>Send important notifications regarding your account and our services</li>
              <li>Detect, prevent, and address technical issues or security incidents</li>
              <li>Comply with legal obligations and regulatory requirements</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              3. Data Storage & Security
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We implement standard security measures to protect your data, including:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>
                <span className="text-white">Encryption:</span> Data is encrypted during transmission 
                using HTTPS/TLS protocols
              </li>
              <li>
                <span className="text-white">Access Control:</span> Secure authentication protocols 
                to prevent unauthorized access
              </li>
              <li>
                <span className="text-white">Monitoring:</span> Regular monitoring for security 
                threats and vulnerabilities
              </li>
              <li>
                <span className="text-white">Backup:</span> Regular backups to prevent data loss
              </li>
            </ul>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4 mt-2">
              Please note that no method of transmission over the internet is 100% secure. 
              While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              4. Data Sharing & Disclosure
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We do not sell or rent your personal information. We may share your data in the 
              following circumstances:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>
                <span className="text-white">With Your Consent:</span> When you have explicitly 
                consented to the sharing of your information
              </li>
              <li>
                <span className="text-white">Service Providers:</span> With trusted third-party 
                service providers who assist in operating our services
              </li>
              <li>
                <span className="text-white">Legal Compliance:</span> When required to comply 
                with applicable laws, regulations, or legal processes
              </li>
              <li>
                <span className="text-white">Aggregated Data:</span> In an anonymized, aggregated 
                form for analytical and research purposes
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              5. Your Privacy Rights
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>
                <span className="text-white">Right to Access:</span> View and export your 
                personal data at any time
              </li>
              <li>
                <span className="text-white">Right to Rectification:</span> Correct or update 
                inaccurate or incomplete information
              </li>
              <li>
                <span className="text-white">Right to Deletion:</span> Request permanent deletion 
                of your account and associated data
              </li>
              <li>
                <span className="text-white">Right to Opt-Out:</span> Choose not to receive 
                promotional communications
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              6. Data Retention
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We retain your personal information for as long as your account remains active or 
              as necessary to provide our services. Upon account deletion, your data will be 
              permanently removed from our systems, except where legal retention requirements apply.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              7. Cookies & Tracking
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We use essential cookies to enhance your experience and enable core functionality. 
              You may control cookie preferences through your browser settings. Essential cookies 
              are required for authentication and service operation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              8. Children's Privacy
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              LedgerLeaf is not intended for use by individuals under the age of 13. We do not 
              knowingly collect personal information from children. If you believe we have 
              inadvertently collected data from a child, please contact us immediately.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              9. Policy Updates
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We reserve the right to update this Privacy Policy to reflect changes in our practices 
              or legal requirements. We will notify you of significant changes via email or through 
              the application. Your continued use of LedgerLeaf constitutes acceptance of the 
              updated policy.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              10. Contact Us
            </h3>
            <div className="pl-4 space-y-2 text-sm text-[#9A9A9A]">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
              <div className="space-y-1">
                <p>
                  <span className="text-white">Email:</span>{' '}
                  <a 
                    href="mailto:tdy.alhassan@gmail.com" 
                    className="text-[#5CB85C] hover:text-[#6FCF70] transition-colors"
                  >
                    tdy.alhassan@gmail.com
                  </a>
                </p>
                <p>
                  <span className="text-white">Response Time:</span>{' '}
                  <span className="text-[#9A9A9A]">We respond to all inquiries within 48 hours</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#242424] flex-shrink-0">
          <p className="text-xs text-[#6B7280]">
            By accepting, you agree to our Privacy Policy
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#9A9A9A] hover:text-white transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={() => {
                if (onAccept) onAccept();
                onClose();
              }}
              className="px-6 py-2 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Icon icon="mdi:check" className="h-4 w-4" />
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}