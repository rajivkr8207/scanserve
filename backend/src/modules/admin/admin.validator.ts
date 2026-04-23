import { body } from 'express-validator';
import { validate } from '../../config/validate.js';

export const AdminValidate = {
  banUser: [body('BanReason').notEmpty().withMessage('Ban reason is required').trim(), validate],
  unBanUser: [
    body('UnBanReason').notEmpty().withMessage('Unban reason is required').trim(),
    validate,
  ],
  createSeller: [
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('phoneno').notEmpty().withMessage('Phone number is required').trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],
  updateUser: [
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('phoneno').notEmpty().withMessage('Phone number is required').trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],
};
