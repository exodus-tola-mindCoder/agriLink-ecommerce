import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Delivery fee cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'online_payment'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'preparing', 'ready_for_pickup', 'dispatched', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { 
      type: String, 
      required: true,
      enum: ['Harar', 'Dire Dawa', 'Hararge']
    },
    region: String,
    postalCode: String,
    latitude: Number,
    longitude: Number,
    instructions: String
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  trackingUpdates: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    location: {
      latitude: Number,
      longitude: Number
    }
  }],
  notes: {
    customer: String,
    seller: String,
    admin: String
  },
  cancellationReason: String,
  refundAmount: Number,
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `EL${timestamp.slice(-6)}${random}`;
  }
  
  // Calculate final amount
  this.finalAmount = this.totalAmount + this.deliveryFee;
  
  next();
});

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ deliveryAgent: 1, orderStatus: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);