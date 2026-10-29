import { Eye, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatINR, formatNumber } from '../utils.js';

export default function ProductTable({ products, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th className="num">Price</th>
            <th className="num">Qty</th><th className="num">Min</th><th>Supplier</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><strong>{p.productId}</strong></td>
              <td>{p.name}{p.isSample && <span className="sample-tag">Sample</span>}</td>
              <td>{p.category}</td>
              <td className="num">{formatINR(p.price)}</td>
              <td className="num">{formatNumber(p.quantity)}</td>
              <td className="num">{formatNumber(p.minimumStock)}</td>
              <td>{p.supplier || '-'}</td>
              <td><StatusBadge status={p.status} /></td>
              <td>
                <div className="icon-actions">
                  <button className="btn icon" onClick={() => onView(p)} aria-label={`View ${p.name}`}><Eye size={16} /></button>
                  <button className="btn icon" onClick={() => onEdit(p)} aria-label={`Edit ${p.name}`}><Pencil size={16} /></button>
                  <button className="btn icon" onClick={() => onDelete(p)} aria-label={`Delete ${p.name}`}><Trash2 size={16} color="#b83232" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
