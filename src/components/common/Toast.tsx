import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-200'
              : toast.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/90 dark:border-blue-800 dark:text-blue-200'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-200'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div className="flex-1 leading-snug">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-slate-700 transition"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
