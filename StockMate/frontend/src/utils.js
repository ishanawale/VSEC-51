export const CATEGORIES = ['Electronics', 'Stationery', 'Furniture', 'Cleaning Supplies', 'Equipment', 'Other'];
export const IN_REASONS = ['New Purchase', 'Return', 'Adjustment'];
export const OUT_REASONS = ['Sale', 'Internal Use', 'Damaged Goods', 'Adjustment'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
export const formatINR = (n) => inr.format(Number(n) || 0);
export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(Number(n) || 0);
export const formatDateTime = (d) => (d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-');
export const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-');
