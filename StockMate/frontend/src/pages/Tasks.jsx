import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api.js';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { PRIORITIES } from '../utils.js';

export default function Tasks() {
  const toast = useToast();
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.tasks.list(filters)
      .then((res) => { if (!cancelled) { setTasks(res.tasks); setCounts(res.counts); setError(''); } })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filters, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const handleSave = async (form) => {
    if (editing) { await api.tasks.update(editing._id, form); toast.success('Task updated'); }
    else { await api.tasks.create(form); toast.success('Task added'); }
    closeForm();
    reload();
  };

  const handleToggle = async (task) => {
    try {
      await api.tasks.update(task._id, { completed: !task.completed });
      reload();
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.tasks.remove(deleting._id);
      toast.success('Task deleted');
      setDeleting(null);
      reload();
    } catch (e) { toast.error(e.message); }
    finally { setDeleteBusy(false); }
  };

  const filtered = filters.status || filters.priority;

  return (
    <>
      <div className="page-head">
        <div className="actions-row">
          <span className="badge gray">Pending: {counts.pending}</span>
          <span className="badge green">Completed: {counts.completed}</span>
        </div>
        <button className="btn primary" onClick={() => setFormOpen(true)}><Plus size={16} /> Add Task</button>
      </div>

      <div className="toolbar">
        <select className="input" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} aria-label="Filter by status">
          <option value="">All statuses</option><option value="pending">Pending</option><option value="completed">Completed</option>
        </select>
        <select className="input" value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} aria-label="Filter by priority">
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        {filtered && <button className="btn" onClick={() => setFilters({ status: '', priority: '' })}>Clear filters</button>}
      </div>

      <div className="card">
        {error ? <ErrorMessage message={error} onRetry={reload} />
          : loading ? <LoadingSpinner text="Loading tasks..." />
          : tasks.length === 0 ? <EmptyState title={filtered ? 'No matching tasks' : 'No tasks yet'} message={filtered ? 'Try clearing the filters.' : 'Add a task such as "Count electronics stock".'} />
          : <TaskList tasks={tasks} onToggle={handleToggle} onEdit={(t) => { setEditing(t); setFormOpen(true); }} onDelete={setDeleting} />}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Edit task' : 'Add task'} onClose={closeForm}>
          <TaskForm task={editing} onSubmit={handleSave} onCancel={closeForm} />
        </Modal>
      )}
      {deleting && (
        <ConfirmationModal title="Delete task?" message={`Delete "${deleting.title}"?`} busy={deleteBusy} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
