import { Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';

export default function ConfirmationModal({ title, message, confirmText = 'Delete', busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} small>
      <p>{message}</p>
      <div className="form-actions">
        <button className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn danger" onClick={onConfirm} disabled={busy}>
          {busy && <Loader2 size={16} className="spin" />} {confirmText}
        </button>
      </div>
    </Modal>
  );
}
