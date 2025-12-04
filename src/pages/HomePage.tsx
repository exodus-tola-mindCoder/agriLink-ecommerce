import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, ArrowRight, Star, CheckCircle, MapPin, Phone } from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts(8);

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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center py-20 md:py-32">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary-800/50 rounded-full px-4 py-1.5 border border-primary-700 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
                <span className="text-sm font-medium text-primary-100">#1 Marketplace for Ethiopian Farmers</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                Fresh from the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-accent-400">Motherland</span>
              </h1>
              
              <p className="text-xl text-primary-100 max-w-lg leading-relaxed">
                Directly connecting farmers in Hararge, Harar, and Dire Dawa with buyers. No middlemen, just fair prices and fresh produce.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="bg-accent-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-600 transition-all duration-300 shadow-lg shadow-accent-500/30 flex items-center justify-center group"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Become a Seller
                </Link>
              </div>

              <div className="pt-8 flex items-center space-x-8 text-sm font-medium text-primary-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary-400" />
                  <span>Verified Sellers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary-400" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/20 to-secondary-500/20 rounded-[2rem] transform rotate-3 blur-2xl"></div>
              <img 
                src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Ethiopian marketplace" 
                className="relative rounded-[2rem] shadow-2xl border-4 border-white/10 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-lg font-bold text-gray-900">25k+ Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our diverse range of authentic Ethiopian products, sourced directly from local producers.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Coffee & Tea', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'coffee_tea', color: 'bg-amber-100 text-amber-800' },
              { name: 'Spices & Herbs', image: 'https://images.pexels.com/photos/2804394/pexels-photo-2804394.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'spices', color: 'bg-red-100 text-red-800' },
              { name: 'Grains & Cereals', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'grains', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Fruits & Veggies', image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'fruits_vegetables', color: 'bg-green-100 text-green-800' },
              { name: 'Traditional Cloth', image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'clothing', color: 'bg-purple-100 text-purple-800' },
              { name: 'Handicrafts', image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'handicrafts', color: 'bg-orange-100 text-orange-800' },
              { name: 'Honey & Jam', image: 'https://images.pexels.com/photos/33266/honey-sweet-syrup-organic.jpg?auto=compress&cs=tinysrgb&w=400', category: 'honey', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Livestock', image: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'livestock', color: 'bg-stone-100 text-stone-800' }
            ].map((category, index) => (
              <Link 
                key={index}
                to={`/products?category=${category.category}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
                  <span className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
                Featured Products
              </h2>
              <p className="text-slate-600">Handpicked quality items just for you</p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {featuredLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link 
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img 
                      src={getMainImage(product.images)} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-secondary-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-slate-600">{product.ratings.average.toFixed(1)}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-sm text-slate-500">{product.ratings.count} reviews</span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-xl font-bold text-primary-700">
                        {formatCurrency(product.price)}
                      </p>
                      <button className="bg-primary-50 text-primary-600 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors">
                        <ShoppingBag className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link 
              to="/products" 
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Trust Signals */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Payments</h3>
              <p className="text-slate-600">
                Safe and secure transactions with multiple payment options including Telebirr and CBE.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Reliable Delivery</h3>
              <p className="text-slate-600">
                Fast delivery network covering Harar, Dire Dawa, and surrounding rural areas.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Guarantee</h3>
              <p className="text-slate-600">
                All products are verified for quality. Not satisfied? We have a fair return policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AL</span>
                </div>
                <span className="text-2xl font-bold text-white">AgriLink</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Empowering Ethiopian farmers by connecting them directly with buyers. Fair trade, fresh products, future growth.
              </p>
              <div className="flex space-x-4">
                {/* Social Icons would go here */}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link to="/products" className="hover:text-primary-400 transition-colors">Shop Products</Link></li>
                <li><Link to="/sellers" className="hover:text-primary-400 transition-colors">Our Sellers</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Categories</h3>
              <ul className="space-y-4">
                <li><Link to="/products?category=coffee_tea" className="hover:text-primary-400 transition-colors">Coffee & Tea</Link></li>
                <li><Link to="/products?category=spices" className="hover:text-primary-400 transition-colors">Spices & Herbs</Link></li>
                <li><Link to="/products?category=grains" className="hover:text-primary-400 transition-colors">Grains & Cereals</Link></li>
                <li><Link to="/products?category=fruits_vegetables" className="hover:text-primary-400 transition-colors">Fruits & Vegetables</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-primary-500 flex-shrink-0" />
                  <span>Kebele 10, Harar, Ethiopia</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span>+251-25-666-1234</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-primary-500 flex-shrink-0">@</div>
                  <span>support@agrilink.et</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-500">
            <p>&copy; 2025 AgriLink Market. All rights reserved. Built with ❤️ for Ethiopia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;