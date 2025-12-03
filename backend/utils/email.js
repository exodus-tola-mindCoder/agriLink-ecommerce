import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    });
  }
};

const transporter = createTransporter();

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to EastLink Market!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Welcome to EastLink Market, ${name}!</h1>
        <p>Thank you for joining Ethiopia's premier e-commerce platform.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse thousands of products from local sellers</li>
          <li>Enjoy fast delivery across Harar, Dire Dawa, and Hararge</li>
          <li>Connect with trusted local businesses</li>
        </ul>
        <p>Start shopping today and discover amazing products!</p>
        <a href="${process.env.CLIENT_URL}/products" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Start Shopping</a>
      </div>
    `,
  }),

  orderConfirmation: (order) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Order Confirmed!</h1>
        <p>Thank you for your order. Here are the details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order #${order.orderNumber}</h3>
          <p><strong>Total:</strong> ${formatCurrency(order.finalAmount)}</p>
          <p><strong>Delivery Address:</strong> ${order.deliveryAddress.street}, ${order.deliveryAddress.city}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>
        <h4>Items Ordered:</h4>
        <ul>
          ${order.items.map(item => `
            <li>${item.product.name} - Qty: ${item.quantity} - ${formatCurrency(item.price * item.quantity)}</li>
          `).join('')}
        </ul>
        <p>We'll send you updates as your order progresses.</p>
        <a href="${process.env.CLIENT_URL}/order/${order._id}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Order</a>
      </div>
    `,
  }),

  orderStatusUpdate: (order, status) => ({
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Order Status Update</h1>
        <p>Your order #${order.orderNumber} status has been updated to: <strong>${status.replace('_', ' ').toUpperCase()}</strong></p>
        ${status === 'dispatched' ? `
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🚚 Your order is on the way!</h3>
            <p>Your order has been dispatched and is on its way to you.</p>
            ${order.deliveryAgent ? `
              <p><strong>Delivery Agent:</strong> ${order.deliveryAgent.firstName} ${order.deliveryAgent.lastName}</p>
              <p><strong>Contact:</strong> ${order.deliveryAgent.phone}</p>
            ` : ''}
          </div>
        ` : ''}
        ${status === 'delivered' ? `
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ Order Delivered!</h3>
            <p>Your order has been successfully delivered. We hope you enjoy your purchase!</p>
            <p>Please consider leaving a review for the products you purchased.</p>
          </div>
        ` : ''}
        <a href="${process.env.CLIENT_URL}/order/${order._id}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order Details</a>
      </div>
    `,
  }),

  sellerApproval: (seller) => ({
    subject: 'Your Seller Account Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Congratulations! Your seller account is approved!</h1>
        <p>Hello ${seller.firstName},</p>
        <p>Great news! Your seller account for <strong>${seller.businessName}</strong> has been approved.</p>
        <p>You can now:</p>
        <ul>
          <li>Add and manage your products</li>
          <li>Receive and process orders</li>
          <li>Track your sales and earnings</li>
          <li>Connect with customers across Eastern Ethiopia</li>
        </ul>
        <p>Start selling today and grow your business with EastLink Market!</p>
        <a href="${process.env.CLIENT_URL}/seller" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Seller Dashboard</a>
      </div>
    `,
  }),

  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request - EastLink Market',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Password Reset Request</h1>
        <p>Hello ${user.firstName},</p>
        <p>You requested a password reset for your EastLink Market account.</p>
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>For security reasons, this link will expire in 1 hour.</p>
      </div>
    `,
  }),

  lowStock: (product, seller) => ({
    subject: `Low Stock Alert - ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">⚠️ Low Stock Alert</h1>
        <p>Hello ${seller.firstName},</p>
        <p>Your product <strong>${product.name}</strong> is running low on stock.</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Current Stock:</strong> ${product.stock} units</p>
          <p><strong>Product:</strong> ${product.name}</p>
          <p><strong>Price:</strong> ${formatCurrency(product.price)}</p>
        </div>
        <p>Consider restocking to avoid missing out on potential sales.</p>
        <a href="${process.env.CLIENT_URL}/seller/products" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Manage Products</a>
      </div>
    `,
  }),
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0
  }).format(amount);
};

// Send email function
export const sendEmail = async (to, templateName, data) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const { subject, html } = typeof template === 'function' ? template(data) : template;

    const mailOptions = {
      from: `"EastLink Market" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Bulk email function
export const sendBulkEmail = async (recipients, templateName, data) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, templateName, data);
    results.push({ recipient, ...result });
    
    // Add delay to avoid overwhelming the email service
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

// Email verification
export const sendVerificationEmail = async (user, verificationToken) => {
  return sendEmail(user.email, 'emailVerification', {
    name: user.firstName,
    verificationToken,
  });
};

// Newsletter subscription
export const sendNewsletterEmail = async (subscribers, content) => {
  return sendBulkEmail(subscribers, 'newsletter', content);
};

export default {
  sendEmail,
  sendBulkEmail,
  sendVerificationEmail,
  sendNewsletterEmail,
};