import express from 'express';
import {
  createRestaurant,
  getMyRestaurant,
  updateRestaurant,
  patchRestaurantBasic,
  getPublicRestaurantBySlug,
} from './restaurant.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { UserRole } from '../../../../shared/types/user.type.js';
import { restaurantValidator } from './restaurant.validator.js';

const restaurantRouter = express.Router();

// Public routes
restaurantRouter.get('/public/:slug', getPublicRestaurantBySlug);

// All routes here require authentication and SELLER role
restaurantRouter.use(authenticate, authorize(UserRole.SELLER));

restaurantRouter.post('/', restaurantValidator.create, createRestaurant);
restaurantRouter.get('/my', getMyRestaurant);
restaurantRouter.put('/', restaurantValidator.update, updateRestaurant);
restaurantRouter.patch('/basic', restaurantValidator.update, patchRestaurantBasic);
restaurantRouter.patch('/images', restaurantValidator.patchImages, patchRestaurantBasic);

export default restaurantRouter;
