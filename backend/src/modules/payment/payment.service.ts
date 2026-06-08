import { Payment } from './payment.model.js';
import Order from '../order/order.model.js';
import { Createorder } from '../../services/payment.service.js';
import crypto from 'crypto';
import { ENV } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

export const PaymentService = {
  async createPaymentOrder(userId: string, orderId: string, amount: number, currency: string = 'INR', userName: string, email: string, phoneNumber: string) {
    const orderExists = await Order.findById(orderId);
    if (!orderExists) {
      throw new ApiError(404, 'Order not found');
    }

    const razorpayOrder = await Createorder({ amount, currency });

    if (!razorpayOrder) {
      throw new ApiError(500, 'Failed to create Razorpay order');
    }
    console.log("razorpayOrder", razorpayOrder);

    const payment = await Payment.create({
      orderId: orderId,
      paymentId: razorpayOrder.id,
      amount: amount,
      currency: currency,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      status: 'pending',
    });

    return {
      payment,
      razorpayOrder,
    };
  },

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      throw new ApiError(400, 'Invalid payment signature');
    }

    // paymentId stores the razorpay order id (set during createPaymentOrder)
    const payment = await Payment.findOneAndUpdate(
      { paymentId: razorpayOrderId },
      {
        $set: {
          signature: razorpaySignature,
          status: 'completed',
        },
      },
      { new: true }
    );

    if (!payment) {
      throw new ApiError(404, 'Payment record not found');
    }

    // orderId is the local Order document id
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'paid',
    });

    return payment;
  },
};