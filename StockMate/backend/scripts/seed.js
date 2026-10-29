// Optional demo data. Safe to run many times: records are inserted only if they do not exist yet,
// and nothing is ever deleted or overwritten.   Run with:  npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Task = require('../models/Task');

const days = (n) => new Date(Date.now() + n * 86400000);

const products = [
  { productId: 'P001', name: 'Wireless Mouse', category: 'Electronics', price: 599, quantity: 45, minimumStock: 10, supplier: 'TechSource India', description: '2.4 GHz wireless optical mouse' },
  { productId: 'P002', name: 'Keyboard', category: 'Electronics', price: 1299, quantity: 8, minimumStock: 10, supplier: 'TechSource India', description: 'Full-size USB keyboard' },
  { productId: 'P003', name: 'Monitor 24"', category: 'Electronics', price: 9499, quantity: 0, minimumStock: 5, supplier: 'ViewMax Distributors', description: '24-inch Full HD monitor' },
  { productId: 'P004', name: 'Notebook A4', category: 'Stationery', price: 60, quantity: 120, minimumStock: 30, supplier: 'Paper Planet', description: '200-page ruled notebook' },
  { productId: 'P005', name: 'Office Chair', category: 'Furniture', price: 4999, quantity: 5, minimumStock: 5, supplier: 'Comfort Seating Co.', description: 'Ergonomic mesh-back chair' },
  { productId: 'P006', name: 'USB Cable', category: 'Electronics', price: 199, quantity: 60, minimumStock: 20, supplier: 'TechSource India', description: 'USB-A to USB-C cable, 1 m' },
  { productId: 'P007', name: 'Printer Paper (A4 Ream)', category: 'Stationery', price: 350, quantity: 12, minimumStock: 15, supplier: 'Paper Planet', description: '500 sheets, 75 GSM' },
  { productId: 'P008', name: 'Cleaning Supplies Kit', category: 'Cleaning Supplies', price: 450, quantity: 25, minimumStock: 10, supplier: 'CleanCare Traders', description: 'Mop, cleaner and cloths' },
];

const tasks = [
  { title: 'Verify new shipment', description: 'Check delivery note against received electronics.', priority: 'High', dueDate: days(1) },
  { title: 'Count electronics stock', description: 'Physical count of mice, keyboards and cables.', priority: 'Medium', dueDate: days(3) },
  { title: 'Inspect damaged products', description: 'Look through returned items for damage.', priority: 'Medium', dueDate: days(5) },
  { title: 'Reorder stationery', description: 'Printer paper is below minimum stock.', priority: 'High', dueDate: days(2) },
  { title: 'Check warehouse shelves', description: 'Make sure shelf labels match product IDs.', priority: 'Low', dueDate: days(7) },
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing in backend/.env');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  const p = await Product.bulkWrite(products.map((x) => ({
    updateOne: { filter: { productId: x.productId }, update: { $setOnInsert: { ...x, isSample: true } }, upsert: true },
  })));
  const t = await Task.bulkWrite(tasks.map((x) => ({
    updateOne: { filter: { title: x.title }, update: { $setOnInsert: { ...x, isSample: true } }, upsert: true },
  })));

  console.log(`Products inserted: ${p.upsertedCount} (already existed: ${products.length - p.upsertedCount})`);
  console.log(`Tasks inserted:    ${t.upsertedCount} (already existed: ${tasks.length - t.upsertedCount})`);
}

run()
  .catch((err) => { console.error('Seed failed:', err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
