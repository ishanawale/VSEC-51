import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Field from './Field.jsx';
import { CATEGORIES } from '../utils.js';

const EMPTY = { productId: '', name: '', category: '', description: '', price: '', quantity: '0', minimumStock: '5', supplier: '' };

// Used for both "Add product" (product = null) and "Edit product".
export default function ProductForm({ product, onSubmit, onCancel }) {
  const editing = Boolean(product);
  const [form, setForm] = useState(editing ? {
    productId: product.productId, name: product.name, category: product.category,
    description: product.description || '', price: String(product.price),
    quantity: String(product.quantity), minimumStock: String(product.minimumStock), supplier: product.supplier || '',
  } : EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.category) e.category = 'Please choose a category';
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Enter a valid price (0 or more)';
    if (!editing && !/^\d+$/.test(form.quantity)) e.quantity = 'Quantity must be a whole number (0 or more)';
    if (!/^\d+$/.test(form.minimumStock)) e.minimumStock = 'Minimum stock must be a whole number (0 or more)';
    if (form.productId && !/^[A-Za-z0-9-]{1,20}$/.test(form.productId)) e.productId = 'Use letters, numbers and hyphens only';
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
      await onSubmit(form);
    } catch (err) {
      setErrors(err.errors || {});   // field errors from the backend (e.g. duplicate ID)
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cls = (name) => `input ${errors[name] ? 'invalid' : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert error" role="alert">{formError}</div>}
      <div className="form-grid">
        <Field label="Product ID" htmlFor="productId" error={errors.productId} hint={editing ? undefined : 'Leave blank to auto-generate (P001, P002...)'}>
          <input id="productId" name="productId" className={cls('productId')} value={form.productId} onChange={handleChange} placeholder="e.g. P009" />
        </Field>
        <Field label="Product name *" htmlFor="name" error={errors.name}>
          <input id="name" name="name" className={cls('name')} value={form.name} onChange={handleChange} />
        </Field>
        <Field label="Category *" htmlFor="category" error={errors.category}>
          <select id="category" name="category" className={cls('category')} value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Supplier" htmlFor="supplier" error={errors.supplier}>
          <input id="supplier" name="supplier" className={cls('supplier')} value={form.supplier} onChange={handleChange} />
        </Field>
        <Field label="Price (INR) *" htmlFor="price" error={errors.price}>
          <input id="price" name="price" type="number" min="0" step="0.01" className={cls('price')} value={form.price} onChange={handleChange} />
        </Field>
        <Field label="Quantity *" htmlFor="quantity" error={errors.quantity} hint={editing ? 'Change quantity using Stock In / Stock Out so history stays correct' : undefined}>
          <input id="quantity" name="quantity" type="number" min="0" step="1" className={cls('quantity')} value={form.quantity} onChange={handleChange} disabled={editing} />
        </Field>
        <Field label="Minimum stock *" htmlFor="minimumStock" error={errors.minimumStock}>
          <input id="minimumStock" name="minimumStock" type="number" min="0" step="1" className={cls('minimumStock')} value={form.minimumStock} onChange={handleChange} />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description} full>
          <textarea id="description" name="description" className={cls('description')} value={form.description} onChange={handleChange} />
        </Field>
      </div>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting && <Loader2 size={16} className="spin" />} {editing ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}
