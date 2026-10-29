import { formatDateTime, formatNumber } from '../utils.js';

export default function StockHistoryTable({ movements }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date &amp; time</th><th>Product ID</th><th>Product</th><th>Type</th>
            <th className="num">Quantity</th><th className="num">Previous</th><th className="num">New</th><th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m._id}>
              <td>{formatDateTime(m.createdAt)}</td>
              <td><strong>{m.productId}</strong></td>
              <td>{m.productName}</td>
              <td><span className={`badge ${m.type === 'IN' ? 'green' : 'amber'}`}>{m.type === 'IN' ? 'IN' : 'OUT'}</span></td>
              <td className="num">{m.type === 'IN' ? '+' : '-'}{formatNumber(m.quantity)}</td>
              <td className="num">{formatNumber(m.previousQuantity)}</td>
              <td className="num">{formatNumber(m.newQuantity)}</td>
              <td>{m.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
