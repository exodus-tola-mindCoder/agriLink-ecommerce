import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, Phone, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="bg-white shadow-sm sticky top-0 z-50 font-sans">
      {/* Top Bar */}
      <div className="bg-primary-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-400" />
                <span>Serving Harar, Dire Dawa & Hararge</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Phone className="h-3 w-3 text-secondary-400" />
                <span>+251-25-666-1234</span>
              </span>
              <span className="text-primary-400">|</span>
              <span>support@agrilink.et</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-0.5">
              <span className="text-white font-display font-bold text-xl sm:text-2xl">AL</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-none group-hover:text-primary-700 transition-colors">AgriLink</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide">Direct from Farmers</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* Mobile Menu Toggle */}
             <button 
              className="md:hidden p-2 text-slate-600 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'customer' && (
                  <button 
                    onClick={toggleCart}
                    className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 bg-accent-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                        {totalItems}
                      </span>
                    )}
                  </button>
                )}
                
                <div className="relative group hidden md:block">
                  <button className="flex items-center space-x-2 text-slate-700 hover:text-primary-700 font-medium">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="hidden sm:inline">{user?.firstName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="py-2">
                      <Link 
                        to={getDashboardLink()} 
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                      >
                        My Profile
                      </Link>
                      {user?.role === 'customer' && (
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                        >
                          My Orders
                        </Link>
                      )}
                      <div className="border-t border-slate-100 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
                <Link 
                  to="/login" 
                  className="text-slate-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="mb-4 mt-2">
              <SearchBar />
            </div>
            {[
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
              { name: 'Categories', path: '/categories' },
              { name: 'Sellers', path: '/sellers' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated && (
               <div className="pt-4 flex flex-col space-y-2">
                  <Link 
                    to="/login"
                    className="block w-full text-center px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Navigation Menu */}
      <div className="hidden md:block border-t border-slate-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-3 overflow-x-auto no-scrollbar">
            {[
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
              { name: 'Categories', path: '/categories' },
              { name: 'Sellers', path: '/sellers' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="text-slate-600 hover:text-primary-600 font-medium whitespace-nowrap text-sm uppercase tracking-wide transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;