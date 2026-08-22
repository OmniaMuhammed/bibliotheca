import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1090, maxWidth: '380px', width: '100%' }}
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />;
            case 'danger':
              return <AlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />;
            case 'warning':
              return <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />;
            default:
              return <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-emerald-50 text-emerald-950';
            case 'danger':
              return 'border-rose-200 bg-rose-50 text-rose-950';
            case 'warning':
              return 'border-amber-200 bg-amber-50 text-amber-950';
            default:
              return 'border-blue-200 bg-blue-50 text-blue-950';
          }
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`shadow-lg border rounded-xl p-3 mb-2 d-flex items-start gap-3 transition-all duration-300 ${getBorderColor()}`}
            role="alert"
          >
            {getIcon()}
            <div className="flex-grow-1 min-w-0">
              <div className="fw-bold text-sm">{toast.title}</div>
              <div className="text-xs opacity-90 mt-0.5 break-words">{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="btn btn-sm p-0 text-muted hover:text-dark border-0 bg-transparent"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
