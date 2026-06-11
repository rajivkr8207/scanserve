import { getIO } from './socket.server.js';

/**
 * Emit a new order event to the restaurant room so the seller sees it live.
 * Call this from order.controller after creating an order.
 */
export const emitNewOrder = (restaurantId: string, order: any) => {
    try {
        const io = getIO();
        io.to(`restaurant:${restaurantId}`).emit('new-order', order);
    } catch (err) {
        console.error('[Socket] emitNewOrder failed:', err);
    }
};

/**
 * Emit an order-status-updated event to the restaurant room.
 * Call this from order.controller after updating order status.
 */
export const emitOrderStatusUpdated = (restaurantId: string, order: any) => {
    try {
        const io = getIO();
        io.to(`restaurant:${restaurantId}`).emit('order-status-updated', order);
    } catch (err) {
        console.error('[Socket] emitOrderStatusUpdated failed:', err);
    }
};

/**
 * Handle seller joining their restaurant room for live order updates.
 */
export const handleOrderSocket = (socket: any) => {
    // Seller joins their restaurant room to receive live order notifications
    socket.on('join-restaurant', (restaurantId: string) => {
        socket.join(`restaurant:${restaurantId}`);
        console.log(`[Socket] Socket ${socket.id} joined room: restaurant:${restaurantId}`);
        socket.emit('joined-restaurant', { restaurantId });
    });

    socket.on('leave-restaurant', (restaurantId: string) => {
        socket.leave(`restaurant:${restaurantId}`);
        console.log(`[Socket] Socket ${socket.id} left room: restaurant:${restaurantId}`);
    });
};
