import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
