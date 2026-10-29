import StatusBadge from './StatusBadge.jsx';
import { formatNumber } from '../utils.js';

export default function LowStockTable({ products }) {
  return (
    <div className="table-wrap">
      <table style={{ minWidth: 480 }}>
        <thead>
          <tr><th>ID</th><th>Product</th><th className="num">Qty</th><th className="num">Min</th><th className="num">Short by</th><th>Status</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><strong>{p.productId}</strong></td>
              <td>{p.name}</td>
              <td className="num">{formatNumber(p.quantity)}</td>
              <td className="num">{formatNumber(p.minimumStock)}</td>
              <td className="num">{formatNumber(Math.max(p.minimumStock - p.quantity, 0))}</td>
              <td><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
