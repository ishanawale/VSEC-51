import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function ToastNotification({ toasts, onClose }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'error' ? <XCircle size={18} color="#b83232" /> : <CheckCircle2 size={18} color="#1f6f4a" />}
          <span>{t.message}</span>
          <button onClick={() => onClose(t.id)} aria-label="Dismiss"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}
