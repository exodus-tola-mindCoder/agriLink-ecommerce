import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// HTTP request logger middleware
export const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 400) {
      logger.error(message);
    } else {
      logger.http(message);
    }
  });
  
  next();
};

// Error logger
export const errorLogger = (error, req, res, next) => {
  logger.error(`${error.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);
  next(error);
};

// Security event logger
export const securityLogger = {
  loginAttempt: (email, ip, success) => {
    logger.info(`Login attempt - Email: ${email}, IP: ${ip}, Success: ${success}`);
  },
  
  suspiciousActivity: (activity, ip, userAgent) => {
    logger.warn(`Suspicious activity - ${activity}, IP: ${ip}, User-Agent: ${userAgent}`);
  },
  
  rateLimitExceeded: (ip, endpoint) => {
    logger.warn(`Rate limit exceeded - IP: ${ip}, Endpoint: ${endpoint}`);
  },
  
  unauthorizedAccess: (ip, endpoint, userId) => {
    logger.warn(`Unauthorized access attempt - IP: ${ip}, Endpoint: ${endpoint}, User: ${userId}`);
  }
};

// Business event logger
export const businessLogger = {
  orderCreated: (orderId, userId, amount) => {
    logger.info(`Order created - ID: ${orderId}, User: ${userId}, Amount: ${amount}`);
  },
  
  paymentProcessed: (orderId, amount, method) => {
    logger.info(`Payment processed - Order: ${orderId}, Amount: ${amount}, Method: ${method}`);
  },
  
  productCreated: (productId, sellerId, name) => {
    logger.info(`Product created - ID: ${productId}, Seller: ${sellerId}, Name: ${name}`);
  },
  
  userRegistered: (userId, email, role) => {
    logger.info(`User registered - ID: ${userId}, Email: ${email}, Role: ${role}`);
  }
};

export default logger;