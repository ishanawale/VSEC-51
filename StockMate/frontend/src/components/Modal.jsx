import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, small, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${small ? 'sm' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="btn icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
