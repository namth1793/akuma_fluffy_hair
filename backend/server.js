const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: cho phép mọi origin (Vercel, localhost, custom domain)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ── Lead capture ──
const leads = [];

app.post('/api/leads', (req, res) => {
  const { email, name, bottles } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const lead = {
    id: leads.length + 1,
    name: name || 'Anonymous',
    email,
    bottles: bottles || 1,
    timestamp: new Date().toISOString(),
  };
  leads.push(lead);
  console.log(`[LEAD] ${email} — ${bottles} chai`);
  res.json({ success: true, message: 'Đã nhận thông tin!' });
});

// ── Orders ──
const orders = [];

app.post('/api/orders', (req, res) => {
  const { name, phone, email, address, note, bottles, total, payment, orderCode } = req.body;
  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
  }

  const order = {
    orderCode: orderCode || `AKUMA-${String(orders.length + 1).padStart(6, '0')}`,
    name, phone,
    email: email || '',
    address,
    note: note || '',
    bottles: parseInt(bottles) || 1,
    total: parseFloat(total) || 29,
    payment: payment || 'cod',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  console.log(`[ORDER] #${order.orderCode} — ${order.name} — ${order.bottles} chai — $${order.total} — ${order.payment}`);
  res.json({ success: true, orderCode: order.orderCode, message: 'Đặt hàng thành công!' });
});

app.get('/api/orders', (_req, res) => {
  res.json({ total: orders.length, orders });
});

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', product: 'AKUMA Fluffy Hair', leads: leads.length, orders: orders.length });
});

app.listen(PORT, () => {
  console.log(`AKUMA backend running on port ${PORT}`);
});
