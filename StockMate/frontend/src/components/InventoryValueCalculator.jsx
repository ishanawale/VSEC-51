import { useState } from 'react';
import Field from './Field.jsx';
import { formatINR } from '../utils.js';

// Total Value = Unit Price x Quantity (works without the database)
export default function InventoryValueCalculator() {
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');

  const priceNum = Number(price);
  const qtyNum = Number(qty);
  const priceError = price !== '' && (isNaN(priceNum) || priceNum < 0) ? 'Enter a price of 0 or more' : '';
  const qtyError = qty !== '' && (!/^\d+$/.test(qty)) ? 'Enter a whole number of 0 or more' : '';
  const ready = price !== '' && qty !== '' && !priceError && !qtyError;

  return (
    <div className="card">
      <div className="card-head"><h2>Inventory Value Calculator</h2></div>
      <div className="stack" style={{ gap: 12 }}>
        <Field label="Unit price (INR)" htmlFor="calc-price" error={priceError}>
          <input id="calc-price" type="number" min="0" step="0.01" className={`input ${priceError ? 'invalid' : ''}`} value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Quantity" htmlFor="calc-qty" error={qtyError}>
          <input id="calc-qty" type="number" min="0" step="1" className={`input ${qtyError ? 'invalid' : ''}`} value={qty} onChange={(e) => setQty(e.target.value)} />
        </Field>
      </div>
      <div className="result-box">{ready ? `Total Value: ${formatINR(priceNum * qtyNum)}` : 'Enter price and quantity'}</div>
      <p className="hint">Formula: Total Value = Unit Price x Quantity</p>
    </div>
  );
}
