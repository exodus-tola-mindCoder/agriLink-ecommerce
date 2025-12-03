import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getUserOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getDeliveryOrders,
  updateDeliveryStatus,
  getOrderTracking
} from '../controllers/orderController.js';
import { protect, authorize, requireApproval } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('deliveryAddress.city')
    .isIn(['Harar', 'Dire Dawa', 'Hararge'])
    .withMessage('Invalid city'),
  body('paymentMethod')
    .optional()
    .isIn(['cash_on_delivery', 'online_payment'])
    .withMessage('Invalid payment method')
];

const statusValidation = [
  body('status')
    .isIn(['accepted', 'rejected', 'preparing', 'ready_for_pickup', 'dispatched', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Message cannot exceed 200 characters')
];

// Protected routes
router.use(protect);

// Customer routes
router.post('/', orderValidation, createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:orderId', getOrder);
router.put('/:orderId/cancel', cancelOrder);

// Seller routes
router.get('/seller/orders', authorize('seller'), requireApproval, getSellerOrders);
router.put('/:orderId/status', 
  authorize('seller', 'admin'), 
  statusValidation, 
  updateOrderStatus
);

// Delivery agent routes
router.get('/delivery/orders', authorize('delivery_agent'), requireApproval, getDeliveryOrders);
router.put('/:orderId/delivery-status', 
  authorize('delivery_agent'), 
  requireApproval, 
  updateDeliveryStatus
);

// Public tracking (with order number)
router.get('/:orderId/tracking', getOrderTracking);

export default router;