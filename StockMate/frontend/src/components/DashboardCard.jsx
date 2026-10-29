export default function DashboardCard({ title, value, icon: Icon, tone = 'green' }) {
  return (
    <div className="card stat">
      <div className={`stat-icon tone-${tone}`}><Icon size={22} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
}
