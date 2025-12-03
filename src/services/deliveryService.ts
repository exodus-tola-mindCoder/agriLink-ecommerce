import { api } from './api';

export interface DeliveryOrder {
  _id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
      weight?: number;
    };
    quantity: number;
    seller: {
      businessName?: string;
      firstName: string;
      lastName: string;
      address: {
        street: string;
        city: string;
      };
    };
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    instructions?: string;
  };
  finalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export interface DeliveryStats {
  overview: {
    totalDeliveries: number;
    completedDeliveries: number;
    totalEarnings: number;
    avgDeliveryTime: number;
  };
  statusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  dailyStats: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    deliveries: number;
    earnings: number;
  }>;
  period: string;
}

export interface EarningsData {
  dailyEarnings: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    dailyEarnings: number;
    deliveries: number;
  }>;
  totalEarnings: {
    total: number;
    totalDeliveries: number;
  };
  period: string;
}

export const deliveryService = {
  // Get available deliveries
  async getAvailableDeliveries(page = 1, limit = 10, city?: string): Promise<{ orders: DeliveryOrder[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (city) {
      params.append('city', city);
    }

    const response = await api.get(`/delivery/available?${params}`);
    return response.data.data;
  },

  // Accept delivery assignment
  async acceptDelivery(orderId: string): Promise<DeliveryOrder> {
    const response = await api.post(`/delivery/${orderId}/accept`);
    return response.data.data;
  },

  // Update delivery location
  async updateLocation(orderId: string, latitude: number, longitude: number): Promise<void> {
    await api.put(`/delivery/${orderId}/location`, {
      latitude,
      longitude,
    });
  },

  // Update delivery status
  async updateDeliveryStatus(orderId: string, status: string, notes?: string): Promise<DeliveryOrder> {
    const response = await api.put(`/delivery/${orderId}/status`, {
      status,
      notes,
    });
    return response.data.data;
  },

  // Complete delivery
  async completeDelivery(orderId: string, deliveryNotes?: string): Promise<DeliveryOrder> {
    const response = await api.post(`/delivery/${orderId}/complete`, {
      deliveryNotes,
    });
    return response.data.data;
  },

  // Get delivery history
  async getDeliveryHistory(page = 1, limit = 10, status?: string, startDate?: string, endDate?: string): Promise<{ orders: DeliveryOrder[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const response = await api.get(`/delivery/history?${params}`);
    return response.data.data;
  },

  // Get delivery statistics
  async getDeliveryStats(period = '30d'): Promise<DeliveryStats> {
    const response = await api.get(`/delivery/stats?period=${period}`);
    return response.data.data;
  },

  // Update availability
  async updateAvailability(isAvailable: boolean, workingHours?: { start: string; end: string }): Promise<void> {
    await api.put('/delivery/availability', {
      isAvailable,
      workingHours,
    });
  },

  // Get earnings
  async getEarnings(period = '30d'): Promise<EarningsData> {
    const response = await api.get(`/delivery/earnings?period=${period}`);
    return response.data.data;
  },

  // Report issue
  async reportIssue(orderId: string, type: string, description: string): Promise<void> {
    await api.post(`/delivery/${orderId}/issue`, {
      type,
      description,
    });
  },
};