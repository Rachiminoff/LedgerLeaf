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
          <h2 className="text-2xl font-light text-white tracking-tight">
            Terms of <span className="text-[#5CB85C] font-medium">Service</span>
          </h2>
          <button
            onClick={onClose}
            className="text-[#9A9A9A] hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-[#242424]"
          >
            <Icon icon="mdi:close" className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Custom Scrollbar Applied */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 modal-scrollbar smooth-scroll">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">1. Acceptance of Terms</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              By creating an account and using LedgerLeaf, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">2. Description of Service</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              LedgerLeaf provides personal finance management tools including expense tracking, 
              budgeting, financial reporting, and analytics. We are committed to helping you 
              achieve financial clarity and smart financial decisions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">3. User Accounts</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to notify us immediately of any unauthorized use of your account. 
              You are solely responsible for all activities that occur under your account.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">4. Data Privacy</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We take your privacy seriously. Your financial data is encrypted and stored securely. 
              We do not sell or share your personal information with third parties without your consent. 
              Please review our Privacy Policy for more details.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">5. User Responsibilities</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              You agree to use LedgerLeaf for lawful purposes only. You are responsible for the 
              accuracy of the financial data you enter. You agree not to:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-5">
              <li>Share your account credentials with others</li>
              <li>Attempt to gain unauthorized access to other users' accounts</li>
              <li>Upload malicious code or content</li>
              <li>Use the service for any illegal activities</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">6. Intellectual Property</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              All content, features, and functionality of LedgerLeaf are owned by LedgerLeaf and 
              are protected by intellectual property laws. You may not copy, modify, or distribute 
              any part of the service without our express permission.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">7. Limitation of Liability</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              LedgerLeaf is provided "as is" without warranties of any kind. We are not liable for 
              any financial decisions you make based on data provided by our service. Always consult 
              with a financial professional for important financial decisions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">8. Changes to Terms</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify you of any 
              significant changes via email or through the application. Your continued use of the 
              service constitutes acceptance of the updated terms.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">9. Contact</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-sm text-[#5CB85C]">
              support@ledgerleaf.com
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#242424] flex-shrink-0">
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
            className="px-6 py-2 bg-[#5CB85C] text-black text-sm font-semibold rounded-xl hover:bg-[#6FCF70] transition-all duration-200 hover:shadow-lg hover:shadow-[#5CB85C]/20 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
}