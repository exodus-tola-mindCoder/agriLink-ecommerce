import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Shirt, 
  Coffee, 
  Home, 
  Book, 
  Dumbbell, 
  Car, 
  Heart, 
  Gamepad2, 
  Palette, 
  MoreHorizontal 
} from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Smartphones, laptops, gadgets and more',
      icon: Smartphone,
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 1250,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'clothing',
      name: 'Clothing & Fashion',
      description: 'Traditional and modern clothing',
      icon: Shirt,
      image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 890,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'food_beverages',
      name: 'Food & Beverages',
      description: 'Local delicacies, coffee, spices and more',
      icon: Coffee,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 567,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'home_garden',
      name: 'Home & Garden',
      description: 'Furniture, decor, and garden supplies',
      icon: Home,
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 743,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'books_media',
      name: 'Books & Media',
      description: 'Books, magazines, music and movies',
      icon: Book,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 324,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'sports_outdoors',
      name: 'Sports & Outdoors',
      description: 'Sports equipment and outdoor gear',
      icon: Dumbbell,
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 456,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'automotive',
      name: 'Automotive',
      description: 'Car parts, accessories and tools',
      icon: Car,
      image: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 289,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'health_beauty',
      name: 'Health & Beauty',
      description: 'Skincare, cosmetics and wellness',
      icon: Heart,
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 612,
      color: 'from-rose-500 to-rose-600'
    },
    {
      id: 'toys_games',
      name: 'Toys & Games',
      description: 'Toys, games and entertainment',
      icon: Gamepad2,
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 378,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'crafts_hobbies',
      name: 'Crafts & Hobbies',
      description: 'Art supplies, crafts and hobby items',
      icon: Palette,
      image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 234,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Miscellaneous items and unique finds',
      icon: MoreHorizontal,
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 156,
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const featuredCategories = categories.slice(0, 4);
  const allCategories = categories;

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of products from local Ethiopian sellers. 
            Find everything you need in one place.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <category.icon className="h-8 w-8 mb-2" />
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{category.description}</p>
                  <p className="text-xs font-medium">{category.productCount} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-all duration-200 hover:border-violet-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-violet-800 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{category.productCount} products</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Ethiopian Coffee',
              'Traditional Clothing',
              'Smartphones',
              'Home Decor',
              'Spices',
              'Handmade Crafts',
              'Electronics',
              'Books',
              'Beauty Products',
              'Sports Equipment'
            ].map((search, index) => (
              <Link
                key={index}
                to={`/products?search=${encodeURIComponent(search)}`}
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-violet-100 hover:text-violet-800 transition-colors border border-gray-200 hover:border-violet-300"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-violet-800 to-orange-500 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-lg mb-6 opacity-90">
              Contact our sellers directly or browse all products to discover unique items.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="bg-white text-violet-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse All Products
              </Link>
              <Link
                to="/sellers"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-violet-800 transition-colors"
              >
                Find Sellers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;