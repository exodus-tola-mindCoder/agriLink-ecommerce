import { body, validationResult } from 'express-validator';

// Common validation rules
export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please enter a valid email address');

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

export const validatePhone = body('phone')
  .matches(/^[0-9]{10,15}$/)
  .withMessage('Please enter a valid phone number');

export const validateName = (field) => 
  body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${field} must be between 2 and 50 characters`);

export const validateCity = body('address.city')
  .isIn(['Harar', 'Dire Dawa', 'Hararge'])
  .withMessage('City must be one of: Harar, Dire Dawa, Hararge');

export const validateRole = body('role')
  .optional()
  .isIn(['customer', 'seller', 'delivery_agent'])
  .withMessage('Role must be customer, seller, or delivery_agent');

// Product validation
export const validateProduct = [
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

// Order validation
export const validateOrder = [
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
  validateCity,
  body('paymentMethod')
    .optional()
    .isIn(['cash_on_delivery', 'online_payment'])
    .withMessage('Invalid payment method')
];

// Review validation
export const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Rate limiting validation
export const validateRateLimit = (windowMs, maxRequests) => {
  return (req, res, next) => {
    // Simple in-memory rate limiting (use Redis in production)
    const key = req.ip;
    const now = Date.now();
    
    if (!req.app.locals.rateLimits) {
      req.app.locals.rateLimits = new Map();
    }
    
    const userRequests = req.app.locals.rateLimits.get(key) || [];
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }
    
    validRequests.push(now);
    req.app.locals.rateLimits.set(key, validRequests);
    next();
  };
};

// File upload validation
export const validateFileUpload = (allowedTypes, maxSize) => {
  return (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    for (const file of req.files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        });
      }

      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
        });
      }
    }

    next();
  };
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potential XSS attacks
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};