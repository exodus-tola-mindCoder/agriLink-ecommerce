import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getSellerProducts,
  getCategories,
  getFeaturedProducts,
  searchProducts
} from '../controllers/productController.js';
import { protect, authorize, requireApproval } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn([
      'electronics',
      'clothing',
      'food_beverages',
      'home_garden',
      'books_media',
      'sports_outdoors',
      'automotive',
      'health_beauty',
      'toys_games',
      'crafts_hobbies',
      'other'
    ])
    .withMessage('Invalid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

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
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:productId', getProduct);

// Protected routes
router.use(protect);

// Customer routes
router.post('/:productId/reviews', reviewValidation, addReview);

// Seller routes
router.get('/seller/my-products', authorize('seller'), requireApproval, getSellerProducts);
router.post('/', 
  authorize('seller'), 
  requireApproval, 
  upload.array('images', 5), 
  productValidation, 
  createProduct
);
router.put('/:productId', 
  authorize('seller'), 
  requireApproval, 
  upload.array('images', 5), 
  updateProduct
);
router.delete('/:productId', authorize('seller'), requireApproval, deleteProduct);

export default router;