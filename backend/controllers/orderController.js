import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      items,
      deliveryAddress,
      paymentMethod = 'cash_on_delivery',
      notes
    } = req.body;

    // Validate and calculate order totals
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      if (item.quantity < product.minOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
        });
      }

      if (item.quantity > product.maxOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Maximum order quantity for ${product.name} is ${product.maxOrderQuantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        seller: product.seller
      });

      // Update product stock
      product.stock -= item.quantity;
      product.salesCount += item.quantity;
      await product.save();
    }

    // Calculate delivery fee based on city
    let deliveryFee = 0;
    switch (deliveryAddress.city) {
      case 'Harar':
        deliveryFee = 50;
        break;
      case 'Dire Dawa':
        deliveryFee = 75;
        break;
      case 'Hararge':
        deliveryFee = 100;
        break;
      default:
        deliveryFee = 100;
    }

    // Create order
    const orderData = {
      customer: req.user.userId,
      items: orderItems,
      totalAmount,
      deliveryFee,
      deliveryAddress,
      paymentMethod,
      notes: notes || {}
    };

    const order = await Order.create(orderData);

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name price images')
      .populate('items.seller', 'businessName firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { customer: req.user.userId };
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name price images')
      .populate('items.seller', 'businessName firstName lastName')
      .populate('deliveryAgent', 'firstName lastName phone vehicleType')
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
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get seller's orders
export const getSellerOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { 'items.seller': req.user.userId };
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name price images')
      .populate('deliveryAgent', 'firstName lastName phone vehicleType')
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
    console.error('Get seller orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching seller orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name price images')
      .populate('items.seller', 'businessName firstName lastName')
      .populate('deliveryAgent', 'firstName lastName phone vehicleType');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    const user = await User.findById(req.user.userId);
    const hasAccess = 
      order.customer._id.toString() === req.user.userId ||
      order.items.some(item => item.seller._id.toString() === req.user.userId) ||
      (order.deliveryAgent && order.deliveryAgent._id.toString() === req.user.userId) ||
      user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update order status (seller/admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const user = await User.findById(req.user.userId);
    
    // Check authorization
    const canUpdate = 
      user.role === 'admin' ||
      order.items.some(item => item.seller.toString() === req.user.userId);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['accepted', 'rejected'],
      'accepted': ['preparing', 'cancelled'],
      'preparing': ['ready_for_pickup', 'cancelled'],
      'ready_for_pickup': ['dispatched'],
      'dispatched': ['in_transit'],
      'in_transit': ['delivered'],
      'delivered': [],
      'cancelled': [],
      'rejected': []
    };

    if (!validTransitions[order.orderStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.orderStatus} to ${status}`
      });
    }

    // Update order status
    order.orderStatus = status;
    
    // Add tracking update
    order.trackingUpdates.push({
      status,
      message: message || `Order ${status}`,
      timestamp: new Date()
    });

    // Set delivery time if delivered
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name price')
      .populate('items.seller', 'businessName firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel order (customer only)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'accepted', 'preparing'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.salesCount -= item.quantity;
        await product.save();
      }
    }

    // Update order
    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.trackingUpdates.push({
      status: 'cancelled',
      message: `Order cancelled by customer. Reason: ${reason}`,
      timestamp: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get delivery agent orders
export const getDeliveryOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { deliveryAgent: req.user.userId };
    
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName phone')
      .populate('items.product', 'name price')
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
    console.error('Get delivery orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching delivery orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, location, message } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is assigned delivery agent
    if (!order.deliveryAgent || order.deliveryAgent.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this delivery'
      });
    }

    // Update order status
    order.orderStatus = status;
    
    // Add tracking update with location
    const trackingUpdate = {
      status,
      message: message || `Delivery ${status}`,
      timestamp: new Date()
    };

    if (location) {
      trackingUpdate.location = location;
    }

    order.trackingUpdates.push(trackingUpdate);

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();

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

// Get order tracking
export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .select('orderNumber orderStatus trackingUpdates estimatedDeliveryTime actualDeliveryTime')
      .populate('deliveryAgent', 'firstName lastName phone vehicleType');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        currentStatus: order.orderStatus,
        trackingUpdates: order.trackingUpdates,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        actualDeliveryTime: order.actualDeliveryTime,
        deliveryAgent: order.deliveryAgent
      }
    });

  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order tracking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};