import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Star, 
  Truck, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Package
} from 'lucide-react';
import { api } from '../services/api';

interface DeliveryAgent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: string;
  licenseNumber: string;
  address: {
    street: string;
    city: string;
    region?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface DeliveryOrder {
  _id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
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
    instructions?: string;
  };
  orderStatus: string;
  finalAmount: number;
  createdAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
}

interface DeliveryStats {
  totalAgents: number;
  activeAgents: number;
  pendingApprovals: number;
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  deliverySuccessRate: number;
}

const AdminDeliveryPage: React.FC = () => {
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [activeTab, setActiveTab] = useState<'agents' | 'orders' | 'stats'>('agents');
  const [agentFilter, setAgentFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchDeliveryData();
  }, [activeTab, agentFilter, orderFilter, searchTerm, currentPage]);

  const fetchDeliveryData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'agents') {
        await fetchDeliveryAgents();
      } else if (activeTab === 'orders') {
        await fetchDeliveryOrders();
      } else {
        await fetchDeliveryStats();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch delivery data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryAgents = async () => {
    const params = new URLSearchParams({
      role: 'delivery_agent',
      page: currentPage.toString(),
      limit: '10',
      ...(agentFilter !== 'all' && { status: agentFilter }),
      ...(searchTerm && { search: searchTerm })
    });

    const response = await api.get(`/admin/users?${params}`);
    if (response.data.success) {
      setDeliveryAgents(response.data.data.users);
    }
  };

  const fetchDeliveryOrders = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '10',
      ...(orderFilter !== 'all' && { status: orderFilter }),
      ...(searchTerm && { search: searchTerm })
    });

    const response = await api.get(`/admin/orders?${params}`);
    if (response.data.success) {
      setDeliveryOrders(response.data.data.orders);
    }
  };

  const fetchDeliveryStats = async () => {
    const response = await api.get('/admin/stats');
    if (response.data.success) {
      const data = response.data.data;
      
      const agentStats = data.userStats.find((stat: any) => stat._id === 'delivery_agent');
      const totalAgents = agentStats?.count || 0;
      
      // Mock additional stats - in real app, these would come from backend
      setStats({
        totalAgents,
        activeAgents: Math.floor(totalAgents * 0.8),
        pendingApprovals: Math.floor(totalAgents * 0.1),
        totalDeliveries: data.orderStats.totalOrders,
        completedDeliveries: Math.floor(data.orderStats.totalOrders * 0.85),
        averageDeliveryTime: 2.5, // hours
        deliverySuccessRate: data.deliverySuccessRate
      });
    }
  };

  const updateAgentStatus = async (agentId: string, action: string) => {
    try {
      const response = await api.put(`/admin/users/${agentId}/status`, { action });
      if (response.data.success) {
        fetchDeliveryAgents();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update agent status');
    }
  };

  const assignDeliveryAgent = async (orderId: string, agentId: string) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status: 'dispatched',
        deliveryAgentId: agentId
      });
      if (response.data.success) {
        setShowAssignModal(false);
        setSelectedOrder(null);
        fetchDeliveryOrders();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to assign delivery agent');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
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
        <h1 className="text-2xl font-bold text-slate-900">Delivery Management</h1>
        <p className="text-gray-600">Manage delivery agents and track deliveries</p>
      </div>

      {/* Tabs */}
      <div className="bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex space-x-1 p-1">
          {[
            { key: 'agents', label: 'Delivery Agents', icon: User },
            { key: 'orders', label: 'Delivery Orders', icon: Package },
            { key: 'stats', label: 'Statistics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setCurrentPage(1);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-violet-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-orange-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
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

      {/* Content based on active tab */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setAgentFilter('all');
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Agents List */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Delivery Agents ({deliveryAgents.length})
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
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-orange-200">
                    {deliveryAgents.map((agent) => (
                      <tr key={agent._id} className="hover:bg-orange-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {agent.firstName} {agent.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{agent.email}</div>
                            <div className="text-sm text-gray-500">{agent.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-slate-900 capitalize">{agent.vehicleType}</span>
                          </div>
                          <div className="text-sm text-gray-500">{agent.licenseNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-slate-900">
                              {agent.ratings.average.toFixed(1)} ({agent.ratings.count})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            agent.isActive && agent.isApproved 
                              ? 'bg-green-100 text-green-800'
                              : !agent.isApproved 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {!agent.isApproved ? 'Pending' : agent.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedAgent(agent)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {!agent.isApproved && (
                              <button
                                onClick={() => updateAgentStatus(agent._id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            
                            {agent.isActive ? (
                              <button
                                onClick={() => updateAgentStatus(agent._id, 'deactivate')}
                                className="text-red-600 hover:text-red-900"
                                title="Deactivate"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => updateAgentStatus(agent._id, 'activate')}
                                className="text-green-600 hover:text-green-900"
                                title="Activate"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Orders</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setOrderFilter('all');
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-orange-50 rounded-lg border border-orange-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Delivery Orders ({deliveryOrders.length})
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
                        Delivery Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-orange-200">
                    {deliveryOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-orange-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(order.finalAmount)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {order.customer.firstName} {order.customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{order.customer.phone}</div>
                            <div className="text-sm text-gray-500">
                              {order.deliveryAddress.city}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.deliveryAgent ? (
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {order.deliveryAgent.firstName} {order.deliveryAgent.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{order.deliveryAgent.phone}</div>
                              <div className="text-sm text-gray-500 capitalize">{order.deliveryAgent.vehicleType}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.replace('_', ' ')}
                          </span>
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
                            
                            {!order.deliveryAgent && order.orderStatus === 'ready_for_pickup' && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowAssignModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                                title="Assign Agent"
                              >
                                <Truck className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Agents</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalAgents}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeAgents}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendingApprovals}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalDeliveries}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-slate-900">{stats.deliverySuccessRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Deliveries</span>
                  <span className="font-semibold text-slate-900">{stats.completedDeliveries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Delivery Time</span>
                  <span className="font-semibold text-slate-900">{stats.averageDeliveryTime} hours</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Motorcycle</span>
                  <span className="font-semibold text-slate-900">60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bicycle</span>
                  <span className="font-semibold text-slate-900">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Car</span>
                  <span className="font-semibold text-slate-900">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Van</span>
                  <span className="font-semibold text-slate-900">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && !showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Agent Details - {selectedAgent.firstName} {selectedAgent.lastName}
                </h3>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900">Contact Information</h4>
                    <p className="text-sm text-gray-600">{selectedAgent.email}</p>
                    <p className="text-sm text-gray-600">{selectedAgent.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Vehicle Details</h4>
                    <p className="text-sm text-gray-600 capitalize">{selectedAgent.vehicleType}</p>
                    <p className="text-sm text-gray-600">{selectedAgent.licenseNumber}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900">Address</h4>
                  <p className="text-sm text-gray-600">
                    {selectedAgent.address.street}, {selectedAgent.address.city}
                    {selectedAgent.address.region && `, ${selectedAgent.address.region}`}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900">Performance</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{selectedAgent.ratings.average.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-600">({selectedAgent.ratings.count} reviews)</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900">Status</h4>
                  <div className="flex space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedAgent.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedAgent.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedAgent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAgent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900">
                  Assign Delivery Agent - {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Available Agents</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {deliveryAgents
                      .filter(agent => agent.isActive && agent.isApproved)
                      .map((agent) => (
                        <div
                          key={agent._id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {agent.firstName} {agent.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{agent.phone}</p>
                            <p className="text-sm text-gray-600 capitalize">{agent.vehicleType}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm">{agent.ratings.average.toFixed(1)}</span>
                            </div>
                            <button
                              onClick={() => assignDeliveryAgent(selectedOrder._id, agent._id)}
                              className="bg-violet-800 text-white px-3 py-1 rounded text-sm hover:bg-violet-700"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryPage;