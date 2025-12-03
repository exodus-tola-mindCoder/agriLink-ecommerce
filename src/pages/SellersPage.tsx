import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Store, 
  Award, 
  TrendingUp,
  Users,
  Package,
  Filter
} from 'lucide-react';

const SellersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Mock sellers data
  const sellers = [
    {
      id: 1,
      businessName: 'Harar Coffee Co.',
      ownerName: 'Ahmed Hassan',
      email: 'ahmed@hararcoffee.et',
      phone: '+251-25-666-1001',
      location: 'Harar',
      category: 'Food & Beverages',
      rating: 4.9,
      reviewCount: 245,
      productCount: 28,
      joinedDate: '2023-01-15',
      isVerified: true,
      isFeatured: true,
      avatar: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium Ethiopian coffee beans sourced directly from Harar highlands. Family business with 3 generations of coffee expertise.',
      specialties: ['Organic Coffee', 'Traditional Roasting', 'Export Quality'],
      totalSales: 1250,
      responseTime: '2 hours'
    },
    {
      id: 2,
      businessName: 'Traditional Crafts Ethiopia',
      ownerName: 'Meron Tadesse',
      email: 'meron@traditionalcrafts.et',
      phone: '+251-25-666-1002',
      location: 'Dire Dawa',
      category: 'Clothing & Fashion',
      rating: 4.7,
      reviewCount: 189,
      productCount: 45,
      joinedDate: '2023-03-20',
      isVerified: true,
      isFeatured: false,
      avatar: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Authentic Ethiopian traditional clothing and handwoven textiles. Preserving cultural heritage through modern e-commerce.',
      specialties: ['Handwoven Textiles', 'Traditional Clothing', 'Cultural Items'],
      totalSales: 890,
      responseTime: '4 hours'
    },
    {
      id: 3,
      businessName: 'Tech Solutions Dire Dawa',
      ownerName: 'Daniel Bekele',
      email: 'daniel@techsolutions.et',
      phone: '+251-25-666-1003',
      location: 'Dire Dawa',
      category: 'Electronics',
      rating: 4.6,
      reviewCount: 312,
      productCount: 67,
      joinedDate: '2022-11-10',
      isVerified: true,
      isFeatured: true,
      avatar: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Latest electronics and gadgets with warranty and technical support. Authorized dealer for major brands.',
      specialties: ['Smartphones', 'Laptops', 'Accessories'],
      totalSales: 2100,
      responseTime: '1 hour'
    },
    {
      id: 4,
      businessName: 'Natural Products Hararge',
      ownerName: 'Fatuma Ali',
      email: 'fatuma@naturalproducts.et',
      phone: '+251-25-666-1004',
      location: 'Hararge',
      category: 'Health & Beauty',
      rating: 4.8,
      reviewCount: 156,
      productCount: 34,
      joinedDate: '2023-05-08',
      isVerified: true,
      isFeatured: false,
      avatar: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Organic honey, natural skincare products, and traditional remedies from the Hararge region.',
      specialties: ['Organic Honey', 'Natural Skincare', 'Herbal Products'],
      totalSales: 567,
      responseTime: '3 hours'
    },
    {
      id: 5,
      businessName: 'Home Essentials Plus',
      ownerName: 'Solomon Girma',
      email: 'solomon@homeessentials.et',
      phone: '+251-25-666-1005',
      location: 'Harar',
      category: 'Home & Garden',
      rating: 4.5,
      reviewCount: 98,
      productCount: 52,
      joinedDate: '2023-02-14',
      isVerified: true,
      isFeatured: false,
      avatar: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Quality home furniture, decor, and garden supplies. Making homes beautiful across Eastern Ethiopia.',
      specialties: ['Furniture', 'Home Decor', 'Garden Supplies'],
      totalSales: 743,
      responseTime: '5 hours'
    },
    {
      id: 6,
      businessName: 'Spice Masters',
      ownerName: 'Yohannes Tesfaye',
      email: 'yohannes@spicemasters.et',
      phone: '+251-25-666-1006',
      location: 'Hararge',
      category: 'Food & Beverages',
      rating: 4.9,
      reviewCount: 203,
      productCount: 23,
      joinedDate: '2022-12-05',
      isVerified: true,
      isFeatured: true,
      avatar: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium Ethiopian spices and seasonings. Traditional blends passed down through generations.',
      specialties: ['Traditional Spices', 'Spice Blends', 'Organic Seasonings'],
      totalSales: 1456,
      responseTime: '2 hours'
    }
  ];

  const categories = [
    'all',
    'Electronics',
    'Clothing & Fashion',
    'Food & Beverages',
    'Home & Garden',
    'Health & Beauty',
    'Books & Media',
    'Sports & Outdoors'
  ];

  const locations = ['all', 'Harar', 'Dire Dawa', 'Hararge'];

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || seller.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || seller.location === locationFilter;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const sortedSellers = [...filteredSellers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'sales':
        return b.totalSales - a.totalSales;
      case 'products':
        return b.productCount - a.productCount;
      case 'newest':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return 0;
    }
  });

  const featuredSellers = sellers.filter(seller => seller.isFeatured);

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Meet Our Sellers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover trusted local businesses and entrepreneurs across Harar, Dire Dawa, and Hararge. 
            Connect directly with verified sellers offering quality products and services.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-orange-50 rounded-lg p-6 text-center border border-orange-200">
            <div className="w-12 h-12 bg-violet-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">500+</div>
            <div className="text-gray-600">Active Sellers</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 text-center border border-orange-200">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">10K+</div>
            <div className="text-gray-600">Products Listed</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 text-center border border-orange-200">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">4.7</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 text-center border border-orange-200">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">25K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
        </div>

        {/* Featured Sellers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSellers.map((seller) => (
              <div key={seller.id} className="bg-gradient-to-r from-violet-800 to-orange-500 rounded-lg p-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={seller.avatar}
                    alt={seller.businessName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{seller.businessName}</h3>
                    <p className="text-orange-100">{seller.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    <span className="font-medium">{seller.rating}</span>
                  </div>
                  <div className="text-orange-100">•</div>
                  <div className="text-orange-100">{seller.totalSales} sales</div>
                </div>
                <p className="text-orange-100 text-sm mb-4">{seller.description}</p>
                <Link
                  to={`/seller/${seller.id}`}
                  className="inline-block bg-white text-violet-800 px-4 py-2 rounded-md font-medium hover:bg-orange-50 transition-colors"
                >
                  View Store
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sellers..."
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="sales">Most Sales</option>
                <option value="products">Most Products</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setLocationFilter('all');
                  setSortBy('rating');
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedSellers.length} of {sellers.length} sellers
          </p>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedSellers.map((seller) => (
            <div key={seller.id} className="bg-orange-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-orange-200">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={seller.avatar}
                    alt={seller.businessName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-slate-900">{seller.businessName}</h3>
                      {seller.isVerified && (
                        <Award className="h-4 w-4 text-green-500" title="Verified Seller" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{seller.ownerName}</p>
                    <p className="text-gray-500 text-xs">{seller.category}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-slate-900">{seller.rating}</span>
                    <span className="text-gray-500 text-sm">({seller.reviewCount})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{seller.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{seller.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Products:</span>
                    <span className="font-medium text-slate-900 ml-1">{seller.productCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sales:</span>
                    <span className="font-medium text-slate-900 ml-1">{seller.totalSales}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Response:</span>
                    <span className="font-medium text-slate-900 ml-1">{seller.responseTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-medium text-slate-900 ml-1">
                      {new Date(seller.joinedDate).getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.specialties.slice(0, 2).map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                  {seller.specialties.length > 2 && (
                    <span className="text-gray-500 text-xs">+{seller.specialties.length - 2} more</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/seller/${seller.id}`}
                    className="flex-1 bg-violet-800 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors text-center font-medium"
                  >
                    View Store
                  </Link>
                  <button className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-violet-800 to-orange-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Become a Seller?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join hundreds of successful sellers on EastLink Market and reach customers across Eastern Ethiopia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-violet-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Selling Today
            </Link>
            <Link
              to="/seller-guide"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-violet-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellersPage;