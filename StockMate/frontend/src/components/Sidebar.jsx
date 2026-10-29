import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, History, ClipboardList, Wrench, Boxes, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/stock', label: 'Stock Management', icon: ArrowLeftRight },
  { to: '/history', label: 'Stock History', icon: History },
  { to: '/tasks', label: 'Inventory Tasks', icon: ClipboardList },
  { to: '/tools', label: 'Tools', icon: Wrench },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <button className="btn icon sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        <div className="brand">
          <div className="brand-logo"><Boxes size={22} /></div>
          <div>
            <div className="brand-name">StockMate</div>
            <div className="brand-sub">Smart Inventory Management System</div>
          </div>
        </div>
        <nav className="nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={onClose}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
