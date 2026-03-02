const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth.middleware');
const invoiceRoutes = require('./routes/invoice.routes');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user
  });
});

app.get('/', (req, res) => {
  res.send('Receipta API running');
});

module.exports = app;