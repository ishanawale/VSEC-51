import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import StockInForm from '../components/StockInForm.jsx';
import StockOutForm from '../components/StockOutForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function StockManagement() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [last, setLast] = useState(null);

  const load = useCallback(() => {
    setError('');
    return api.products.list({ sortBy: 'name', order: 'asc', limit: 1000 })
      .then((res) => setProducts(res.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSuccess = (result) => {
    toast.success(result.message);
    setLast(result);
    load(); // refresh quantities and statuses
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (products.length === 0) {
    return <div className="card"><EmptyState title="No products to manage" message="Add a product first, then record stock movements." action={<Link className="btn primary" to="/products?add=1">Add Product</Link>} /></div>;
  }

  return (
    <>
      {last && (
        <div className="alert success" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span>
            <strong>{last.product.name}</strong>: {last.movement.previousQuantity} to {last.movement.newQuantity} units ({last.movement.type === 'IN' ? '+' : '-'}{last.movement.quantity}, {last.movement.reason}) <StatusBadge status={last.product.status} />
          </span>
          <Link to="/history">View in Stock History</Link>
        </div>
      )}
      <div className="two-col">
        <StockInForm products={products} onSuccess={handleSuccess} />
        <StockOutForm products={products} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
