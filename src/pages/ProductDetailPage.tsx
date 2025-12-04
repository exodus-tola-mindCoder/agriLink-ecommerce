import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Plus,
  Minus,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  ArrowRight
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
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="p-8 bg-slate-50/50">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm mb-4 relative group">
                <img
                  src={getMainImage(product.images)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isFeatured && (
                  <span className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Featured
                  </span>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index 
                          ? 'border-primary-500 ring-2 ring-primary-100' 
                          : 'border-transparent hover:border-slate-200'
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
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {product.category.replace('_', ' ')}
                  </span>
                  {product.stock > 0 ? (
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> In Stock
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-secondary-400 fill-current" />
                    <span className="font-bold text-slate-900 text-lg">{product.ratings.average.toFixed(1)}</span>
                    <span className="text-slate-500">({product.ratings.count} reviews)</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200"></div>
                  <span className="text-slate-600 font-medium">{product.salesCount} sold</span>
                </div>

                <div className="flex items-end space-x-4 mb-8">
                  <span className="text-4xl font-bold text-primary-700">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col mb-1">
                      <span className="text-lg text-slate-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-red-500">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed mb-8 line-clamp-3">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="flex items-center space-x-6 mb-8">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Quantity</span>
                    <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-full hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 rounded-full hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-500">
                      {product.stock} items available
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-primary-600 text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                  <button className="p-4 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-600">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-4 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-600"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                    <Truck className="h-6 w-6 text-secondary-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Fast Delivery</p>
                      <p className="text-xs text-slate-500">Within 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                    <Shield className="h-6 w-6 text-primary-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Secure Payment</p>
                      <p className="text-xs text-slate-500">Cash on delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100">
            <nav className="flex">
              {[
                { key: 'description', label: 'Description' },
                { key: 'reviews', label: `Reviews (${product.ratings.count})` },
                { key: 'seller', label: 'Seller Info' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-6 text-center font-bold text-sm uppercase tracking-wide transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8 lg:p-12">
            {activeTab === 'description' && (
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
                
                <div className="grid md:grid-cols-2 gap-12 mt-12">
                  {product.dimensions && (
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-xl mb-6">Specifications</h4>
                      <div className="space-y-4">
                        {product.weight && (
                          <div className="flex justify-between py-3 border-b border-slate-100">
                            <span className="text-slate-500">Weight</span>
                            <span className="font-medium text-slate-900">{product.weight} kg</span>
                          </div>
                        )}
                        <div className="flex justify-between py-3 border-b border-slate-100">
                          <span className="text-slate-500">Dimensions</span>
                          <span className="font-medium text-slate-900">
                            {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-xl mb-6">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-3xl mx-auto">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
                            {review.user.firstName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {review.user.firstName} {review.user.lastName}
                            </p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-secondary-400 fill-current' : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No reviews yet</h3>
                    <p className="text-slate-500">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-700 font-bold text-2xl">
                      {product.seller.businessName?.[0] || product.seller.firstName[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {product.seller.businessName || `${product.seller.firstName} ${product.seller.lastName}`}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-secondary-400 fill-current" />
                        <span className="font-bold text-slate-900">{product.seller.ratings.average.toFixed(1)}</span>
                        <span className="text-slate-500">({product.seller.ratings.count} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                        Contact Information
                      </h4>
                      <div className="space-y-3 text-slate-600">
                        <p>Harar, Ethiopia</p>
                        <p>+251-25-666-1234</p>
                        <p>seller@eastlinkmarket.et</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-primary-500" />
                        Store Policies
                      </h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Free delivery within city limits</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 7-day return policy</li>
                        <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Cash on delivery accepted</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                    <Link
                      to={`/seller/${product.seller._id}`}
                      className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors"
                    >
                      Visit Store <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
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