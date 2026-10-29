import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { formatDate } from '../utils.js';

const PRIORITY_CLASS = { High: 'red', Medium: 'amber', Low: 'gray' };

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  return (
    <div className="list">
      {tasks.map((t) => {
        const overdue = !t.completed && t.dueDate && new Date(t.dueDate) < startOfToday;
        return (
          <div key={t._id} className={`task ${t.completed ? 'done' : ''}`}>
            <input type="checkbox" checked={t.completed} onChange={() => onToggle(t)} aria-label={`Mark "${t.title}" as ${t.completed ? 'pending' : 'completed'}`} />
            <div className="task-body">
              <div className="task-title">{t.title}{t.isSample && <span className="sample-tag">Sample</span>}</div>
              {t.description && <div className="muted small">{t.description}</div>}
              <div className="actions-row small" style={{ marginTop: 6, alignItems: 'center' }}>
                <span className={`badge ${PRIORITY_CLASS[t.priority]}`}>{t.priority}</span>
                {t.dueDate && <span className={overdue ? 'overdue' : 'muted'}><CalendarDays size={13} style={{ verticalAlign: '-2px' }} /> {formatDate(t.dueDate)}{overdue ? ' (overdue)' : ''}</span>}
                <span className={`badge ${t.completed ? 'green' : 'gray'}`}>{t.completed ? 'Completed' : 'Pending'}</span>
              </div>
            </div>
            <div className="icon-actions">
              <button className="btn icon" onClick={() => onEdit(t)} aria-label={`Edit ${t.title}`}><Pencil size={16} /></button>
              <button className="btn icon" onClick={() => onDelete(t)} aria-label={`Delete ${t.title}`}><Trash2 size={16} color="#b83232" /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
