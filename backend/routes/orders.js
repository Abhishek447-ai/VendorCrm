const express = require('express');
const router = express.Router();
const { load, save } = require('../db');
const { authMiddleware, requireRole } = require('../utils/auth_middleware');

// Create new order
router.post('/', authMiddleware, (req, res) => {
  const { order_id, created_at, vendor_id, vendor_name, order_type, quantity, amount, order_date, delivery_date } = req.body;
  const data = load();
  data.orders = data.orders || [];
  if (data.orders.some(o => o.order_id === order_id)) return res.status(400).json({ error: 'order_id exists' });
  data.orders.push({ order_id, created_at: created_at || new Date().toISOString(), vendor_id, vendor_name, order_type, quantity, amount, order_date, delivery_date, status: 'active' });
  save(data);
  res.json({ ok: true });
});

// Modify order
router.put('/:order_id', authMiddleware, (req, res) => {
  const { order_id } = req.params;
  const { vendor_id, vendor_name, order_type, quantity, amount, order_date, delivery_date, status } = req.body;
  const data = load();
  const idx = (data.orders || []).findIndex(o => o.order_id === order_id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.orders[idx] = Object.assign({}, data.orders[idx], { vendor_id, vendor_name, order_type, quantity, amount, order_date, delivery_date, status });
  save(data);
  res.json({ ok: true });
});

// Delete order
router.delete('/:order_id', authMiddleware, (req, res) => {
  const { order_id } = req.params;
  const data = load();
  const before = (data.orders || []).length;
  data.orders = (data.orders || []).filter(o => o.order_id !== order_id);
  save(data);
  res.json({ deleted: before - data.orders.length });
});

// View order
router.get('/:order_id', authMiddleware, (req, res) => {
  const { order_id } = req.params;
  const data = load();
  const row = (data.orders || []).find(o => o.order_id === order_id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// List orders (filter by status)
router.get('/', authMiddleware, (req, res) => {
  const { status } = req.query;
  const data = load();
  let rows = data.orders || [];
  if (status) rows = rows.filter(r => r.status === status);
  res.json(rows);
});

// Update delivered status: mark as delivered (status = 'delivered') or set back
router.post('/:order_id/delivered', authMiddleware, (req, res) => {
  const { order_id } = req.params;
  const { delivered } = req.body; // boolean
  const status = delivered ? 'delivered' : 'active';
  const data = load();
  const idx = (data.orders || []).findIndex(o => o.order_id === order_id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.orders[idx].status = status;
  save(data);
  res.json({ ok: true });
});

module.exports = router;
