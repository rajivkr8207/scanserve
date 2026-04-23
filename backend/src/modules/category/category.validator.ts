import { body, param } from 'express-validator';
import { validate } from '../../config/validate.js';

export const categoryValidator = {
  create: [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('description').optional().trim(),
    body('sortOrder').optional().isNumeric().withMessage('Sort order must be a number'),
    validate,
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').optional().notEmpty().withMessage('Category name cannot be empty').trim(),
    body('description').optional().trim(),
    body('sortOrder').optional().isNumeric().withMessage('Sort order must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    validate,
  ],
  delete: [param('id').isMongoId().withMessage('Invalid category ID'), validate],
};
