import { body, param } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { validate } from '../../config/validate.js';

export const userValidator = {
  register: [
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
      .trim(),
    body('email').isEmail().withMessage('Invalid email address'),
    body('phoneno').optional().trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],

  login: [
    body('usernameOrEmail').notEmpty().withMessage('Username or Email is required').trim(),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],

  verify: [
    body('otp').notEmpty().withMessage('OTP is required').isLength({ min: 6, max: 6 }),
    validate,
  ],

  forgotPassword: [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    validate,
  ],

  resetPassword: [
    param('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('otp').notEmpty().withMessage('OTP is required').isLength({ min: 6, max: 6 }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],
};
