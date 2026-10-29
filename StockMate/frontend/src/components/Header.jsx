import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';

export default function Header({ title, onMenu }) {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
    setText('');
  };

  return (
    <header className="header">
      <button className="btn icon menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <h1>{title}</h1>
      <form className="header-search" onSubmit={handleSearch}>
        <Search size={16} className="muted" />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Quick search products..." aria-label="Quick search products" />
      </form>
    </header>
  );
}
