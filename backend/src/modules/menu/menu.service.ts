import { MenuItem } from './menu.model.js';
import { Restaurant } from '../resturant/restaurant.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const MenuService = {
  async createMenuItem(sellerId: string, data: any) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found for this seller');
    }

    const menuItem = await MenuItem.create({
      ...data,
      restaurant: restaurant._id,
    });
    return menuItem;
  },

  async getAllMenuItems(sellerId: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }
    return await MenuItem.find({ restaurant: restaurant._id }).populate('category');
  },

  async updateMenuItem(itemId: string, sellerId: string, data: any) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, restaurant: restaurant._id },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found or you are not authorized');
    }
    return menuItem;
  },

  async deleteMenuItem(itemId: string, sellerId: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const menuItem = await MenuItem.findOneAndDelete({ _id: itemId, restaurant: restaurant._id });
    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found or you are not authorized');
    }
    return menuItem;
  },

  async toggleAvailability(itemId: string, sellerId: string, isAvailable: boolean) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, restaurant: restaurant._id },
      { $set: { isAvailable } },
      { new: true },
    );

    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found or you are not authorized');
    }
    return menuItem;
  },

  async getPublicMenuBySlug(slug: string) {
    const restaurant = await Restaurant.findOne({ slug, isActive: true });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }
    return await MenuItem.find({ restaurant: restaurant._id, isAvailable: true }).populate(
      'category',
    );
  },
};
