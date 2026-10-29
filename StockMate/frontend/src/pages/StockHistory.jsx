import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import api from '../services/api.js';
import StockHistoryTable from '../components/StockHistoryTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useDebounce from '../hooks/useDebounce.js';

export default function StockHistory() {
  const [filters, setFilters] = useState({ search: '', type: '', date: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ movements: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.stock.list({ search: debouncedSearch, type: filters.type, date: filters.date, page, limit: 15 })
      .then((res) => { if (!cancelled) { setData(res); setError(''); } })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedSearch, filters.type, filters.date, page, reloadKey]);

  const update = (key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };
  const active = filters.search || filters.type || filters.date;

  return (
    <>
      <div className="toolbar">
        <div className="search-box grow">
          <Search size={16} />
          <input className="input" placeholder="Search by product ID or name" value={filters.search} onChange={(e) => update('search', e.target.value)} aria-label="Search history" />
        </div>
        <select className="input" value={filters.type} onChange={(e) => update('type', e.target.value)} aria-label="Filter by type">
          <option value="">All types</option><option value="IN">Stock In</option><option value="OUT">Stock Out</option>
        </select>
        <input className="input" type="date" value={filters.date} onChange={(e) => update('date', e.target.value)} aria-label="Filter by date" />
        {active && <button className="btn" onClick={() => { setFilters({ search: '', type: '', date: '' }); setPage(1); }}><X size={15} /> Clear filters</button>}
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        : loading ? <LoadingSpinner text="Loading history..." />
        : data.movements.length === 0 ? (
          <div className="card"><EmptyState title={active ? 'No matching transactions' : 'No stock transactions yet'} message={active ? 'Try changing or clearing the filters.' : 'Every Stock In and Stock Out you record will appear here.'} /></div>
        ) : (
          <>
            <StockHistoryTable movements={data.movements} />
            <div className="pagination">
              <span className="muted small">{data.total} transaction{data.total === 1 ? '' : 's'} - page {data.page} of {data.pages} (newest first)</span>
              <div className="actions-row">
                <button className="btn sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <button className="btn sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
    </>
  );
}
