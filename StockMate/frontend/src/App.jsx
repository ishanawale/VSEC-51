import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import StockManagement from './pages/StockManagement.jsx';
import StockHistory from './pages/StockHistory.jsx';
import Tasks from './pages/Tasks.jsx';
import Tools from './pages/Tools.jsx';

const TITLES = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/stock': 'Stock Management',
  '/history': 'Stock History',
  '/tasks': 'Inventory Tasks',
  '/tools': 'Tools',
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="app">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Header title={TITLES[pathname] || 'StockMate'} onMenu={() => setMenuOpen(true)} />
        <main className="page">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/history" element={<StockHistory />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
