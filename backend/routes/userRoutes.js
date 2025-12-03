import express from 'express';
import {
  getDashboard,
  getSellers,
  getSellerProfile,
  updateAvatar,
  getNotifications,
  markNotificationRead,
  getUserAnalytics,
  updatePreferences,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/sellers', getSellers);
router.get('/sellers/:sellerId', getSellerProfile);

// Protected routes
router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId/read', markNotificationRead);
router.put('/avatar', upload.single('avatar'), updateAvatar);
router.put('/preferences', updatePreferences);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.delete('/wishlist', clearWishlist);

// Seller analytics
router.get('/analytics', authorize('seller'), getUserAnalytics);

export default router;