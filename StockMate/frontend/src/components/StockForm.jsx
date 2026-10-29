import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Field from './Field.jsx';
import api from '../services/api.js';
import { IN_REASONS, OUT_REASONS, formatNumber } from '../utils.js';

// One form used for both Stock In and Stock Out (see StockInForm / StockOutForm).
export default function StockForm({ type, products, onSuccess }) {
  const isIn = type === 'IN';
  const reasons = isIn ? IN_REASONS : OUT_REASONS;
  const initial = { product: '', quantity: '', reason: reasons[0], notes: '' };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selected = products.find((p) => p._id === form.product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.product) e.product = 'Please select a product';
    if (!/^\d+$/.test(form.quantity) || Number(form.quantity) < 1) e.quantity = 'Enter a whole number greater than 0';
    else if (!isIn && selected && Number(form.quantity) > selected.quantity) e.quantity = `Only ${selected.quantity} unit(s) available`;
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    setFormError('');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const result = await (isIn ? api.stock.stockIn(form) : api.stock.stockOut(form));
      setForm(initial);
      onSuccess(result);
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <div className="card-head"><h2>{isIn ? 'Stock In' : 'Stock Out'}</h2><span className={`badge ${isIn ? 'green' : 'amber'}`}>{isIn ? 'Add stock' : 'Remove stock'}</span></div>
      {formError && <div className="alert error" role="alert">{formError}</div>}
      <div className="stack" style={{ gap: 12 }}>
        <Field label="Product *" htmlFor={`product-${type}`} error={errors.product} hint={selected ? `Current stock: ${formatNumber(selected.quantity)}` : undefined}>
          <select id={`product-${type}`} name="product" className={`input ${errors.product ? 'invalid' : ''}`} value={form.product} onChange={handleChange}>
            <option value="">Select product</option>
            {products.map((p) => <option key={p._id} value={p._id}>{p.productId} - {p.name}</option>)}
          </select>
        </Field>
        <Field label={isIn ? 'Quantity to add *' : 'Quantity to remove *'} htmlFor={`qty-${type}`} error={errors.quantity}>
          <input id={`qty-${type}`} name="quantity" type="number" min="1" step="1" className={`input ${errors.quantity ? 'invalid' : ''}`} value={form.quantity} onChange={handleChange} />
        </Field>
        <Field label="Reason *" htmlFor={`reason-${type}`} error={errors.reason}>
          <select id={`reason-${type}`} name="reason" className="input" value={form.reason} onChange={handleChange}>
            {reasons.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Notes (optional)" htmlFor={`notes-${type}`} error={errors.notes}>
          <textarea id={`notes-${type}`} name="notes" className="input" value={form.notes} onChange={handleChange} />
        </Field>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={submitting || products.length === 0}>
          {submitting && <Loader2 size={16} className="spin" />} {isIn ? 'Record Stock In' : 'Record Stock Out'}
        </button>
      </div>
    </form>
  );
}
