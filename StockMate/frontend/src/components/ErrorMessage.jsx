import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert error" role="alert">
      <AlertTriangle size={18} />
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && <button className="btn sm" onClick={onRetry}>Retry</button>}
    </div>
  );
}
