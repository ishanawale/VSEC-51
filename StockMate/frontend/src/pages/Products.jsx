import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, Search, X, AlertTriangle } from 'lucide-react';
import api from '../services/api.js';
import ProductForm from '../components/ProductForm.jsx';
import ProductTable from '../components/ProductTable.jsx';
import ProductDetails from '../components/ProductDetails.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { useToast } from '../hooks/useToast.jsx';
import { CATEGORIES } from '../utils.js';

const DEFAULT_FILTERS = { search: '', category: '', status: '', sortBy: 'name', order: 'asc' };

export default function Products() {
  const [params] = useSearchParams();
  const toast = useToast();

  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, search: params.get('search') || '', status: params.get('status') || '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 300);

  // React to links such as /products?search=mouse, /products?status=attention, /products?add=1
  useEffect(() => {
    setFilters((f) => ({ ...f, search: params.get('search') || '', status: params.get('status') || '' }));
    setPage(1);
    if (params.get('add') === '1') { setEditing(null); setFormOpen(true); }
  }, [params]);

  // Load products from the backend whenever a filter, page or reload counter changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.products
      .list({ search: debouncedSearch, category: filters.category, status: filters.status, sortBy: filters.sortBy, order: filters.order, page, limit: 10 })
      .then((res) => { if (!cancelled) { setData(res); setError(''); } })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedSearch, filters.category, filters.status, filters.sortBy, filters.order, page, reloadKey]);

  const updateFilter = (key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };
  const clearFilters = () => { setFilters(DEFAULT_FILTERS); setPage(1); };
  const filtersActive = filters.search || filters.category || filters.status;

  const handleSave = async (form) => {
    if (editing) {
      await api.products.update(editing._id, form);
      toast.success('Product updated');
    } else {
      await api.products.create(form);
      toast.success('Product added');
    }
    setFormOpen(false);
    setEditing(null);
    setReloadKey((k) => k + 1);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.products.remove(deleting._id);
      toast.success(`"${deleting.name}" deleted`);
      setDeleting(null);
      if (data.products.length === 1 && page > 1) setPage(page - 1);
      setReloadKey((k) => k + 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <p className="muted" style={{ margin: 0 }}>{data.total} product{data.total === 1 ? '' : 's'} found</p>
        <button className="btn primary" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={16} /> Add Product</button>
      </div>

      <div className="toolbar">
        <div className="search-box grow">
          <Search size={16} />
          <input className="input" placeholder="Search by product ID or name" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} aria-label="Search products" />
        </div>
        <select className="input" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} aria-label="Filter by stock status">
          <option value="">All statuses</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="attention">Needs replenishment</option>
        </select>
        <select className="input" value={filters.sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)} aria-label="Sort by">
          <option value="name">Sort: Name</option>
          <option value="quantity">Sort: Quantity</option>
          <option value="price">Sort: Price</option>
        </select>
        <select className="input" value={filters.order} onChange={(e) => updateFilter('order', e.target.value)} aria-label="Sort order">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        {filtersActive && <button className="btn" onClick={clearFilters}><X size={15} /> Clear filters</button>}
      </div>

      {filters.status === 'attention' && (
        <div className="alert warn"><AlertTriangle size={16} /> Showing products that are low or out of stock and need replenishment.</div>
      )}

      {error ? (
        <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : data.products.length === 0 ? (
        <div className="card">
          {filtersActive ? (
            <EmptyState title="No matching products" message="Try a different search or clear the filters." action={<button className="btn" onClick={clearFilters}>Clear filters</button>} />
          ) : (
            <EmptyState title="No products yet" message="Add your first product to get started." action={<button className="btn primary" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={16} /> Add Product</button>} />
          )}
        </div>
      ) : (
        <>
          <ProductTable products={data.products} onView={setViewing} onEdit={(p) => { setEditing(p); setFormOpen(true); }} onDelete={setDeleting} />
          <div className="pagination">
            <span className="muted small">Page {data.page} of {data.pages}</span>
            <div className="actions-row">
              <button className="btn sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <button className="btn sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </>
      )}

      {formOpen && (
        <Modal title={editing ? 'Edit product' : 'Add product'} onClose={() => { setFormOpen(false); setEditing(null); }}>
          <ProductForm product={editing} onSubmit={handleSave} onCancel={() => { setFormOpen(false); setEditing(null); }} />
        </Modal>
      )}
      {viewing && (
        <Modal title="Product details" onClose={() => setViewing(null)}>
          <ProductDetails product={viewing} />
          <div className="form-actions"><Link className="btn" to="/stock" onClick={() => setViewing(null)}>Go to Stock Management</Link></div>
        </Modal>
      )}
      {deleting && (
        <ConfirmationModal title="Delete product?" message={`Delete "${deleting.name}" (${deleting.productId})? This cannot be undone. Its stock history is kept.`}
          busy={deleteBusy} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
