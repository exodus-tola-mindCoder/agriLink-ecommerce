import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, Phone, Clock } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, loading, error } = useOrder(orderId!);

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
      case 'ready_for_pickup': return 'bg-indigo-100 text-indigo-800';
      case 'dispatched': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-cyan-100 text-cyan-800';
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The order you are looking for does not exist.'}</p>
          <Link
            to="/orders"
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/orders"
            className="flex items-center space-x-2 text-violet-800 hover:text-violet-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order {order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Order Status</h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-violet-800">{formatCurrency(order.finalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-orange-200">
                    <img
                      src={item.product.images?.[0]?.url || 'https://images.pexels.com/photos/441923/pexels-photo-441923.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Sold by: {item.seller.businessName || `${item.seller.firstName} ${item.seller.lastName}`}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-gray-600">each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Tracking</h2>
              <div className="space-y-4">
                {order.trackingUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-violet-800 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{update.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">Delivery Address</p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.city}
                      {order.deliveryAddress.region && `, ${order.deliveryAddress.region}`}
                    </p>
                  </div>
                </div>
                
                {order.estimatedDeliveryTime && (
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.estimatedDeliveryTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {order.deliveryAgent && (
                  <div className="flex items-start space-x-2">
                    <Truck className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Delivery Agent</p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAgent.firstName} {order.deliveryAgent.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{order.deliveryAgent.phone}</p>
                      <p className="text-sm text-gray-600 capitalize">{order.deliveryAgent.vehicleType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-orange-200 pt-2">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-bold text-violet-800">{formatCurrency(order.finalAmount)}</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm text-gray-600">Payment Method: </span>
                  <span className="text-sm font-medium text-slate-900">
                    {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Status: </span>
                  <span className={`text-sm font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes?.customer && (
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Delivery Instructions</h3>
                <p className="text-sm text-gray-600">{order.notes.customer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;