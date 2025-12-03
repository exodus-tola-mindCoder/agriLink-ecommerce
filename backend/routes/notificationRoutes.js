import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', getNotifications);
router.put('/:notificationId/read', markNotificationRead);
router.put('/mark-all-read', markAllNotificationsRead);
router.delete('/:notificationId', deleteNotification);

export default router;