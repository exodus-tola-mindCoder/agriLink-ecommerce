import express from 'express';
import { body } from 'express-validator';
import {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryLocation,
  updateDeliveryStatus,
  completeDelivery,
  getDeliveryHistory,
  getDeliveryStats,
  updateAvailability,
  getEarnings,
  reportIssue
} from '../controllers/deliveryController.js';
import { protect, authorize, requireApproval } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const locationValidation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude')
];

const deliveryUpdateValidation = [
  body('status')
    .isIn(['picked_up', 'in_transit', 'delivered', 'failed'])
    .withMessage('Invalid delivery status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const issueReportValidation = [
  body('type')
    .isIn(['customer_unavailable', 'address_issue', 'product_damaged', 'other'])
    .withMessage('Invalid issue type'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
];

// Protected routes for delivery agents only
router.use(protect);
router.use(authorize('delivery_agent'));
router.use(requireApproval);

// Get available deliveries in agent's area
router.get('/available', getAvailableDeliveries);

// Accept a delivery assignment
router.post('/:orderId/accept', acceptDelivery);

// Update delivery location (real-time tracking)
router.put('/:orderId/location', locationValidation, updateDeliveryLocation);

// Update delivery status
router.put('/:orderId/status', deliveryUpdateValidation, updateDeliveryStatus);

// Complete delivery
router.post('/:orderId/complete', completeDelivery);

// Get delivery history
router.get('/history', getDeliveryHistory);

// Get delivery statistics
router.get('/stats', getDeliveryStats);

// Update availability status
router.put('/availability', updateAvailability);

// Get earnings information
router.get('/earnings', getEarnings);

// Report delivery issue
router.post('/:orderId/issue', issueReportValidation, reportIssue);

export default router;