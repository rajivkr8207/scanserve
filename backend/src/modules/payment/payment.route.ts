import express from 'express';
import { createPayment, verifyPayment } from './payment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { paymentValidator } from './payment.validator.js';

const paymentRouter = express.Router();

paymentRouter.post('/create', paymentValidator.create, createPayment);
paymentRouter.post('/verify', paymentValidator.verify, verifyPayment);


export default paymentRouter;