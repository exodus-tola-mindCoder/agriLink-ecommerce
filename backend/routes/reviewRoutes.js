import express from 'express';
import { body } from 'express-validator';
import {
  addProductReview,
  getProductReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes
router.use(protect);

router.post('/:productId', reviewValidation, addProductReview);
router.put('/:productId/:reviewId', reviewValidation, updateReview);
router.delete('/:productId/:reviewId', deleteReview);

export default router;