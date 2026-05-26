const { load, save } = require('./db');
const bcrypt = require('bcryptjs')

function init() {
  const data = load();
  if (!Array.isArray(data.users)) data.users = [];
  if (!Array.isArray(data.vendors)) data.vendors = [];
  if (!Array.isArray(data.orders)) data.orders = [];

  const admin = data.users.find(u => u.email === 'admin@example.com');
  if (!admin) {
    const hash = bcrypt.hashSync('admin123', 10);
    data.users.push({ id: 1, email: 'admin@example.com', password: hash, role: 'admin' });
    save(data);
    console.log('Seeded admin user: admin@example.com / admin123');
  } else {
    console.log('Admin user already present');
  }

  console.log('Data store initialized at', require('./db').DATA_FILE);
}

init();
