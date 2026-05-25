# Vendor Management API

Basic Node.js + Express backend using SQLite for a vendor management system.

Quick start

```bash
cd "D:\New vendor project"
npm install
npm run init-db
npm start
```

Seed admin user: `admin@example.com` / `admin123` (change after first login).

Endpoints summary
- `POST /api/auth/login` - login (returns JWT)
- `POST /api/auth/users` - create user (admin only)
- `GET /api/vendors` - list vendors
- `POST /api/vendors` - create vendor (admin)
- `PUT /api/vendors/:vendor_id` - update vendor (admin)
- `DELETE /api/vendors/:vendor_id` - delete vendor (admin)
- `POST /api/orders` - create order
- `PUT /api/orders/:order_id` - modify order
- `DELETE /api/orders/:order_id` - delete order
- `GET /api/orders` - list orders
- `POST /api/orders/:order_id/delivered` - set delivered flag
- `GET /api/reports/*` - various reports
