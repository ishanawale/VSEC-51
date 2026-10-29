require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());

// ----- Middleware -----
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '100kb' }));

// ----- Health check (works even when the database is down) -----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'StockMate backend is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  });
});

// ----- Return a clear 503 if MongoDB is not connected -----
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database is not connected. Start MongoDB and check MONGODB_URI in backend/.env', errors: {} });
  }
  next();
});

// ----- Routes -----
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use((req, res) => res.status(404).json({ message: 'Route not found', errors: {} }));
app.use(errorHandler);

// ----- Start -----
mongoose.set('bufferCommands', false);
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

app.listen(PORT, () => console.log(`StockMate API listening on http://localhost:${PORT}`));

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing. Copy backend/.env.example to backend/.env and set it.');
} else {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log(`MongoDB connected (database: ${mongoose.connection.name})`))
    .catch((err) => console.error('MongoDB connection failed:', err.message));
}
