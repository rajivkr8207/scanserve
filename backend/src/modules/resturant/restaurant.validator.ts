import { body } from 'express-validator';
import { validate } from '../../config/validate.js';

export const restaurantValidator = {
    create: [
        body('name').notEmpty().withMessage('Restaurant name is required').trim(),
        body('address.street').notEmpty().withMessage('Street is required'),
        body('address.city').notEmpty().withMessage('City is required'),
        body('address.state').notEmpty().withMessage('State is required'),
        body('address.pincode').notEmpty().withMessage('Pincode is required'),
        body('contact.phone').notEmpty().withMessage('Contact phone is required'),
        validate,
    ],
    update: [
        body('name').optional().notEmpty().withMessage('Restaurant name cannot be empty').trim(),
        body('address').optional().isObject(),
        body('contact').optional().isObject(),
        body('openingHours').optional().isArray(),
        validate,
    ],
    patchImages: [
        body('logo').optional().isURL().withMessage('Logo must be a valid URL'),
        body('coverImage').optional().isURL().withMessage('Cover image must be a valid URL'),
        validate,
    ],
};
