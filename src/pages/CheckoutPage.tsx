import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { orderService } from '../services/orderService';

const CheckoutPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || 'Harar',
    region: user?.address?.region || '',
    postalCode: user?.address?.postalCode || '',
    instructions: ''
  });

  const deliveryFees = {
    'Harar': 50,
    'Dire Dawa': 75,
    'Hararge': 100
  };

  const deliveryFee = deliveryFees[deliveryAddress.city as keyof typeof deliveryFees] || 50;
  const finalTotal = totalAmount + deliveryFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddressChange = (field: string, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      addNotification({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to place an order.'
      });
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      addNotification({
        type: 'error',
        title: 'Empty Cart',
        message: 'Your cart is empty. Add some products first.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryAddress,
        paymentMethod: 'cash_on_delivery' as const,
        notes: {
          customer: deliveryAddress.instructions
        }
      };

      const order = await orderService.createOrder(orderData);
      
      clearCart();
      addNotification({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Your order ${order.orderNumber} has been placed. You will receive a confirmation shortly.`
      });
      
      navigate(`/order/${order._id}`);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Order Failed',
        message: error.response?.data?.message || 'Failed to place order. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to place an order.</p>
          <Link
            to="/login"
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
          <Link
            to="/products"
            className="bg-violet-800 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/products"
            className="flex items-center space-x-2 text-violet-800 hover:text-violet-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-violet-800" />
                <h2 className="text-lg font-semibold text-slate-900">Delivery Address</h2>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      value={deliveryAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="Harar">Harar</option>
                      <option value="Dire Dawa">Dire Dawa</option>
                      <option value="Hararge">Hararge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.region}
                      onChange={(e) => handleAddressChange('region', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Region (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Postal code (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={deliveryAddress.instructions}
                    onChange={(e) => handleAddressChange('instructions', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-violet-800" />
                <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg bg-white">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cash_on_delivery"
                    checked={true}
                    readOnly
                    className="text-violet-800 focus:ring-violet-500"
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-medium text-slate-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order is delivered</div>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg bg-gray-50 opacity-50">
                  <input
                    type="radio"
                    id="online"
                    name="payment"
                    value="online_payment"
                    disabled
                    className="text-violet-800 focus:ring-violet-500"
                  />
                  <label htmlFor="online" className="flex-1">
                    <div className="font-medium text-gray-500">Online Payment</div>
                    <div className="text-sm text-gray-400">Coming soon - PayPal, Bank Transfer</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-5 w-5 text-violet-800" />
                <h2 className="text-lg font-semibold text-slate-900">Delivery Information</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium text-slate-900">2-4 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee ({deliveryAddress.city}):</span>
                  <span className="font-medium text-slate-900">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="text-gray-600">
                  <p>• Free delivery for orders over 1,000 ETB</p>
                  <p>• Delivery available Monday to Saturday</p>
                  <p>• Contact delivery agent for precise timing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-orange-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-orange-200 pt-2">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-violet-800">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={isLoading || !deliveryAddress.street}
                className="w-full bg-violet-800 text-white py-3 px-4 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 font-medium"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;