import { Restaurant } from './restaurant.model.js';
import { ApiError } from '../../utils/ApiError.js';
import slugify from 'slugify';

export const RestaurantService = {
  async createRestaurant(sellerId: string, data: any) {
    const existingRestaurant = await Restaurant.findOne({ seller: sellerId });
    if (existingRestaurant) {
      throw new ApiError(400, 'Seller already has a restaurant');
    }

    const slug = slugify.default(data.name, { lower: true });
    const restaurant = await Restaurant.create({
      ...data,
      seller: sellerId,
      slug,
    });
    return restaurant;
  },

  async getRestaurantBySeller(sellerId: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    return restaurant;
  },

  async updateRestaurant(sellerId: string, data: any) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    if (data.name) {
      data.slug = slugify.default(data.name, { lower: true });
    }

    Object.assign(restaurant, data);
    await restaurant.save();
    return restaurant;
  },

  async patchRestaurant(sellerId: string, data: any) {
    const restaurant = await Restaurant.findOneAndUpdate(
      { seller: sellerId },
      { $set: data },
      { new: true, runValidators: true },
    );
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }
    return restaurant;
  },

  async getPublicRestaurantBySlug(slug: string) {
    const restaurant = await Restaurant.findOne({ slug, isActive: true });
    return restaurant;
  },
};
