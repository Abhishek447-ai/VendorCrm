const express = require('express');
const router = express.Router();
const { load } = require('../db');
const { authMiddleware } = require('../utils/auth_middleware');
const { stringify } = require('csv-stringify/sync');
const path = require('path');

router.use(authMiddleware);

function paginate(items, page = 1, limit = 20) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Number(limit) || 20);
  const start = (p - 1) * l;
  const paged = items.slice(start, start + l);
  return { items: paged, total: items.length, page: p, limit: l };
}

function filterVendors(all, q, active) {
  let rows = all || [];
  if (active !== undefined) rows = rows.filter(v => v.is_active == (active ? 1 : 0));
  if (q) {
    const term = q.toLowerCase();
    rows = rows.filter(r => (r.name || '').toLowerCase().includes(term) || (r.vendor_id || '').toLowerCase().includes(term) || (r.email || '').toLowerCase().includes(term));
  }
  return rows;
}

function filterOrders(all, q, status) {
  let rows = all || [];
  if (status) rows = rows.filter(o => o.status === status);
  if (q) {
    const term = q.toLowerCase();
    rows = rows.filter(r => (r.order_id || '').toLowerCase().includes(term) || (r.vendor_name || '').toLowerCase().includes(term));
  }
  return rows;
}

router.get('/active-vendors', (req, res) => {
  const { page, limit, q } = req.query;
  const data = load();
  const rows = filterVendors(data.vendors, q, true);
  res.json(paginate(rows, page, limit));
});

router.get('/inactive-vendors', (req, res) => {
  const { page, limit, q } = req.query;
  const data = load();
  const rows = filterVendors(data.vendors, q, false);
  res.json(paginate(rows, page, limit));
});

router.get('/active-orders', (req, res) => {
  const { page, limit, q } = req.query;
  const data = load();
  const rows = filterOrders(data.orders, q, 'active');
  res.json(paginate(rows, page, limit));
});

router.get('/completed-orders', (req, res) => {
  const { page, limit, q } = req.query;
  const data = load();
  const rows = filterOrders(data.orders, q, 'delivered');
  res.json(paginate(rows, page, limit));
});

router.get('/cancelled-orders', (req, res) => {
  const { page, limit, q } = req.query;
  const data = load();
  const rows = filterOrders(data.orders, q, 'cancelled');
  res.json(paginate(rows, page, limit));
});

// Export CSV for a given report type: pass ?q=... to filter
router.get('/export/:type', (req, res) => {
  const { type } = req.params;
  const { q } = req.query;
  const data = load();
  let rows = [];
  let filename = 'report';
  if (type === 'active-vendors') { rows = filterVendors(data.vendors, q, true); filename = 'active-vendors' }
  else if (type === 'inactive-vendors') { rows = filterVendors(data.vendors, q, false); filename = 'inactive-vendors' }
  else if (type === 'active-orders') { rows = filterOrders(data.orders, q, 'active'); filename = 'active-orders' }
  else if (type === 'completed-orders') { rows = filterOrders(data.orders, q, 'delivered'); filename = 'completed-orders' }
  else if (type === 'cancelled-orders') { rows = filterOrders(data.orders, q, 'cancelled'); filename = 'cancelled-orders' }
  else return res.status(400).json({ error: 'Unknown export type' });

  // Build CSV depending on type
  let csv = '';
  if (type.includes('vendors')) {
    const cols = ['vendor_id', 'name', 'email', 'contact', 'location', 'vendor_type', 'description', 'is_active'];
    csv = stringify(rows.map(r => cols.map(c => r[c])), { header: true, columns: cols });
  } else {
    const cols = ['order_id', 'created_at', 'vendor_id', 'vendor_name', 'order_type', 'quantity', 'amount', 'order_date', 'delivery_date', 'status'];
    csv = stringify(rows.map(r => cols.map(c => r[c])), { header: true, columns: cols });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
  res.send(csv);
});

module.exports = router;
