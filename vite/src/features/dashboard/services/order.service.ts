import { api } from '../../../lib/api';

export const getRestaurantOrders = async () => {
    const res = await api.get('/order/restaurant/orders');
    return res.data;
};

export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
    const res = await api.patch(`/order/${orderId}/status`, { orderStatus });
    return res.data;
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    const res = await api.patch(`/order/${orderId}/payment`, { paymentStatus });
    return res.data;
};

export const SellerOrderServices = {
    getRestaurantOrders,
    updateOrderStatus,
    updatePaymentStatus,
};
