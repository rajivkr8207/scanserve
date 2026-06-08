import { body, param } from 'express-validator';
import { validate } from '../../config/validate.js';

export const orderValidator = {
  create: [
    body('customerName').notEmpty().withMessage('Customer name is required').trim(),
    body('customerEmail').isEmail().withMessage('Valid customer email is required').normalizeEmail(),
    body('restaurant').isMongoId().withMessage('Invalid restaurant ID'),
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.menuItem').isMongoId().withMessage('Invalid menu item ID in items array'),
    body('items.*.name').notEmpty().withMessage('Item name is required'),
    body('items.*.price').isNumeric().withMessage('Item price must be a number'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.subtotal').isNumeric().withMessage('Subtotal must be a number'),
    body('totalPrice').isNumeric().withMessage('Total price must be a number'),
    body('paymentMethod').optional().isIn(['online', 'cash']).withMessage('Invalid payment method'),
    validate,
  ],
  updateStatus: [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('orderStatus').isIn([
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'completed',
      'cancelled',
    ]).withMessage('Invalid order status'),
    validate,
  ],
  updatePaymentStatus: [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status'),
    validate,
  ],
  getById: [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validate,
  ]
};
