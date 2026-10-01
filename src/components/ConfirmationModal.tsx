import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  confirmVariant = 'warning',
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                confirmVariant === 'danger'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{message}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                confirmVariant === 'danger'
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950'
              }`}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
