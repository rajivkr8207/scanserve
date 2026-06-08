import type { Request, Response } from 'express';
import { PaymentService } from './payment.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, amount, currency } = req.body;
  const userId = req.user.id;

  const result = await PaymentService.createPaymentOrder(userId, orderId, amount, currency);

  res.status(201).json(new ApiResponse(201, result, 'Payment order created successfully'));
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const payment = await PaymentService.verifyPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  res.status(200).json(new ApiResponse(200, payment, 'Payment verified successfully'));
});