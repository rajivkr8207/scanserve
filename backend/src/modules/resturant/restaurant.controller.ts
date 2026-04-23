import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { RestaurantService } from './restaurant.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const createRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await RestaurantService.createRestaurant(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, restaurant, 'Restaurant created successfully'));
});

export const getMyRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await RestaurantService.getRestaurantBySeller(req.user.id);
  if (!restaurant) {
    throw new ApiError(404, 'No restaurant found for this seller');
  }
  return res.status(200).json(new ApiResponse(200, restaurant, 'Restaurant fetched successfully'));
});

export const updateRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await RestaurantService.updateRestaurant(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, restaurant, 'Restaurant updated successfully'));
});

export const patchRestaurantBasic = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await RestaurantService.patchRestaurant(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, restaurant, 'Restaurant updated successfully'));
});
