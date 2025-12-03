import { api } from './api';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface DeliveryAddress {
  street: string;
  city: 'Harar' | 'Dire Dawa' | 'Hararge';
  region?: string;
  postalCode?: string;
  instructions?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod?: 'cash_on_delivery' | 'online_payment';
  notes?: {
    customer?: string;
  };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryAddress: DeliveryAddress;
  deliveryAgent?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    vehicleType: string;
  };
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  trackingUpdates: Array<{
    status: string;
    message: string;
    timestamp: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  }>;
  notes: {
    customer?: string;
    seller?: string;
    admin?: string;
  };
  cancellationReason?: string;
  isUrgent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface OrderTracking {
  orderNumber: string;
  currentStatus: string;
  trackingUpdates: Array<{
    status: string;
    message: string;
    timestamp: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  }>;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryAgent?: {
    firstName: string;
    lastName: string;
    phone: string;
    vehicleType: string;
  };
}

export const orderService = {
  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  },

  // Get user's orders
  async getUserOrders(page = 1, limit = 10, status?: string): Promise<OrdersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }

    const response = await api.get(`/orders/my-orders?${params}`);
    return response.data.data;
  },

  // Get seller's orders
  async getSellerOrders(page = 1, limit = 10, status?: string): Promise<OrdersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }

    const response = await api.get(`/orders/seller/orders?${params}`);
    return response.data.data;
  },

  // Get delivery agent's orders
  async getDeliveryOrders(page = 1, limit = 10, status?: string): Promise<OrdersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }

    const response = await api.get(`/orders/delivery/orders?${params}`);
    return response.data.data;
  },

  // Get single order
  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  },

  // Update order status (seller/admin)
  async updateOrderStatus(orderId: string, status: string, message?: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      message,
    });
    return response.data.data;
  },

  // Cancel order (customer)
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data.data;
  },

  // Update delivery status (delivery agent)
  async updateDeliveryStatus(
    orderId: string, 
    status: string, 
    message?: string, 
    location?: { latitude: number; longitude: number }
  ): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/delivery-status`, {
      status,
      message,
      location,
    });
    return response.data.data;
  },

  // Get order tracking
  async getOrderTracking(orderId: string): Promise<OrderTracking> {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data.data;
  },
};