# 🛒 EastLink Market - Ethiopia's Premier E-commerce Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/eastlink-market)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

> A comprehensive e-commerce platform connecting local sellers and buyers across Harar, Dire Dawa, and Hararge regions of Ethiopia.

## 🌟 Features

### 👥 **Multi-Role System**
- **Customers**: Browse, purchase, and track orders
- **Sellers**: Manage products, inventory, and sales
- **Delivery Agents**: Handle deliveries with real-time tracking
- **Admins**: Platform management and analytics

### 🛍️ **Core E-commerce Features**
- Product catalog with advanced search and filtering
- Shopping cart and secure checkout
- Order management and tracking
- Real-time delivery tracking with GPS
- Wishlist functionality
- Product reviews and ratings
- Multi-category support

### 💳 **Payment & Delivery**
- Cash on Delivery (COD)
- Online payment integration ready
- Regional delivery across Eastern Ethiopia
- Real-time delivery tracking
- Delivery fee calculation by region

### 📊 **Analytics & Management**
- Seller dashboard with sales analytics
- Admin panel with comprehensive statistics
- User management and approval system
- Order and delivery management
- Revenue tracking and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- npm or yarn
- Cloudinary account (for image uploads)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/eastlink-market.git
cd eastlink-market
```



2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/eastlink-market

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use local MongoDB installation
mongod
```

5. **Run the application**
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately
npm run client  # Frontend only
npm run server  # Backend only
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🌐 Deployment to Vercel (Free Tier)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Set Up External Services

#### MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Whitelist Vercel's IP ranges or use `0.0.0.0/0` for development

#### Cloudinary (Free Tier)
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [Vercel](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables (see below)
6. Deploy!

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set up environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

### Step 4: Configure Environment Variables in Vercel

In your Vercel dashboard, go to Project Settings > Environment Variables and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eastlink-market
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLIENT_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

### Step 5: Update CORS Settings

After deployment, update the `CLIENT_URL` in your environment variables to match your Vercel domain.

## 🐳 Docker Deployment

### Development with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Build
```bash
# Build production image
docker build -t eastlink-market .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  eastlink-market
```

## 📁 Project Structure

```
eastlink-market/
├── backend/                 # Backend API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Express server
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── dist/                   # Built frontend
├── docker-compose.yml      # Docker services
├── Dockerfile             # Docker build config
├── nginx.conf             # Nginx configuration
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `CLIENT_URL` | Frontend URL for CORS | No | `http://localhost:5173` |
| `EMAIL_HOST` | SMTP host | No | - |
| `EMAIL_USER` | SMTP username | No | - |
| `EMAIL_PASS` | SMTP password | No | - |

### Supported Regions
- **Harar** - Delivery fee: 50 ETB
- **Dire Dawa** - Delivery fee: 75 ETB  
- **Hararge** - Delivery fee: 100 ETB

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (sellers only)
- `PUT /api/products/:id` - Update product (sellers only)
- `DELETE /api/products/:id` - Delete product (sellers only)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/products` - Manage products

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- MongoDB injection protection
- File upload restrictions

## 🚀 Performance Optimizations

- Image optimization with Cloudinary
- Database indexing
- API response caching
- Gzip compression
- Code splitting
- Lazy loading
- CDN integration ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/yourusername/eastlink-market/issues)
- **Email**: support@eastlinkmarket.et

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core e-commerce functionality
- ✅ Multi-role user system
- ✅ Order management
- ✅ Delivery tracking

### Phase 2 (Next)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment gateway integration

### Phase 3 (Future)
- [ ] AI-powered recommendations
- [ ] Inventory management
- [ ] Seller onboarding automation
- [ ] Advanced reporting

## 🏆 Built With

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Deployment**: Vercel, Docker
- **Icons**: Lucide React

---

**Made with ❤️ for Ethiopia's digital marketplace future**

*EastLink Market - Connecting communities, empowering businesses*
