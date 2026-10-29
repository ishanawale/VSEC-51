import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Field from './Field.jsx';
import { PRIORITIES } from '../utils.js';

export default function TaskForm({ task, onSubmit, onCancel }) {
  const editing = Boolean(task);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    setFormError('');
    if (!form.title.trim()) { setErrors({ title: 'Title is required' }); return; }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert error" role="alert">{formError}</div>}
      <div className="form-grid">
        <Field label="Title *" htmlFor="title" error={errors.title} full>
          <input id="title" name="title" className={`input ${errors.title ? 'invalid' : ''}`} value={form.title} onChange={handleChange} />
        </Field>
        <Field label="Priority" htmlFor="priority" error={errors.priority}>
          <select id="priority" name="priority" className="input" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
          <input id="dueDate" name="dueDate" type="date" className="input" value={form.dueDate} onChange={handleChange} />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description} full>
          <textarea id="description" name="description" className="input" value={form.description} onChange={handleChange} />
        </Field>
      </div>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting && <Loader2 size={16} className="spin" />} {editing ? 'Save task' : 'Add task'}
        </button>
      </div>
    </form>
  );
}
