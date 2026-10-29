import { Inbox } from 'lucide-react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty">
      <Inbox size={38} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
