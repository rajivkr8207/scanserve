import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        subtotal: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },

        customerEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        customerPhone: {
            type: String,
            trim: true,
            default: "",
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "preparing",
                "ready",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        paymentMethod: {
            type: String,
            enum: ["online", "cash"],
            default: "online",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);