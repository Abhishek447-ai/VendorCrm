const fs = require('fs');
const path = require('path');
const request = require('supertest');

// Use a temp data file for tests
const TEST_DATA = path.join(__dirname, 'test-data.json');
process.env.DATA_FILE = TEST_DATA;

// Ensure fresh
if (fs.existsSync(TEST_DATA)) fs.unlinkSync(TEST_DATA);

// initialize DB (seed admin)
require('../backend/init_db');

const app = require('../backend/app');

describe('API endpoints', () => {
  let token;

  test('login with seeded admin', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('create vendor', async () => {
    const res = await request(app).post('/api/vendors').set('Authorization', 'Bearer ' + token).send({ vendor_id: 'V1', name: 'Supplier 1', email: 's1@example.com', contact: '123', location: 'City', vendor_type: 'TypeA', description: 'Desc', isactive: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('list active vendors', async () => {
    const res = await request(app).get('/api/reports/active-vendors').set('Authorization', 'Bearer ' + token);
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeDefined();
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  test('create order', async () => {
    const res = await request(app).post('/api/orders').set('Authorization', 'Bearer ' + token).send({ order_id: 'O1', vendor_id: 'V1', vendor_name: 'Supplier 1', order_type: 'standard', quantity: 5, amount: 100, order_date: '2026-05-23', delivery_date: '2026-05-30' });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('mark delivered', async () => {
    const res = await request(app).post('/api/orders/O1/delivered').set('Authorization', 'Bearer ' + token).send({ delivered: true });
    expect(res.statusCode).toBe(200);
  });

  test('export completed orders CSV', async () => {
    const res = await request(app).get('/api/reports/export/completed-orders').set('Authorization', 'Bearer ' + token);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/csv/);
  });
});
