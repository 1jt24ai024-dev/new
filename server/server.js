require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps, etc.)
    if (!origin) return callback(null, true);
    // Normalize the incoming origin (strip trailing slash just in case)
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/items', require('./routes/items'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => res.json({ status: 'Portfolio API running' }));
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
