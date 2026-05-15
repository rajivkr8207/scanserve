import express from 'express';
import {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getPublicMenuBySlug,
  getPublicMenuByRestaurantId,
} from './menu.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { UserRole } from '@shared/types/user.type.js';
import { menuValidator } from './menu.validator.js';

const menuRouter = express.Router();

// Public routes
menuRouter.get('/public/:slug', getPublicMenuBySlug);
menuRouter.get('/public/id/:id', getPublicMenuByRestaurantId);

// Protected routes for SELLER
menuRouter.use(authenticate, authorize(UserRole.SELLER));

menuRouter.post('/', menuValidator.create, createMenuItem);
menuRouter.get('/', getMenuItems);
menuRouter.put('/:id', menuValidator.update, updateMenuItem);
menuRouter.delete('/:id', menuValidator.delete, deleteMenuItem);
menuRouter.patch('/:id/availability', menuValidator.toggleAvailability, toggleAvailability);

export default menuRouter;
