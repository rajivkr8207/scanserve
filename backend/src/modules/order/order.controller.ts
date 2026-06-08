import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { OrderService } from './order.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Createorder } from '../../services/payment.service.js';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.createOrder(req.body);
  
  if (req.body.paymentMethod === 'online') {
    const paymentorder = await Createorder({
      amount: order.totalPrice,
      currency: "INR"
    });
    return res.status(201).json(new ApiResponse(201, { order, paymentorder }, 'Order created successfully'));
  }
  
  return res.status(201).json(new ApiResponse(201, { order }, 'Order created successfully'));
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.getOrderById(req.params.id as string);
  return res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
});

export const getRestaurantOrders = asyncHandler(async (req: Request, res: Response) => {
  // Assuming req.user.id is the seller's ID since this route is protected by SELLER role
  const orders = await OrderService.getRestaurantOrders(req.user.id);
  return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.updateOrderStatus(
    req.params.id as string,
    req.user.id,
    req.body.orderStatus
  );
  return res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
});

export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrderService.updatePaymentStatus(
    req.params.id as string,
    req.user.id,
    req.body.paymentStatus
  );
  return res.status(200).json(new ApiResponse(200, order, 'Payment status updated successfully'));
});
