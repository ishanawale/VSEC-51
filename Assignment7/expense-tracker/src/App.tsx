import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Other');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(transactions));
  }, [transactions]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (val: number) => {
    const formatted = Math.abs(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return val < 0 ? `-₹${formatted}` : `₹${formatted}`;
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString('en-US'),
    };

    setTransactions([newTx, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: '#111111',
        padding: '30px 24px',
        borderRadius: '16px',
        color: '#ffffff',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '20px',
        }}
      >
        Personal Expense Tracker
      </h2>

      {/* Balance Card */}
      <div
        style={{
          backgroundColor: '#1f1f1f',
          padding: '24px 16px',
          borderRadius: '12px',
          marginBottom: '24px',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: '#888888',
            textAlign: 'center',
            marginBottom: '6px',
          }}
        >
          Total Balance
        </p>
        <h1
          style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: balance < 0 ? '#ff4d4d' : '#2ecc71',
            margin: '0 0 16px 0',
          }}
        >
          {formatCurrency(balance)}
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            borderTop: '1px solid #2d2d2d',
            paddingTop: '14px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#888888' }}>Income</span>
            <p style={{ color: '#2ecc71', fontWeight: '600', marginTop: '4px' }}>
              +₹
              {totalIncome.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#888888' }}>Expenses</span>
            <p style={{ color: '#ff4d4d', fontWeight: '600', marginTop: '4px' }}>
              -₹
              {totalExpense.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      <form
        onSubmit={handleAddTransaction}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}
      >
        <input
          type="text"
          placeholder="Description (e.g. Groceries)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid #333333',
            backgroundColor: '#2b2b2b',
            color: '#ffffff',
            outline: 'none',
            fontSize: '14px',
          }}
        />

        <input
          type="number"
          placeholder="Amount"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid #333333',
            backgroundColor: '#2b2b2b',
            color: '#ffffff',
            outline: 'none',
            fontSize: '14px',
          }}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333333',
              backgroundColor: '#2b2b2b',
              color: '#ffffff',
              outline: 'none',
              fontSize: '14px',
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333333',
              backgroundColor: '#2b2b2b',
              color: '#ffffff',
              outline: 'none',
              fontSize: '14px',
            }}
          >
            <option value="Other">Other</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '4px',
            padding: '12px',
            backgroundColor: '#5243eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Add Transaction
        </button>
      </form>

      {/* History Section */}
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {transactions.length === 0 ? (
          <p style={{ color: '#666666', textAlign: 'center', fontSize: '13px' }}>
            No transactions yet.
          </p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                backgroundColor: '#1b1b1b',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left Color Indicator Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: tx.type === 'income' ? '#2ecc71' : '#ff4d4d',
                }}
              />

              <div style={{ paddingLeft: '8px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px', margin: 0 }}>
                  {tx.description}
                </p>
                <span style={{ fontSize: '11px', color: '#777777' }}>
                  {tx.category} • {tx.date}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: tx.type === 'income' ? '#2ecc71' : '#ff4d4d',
                  }}
                >
                  {tx.type === 'income' ? '+' : '-'}₹
                  {tx.amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <button
                  onClick={() => handleDelete(tx.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0 4px',
                  }}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}