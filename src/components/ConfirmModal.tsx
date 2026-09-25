import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onCancel}
    >
      <div 
        className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex items-start gap-3.5">
          <div 
            className={`p-2.5 rounded-xl shrink-0 ${
              isDanger 
                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                : isWarning 
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-5 h-5 text-rose-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 id="confirm-modal-title" className="text-sm font-bold text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : isWarning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
