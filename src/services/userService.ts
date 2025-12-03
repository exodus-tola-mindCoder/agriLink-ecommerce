import { api } from './api';

export interface DashboardData {
  user: any;
  recentOrders?: any[];
  recentProducts?: any[];
  recentDeliveries?: any[];
  orderStats?: Array<{ _id: string; count: number }>;
  productStats?: {
    totalProducts: number;
    activeProducts: number;
    totalViews: number;
    totalSales: number;
  };
  revenueStats?: {
    totalRevenue: number;
    totalOrders: number;
  };
  deliveryStats?: Array<{ _id: string; count: number }>;
}

export interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName?: string;
  address: {
    street: string;
    city: string;
    region?: string;
    postalCode?: string;
  };
  avatar?: string;
  ratings: {
    average: number;
    count: number;
  };
  productCount: number;
  totalSales: number;
  createdAt: string;
}

export interface SellersResponse {
  sellers: Seller[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface SellerProfile extends Seller {
  products: any[];
  stats: {
    totalOrders: number;
    totalRevenue: number;
  };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export interface NotificationsResponse {
  notifications: Notification[];
  hasMore: boolean;
}

export interface AnalyticsData {
  salesData: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    sales: number;
    revenue: number;
  }>;
  productPerformance: Array<{
    _id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    viewCount: number;
  }>;
  period: string;
}

export const userService = {
  // Get dashboard data
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/users/dashboard');
    return response.data.data;
  },

  // Get sellers with filters
  async getSellers(
    page = 1,
    limit = 12,
    category?: string,
    location?: string,
    search?: string,
    sortBy = 'ratings.average',
    sortOrder = 'desc'
  ): Promise<SellersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (category && category !== 'all') {
      params.append('category', category);
    }
    if (location && location !== 'all') {
      params.append('location', location);
    }
    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/users/sellers?${params}`);
    return response.data.data;
  },

  // Get seller profile
  async getSellerProfile(sellerId: string): Promise<SellerProfile> {
    const response = await api.get(`/users/sellers/${sellerId}`);
    return response.data.data;
  },

  // Update avatar
  async updateAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get notifications
  async getNotifications(page = 1, limit = 10, unreadOnly = false): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    const response = await api.get(`/users/notifications?${params}`);
    return response.data.data;
  },

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    await api.put(`/users/notifications/${notificationId}/read`);
  },

  // Get analytics (seller only)
  async getAnalytics(period = '30d'): Promise<AnalyticsData> {
    const response = await api.get(`/users/analytics?period=${period}`);
    return response.data.data;
  },
};