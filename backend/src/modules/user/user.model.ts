import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../../../shared/types/user.type.js';

export interface IUser extends Document {
    fullName: string;
    username: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    isVerified: boolean;
    phoneno: string;
    otp?: string;
    otpExpire?: Date;
    forgotPasswordOtp?: string;
    forgotPasswordExpire?: Date;
    role: UserRole;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phoneno: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },

        otpExpire: {
            type: Date,
        },

        forgotPasswordOtp: {
            type: String,
        },

        forgotPasswordExpire: {
            type: Date,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.SELLER,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
