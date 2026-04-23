import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AuthService } from './user.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateToken } from '../../utils/generateToken.js';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, username, email, password, phoneno } = req.body;
    const existUser = await AuthService.findByUserNameOrEmail(username, email);
    if (existUser) {
        throw new ApiError(409, 'User already exists');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await AuthService.registerUser(
        fullName,
        username,
        email,
        phoneno,
        password,
        otp.toString(),
    );
    return res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body;
    const user = await AuthService.findUserForLogin(usernameOrEmail);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const isEmailVerifiedUser = user.isEmailVerified;
    if (!isEmailVerifiedUser) {
        throw new ApiError(401, 'Email not verified');
    }
    const isVerifiedUser = user.isVerified;
    if (!isVerifiedUser) {
        throw new ApiError(401, 'Account not verified, please wait for approval');
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password');
    }
    const payload = {
        id: user._id,
        role: user.role,
    };
    const token = generateToken(payload);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json(new ApiResponse(200, {}, 'User logged in successfully'));
});

export const Logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(200).json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(404, 'User not found');
    }
    const user = await AuthService.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const email = req.params.email as string;
    const { otp } = req.body;
    const user = await AuthService.findByEmail(email);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (user.otp !== otp) {
        throw new ApiError(400, 'Invalid OTP');
    }
    if (!user.otpExpire || user.otpExpire < new Date()) {
        throw new ApiError(400, 'OTP expired');
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    user.isEmailVerified = true;
    await user.save();
    return res.status(200).json(new ApiResponse(200, user, 'User verified successfully'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await AuthService.findByEmail(email);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.forgotPasswordOtp = otp.toString();
    user.forgotPasswordExpire = new Date(Date.now() + 1000 * 60 * 15);
    await user.save();
    return res.status(200).json(new ApiResponse(200, user, 'User reset password sent Otp successfully'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const email = req.params.email as string;
    const { otp, password } = req.body;
    const user = await AuthService.findByEmail(email);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (user.forgotPasswordOtp !== otp) {
        throw new ApiError(400, 'Invalid OTP');
    }
    if (!user.forgotPasswordExpire || user.forgotPasswordExpire < new Date()) {
        throw new ApiError(400, 'OTP expired');
    }
    user.password = password;
    user.forgotPasswordOtp = undefined;
    user.forgotPasswordExpire = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, user, 'User Reset Password successfully'));
});
