import { useState } from 'react';
import Field from './Field.jsx';

// Final Stock = Current Stock + Stock In - Stock Out (calculator only, does not change the database)
export default function StockCalculator() {
  const [v, setV] = useState({ current: '', stockIn: '', stockOut: '' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const bad = (x) => x !== '' && !/^\d+$/.test(x) ? 'Enter a whole number of 0 or more' : '';

  const filled = v.current !== '' && v.stockIn !== '' && v.stockOut !== '';
  const hasError = bad(v.current) || bad(v.stockIn) || bad(v.stockOut);
  const final = Number(v.current) + Number(v.stockIn) - Number(v.stockOut);

  let result = <div className="result-box">Fill in all three values</div>;
  if (filled && !hasError) {
    result = final < 0
      ? <div className="result-box bad">Invalid: final stock would be {final}. Stock out cannot exceed current stock plus stock in.</div>
      : <div className="result-box">Final Stock: {final}</div>;
  }

  return (
    <div className="card">
      <div className="card-head"><h2>Stock Calculator</h2></div>
      <div className="stack" style={{ gap: 12 }}>
        <Field label="Current stock" htmlFor="sc-current" error={bad(v.current)}>
          <input id="sc-current" type="number" min="0" step="1" className="input" value={v.current} onChange={set('current')} />
        </Field>
        <Field label="Stock in" htmlFor="sc-in" error={bad(v.stockIn)}>
          <input id="sc-in" type="number" min="0" step="1" className="input" value={v.stockIn} onChange={set('stockIn')} />
        </Field>
        <Field label="Stock out" htmlFor="sc-out" error={bad(v.stockOut)}>
          <input id="sc-out" type="number" min="0" step="1" className="input" value={v.stockOut} onChange={set('stockOut')} />
        </Field>
      </div>
      {result}
      <p className="hint">Calculator only. Real stock changes are made in Stock Management.</p>
    </div>
  );
}
