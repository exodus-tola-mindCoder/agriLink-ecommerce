import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Truck,
  UserCheck,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

interface PlatformStats {
  userStats: Array<{ _id: string; count: number }>;
  orderStats: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  orderStatusStats: Array<{ _id: string; count: number }>;
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    price: number;
    salesCount: number;
    ratings: { average: number };
    sellerInfo: Array<{ businessName?: string; firstName: string; lastName: string }>;
  }>;
  topSellers: Array<{
    _id: string;
    totalOrders: number;
    totalRevenue: number;
    sellerInfo: Array<{ businessName?: string; firstName: string; lastName: string; email: string }>;
  }>;
  newUsers: {
    last7Days: number;
    last30Days: number;
  };
  deliverySuccessRate: number;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const getUserCount = (role: string) => {
    return stats?.userStats.find(stat => stat._id === role)?.count || 0;
  };

  const getOrderStatusCount = (status: string) => {
    return stats?.orderStatusStats.find(stat => stat._id === status)?.count || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
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
          onClick={fetchStats}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to EastLink Market Admin Panel</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.userStats.reduce((sum, stat) => sum + stat.count, 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-violet-800 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.orderStats.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats?.orderStats.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-400 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivery Success</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.deliverySuccessRate.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Distribution & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customers</span>
              <span className="font-semibold text-slate-900">{getUserCount('customer')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sellers</span>
              <span className="font-semibold text-slate-900">{getUserCount('seller')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Agents</span>
              <span className="font-semibold text-slate-900">{getUserCount('delivery_agent')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admins</span>
              <span className="font-semibold text-slate-900">{getUserCount('admin')}</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-semibold text-slate-900">{getOrderStatusCount('pending')}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Accepted</span>
              </div>
              <span className="font-semibold text-slate-900">{getOrderStatusCount('accepted')}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Delivered</span>
              </div>
              <span className="font-semibold text-slate-900">{getOrderStatusCount('delivered')}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Cancelled</span>
              </div>
              <span className="font-semibold text-slate-900">{getOrderStatusCount('cancelled')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Revenue Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {stats?.monthlyRevenue.map((month, index) => {
            const maxRevenue = Math.max(...(stats?.monthlyRevenue.map(m => m.revenue) || [1]));
            const height = (month.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-violet-800 rounded-t-md hover:bg-violet-700 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${getMonthName(month._id.month)} ${month._id.year}: ${formatCurrency(month.revenue)}`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">
                  {getMonthName(month._id.month)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Products & Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats?.topProducts.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.sellerInfo[0]?.businessName || 
                     `${product.sellerInfo[0]?.firstName} ${product.sellerInfo[0]?.lastName}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{product.salesCount} sales</p>
                  <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Sellers</h3>
          <div className="space-y-3">
            {stats?.topSellers.slice(0, 5).map((seller, index) => (
              <div key={seller._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">
                    {seller.sellerInfo[0]?.businessName || 
                     `${seller.sellerInfo[0]?.firstName} ${seller.sellerInfo[0]?.lastName}`}
                  </p>
                  <p className="text-sm text-gray-600">{seller.sellerInfo[0]?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{seller.totalOrders} orders</p>
                  <p className="text-sm text-gray-600">{formatCurrency(seller.totalRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New User Registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Users (7 days)</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.newUsers.last7Days || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Users (30 days)</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.newUsers.last30Days || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;