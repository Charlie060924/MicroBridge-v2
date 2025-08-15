"use client";

import { useEffect } from 'react';
import { X } from 'lucide-react';
import ContactSupportForm from './ContactSupportForm';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'student' | 'employer';
}

export default function ContactSupportModal({ 
  isOpen, 
  onClose, 
  userRole = 'student' 
}: ContactSupportModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Modal content */}
          <div className="relative">
            <ContactSupportForm 
              userRole={userRole} 
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}