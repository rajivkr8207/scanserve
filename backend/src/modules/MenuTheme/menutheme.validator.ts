import { body, param } from 'express-validator';
import { validate } from '../../config/validate.js';

export const menuThemeValidator = {
  create: [
    body('name').notEmpty().withMessage('Theme name is required').trim(),
    body('slug').notEmpty().withMessage('Slug is required').trim(),
    body('templateType').optional().isIn(['card', 'list', 'category']),
    body('isPremium').optional().isBoolean(),
    validate,
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid theme ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('isActive').optional().isBoolean(),
    validate,
  ],
  getById: [param('id').isMongoId().withMessage('Invalid theme ID'), validate],
  getBySlug: [param('slug').notEmpty().withMessage('Slug is required'), validate],
  delete: [param('id').isMongoId().withMessage('Invalid theme ID'), validate],
};
