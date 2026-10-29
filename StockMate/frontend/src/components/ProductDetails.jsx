import StatusBadge from './StatusBadge.jsx';
import { formatINR, formatNumber, formatDateTime } from '../utils.js';

export default function ProductDetails({ product: p }) {
  return (
    <dl className="details">
      <dt>Product ID</dt><dd>{p.productId}</dd>
      <dt>Name</dt><dd>{p.name}</dd>
      <dt>Category</dt><dd>{p.category}</dd>
      <dt>Description</dt><dd>{p.description || '-'}</dd>
      <dt>Price</dt><dd>{formatINR(p.price)}</dd>
      <dt>Quantity</dt><dd>{formatNumber(p.quantity)}</dd>
      <dt>Minimum stock</dt><dd>{formatNumber(p.minimumStock)}</dd>
      <dt>Status</dt><dd><StatusBadge status={p.status} /></dd>
      <dt>Stock value</dt><dd>{formatINR(p.price * p.quantity)}</dd>
      <dt>Supplier</dt><dd>{p.supplier || '-'}</dd>
      <dt>Created</dt><dd>{formatDateTime(p.createdAt)}</dd>
      <dt>Last updated</dt><dd>{formatDateTime(p.updatedAt)}</dd>
    </dl>
  );
}
