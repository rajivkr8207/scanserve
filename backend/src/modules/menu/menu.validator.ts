import { body, param } from 'express-validator';
import { validate } from '../../config/validate.js';

export const menuValidator = {
  create: [
    body('category').isMongoId().withMessage('Invalid category ID'),
    body('name').notEmpty().withMessage('Item name is required').trim(),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('isVeg').optional().isBoolean(),
    body('preparationTime').optional().isNumeric(),
    validate,
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid item ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('price').optional().isNumeric(),
    body('category').optional().isMongoId(),
    validate,
  ],
  toggleAvailability: [
    param('id').isMongoId().withMessage('Invalid item ID'),
    body('isAvailable').isBoolean().withMessage('isAvailable must be a boolean'),
    validate,
  ],
  delete: [param('id').isMongoId().withMessage('Invalid item ID'), validate],
};
