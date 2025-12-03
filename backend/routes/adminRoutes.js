import express from 'express';
import {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDeliveryAgents,
  getAllProducts,
  updateProductStatus,
  deleteProduct
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('admin'));

// Platform statistics
router.get('/stats', getPlatformStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

// Delivery management
router.get('/delivery-agents', getDeliveryAgents);

// Product management
router.get('/products', getAllProducts);
router.put('/products/:productId/status', updateProductStatus);
router.delete('/products/:productId', deleteProduct);

export default router;