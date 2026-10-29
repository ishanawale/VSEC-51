const MAP = {
  IN_STOCK: { label: 'In Stock', cls: 'green' },
  LOW_STOCK: { label: 'Low Stock', cls: 'amber' },
  OUT_OF_STOCK: { label: 'Out of Stock', cls: 'red' },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] || { label: status, cls: 'gray' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
