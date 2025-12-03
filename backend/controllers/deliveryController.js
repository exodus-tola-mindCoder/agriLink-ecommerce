import Order from '../models/Order.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { createNotification } from './notificationController.js';

// Get available deliveries in agent's area
export const getAvailableDeliveries = async (req, res) => {
  try {
    const { page = 1, limit = 10, city } = req.query;
    const agent = await User.findById(req.user.userId);
    
    const query = {
      orderStatus: 'ready_for_pickup',
      deliveryAgent: { $exists: false },
      ...(city && { 'deliveryAddress.city': city })
    };

    // If agent has a preferred city, filter by that
    if (agent.address?.city && !city) {
      query['deliveryAddress.city'] = agent.address.city;
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name price weight')
      .populate('items.seller', 'businessName firstName lastName address')
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
    console.error('Get available deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available deliveries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Accept a delivery assignment
export const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const agentId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.deliveryAgent) {
      return res.status(400).json({
        success: false,
        message: 'Order already assigned to another agent'
      });
    }

    if (order.orderStatus !== 'ready_for_pickup') {
      return res.status(400).json({
        success: false,
        message: 'Order is not ready for pickup'
      });
    }

    // Assign delivery agent
    order.deliveryAgent = agentId;
    order.orderStatus = 'dispatched';
    order.trackingUpdates.push({
      status: 'dispatched',
      message: 'Order assigned to delivery agent',
      timestamp: new Date()
    });

    await order.save();

    // Notify customer
    createNotification(order.customer, {
      type: 'order_update',
      title: 'Order Dispatched',
      message: `Your order ${order.orderNumber} has been assigned to a delivery agent and is on its way!`
    });

    const populatedOrder = await Order.findById(orderId)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name price')
      .populate('deliveryAgent', 'firstName lastName phone vehicleType');

    res.status(200).json({
      success: true,
      message: 'Delivery accepted successfully',
      data: populatedOrder
    });

  } catch (error) {
    console.error('Accept delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting delivery',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update delivery location for real-time tracking
export const updateDeliveryLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { latitude, longitude } = req.body;
    const agentId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.deliveryAgent.toString() !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this delivery'
      });
    }

    // Add location update to tracking
    order.trackingUpdates.push({
      status: 'location_update',
      message: 'Location updated',
      timestamp: new Date(),
      location: { latitude, longitude }
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });

  } catch (error) {
    console.error('Update delivery location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status, notes } = req.body;
    const agentId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.deliveryAgent.toString() !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this delivery'
      });
    }

    // Update order status
    order.orderStatus = status === 'picked_up' ? 'in_transit' : status;
    
    // Add tracking update
    order.trackingUpdates.push({
      status,
      message: notes || `Delivery ${status.replace('_', ' ')}`,
      timestamp: new Date()
    });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Notify customer
    createNotification(order.customer, {
      type: 'order_update',
      title: 'Delivery Update',
      message: `Your order ${order.orderNumber} is ${status.replace('_', ' ')}`
    });

    res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating delivery status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Complete delivery
export const completeDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customerSignature, deliveryNotes } = req.body;
    const agentId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.deliveryAgent.toString() !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this delivery'
      });
    }

    // Mark as delivered
    order.orderStatus = 'delivered';
    order.actualDeliveryTime = new Date();
    order.paymentStatus = 'paid';
    
    if (deliveryNotes) {
      order.notes.delivery = deliveryNotes;
    }

    order.trackingUpdates.push({
      status: 'delivered',
      message: 'Order delivered successfully',
      timestamp: new Date()
    });

    await order.save();

    // Update agent's delivery count and earnings
    const agent = await User.findById(agentId);
    if (agent) {
      // Calculate delivery fee (this would be based on your business logic)
      const deliveryEarning = order.deliveryFee * 0.8; // Agent gets 80% of delivery fee
      
      // In a real app, you'd have an earnings/wallet system
      // For now, we'll just track it in the user document
      if (!agent.earnings) {
        agent.earnings = { total: 0, deliveries: 0 };
      }
      agent.earnings.total += deliveryEarning;
      agent.earnings.deliveries += 1;
      
      await agent.save();
    }

    // Notify customer
    createNotification(order.customer, {
      type: 'order_update',
      title: 'Order Delivered',
      message: `Your order ${order.orderNumber} has been delivered successfully!`
    });

    res.status(200).json({
      success: true,
      message: 'Delivery completed successfully',
      data: order
    });

  } catch (error) {
    console.error('Complete delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing delivery',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get delivery history
export const getDeliveryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const agentId = req.user.userId;

    const query = { deliveryAgent: agentId };

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name price')
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
    console.error('Get delivery history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching delivery history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get delivery statistics
export const getDeliveryStats = async (req, res) => {
  try {
    const agentId = req.user.userId;
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

    const stats = await Order.aggregate([
      {
        $match: {
          deliveryAgent: agentId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          completedDeliveries: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          totalEarnings: { $sum: '$deliveryFee' },
          avgDeliveryTime: { $avg: '$deliveryTime' }
        }
      }
    ]);

    const statusBreakdown = await Order.aggregate([
      {
        $match: {
          deliveryAgent: agentId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const dailyStats = await Order.aggregate([
      {
        $match: {
          deliveryAgent: agentId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          deliveries: { $sum: 1 },
          earnings: { $sum: '$deliveryFee' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalDeliveries: 0,
          completedDeliveries: 0,
          totalEarnings: 0,
          avgDeliveryTime: 0
        },
        statusBreakdown,
        dailyStats,
        period
      }
    });

  } catch (error) {
    console.error('Get delivery stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching delivery statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update availability status
export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable, workingHours } = req.body;
    const agentId = req.user.userId;

    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    agent.isAvailable = isAvailable;
    if (workingHours) {
      agent.workingHours = workingHours;
    }

    await agent.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        isAvailable: agent.isAvailable,
        workingHours: agent.workingHours
      }
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get earnings information
export const getEarnings = async (req, res) => {
  try {
    const agentId = req.user.userId;
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

    const earnings = await Order.aggregate([
      {
        $match: {
          deliveryAgent: agentId,
          orderStatus: 'delivered',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          dailyEarnings: { $sum: { $multiply: ['$deliveryFee', 0.8] } },
          deliveries: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const totalEarnings = await Order.aggregate([
      {
        $match: {
          deliveryAgent: agentId,
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$deliveryFee', 0.8] } },
          totalDeliveries: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyEarnings: earnings,
        totalEarnings: totalEarnings[0] || { total: 0, totalDeliveries: 0 },
        period
      }
    });

  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching earnings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Report delivery issue
export const reportIssue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { type, description } = req.body;
    const agentId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.deliveryAgent.toString() !== agentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to report issue for this delivery'
      });
    }

    // Add issue to tracking updates
    order.trackingUpdates.push({
      status: 'issue_reported',
      message: `Issue reported: ${type} - ${description}`,
      timestamp: new Date()
    });

    // Store issue details
    if (!order.issues) {
      order.issues = [];
    }
    order.issues.push({
      type,
      description,
      reportedBy: agentId,
      reportedAt: new Date(),
      status: 'open'
    });

    await order.save();

    // Notify admin about the issue
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      createNotification(admin._id, {
        type: 'delivery_issue',
        title: 'Delivery Issue Reported',
        message: `Issue reported for order ${order.orderNumber}: ${type}`
      });
    });

    res.status(200).json({
      success: true,
      message: 'Issue reported successfully'
    });

  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error reporting issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};