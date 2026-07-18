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
          <h2 className="text-2xl font-light text-white tracking-tight">
            Privacy <span className="text-[#5CB85C] font-medium">Policy</span>
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
            <h3 className="text-lg font-medium text-white">1. Information We Collect</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We collect information to provide better services to our users. The types of information we collect include:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-5">
              <li><span className="text-white">Account Information:</span> Name, email address, and password</li>
              <li><span className="text-white">Financial Data:</span> Transaction history, income, expenses, budgets, and financial goals</li>
              <li><span className="text-white">Usage Data:</span> How you interact with LedgerLeaf features and services</li>
              <li><span className="text-white">Device Information:</span> IP address, browser type, and device identifiers</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">2. How We Use Your Information</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We use your information to deliver, maintain, and improve our services:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-5">
              <li>Provide personalized financial insights and recommendations</li>
              <li>Process transactions and maintain accurate financial records</li>
              <li>Send important notifications about your account and our services</li>
              <li>Improve and optimize the LedgerLeaf experience</li>
              <li>Detect and prevent fraud or security issues</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">3. Data Security</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-5">
              <li><span className="text-white">Encryption:</span> All data is encrypted in transit using TLS 1.3 and at rest using AES-256</li>
              <li><span className="text-white">Access Control:</span> Strict access controls and authentication protocols</li>
              <li><span className="text-white">Monitoring:</span> Continuous monitoring for security threats</li>
              <li><span className="text-white">Backup:</span> Regular secure backups with redundancy</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">4. Data Sharing</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We value your trust and do not sell your personal information. We only share data:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-5">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>With trusted service providers who assist in operating our services</li>
              <li>In an aggregated, anonymized form for analytics</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">5. Your Privacy Rights</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              You have control over your personal information:
            </p>
            <ul className="text-sm text-[#9A9A9A] leading-relaxed space-y-1.5 list-disc pl-5">
              <li><span className="text-white">Access:</span> View and export your data at any time</li>
              <li><span className="text-white">Update:</span> Correct or update your information</li>
              <li><span className="text-white">Delete:</span> Request deletion of your account and associated data</li>
              <li><span className="text-white">Opt-Out:</span> Choose not to receive promotional communications</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">6. Data Retention</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services. 
              After account deletion, data is securely deleted within 30 days, except where legal 
              retention requirements apply.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">7. Cookies and Tracking</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We use cookies to enhance your experience. You can control cookie preferences in your 
              browser settings. Essential cookies are required for core functionality.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">8. Children's Privacy</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              LedgerLeaf is not intended for children under 13. We do not knowingly collect information 
              from children. If you believe we have inadvertently collected data from a child, please 
              contact us immediately.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">9. Changes to This Policy</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              We may update this policy to reflect changes in our practices or legal requirements. 
              We will notify you of significant changes via email or in-app notification.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">10. Contact Us</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              If you have questions about this Privacy Policy, please contact our Data Protection Officer:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-[#9A9A9A]">
                <span className="text-white">Email:</span>{' '}
                <span className="text-[#5CB85C]">privacy@ledgerleaf.com</span>
              </p>
              <p className="text-[#9A9A9A]">
                <span className="text-white">Address:</span>{' '}
                <span className="text-[#9A9A9A]">123 Financial District, Suite 400</span>
              </p>
              <p className="text-[#9A9A9A]">
                <span className="text-white">Response Time:</span>{' '}
                <span className="text-[#9A9A9A]">We respond to all inquiries within 48 hours</span>
              </p>
            </div>
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
            Accept Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}