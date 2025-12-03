import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin', 'delivery_agent'],
    default: 'customer'
  },
  address: {
    street: String,
    city: {
      type: String,
      enum: ['Harar', 'Dire Dawa', 'Hararge'],
      required: [true, 'City is required']
    },
    region: String,
    postalCode: String
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Seller specific fields
  businessName: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  businessLicense: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  isApproved: {
    type: Boolean,
    default: function() { return this.role !== 'seller' && this.role !== 'delivery_agent'; }
  },
  // Delivery Agent specific fields
  vehicleType: {
    type: String,
    enum: ['motorcycle', 'bicycle', 'car', 'van'],
    required: function() { return this.role === 'delivery_agent'; }
  },
  licenseNumber: {
    type: String,
    required: function() { return this.role === 'delivery_agent'; }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  workingHours: {
    start: String,
    end: String
  },
  // Common fields
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  // Wishlist for customers
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // User preferences
  preferences: {
    notifications: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      activityStatus: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'ETB' }
  },
  // Earnings for delivery agents
  earnings: {
    total: { type: Number, default: 0 },
    deliveries: { type: Number, default: 0 }
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'address.city': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

export default mongoose.model('User', userSchema);