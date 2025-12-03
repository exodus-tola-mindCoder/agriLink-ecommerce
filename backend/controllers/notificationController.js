import User from '../models/User.js';

// Mock notification storage (in production, use database)
const userNotifications = new Map();

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    let notifications = userNotifications.get(userId) || [];

    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.isRead);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        hasMore: endIndex < notifications.length,
        unreadCount: notifications.filter(n => !n.isRead).length
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notifications = userNotifications.get(userId) || [];
    const notification = notifications.find(n => n.id === notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    userNotifications.set(userId, notifications);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notification as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = userNotifications.get(userId) || [];

    notifications.forEach(notification => {
      notification.isRead = true;
      notification.readAt = new Date();
    });

    userNotifications.set(userId, notifications);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notifications as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create notification (internal function)
export const createNotification = (userId, notification) => {
  const notifications = userNotifications.get(userId) || [];
  const newNotification = {
    id: Math.random().toString(36).substr(2, 9),
    ...notification,
    createdAt: new Date(),
    isRead: false
  };

  notifications.unshift(newNotification);
  
  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications.splice(100);
  }

  userNotifications.set(userId, notifications);
  return newNotification;
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notifications = userNotifications.get(userId) || [];
    const filteredNotifications = notifications.filter(n => n.id !== notificationId);

    if (notifications.length === filteredNotifications.length) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    userNotifications.set(userId, filteredNotifications);

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};