import axios from "axios";
import { Env } from "../../../config/Config";

const publicApi = axios.create({
    baseURL: `${Env.Backend_URL}/api/v1`,
});

export const createOrder = async (orderData: any) => {
    const res = await publicApi.post("/order", orderData);
    return res.data;
};

export const verifyPayment = async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}) => {
    const res = await publicApi.post("/payment/verify", data);
    return res.data;
};

export const OrderServices = {
    createOrder,
    verifyPayment,
};
