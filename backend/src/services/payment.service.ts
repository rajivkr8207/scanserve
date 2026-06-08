import Razorpay from "razorpay";
import { ENV } from "../config/env.js";

const razorpay = new Razorpay({
    key_id: ENV.RAZORPAY_KEY,
    key_secret: ENV.RAZORPAY_SECRET,
});

export const Createorder = async ({ amount, currency = "INR" }: { amount: number; currency: string }) => {
    const options = {
        amount: amount * 100,
        currency: currency,
    }
    const order = await razorpay.orders.create(options);
    return order;
}