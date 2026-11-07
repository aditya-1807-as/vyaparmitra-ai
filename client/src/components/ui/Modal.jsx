import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={onClose}
      />

      {/* Modal Dialog Content (Dark Theme Surface) */}
      <div className={`relative bg-[#142319] text-[#F5EFE6] rounded-3xl shadow-popover w-full ${maxWidth} z-10 overflow-hidden border border-[#243D2D] transform transition-all animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#243D2D] bg-[#0E1B13]">
          <div>
            <h3 className="text-base font-bold text-[#E8DCC4] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-[#9EAEA3] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9EAEA3] hover:text-[#F5EFE6] hover:bg-[#18291E] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
