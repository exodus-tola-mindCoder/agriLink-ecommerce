import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading, error } = useProduct(productId!);
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const { isAuthenticated } = useAuth();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'seller'>('description');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMainImage = (images: Array<{ url: string; isMain: boolean }>) => {
    if (!images || images.length === 0) {
      return 'https://images.pexels.com/photos/441923/pexels-photo-441923.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    return images[selectedImageIndex]?.url || images[0]?.url;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      addNotification({
        type: 'success',
        title: 'Link Copied',
        message: 'Product link copied to clipboard!'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/products"
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-violet-800">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-violet-800">Products</Link>
          <span>/</span>
          <span className="text-slate-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-violet-800 hover:text-violet-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={getMainImage(product.images)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-violet-800' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.ratings.average.toFixed(1)}</span>
                  <span className="text-gray-500">({product.ratings.count} reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{product.salesCount} sold</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-violet-800">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Stock:</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  (Min: {product.minOrderQuantity}, Max: {product.maxOrderQuantity})
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-violet-800 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-3 mb-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="font-medium text-slate-900">Free Delivery</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Available in Harar, Dire Dawa, and Hararge regions
              </p>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Cash on Delivery Available</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-slate-900 mb-2">Sold by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <span className="text-violet-800 font-medium">
                    {product.seller.businessName?.[0] || product.seller.firstName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {product.seller.businessName || `${product.seller.firstName} ${product.seller.lastName}`}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.seller.ratings.average.toFixed(1)} ({product.seller.ratings.count} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { key: 'description', label: 'Description' },
                { key: 'reviews', label: `Reviews (${product.ratings.count})` },
                { key: 'seller', label: 'Seller Info' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-violet-800 text-violet-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-slate-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.dimensions && (
                  <div className="mt-6">
                    <h4 className="font-medium text-slate-900 mb-3">Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {product.weight && (
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-2 font-medium">{product.weight} kg</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="ml-2 font-medium">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-800 font-medium">
                            {review.user.firstName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {review.user.firstName} {review.user.lastName}
                          </p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                    <span className="text-violet-800 font-bold text-xl">
                      {product.seller.businessName?.[0] || product.seller.firstName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {product.seller.businessName || `${product.seller.firstName} ${product.seller.lastName}`}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{product.seller.ratings.average.toFixed(1)}</span>
                      <span className="text-gray-500">({product.seller.ratings.count} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Harar, Ethiopia</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">+251-25-666-1234</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">seller@eastlinkmarket.et</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Store Policies</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Free delivery within city limits</p>
                      <p>• 7-day return policy</p>
                      <p>• Cash on delivery accepted</p>
                      <p>• Quality guarantee</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/seller/${product.seller._id}`}
                    className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    View Store
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;