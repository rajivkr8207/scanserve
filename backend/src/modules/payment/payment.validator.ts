import { body } from 'express-validator';
import { validate } from '../../config/validate.js';

export const paymentValidator = {
  create: [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('amount').isNumeric().withMessage('Amount is required and must be a number'),
    body('currency').optional().isString().withMessage('Currency must be a string'),
    validate,
  ],
  verify: [
    body('razorpayOrderId').notEmpty().withMessage('Razorpay Order ID is required'),
    body('razorpayPaymentId').notEmpty().withMessage('Razorpay Payment ID is required'),
    body('razorpaySignature').notEmpty().withMessage('Razorpay Signature is required'),
    validate,
  ],
};