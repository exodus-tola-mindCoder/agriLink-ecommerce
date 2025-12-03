import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { wishlistService, WishlistItem } from '../services/wishlistService';

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setWishlistItems(response.items);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load wishlist');
      // Fallback to localStorage
      loadLocalWishlist();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalWishlist = () => {
    const savedWishlist = localStorage.getItem('eastlink-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMainImage = (images: Array<{ url: string; isMain: boolean }>) => {
    const mainImage = images.find(img => img.isMain);
    return mainImage ? mainImage.url : images[0]?.url || 'https://images.pexels.com/photos/441923/pexels-photo-441923.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (isAuthenticated) {
        await wishlistService.removeFromWishlist(productId);
      } else {
        // Update localStorage
        const updatedWishlist = wishlistItems.filter(item => item._id !== productId);
        localStorage.setItem('eastlink-wishlist', JSON.stringify(updatedWishlist));
      }
      
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      
      addNotification({
        type: 'success',
        title: 'Removed from Wishlist',
        message: 'Item has been removed from your wishlist.'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to remove item from wishlist'
      });
    }
  };

  const addToCart = (item: WishlistItem) => {
    const cartItem = {
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: getMainImage(item.images),
      seller: item.seller,
      stock: item.stock
    };

    addItem(cartItem);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${item.name} has been added to your cart.`
    });
  };

  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        await wishlistService.clearWishlist();
      } else {
        localStorage.removeItem('eastlink-wishlist');
      }
      
      setWishlistItems([]);
      addNotification({
        type: 'success',
        title: 'Wishlist Cleared',
        message: 'All items have been removed from your wishlist.'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to clear wishlist'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
          <Link
            to="/login"
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Wishlist</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchWishlist}
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and never lose track of them.
            </p>
            <Link
              to="/products"
              className="bg-violet-800 text-white px-8 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-orange-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-orange-200">
                <div className="relative">
                  <img
                    src={getMainImage(item.images)}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/product/${item._id}`}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Link>
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.seller.businessName || `${item.seller.firstName} ${item.seller.lastName}`}
                  </p>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {item.ratings.average.toFixed(1)} ({item.ratings.count})
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    Stock: {item.stock > 0 ? item.stock : 'Out of stock'}
                  </div>
                  
                  <button 
                    onClick={() => addToCart(item)}
                    disabled={item.stock === 0}
                    className="w-full bg-violet-800 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>

                  {item.addedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;