import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { validationResult } from 'express-validator';
import cloudinary from '../config/cloudinary.js';

// Get user dashboard data
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let dashboardData = {
      user: user.getPublicProfile()
    };

    // Role-specific dashboard data
    switch (user.role) {
      case 'customer':
        const customerOrders = await Order.find({ customer: req.user.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('items.product', 'name price images');

        const orderStats = await Order.aggregate([
          { $match: { customer: user._id } },
          {
            $group: {
              _id: '$orderStatus',
              count: { $sum: 1 }
            }
          }
        ]);

        dashboardData.recentOrders = customerOrders;
        dashboardData.orderStats = orderStats;
        break;

      case 'seller':
        const sellerProducts = await Product.find({ seller: req.user.userId })
          .sort({ createdAt: -1 })
          .limit(5);

        const sellerOrders = await Order.find({ 'items.seller': req.user.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('customer', 'firstName lastName')
          .populate('items.product', 'name price');

        const productStats = await Product.aggregate([
          { $match: { seller: user._id } },
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
              totalViews: { $sum: '$viewCount' },
              totalSales: { $sum: '$salesCount' }
            }
          }
        ]);

        const revenueStats = await Order.aggregate([
          { $unwind: '$items' },
          { $match: { 'items.seller': user._id } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
              totalOrders: { $sum: 1 }
            }
          }
        ]);

        dashboardData.recentProducts = sellerProducts;
        dashboardData.recentOrders = sellerOrders;
        dashboardData.productStats = productStats[0] || {};
        dashboardData.revenueStats = revenueStats[0] || {};
        break;

      case 'delivery_agent':
        const deliveryOrders = await Order.find({ deliveryAgent: req.user.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('customer', 'firstName lastName phone');

        const deliveryStats = await Order.aggregate([
          { $match: { deliveryAgent: user._id } },
          {
            $group: {
              _id: '$orderStatus',
              count: { $sum: 1 }
            }
          }
        ]);

        dashboardData.recentDeliveries = deliveryOrders;
        dashboardData.deliveryStats = deliveryStats;
        break;
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all sellers with filters
export const getSellers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      location, 
      search,
      sortBy = 'ratings.average',
      sortOrder = 'desc'
    } = req.query;

    const query = { 
      role: 'seller', 
      isActive: true, 
      isApproved: true 
    };

    // Apply filters
    if (location && location !== 'all') {
      query['address.city'] = location;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Get sellers with product counts
    const sellers = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'products',
          let: { sellerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$seller', '$$sellerId'] }, isActive: true } },
            ...(category && category !== 'all' ? [{ $match: { category } }] : [])
          ],
          as: 'products'
        }
      },
      {
        $lookup: {
          from: 'orders',
          let: { sellerId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            { $match: { $expr: { $eq: ['$items.seller', '$$sellerId'] } } },
            { $group: { _id: null, totalSales: { $sum: '$items.quantity' } } }
          ],
          as: 'salesData'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' },
          totalSales: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSales', 0] }, 0] }
        }
      },
      {
        $project: {
          password: 0,
          resetPasswordToken: 0,
          resetPasswordExpire: 0
        }
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) }
    ]);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        sellers,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching sellers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single seller profile
export const getSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findOne({
      _id: sellerId,
      role: 'seller',
      isActive: true,
      isApproved: true
    }).select('-password -resetPasswordToken -resetPasswordExpire');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Get seller's products
    const products = await Product.find({ 
      seller: sellerId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    // Get seller stats
    const stats = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.seller': seller._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      }
    ]);

    const sellerData = {
      ...seller.toObject(),
      products,
      productCount: products.length,
      stats: stats[0] || { totalOrders: 0, totalRevenue: 0 }
    };

    res.status(200).json({
      success: true,
      data: sellerData
    });

  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching seller profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user avatar
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old avatar if exists
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`eastlink-avatars/${publicId}`);
    }

    // Upload new avatar
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'eastlink-avatars',
      transformation: [
        { width: 200, height: 200, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    user.avatar = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar: user.avatar }
    });

  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    // This would typically come from a notifications collection
    // For now, we'll return order-based notifications
    const query = {};
    
    if (req.userDoc.role === 'customer') {
      query.customer = req.user.userId;
    } else if (req.userDoc.role === 'seller') {
      query['items.seller'] = req.user.userId;
    } else if (req.userDoc.role === 'delivery_agent') {
      query.deliveryAgent = req.user.userId;
    }

    const orders = await Order.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.product', 'name')
      .select('orderNumber orderStatus updatedAt trackingUpdates');

    // Convert orders to notifications format
    const notifications = orders.map(order => ({
      id: order._id,
      type: 'order_update',
      title: `Order ${order.orderNumber}`,
      message: `Order status updated to ${order.orderStatus}`,
      timestamp: order.updatedAt,
      isRead: false, // This would come from a notifications collection
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.orderStatus
      }
    }));

    res.status(200).json({
      success: true,
      data: {
        notifications,
        hasMore: orders.length === Number(limit)
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
    const { notificationId } = req.params;

    // This would typically update a notifications collection
    // For now, we'll just return success
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

// Get user analytics (for sellers)
export const getUserAnalytics = async (req, res) => {
  try {
    if (req.userDoc.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Analytics only available for sellers'
      });
    }

    const { period = '30d' } = req.query;
    
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Sales analytics
    const salesData = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 
        'items.seller': req.userDoc._id,
        createdAt: { $gte: startDate }
      }},
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Product performance
    const productPerformance = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.seller': req.userDoc._id } },
      {
        $group: {
          _id: '$items.product',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSales: 1,
          totalRevenue: 1,
          viewCount: '$product.viewCount'
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        productPerformance,
        period
      }
    });

  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
  try {
    const { notifications, privacy, language, currency } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (notifications) {
      user.preferences = user.preferences || {};
      user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    }

    if (privacy) {
      user.preferences = user.preferences || {};
      user.preferences.privacy = { ...user.preferences.privacy, ...privacy };
    }

    if (language) {
      user.preferences = user.preferences || {};
      user.preferences.language = language;
    }

    if (currency) {
      user.preferences = user.preferences || {};
      user.preferences.currency = currency;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 12 } = req.query;

    const user = await User.findById(userId).populate({
      path: 'wishlist',
      populate: {
        path: 'seller',
        select: 'businessName firstName lastName'
      },
      options: {
        limit: limit * 1,
        skip: (page - 1) * limit
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.wishlist ? user.wishlist.length : 0;

    res.status(200).json({
      success: true,
      data: {
        items: user.wishlist || [],
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlistCount: user.wishlist.length }
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.wishlist) {
      return res.status(400).json({
        success: false,
        message: 'Wishlist is empty'
      });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlistCount: user.wishlist.length }
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.wishlist = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully'
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};