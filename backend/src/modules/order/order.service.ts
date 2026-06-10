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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get orders for this restaurant for today, sorted by newest first
    return await Order.find({ 
      restaurant: restaurant._id,
      createdAt: { $gte: startOfToday }
    }).sort({ createdAt: -1 });
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
  },

  async getRestaurantAnalytics(sellerId: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }

    const now = new Date();
    
    // Server-local start of days
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
    
    const startOfMonth = new Date(startOfToday);
    startOfMonth.setDate(1);

    // Using MongoDB aggregate for performance
    const pipeline = (startDate: Date, endDate: Date) => [
        {
            $match: {
                restaurant: restaurant._id,
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                revenue: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalPrice", 0]
                    }
                }
            }
        }
    ];

    const todayResult = await Order.aggregate(pipeline(startOfToday, now));
    const yesterdayResult = await Order.aggregate(pipeline(startOfYesterday, startOfToday));
    const weekResult = await Order.aggregate(pipeline(startOf7DaysAgo, now));
    const monthResult = await Order.aggregate(pipeline(startOfMonth, now));

    const formatResult = (res: any[]) => res.length > 0 ? { totalOrders: res[0].totalOrders, revenue: res[0].revenue } : { totalOrders: 0, revenue: 0 };

    return {
      today: formatResult(todayResult),
      yesterday: formatResult(yesterdayResult),
      week: formatResult(weekResult),
      month: formatResult(monthResult)
    };
  }
};
