import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account deactivated.'
      });
    }

    // Add user to request
    req.user = decoded;
    req.userDoc = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${user.role}' is not authorized for this action.`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during authorization'
      });
    }
  };
};

// Check if seller is approved
export const requireApproval = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if ((user.role === 'seller' || user.role === 'delivery_agent') && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please wait for admin verification.'
      });
    }

    next();
  } catch (error) {
    console.error('Approval check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking approval status'
    });
  }
};