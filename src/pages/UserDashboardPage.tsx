import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  DollarSign,
  Eye,
  Calendar,
  User,
  Settings,
  Bell,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await userService.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'dispatched': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'customer' && 'Manage your orders and account settings'}
            {user?.role === 'seller' && 'Track your sales and manage your products'}
            {user?.role === 'delivery_agent' && 'View your delivery assignments and earnings'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {user?.role === 'customer' && (
            <>
              <Link
                to="/products"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-violet-800 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Browse</p>
                    <p className="text-lg font-bold text-slate-900">Products</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/orders"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My</p>
                    <p className="text-lg font-bold text-slate-900">Orders</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/wishlist"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My</p>
                    <p className="text-lg font-bold text-slate-900">Wishlist</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/profile"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Account</p>
                    <p className="text-lg font-bold text-slate-900">Settings</p>
                  </div>
                </div>
              </Link>
            </>
          )}

          {user?.role === 'seller' && (
            <>
              <Link
                to="/seller/products"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-violet-800 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My</p>
                    <p className="text-lg font-bold text-slate-900">Products</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/seller/orders"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Sales</p>
                    <p className="text-lg font-bold text-slate-900">Orders</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/seller/analytics"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Sales</p>
                    <p className="text-lg font-bold text-slate-900">Analytics</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/seller/add-product"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Add</p>
                    <p className="text-lg font-bold text-slate-900">Product</p>
                  </div>
                </div>
              </Link>
            </>
          )}

          {user?.role === 'delivery_agent' && (
            <>
              <Link
                to="/delivery/orders"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-violet-800 rounded-lg">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My</p>
                    <p className="text-lg font-bold text-slate-900">Deliveries</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/delivery/earnings"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My</p>
                    <p className="text-lg font-bold text-slate-900">Earnings</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/delivery/schedule"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My</p>
                    <p className="text-lg font-bold text-slate-900">Schedule</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/profile"
                className="bg-orange-50 rounded-lg p-6 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Account</p>
                    <p className="text-lg font-bold text-slate-900">Settings</p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Dashboard Content Based on Role */}
        {user?.role === 'customer' && dashboardData?.recentOrders && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                <Link to="/orders" className="text-violet-800 hover:text-violet-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentOrders.map((order: any) => (
                    <div key={order._id} className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item(s) • {formatCurrency(order.finalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link
                    to="/products"
                    className="text-violet-800 hover:text-violet-700 font-medium"
                  >
                    Start shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Order Stats */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Statistics</h2>
              {dashboardData.orderStats && dashboardData.orderStats.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.orderStats.map((stat: any) => (
                    <div key={stat._id} className="flex justify-between items-center">
                      <span className="text-gray-600 capitalize">{stat._id.replace('_', ' ')}</span>
                      <span className="font-medium text-slate-900">{stat.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No order statistics available</p>
              )}
            </div>
          </div>
        )}

        {user?.role === 'seller' && dashboardData?.productStats && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sales Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-2xl font-bold text-slate-900">
                    {dashboardData.productStats.totalProducts}
                  </div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-2xl font-bold text-slate-900">
                    {dashboardData.productStats.activeProducts}
                  </div>
                  <div className="text-sm text-gray-600">Active Products</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-2xl font-bold text-slate-900">
                    {dashboardData.productStats.totalSales}
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatCurrency(dashboardData.revenueStats?.totalRevenue || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Products</h2>
                  <Link to="/seller/products" className="text-violet-800 hover:text-violet-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                {dashboardData.recentProducts && dashboardData.recentProducts.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentProducts.map((product: any) => (
                      <div key={product._id} className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products yet</p>
                    <Link
                      to="/seller/add-product"
                      className="text-violet-800 hover:text-violet-700 font-medium"
                    >
                      Add your first product
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Orders</h2>
              {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentOrders.map((order: any) => (
                    <div key={order._id} className="bg-white rounded-lg p-3 border border-orange-200">
                      <p className="font-medium text-slate-900 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(order.finalAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No recent orders</p>
              )}
            </div>
          </div>
        )}

        {user?.role === 'delivery_agent' && dashboardData?.recentDeliveries && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Deliveries */}
            <div className="lg:col-span-2 bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Deliveries</h2>
                <Link to="/delivery/orders" className="text-violet-800 hover:text-violet-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {dashboardData.recentDeliveries.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentDeliveries.map((delivery: any) => (
                    <div key={delivery._id} className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">{delivery.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {delivery.customer?.firstName} {delivery.customer?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {delivery.deliveryAddress?.city}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.orderStatus)}`}>
                          {delivery.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No deliveries assigned yet</p>
                </div>
              )}
            </div>

            {/* Delivery Stats */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Delivery Statistics</h2>
              {dashboardData.deliveryStats && dashboardData.deliveryStats.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.deliveryStats.map((stat: any) => (
                    <div key={stat._id} className="flex justify-between items-center">
                      <span className="text-gray-600 capitalize">{stat._id.replace('_', ' ')}</span>
                      <span className="font-medium text-slate-900">{stat.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No delivery statistics available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;