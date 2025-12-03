import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  Truck,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { api } from '../services/api';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueGrowth: number;
    orderGrowth: number;
    userGrowth: number;
  };
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    revenue: number;
    orders: number;
    products: number;
  }>;
  topSellers: Array<{
    _id: string;
    name: string;
    revenue: number;
    orders: number;
    products: number;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    revenue: number;
    sales: number;
    views: number;
  }>;
  userStats: {
    customers: number;
    sellers: number;
    deliveryAgents: number;
    newUsersThisMonth: number;
  };
  orderStats: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
  deliveryStats: {
    totalDeliveries: number;
    successRate: number;
    averageTime: number;
    onTimeRate: number;
  };
}

const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [activeChart, setActiveChart] = useState<'revenue' | 'orders' | 'users'>('revenue');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch platform stats
      const statsResponse = await api.get('/admin/stats');
      
      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        
        // Transform the data into analytics format
        const analyticsData: AnalyticsData = {
          overview: {
            totalRevenue: data.orderStats.totalRevenue || 0,
            totalOrders: data.orderStats.totalOrders || 0,
            totalUsers: data.userStats.reduce((sum: number, stat: any) => sum + stat.count, 0),
            totalProducts: data.topProducts.length * 10, // Estimate
            revenueGrowth: 12.5, // Mock data
            orderGrowth: 8.3,
            userGrowth: 15.2
          },
          salesTrend: data.monthlyRevenue.map((month: any) => ({
            date: `${month._id.year}-${month._id.month.toString().padStart(2, '0')}`,
            revenue: month.revenue,
            orders: month.orders
          })),
          categoryPerformance: [
            { category: 'Electronics', revenue: 125000, orders: 450, products: 120 },
            { category: 'Clothing', revenue: 89000, orders: 320, products: 85 },
            { category: 'Food & Beverages', revenue: 67000, orders: 280, products: 65 },
            { category: 'Home & Garden', revenue: 45000, orders: 180, products: 45 },
            { category: 'Health & Beauty', revenue: 38000, orders: 150, products: 38 }
          ],
          topSellers: data.topSellers.map((seller: any) => ({
            _id: seller._id,
            name: seller.sellerInfo[0]?.businessName || 
                  `${seller.sellerInfo[0]?.firstName} ${seller.sellerInfo[0]?.lastName}`,
            revenue: seller.totalRevenue,
            orders: seller.totalOrders,
            products: Math.floor(Math.random() * 50) + 10 // Mock data
          })),
          topProducts: data.topProducts.map((product: any) => ({
            _id: product._id,
            name: product.name,
            revenue: product.price * product.salesCount,
            sales: product.salesCount,
            views: Math.floor(Math.random() * 1000) + 100 // Mock data
          })),
          userStats: {
            customers: data.userStats.find((stat: any) => stat._id === 'customer')?.count || 0,
            sellers: data.userStats.find((stat: any) => stat._id === 'seller')?.count || 0,
            deliveryAgents: data.userStats.find((stat: any) => stat._id === 'delivery_agent')?.count || 0,
            newUsersThisMonth: data.newUsers.last30Days
          },
          orderStats: {
            pending: data.orderStatusStats.find((stat: any) => stat._id === 'pending')?.count || 0,
            processing: (data.orderStatusStats.find((stat: any) => stat._id === 'accepted')?.count || 0) +
                      (data.orderStatusStats.find((stat: any) => stat._id === 'preparing')?.count || 0),
            delivered: data.orderStatusStats.find((stat: any) => stat._id === 'delivered')?.count || 0,
            cancelled: data.orderStatusStats.find((stat: any) => stat._id === 'cancelled')?.count || 0
          },
          deliveryStats: {
            totalDeliveries: data.orderStats.totalOrders,
            successRate: data.deliverySuccessRate,
            averageTime: 2.5, // Mock data
            onTimeRate: 85.2 // Mock data
          }
        };

        setAnalytics(analyticsData);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const exportData = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eastlink-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={exportData}
            className="bg-violet-800 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(analytics.overview.totalRevenue)}
              </p>
              <p className={`text-sm ${analytics.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(analytics.overview.revenueGrowth)} from last month
              </p>
            </div>
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalOrders}</p>
              <p className={`text-sm ${analytics.overview.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(analytics.overview.orderGrowth)} from last month
              </p>
            </div>
            <div className="p-2 bg-blue-500 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalUsers}</p>
              <p className={`text-sm ${analytics.overview.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(analytics.overview.userGrowth)} from last month
              </p>
            </div>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalProducts}</p>
              <p className="text-sm text-gray-600">Active listings</p>
            </div>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Sales Trend</h3>
            <div className="flex space-x-2">
              {['revenue', 'orders', 'users'].map((chart) => (
                <button
                  key={chart}
                  onClick={() => setActiveChart(chart as any)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    activeChart === chart
                      ? 'bg-violet-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {chart.charAt(0).toUpperCase() + chart.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end space-x-2">
            {analytics.salesTrend.map((data, index) => {
              const maxValue = Math.max(...analytics.salesTrend.map(d => 
                activeChart === 'revenue' ? d.revenue : d.orders
              ));
              const value = activeChart === 'revenue' ? data.revenue : data.orders;
              const height = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-violet-800 rounded-t-md hover:bg-violet-700 transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${data.date}: ${activeChart === 'revenue' ? formatCurrency(value) : value}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">
                    {data.date.split('-')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Performance</h3>
          <div className="space-y-3">
            {analytics.categoryPerformance.map((category, index) => {
              const maxRevenue = Math.max(...analytics.categoryPerformance.map(c => c.revenue));
              const percentage = (category.revenue / maxRevenue) * 100;
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-900">{category.category}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-violet-800 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{category.orders} orders</span>
                    <span>{category.products} products</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sellers */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Sellers</h3>
          <div className="space-y-3">
            {analytics.topSellers.slice(0, 5).map((seller, index) => (
              <div key={seller._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{seller.name}</p>
                  <p className="text-sm text-gray-600">{seller.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(seller.revenue)}</p>
                  <p className="text-sm text-gray-600">{seller.products} products</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-gray-600">{product.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-semibold text-slate-900">{analytics.orderStats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Processing</span>
              </div>
              <span className="font-semibold text-slate-900">{analytics.orderStats.processing}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Delivered</span>
              </div>
              <span className="font-semibold text-slate-900">{analytics.orderStats.delivered}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Cancelled</span>
              </div>
              <span className="font-semibold text-slate-900">{analytics.orderStats.cancelled}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User & Delivery Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">User Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.userStats.customers}</div>
              <div className="text-sm text-gray-600">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.userStats.sellers}</div>
              <div className="text-sm text-gray-600">Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.userStats.deliveryAgents}</div>
              <div className="text-sm text-gray-600">Delivery Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.userStats.newUsersThisMonth}</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-slate-900">{analytics.deliveryStats.successRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Time</span>
              <span className="font-semibold text-slate-900">{analytics.deliveryStats.averageTime} hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">On-Time Rate</span>
              <span className="font-semibold text-slate-900">{analytics.deliveryStats.onTimeRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Deliveries</span>
              <span className="font-semibold text-slate-900">{analytics.deliveryStats.totalDeliveries}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;