import { api } from './api';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'order_update' | 'product_update';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  data?: any;
}

export interface NotificationsResponse {
  notifications: Notification[];
  hasMore: boolean;
  unreadCount: number;
}

export const notificationService = {
  // Get notifications
  async getNotifications(page = 1, limit = 10, unreadOnly = false): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    const response = await api.get(`/notifications?${params}`);
    return response.data.data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },
};