import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function TermsModal({
  isOpen,
  onClose,
  onAccept,
}: TermsModalProps) {
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
              <Icon icon="mdi:file-document-outline" className="h-5 w-5 text-[#5CB85C]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Terms of Service
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
                  These Terms of Service govern your use of LedgerLeaf. By creating an account 
                  and using our services, you agree to be bound by these terms. Please read them carefully.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              1. Acceptance of Terms
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              By accessing or using LedgerLeaf, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any part of these 
              terms, you must not use our services. Your continued use constitutes acceptance of 
              any future modifications to these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              2. User Accounts
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account. You agree to:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>Provide accurate and complete registration information</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Not share your account credentials with any third party</li>
              <li>Be solely responsible for all actions taken under your account</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              3. User Obligations
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              You agree to use LedgerLeaf in accordance with all applicable laws and regulations. 
              You shall not:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Interfere with or disrupt the integrity of the service</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              4. Intellectual Property
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              LedgerLeaf and its entire contents, features, and functionality are owned by the 
              developer and are protected by intellectual property laws. You are granted a 
              limited, non-exclusive, non-transferable license to use the service for personal, 
              non-commercial purposes. You may not:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>Copy, modify, or distribute any part of the service</li>
              <li>Reverse engineer or decompile the software</li>
              <li>Use any automated systems to access the service</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              5. Data Privacy
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              Your privacy is important to us. Our collection, use, and disclosure of your personal 
              information is governed by our Privacy Policy. By using LedgerLeaf, you consent to 
              the collection and use of your information as described in the Privacy Policy.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              6. Limitation of Liability
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              LedgerLeaf is provided on an "as is" and "as available" basis. To the fullest extent 
              permitted by law, we disclaim all warranties, express or implied. We are not liable for:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-8">
              <li>Any financial decisions made based on data provided by the service</li>
              <li>Loss or corruption of data</li>
              <li>Interruption or cessation of service</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              7. Termination
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We reserve the right to suspend or terminate your account at our sole discretion, 
              without prior notice, for any conduct that we believe violates these terms or is 
              harmful to other users, us, or third parties. Upon termination, your right to use 
              the service will immediately cease.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              8. Modifications to Terms
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              We reserve the right to update or modify these terms at any time without prior 
              notice. The most current version will always be available within the application. 
              Your continued use of LedgerLeaf after any changes constitutes your acceptance of 
              the new terms.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              9. Governing Law
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed pl-4">
              These terms shall be governed by and construed in accordance with the laws of the 
              Philippines. Any disputes arising under these terms shall be subject to the exclusive 
              jurisdiction of the courts of the Philippines.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB85C]" />
              10. Contact Information
            </h3>
            <div className="pl-4 space-y-2 text-sm text-[#9A9A9A]">
              <p>If you have any questions regarding these Terms of Service, please contact us:</p>
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
            By accepting, you agree to these Terms of Service
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