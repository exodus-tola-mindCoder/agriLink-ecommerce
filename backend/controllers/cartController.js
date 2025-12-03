import { validationResult } from 'express-validator';

// Mock cart storage (in production, use Redis or database)
const userCarts = new Map();

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = userCarts.get(userId) || { items: [], totalAmount: 0, totalItems: 0 };

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    // Get current cart
    const cart = userCarts.get(userId) || { items: [], totalAmount: 0, totalItems: 0 };

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date()
      });
    }

    // Recalculate totals (simplified - in production, fetch product prices)
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // Save cart
    userCarts.set(userId, cart);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = userCarts.get(userId) || { items: [], totalAmount: 0, totalItems: 0 };
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    userCarts.set(userId, cart);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = userCarts.get(userId) || { items: [], totalAmount: 0, totalItems: 0 };
    cart.items = cart.items.filter(item => item.productId !== productId);

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    userCarts.set(userId, cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    userCarts.set(userId, { items: [], totalAmount: 0, totalItems: 0 });

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { items: [], totalAmount: 0, totalItems: 0 }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};