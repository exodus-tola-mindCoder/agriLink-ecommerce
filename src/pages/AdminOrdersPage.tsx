import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      images: Array<{ url: string; isMain: boolean }>;
    };
    quantity: number;
    price: number;
    seller: {
      _id: string;
      businessName?: string;
      firstName: string;
      lastName: string;
    };
  }>;
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryAgent?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    vehicleType: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    region?: string;
    instructions?: string;
  };
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface DeliveryAgent {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: string;
  ratings: {
    average: number;
    count: number;
  };
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchDeliveryAgents();
  }, [currentPage, searchTerm, statusFilter, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const response = await api.get(`/admin/orders?${params}`);
      if (response.data.success) {
        const data: OrdersResponse = response.data.data;
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryAgents = async () => {
    try {
      const response = await api.get('/admin/delivery-agents');
      if (response.data.success) {
        setDeliveryAgents(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch delivery agents:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, deliveryAgentId?: string) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status,
        ...(deliveryAgentId && { deliveryAgentId })
      });
      if (response.data.success) {
        fetchOrders(); // Refresh the list
        setShowAssignModal(false);
        setSelectedOrder(null);
        setSelectedAgent('');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready_for_pickup': return 'bg-indigo-100 text-indigo-800';
      case 'dispatched': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-cyan-100 text-cyan-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
        <p className="text-gray-600">Manage all orders on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setStartDate('');
                setEndDate('');
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

      {/* Orders Table */}
      <div className="bg-orange-50 rounded-lg border border-orange-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Orders ({total})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-800"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-200">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-orange-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} item(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(order.finalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        + {formatCurrency(order.deliveryFee)} delivery
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {order.orderStatus === 'accepted' && !order.deliveryAgent && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAssignModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Assign Delivery Agent"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Delivered"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Order"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-orange-100 px-6 py-3 flex items-center justify-between border-t border-orange-200">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} results
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

      {/* Order Details Modal */}
      {selectedOrder && !showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Order Details - {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">Customer</h4>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}
                    </p>
                    {selectedOrder.deliveryAddress.instructions && (
                      <p className="text-sm text-gray-500">
                        Note: {selectedOrder.deliveryAddress.instructions}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Seller: {item.seller.businessName || `${item.seller.firstName} ${item.seller.lastName}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.price)} x {item.quantity}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.finalAmount)}</span>
                  </div>
                </div>

                {selectedOrder.deliveryAgent && (
                  <div>
                    <h4 className="font-medium text-slate-900">Delivery Agent</h4>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.deliveryAgent.firstName} {selectedOrder.deliveryAgent.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedOrder.deliveryAgent.phone}</p>
                    <p className="text-sm text-gray-600">Vehicle: {selectedOrder.deliveryAgent.vehicleType}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Delivery Agent Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Assign Delivery Agent
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedOrder(null);
                    setSelectedAgent('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Delivery Agent
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Choose an agent...</option>
                    {deliveryAgents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.firstName} {agent.lastName} - {agent.vehicleType} 
                        ({agent.ratings.average.toFixed(1)}★ - {agent.ratings.count} reviews)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (selectedAgent) {
                        updateOrderStatus(selectedOrder._id, 'dispatched', selectedAgent);
                      }
                    }}
                    disabled={!selectedAgent}
                    className="flex-1 bg-violet-800 text-white px-4 py-2 rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Agent
                  </button>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedOrder(null);
                      setSelectedAgent('');
                    }}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;