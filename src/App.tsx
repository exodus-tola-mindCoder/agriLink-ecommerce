import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import Header from './components/common/Header';
import CartSidebar from './components/cart/CartSidebar';
import NotificationToast from './components/common/NotificationToast';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrdersPage from './pages/OrdersPage';
import CategoriesPage from './pages/CategoriesPage';
import SellersPage from './pages/SellersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserDashboardPage from './pages/UserDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminDeliveryPage from './pages/AdminDeliveryPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

// Protected Route Component
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-yellow-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please log in to access this page.</p>
      </div>
    </div>;
  }

  if (roles && !roles.includes(user?.role || '')) {
    return <div className="min-h-screen flex items-center justify-center bg-yellow-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="delivery" element={<AdminDeliveryPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* Main App Routes */}
              <Route path="/*" element={
                <div className="min-h-screen bg-yellow-100">
                  <Header />
                  <CartSidebar />
                  <NotificationToast />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/product/:productId" element={<ProductDetailPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order/:orderId" element={<OrderDetailPage />} />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/sellers" element={<SellersPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/customer" element={
                        <ProtectedRoute roles={['customer']}>
                          <UserDashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/seller" element={
                        <ProtectedRoute roles={['seller']}>
                          <UserDashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/delivery" element={
                        <ProtectedRoute roles={['delivery_agent']}>
                          <UserDashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <UserProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/wishlist" element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </main>
                </div>
              } />
            </Routes>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;