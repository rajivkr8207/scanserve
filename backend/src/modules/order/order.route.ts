import express from 'express';
import {
  createOrder,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getRestaurantAnalytics
} from './order.controller.js';

// ... other imports ...
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { UserRole } from '@shared/types/user.type.js';
import { orderValidator } from './order.validator.js';

const orderRouter = express.Router();

// Public routes (for customers scanning QR code)
orderRouter.post('/', orderValidator.create, createOrder);
orderRouter.get('/:id', orderValidator.getById, getOrderById);

// Protected routes for SELLER (to manage orders)
orderRouter.use(authenticate, authorize(UserRole.SELLER));

orderRouter.get('/restaurant/analytics', getRestaurantAnalytics);
orderRouter.get('/restaurant/orders', getRestaurantOrders);
orderRouter.patch('/:id/status', orderValidator.updateStatus, updateOrderStatus);
orderRouter.patch('/:id/payment', orderValidator.updatePaymentStatus, updatePaymentStatus);

export default orderRouter;
