import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Get platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    // Get user counts by role
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total orders and revenue
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          avgOrderValue: { $avg: '$finalAmount' }
        }
      }
    ]);

    // Get order status breakdown
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly revenue for the last 12 months
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$finalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top products
    const topProducts = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $sort: { salesCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $project: {
          name: 1,
          price: 1,
          salesCount: 1,
          'ratings.average': 1,
          'sellerInfo.businessName': 1,
          'sellerInfo.firstName': 1,
          'sellerInfo.lastName': 1
        }
      }
    ]);

    // Get top sellers
    const topSellers = await Order.aggregate([
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.seller',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$items.price' }
        }
      },
      {
        $sort: { totalOrders: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $project: {
          totalOrders: 1,
          totalRevenue: 1,
          'sellerInfo.businessName': 1,
          'sellerInfo.firstName': 1,
          'sellerInfo.lastName': 1,
          'sellerInfo.email': 1
        }
      }
    ]);

    // Get new user registrations (last 7 and 30 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const newUsers7Days = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const newUsers30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate delivery success rate
    const deliveryStats = await Order.aggregate([
      {
        $match: {
          deliveryAgent: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalAssigned: { $sum: 1 },
          delivered: {
            $sum: {
              $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const deliverySuccessRate = deliveryStats.length > 0 
      ? (deliveryStats[0].delivered / deliveryStats[0].totalAssigned) * 100 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        userStats,
        orderStats: orderStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
        orderStatusStats,
        monthlyRevenue,
        topProducts,
        topSellers,
        newUsers: {
          last7Days: newUsers7Days,
          last30Days: newUsers30Days
        },
        deliverySuccessRate: Math.round(deliverySuccessRate * 100) / 100
      }
    });

  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching platform statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    const query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      } else if (status === 'approved') {
        query.isApproved = true;
      } else if (status === 'pending') {
        query.isApproved = false;
      }
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    switch (action) {
      case 'approve':
        user.isApproved = true;
        break;
      case 'reject':
        user.isApproved = false;
        break;
      case 'activate':
        user.isActive = true;
        break;
      case 'deactivate':
        user.isActive = false;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${action}d successfully`,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all orders with pagination and filters
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, startDate, endDate } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email')
      .populate('deliveryAgent', 'firstName lastName phone vehicleType')
      .populate('items.product', 'name price images')
      .populate('items.seller', 'businessName firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryAgentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) {
      order.orderStatus = status;
      
      // Add tracking update
      order.trackingUpdates.push({
        status,
        message: `Order ${status} by admin`,
        timestamp: new Date()
      });

      if (status === 'delivered') {
        order.actualDeliveryTime = new Date();
      }
    }

    if (deliveryAgentId) {
      order.deliveryAgent = deliveryAgentId;
      order.trackingUpdates.push({
        status: 'assigned',
        message: 'Delivery agent assigned',
        timestamp: new Date()
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get available delivery agents
export const getDeliveryAgents = async (req, res) => {
  try {
    const deliveryAgents = await User.find({
      role: 'delivery_agent',
      isActive: true,
      isApproved: true
    }).select('firstName lastName phone vehicleType ratings');

    res.status(200).json({
      success: true,
      data: deliveryAgents
    });

  } catch (error) {
    console.error('Get delivery agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching delivery agents',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all products with pagination and filters
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status, search } = req.query;
    
    const query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      } else if (status === 'featured') {
        query.isFeatured = true;
      }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'businessName firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update product status
export const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    switch (action) {
      case 'activate':
        product.isActive = true;
        break;
      case 'deactivate':
        product.isActive = false;
        break;
      case 'feature':
        product.isFeatured = true;
        break;
      case 'unfeature':
        product.isFeatured = false;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${action}d successfully`,
      product
    });

  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};