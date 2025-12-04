import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters } from '../services/productService';
import ProductCard from '../components/products/ProductCard';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, loading, error } = useProducts(filters);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'coffee_tea', label: 'Coffee & Tea' },
    { value: 'spices', label: 'Spices & Herbs' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'fruits_vegetables', label: 'Fruits & Vegetables' },
    { value: 'clothing', label: 'Traditional Clothing' },
    { value: 'handicrafts', label: 'Handicrafts' },
    { value: 'honey', label: 'Honey & Jam' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'home_garden', label: 'Home & Garden' },
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Products</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-primary-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl font-display font-bold mb-4">Marketplace</h1>
          <p className="text-primary-100 text-lg max-w-2xl">
            Discover authentic Ethiopian products directly from local farmers and artisans. 
            Fresh, fair, and delivered to your door.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-medium"
          >
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Sort
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
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
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Reset All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-2 top-2 text-slate-400 hover:text-primary-600"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                  {categories.map((category) => (
                    <label key={category.value} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={filters.category === category.value || (!filters.category && category.value === 'all')}
                        onChange={(e) => handleFilterChange('category', e.target.value === 'all' ? undefined : e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under-100">Under 100 ETB</option>
                  <option value="100-500">100 - 500 ETB</option>
                  <option value="500-1000">500 - 1,000 ETB</option>
                  <option value="over-1000">Over 1,000 ETB</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="ratings.average-desc">Highest Rated</option>
                  <option value="salesCount-desc">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            {data && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-slate-600">
                  Showing <span className="font-bold text-slate-900">{data.products.length}</span> of <span className="font-bold text-slate-900">{data.total}</span> products
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {/* Products Grid */}
            {data && !loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {data && !loading && data.products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  We couldn't find what you're looking for. Try adjusting your search or filters.
                </p>
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
                  className="mt-6 text-primary-600 font-medium hover:text-primary-700"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                    disabled={filters.page === 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                      const page = i + 1;
                      // Simple logic to show current page range - can be improved for large page counts
                      return (
                        <button
                          key={page}
                          onClick={() => handleFilterChange('page', page)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                            filters.page === page
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(data.totalPages, (filters.page || 1) + 1))}
                    disabled={filters.page === data.totalPages}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;