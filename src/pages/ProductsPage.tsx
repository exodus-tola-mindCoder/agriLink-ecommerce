import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import { ProductFilters } from '../services/productService';

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');

  const { data, loading, error } = useProducts(filters);
  const { addItem } = useCart();
  const { addNotification } = useNotifications();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food_beverages', label: 'Food & Beverages' },
    { value: 'home_garden', label: 'Home & Garden' },
    { value: 'books_media', label: 'Books & Media' },
    { value: 'sports_outdoors', label: 'Sports & Outdoors' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health_beauty', label: 'Health & Beauty' },
    { value: 'toys_games', label: 'Toys & Games' },
    { value: 'crafts_hobbies', label: 'Crafts & Hobbies' },
    { value: 'other', label: 'Other' }
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = () => {
    handleFilterChange('search', searchTerm);
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
    
    let minPrice, maxPrice;
    switch (range) {
      case 'under-100':
        maxPrice = 100;
        break;
      case '100-500':
        minPrice = 100;
        maxPrice = 500;
        break;
      case '500-1000':
        minPrice = 500;
        maxPrice = 1000;
        break;
      case 'over-1000':
        minPrice = 1000;
        break;
      default:
        minPrice = undefined;
        maxPrice = undefined;
    }

    setFilters(prev => ({
      ...prev,
      minPrice,
      maxPrice,
      page: 1
    }));
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: getMainImage(product.images),
      seller: product.seller,
      stock: product.stock
    };

    addItem(cartItem);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`
    });
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

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Products</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover amazing products from local sellers</p>
        </div>

        {/* Filters */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value === 'all' ? undefined : e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Prices</option>
                <option value="under-100">Under 100 ETB</option>
                <option value="100-500">100 - 500 ETB</option>
                <option value="500-1000">500 - 1,000 ETB</option>
                <option value="over-1000">Over 1,000 ETB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="ratings.average-desc">Highest Rated</option>
                <option value="salesCount-desc">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSearch}
              className="bg-violet-800 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                setPriceRange('all');
                setFilters({
                  page: 1,
                  limit: 12,
                  category: 'all',
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
                });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        {data && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {data.products.length} of {data.total} products
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
          </div>
        )}

        {/* Products Grid */}
        {data && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <div key={product._id} className="bg-orange-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-orange-200">
                <div className="relative">
                  <img
                    src={getMainImage(product.images)}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {product.isFeatured && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Sale
                      </span>
                    )}
                  </div>
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </Link>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.seller.businessName || `${product.seller.firstName} ${product.seller.lastName}`}
                  </p>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Stock: {product.stock}</span>
                    <span>{product.salesCount} sold</span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-violet-800 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {data && !loading && data.products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handleFilterChange('page', page)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      filters.page === page
                        ? 'bg-violet-800 text-white border-violet-800'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handleFilterChange('page', Math.min(data.totalPages, (filters.page || 1) + 1))}
                disabled={filters.page === data.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;