import React, { useState } from 'react';
import { DEALERSHIP } from '../../config/dealership';
import { getWhatsAppGeneralUrl } from '../../utils/formatters';
import { X, Send } from 'lucide-react';

// Authentic Official WhatsApp Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-.893-.797-1.496-1.782-1.672-2.083-.175-.3-.019-.463.132-.612.136-.135.301-.35.452-.526.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.587-.492-.507-.677-.517-.175-.01-.376-.01-.577-.01s-.527.075-.802.376c-.276.3-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.542.718.31 1.278.495 1.714.634.722.23 1.379.197 1.898.12.578-.086 1.78-.728 2.031-1.43.251-.703.251-1.304.175-.1.43-.075-.125-.276-.2-.577-.35z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.982-1.402A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.163 8.163 0 01-4.34-1.238l-.312-.192-2.955.83.84-2.88-.2-.318A8.164 8.164 0 013.8 12c0-4.529 3.671-8.2 8.2-8.2s8.2 3.671 8.2 8.2-3.671 8.2-8.2 8.2z"
    />
  </svg>
);

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickPrompts = [
    'Is doorstep test drive available today?',
    'What is the minimum down payment required?',
    'Can I trade-in my old car?',
    'Show me certified SUVs under ₹15 Lakh',
  ];

  const handlePromptClick = (prompt: string) => {
    const url = getWhatsAppGeneralUrl(prompt);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-[#128C7E]"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{DEALERSHIP.name} Concierge</h4>
                <p className="text-[11px] text-emerald-100">Typically replies in under 5 minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 space-y-3">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none shadow-sm text-xs text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/60 leading-relaxed">
              👋 Namaste! Welcome to <strong>{DEALERSHIP.name}</strong>. How can our vehicle specialist assist you today?
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Quick questions:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 dark:hover:border-emerald-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 transition flex items-center justify-between group shadow-2xs"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Start WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Circular Action Button (FAB - No Text, Premium Aesthetics) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-xl hover:scale-108 focus:outline-none ${
          isOpen
            ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/30 ring-2 ring-slate-700'
            : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25D366]/40 hover:shadow-2xl hover:shadow-[#25D366]/50 ring-4 ring-white/60 dark:ring-slate-900/60'
        }`}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <>
            {/* Live Indicator Pulse on the corner */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 ring-2 ring-white dark:ring-slate-900"></span>
            </span>

            {/* Authentic WhatsApp Icon */}
            <WhatsAppIcon className="w-7 h-7 fill-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />

            {/* Sleek Tooltip on hover (desktop only, no permanent text clutter) */}
            <span className="pointer-events-none absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg backdrop-blur-xs hidden sm:flex items-center gap-1.5">
              <span>WhatsApp</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};
