import Order from './order.model.js';
import { Restaurant } from '../resturant/restaurant.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const OrderService = {
  async createOrder(data: any) {
    // Optional: You could verify the restaurant exists and items match their prices here
    const restaurant = await Restaurant.findById(data.restaurant);
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const order = await Order.create(data);
    return order;
  },

  async getOrderById(orderId: string) {
    const order = await Order.findById(orderId).populate('restaurant', 'name address');
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  },

  async getRestaurantOrders(sellerId: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    // Get orders for this restaurant, sorted by newest first
    return await Order.find({ restaurant: restaurant._id }).sort({ createdAt: -1 });
  },

  async updateOrderStatus(orderId: string, sellerId: string, status: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, restaurant: restaurant._id },
      { $set: { orderStatus: status } },
      { new: true, runValidators: true }
    );

    if (!order) {
      throw new ApiError(404, 'Order not found or you do not have permission to update it');
    }

    return order;
  },

  async updatePaymentStatus(orderId: string, sellerId: string, status: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, restaurant: restaurant._id },
      { $set: { paymentStatus: status } },
      { new: true, runValidators: true }
    );

    if (!order) {
      throw new ApiError(404, 'Order not found or you do not have permission to update it');
    }

    return order;
  }
};
