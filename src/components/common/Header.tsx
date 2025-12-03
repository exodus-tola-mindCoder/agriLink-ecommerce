import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/seller';
      case 'delivery_agent':
        return '/delivery';
      default:
        return '/customer';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Serving Harar, Dire Dawa & Hararge</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>📞 +251-25-666-1234</span>
              <span>|</span>
              <span>📧 support@eastlinkmarket.et</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EastLink Market</h1>
              <p className="text-xs text-gray-500">Regional E-commerce Platform</p>
            </div>
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'customer' && (
                  <button 
                    onClick={toggleCart}
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="hidden sm:inline">Cart</span>
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user?.firstName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link 
                        to={getDashboardLink()} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      {user?.role === 'customer' && (
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-3">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-green-600 font-medium">
              Products
            </Link>
            <Link to="/categories" className="text-gray-600 hover:text-green-600 font-medium">
              Categories
            </Link>
            <Link to="/sellers" className="text-gray-600 hover:text-green-600 font-medium">
              Sellers
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600 font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;