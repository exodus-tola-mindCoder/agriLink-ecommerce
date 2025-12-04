import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: Array<{ url: string; isMain: boolean }>;
    category: string;
    stock: number;
    seller: {
      businessName?: string;
      firstName: string;
      lastName: string;
    };
    ratings: {
      average: number;
      count: number;
    };
    isFeatured?: boolean;
    salesCount?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { addNotification } = useNotifications();

  const getMainImage = (images: Array<{ url: string; isMain: boolean }>) => {
    const mainImage = images.find(img => img.isMain);
    return mainImage ? mainImage.url : images[0]?.url || 'https://images.pexels.com/photos/441923/pexels-photo-441923.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={getMainImage(product.images)} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-accent-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
              Featured
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist logic here
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Quick view logic here
            }}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-1">
          <p className="text-xs font-medium text-primary-600 uppercase tracking-wide truncate">
            {product.category.replace('_', ' ')}
          </p>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-slate-500 mb-3 truncate">
          By {product.seller.businessName || `${product.seller.firstName} ${product.seller.lastName}`}
        </p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center bg-secondary-50 px-2 py-1 rounded-md">
            <Star className="h-3.5 w-3.5 text-secondary-500 fill-current" />
            <span className="ml-1 text-xs font-bold text-secondary-700">{product.ratings.average.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-slate-300">•</span>
          <span className="text-xs text-slate-500">{product.ratings.count} reviews</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              product.stock > 0 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
