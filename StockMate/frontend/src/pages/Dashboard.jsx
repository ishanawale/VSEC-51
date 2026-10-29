import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Boxes, AlertTriangle, PackageX, IndianRupee, Plus, PackagePlus, PackageMinus } from 'lucide-react';
import api from '../services/api.js';
import DashboardCard from '../components/DashboardCard.jsx';
import LowStockTable from '../components/LowStockTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatINR, formatNumber, formatDateTime } from '../utils.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.dashboard().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  const { stats, categories, lowStock, recentMovements } = data;
  if (stats.totalProducts === 0) {
    return (
      <div className="card">
        <EmptyState title="No products yet" message="Add your first product to see live inventory statistics here."
          action={<Link className="btn primary" to="/products?add=1"><Plus size={16} /> Add Product</Link>} />
      </div>
    );
  }
  const maxUnits = Math.max(...categories.map((c) => c.units), 1);

  return (
    <>
      <div className="grid-cards">
        <DashboardCard title="Total Products" value={formatNumber(stats.totalProducts)} icon={Package} tone="green" />
        <DashboardCard title="Total Units in Stock" value={formatNumber(stats.totalUnits)} icon={Boxes} tone="gray" />
        <DashboardCard title="Low Stock Items" value={formatNumber(stats.lowStock)} icon={AlertTriangle} tone="amber" />
        <DashboardCard title="Out of Stock" value={formatNumber(stats.outOfStock)} icon={PackageX} tone="red" />
        <DashboardCard title="Total Inventory Value" value={formatINR(stats.totalValue)} icon={IndianRupee} tone="green" />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><h2>Quick actions</h2></div>
        <div className="actions-row">
          <Link className="btn primary" to="/products?add=1"><Plus size={16} /> Add Product</Link>
          <Link className="btn" to="/stock"><PackagePlus size={16} /> Stock In</Link>
          <Link className="btn" to="/stock"><PackageMinus size={16} /> Stock Out</Link>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head"><h2>Low-stock alerts</h2><Link className="small" to="/products?status=attention">View all</Link></div>
          {lowStock.length === 0 ? <EmptyState title="All good" message="No products need replenishment." /> : <LowStockTable products={lowStock} />}
        </div>
        <div className="card">
          <div className="card-head"><h2>Recent stock movements</h2><Link className="small" to="/history">View history</Link></div>
          {recentMovements.length === 0 ? (
            <EmptyState title="No movements yet" message="Record a Stock In or Stock Out to see it here." />
          ) : (
            <div className="list">
              {recentMovements.map((m) => (
                <div key={m._id} className="list-item">
                  <div>
                    <strong>{m.productName}</strong>
                    <div className="muted small">{m.reason} - {formatDateTime(m.createdAt)}</div>
                  </div>
                  <span className={`badge ${m.type === 'IN' ? 'green' : 'amber'}`}>{m.type === 'IN' ? '+' : '-'}{m.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h2>Inventory by category</h2></div>
        {categories.map((c) => (
          <div className="bar-row" key={c.category}>
            <div className="bar-label"><span>{c.category} <span className="muted">({c.products} product{c.products === 1 ? '' : 's'})</span></span><span>{formatNumber(c.units)} units - {formatINR(c.value)}</span></div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${(c.units / maxUnits) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </>
  );
}
