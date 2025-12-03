// MongoDB initialization script for Docker
db = db.getSiblingDB('eastlink-market');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, isActive: 1 });
db.users.createIndex({ 'address.city': 1 });

db.products.createIndex({ seller: 1, isActive: 1 });
db.products.createIndex({ category: 1, isActive: 1 });
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' });
db.products.createIndex({ price: 1 });
db.products.createIndex({ 'ratings.average': -1 });
db.products.createIndex({ createdAt: -1 });
db.products.createIndex({ isFeatured: -1, isActive: 1 });

db.orders.createIndex({ customer: 1, createdAt: -1 });
db.orders.createIndex({ 'items.seller': 1, createdAt: -1 });
db.orders.createIndex({ deliveryAgent: 1, orderStatus: 1 });
db.orders.createIndex({ orderNumber: 1 });
db.orders.createIndex({ orderStatus: 1, createdAt: -1 });

// Create admin user
db.users.insertOne({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@eastlinkmarket.et',
  phone: '+251911000000',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIjO', // password: admin123
  role: 'admin',
  address: {
    street: 'Admin Street',
    city: 'Harar',
    region: 'Harari',
    postalCode: '1000'
  },
  isActive: true,
  isVerified: true,
  isApproved: true,
  ratings: {
    average: 0,
    count: 0
  },
  createdAt: new Date(),
  lastLogin: new Date()
});

print('Database initialized successfully!');