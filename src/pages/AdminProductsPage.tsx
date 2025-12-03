import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Star, 
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: Array<{ url: string; isMain: boolean }>;
  seller: {
    _id: string;
    businessName?: string;
    firstName: string;
    lastName: string;
  };
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  ratings: {
    average: number;
    count: number;
  };
  salesCount: number;
  viewCount: number;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    'electronics',
    'clothing',
    'food_beverages',
    'home_garden',
    'books_media',
    'sports_outdoors',
    'automotive',
    'health_beauty',
    'toys_games',
    'crafts_hobbies',
    'other'
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await api.get(`/admin/products?${params}`);
      if (response.data.success) {
        const data: ProductsResponse = response.data.data;
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, action: string) => {
    try {
      const response = await api.put(`/admin/products/${productId}/status`, { action });
      if (response.data.success) {
        fetchProducts(); // Refresh the list
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update product status');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/products/${productId}`);
      if (response.data.success) {
        fetchProducts(); // Refresh the list
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete product');
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
        <p className="text-gray-600">Manage all products on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
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
                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-orange-50 rounded-lg border border-orange-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Products ({total})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={getMainImage(product.images)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {product.isFeatured && (
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.seller.businessName || `${product.seller.firstName} ${product.seller.lastName}`}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.ratings.average.toFixed(1)} ({product.ratings.count})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Stock: {product.stock}</span>
                      <span>{product.salesCount} sold</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </button>
                      
                      {product.isActive ? (
                        <button
                          onClick={() => updateProductStatus(product._id, 'deactivate')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          title="Deactivate"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateProductStatus(product._id, 'activate')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          title="Activate"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => updateProductStatus(product._id, product.isFeatured ? 'unfeature' : 'feature')}
                        className={`px-3 py-1 rounded text-sm ${
                          product.isFeatured 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                        title={product.isFeatured ? 'Unfeature' : 'Feature'}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-orange-100 px-6 py-3 flex items-center justify-between border-t border-orange-200">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, total)} of {total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Product Details
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <img
                      src={getMainImage(selectedProduct.images)}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{selectedProduct.name}</h4>
                    <p className="text-2xl font-bold text-orange-500 mb-2">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{selectedProduct.ratings.average.toFixed(1)}</span>
                        <span className="text-gray-500">({selectedProduct.ratings.count} reviews)</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Category:</span> {selectedProduct.category.replace('_', ' ')}</p>
                      <p><span className="font-medium">Stock:</span> {selectedProduct.stock}</p>
                      <p><span className="font-medium">Sales:</span> {selectedProduct.salesCount}</p>
                      <p><span className="font-medium">Views:</span> {selectedProduct.viewCount}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-1 ${selectedProduct.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedProduct.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                      <p><span className="font-medium">Featured:</span> 
                        <span className={`ml-1 ${selectedProduct.isFeatured ? 'text-orange-600' : 'text-gray-600'}`}>
                          {selectedProduct.isFeatured ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-slate-900 mb-2">Description</h5>
                  <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                </div>

                <div>
                  <h5 className="font-medium text-slate-900 mb-2">Seller Information</h5>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {selectedProduct.seller.businessName || `${selectedProduct.seller.firstName} ${selectedProduct.seller.lastName}`}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-slate-900 mb-2">Product Images</h5>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;