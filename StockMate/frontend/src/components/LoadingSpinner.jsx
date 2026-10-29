import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status">
      <Loader2 className="spin" size={28} />
      <span>{text}</span>
    </div>
  );
}
