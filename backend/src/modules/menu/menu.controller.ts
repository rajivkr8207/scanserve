import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { MenuService } from './menu.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
export const createMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const menuItem = await MenuService.createMenuItem(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, menuItem, 'Menu item created successfully'));
});

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const menuItems = await MenuService.getAllMenuItems(req.user.id);
  return res.status(200).json(new ApiResponse(200, menuItems, 'Menu items fetched successfully'));
});

export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const menuItem = await MenuService.updateMenuItem(req.params.id as string, req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, menuItem, 'Menu item updated successfully'));
});

export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  await MenuService.deleteMenuItem(req.params.id as string, req.user.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Menu item deleted successfully'));
});

export const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const menuItem = await MenuService.toggleAvailability(
    req.params.id as string,
    req.user.id,
    req.body.isAvailable,
  );
  return res.status(200).json(new ApiResponse(200, menuItem, 'Availability updated successfully'));
});

export const getPublicMenuBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(400, 'Slug is required');
  }
  const menu = await MenuService.getPublicMenuBySlug(slug as string);
  return res.status(200).json(new ApiResponse(200, menu, 'Menu fetched successfully'));
});

export const getPublicMenuByRestaurantId = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, 'Restaurant ID is required');
  }
  const menu = await MenuService.getPublicMenuByRestaurantId(id as string);
  return res.status(200).json(new ApiResponse(200, menu, 'Menu fetched successfully'));
});
