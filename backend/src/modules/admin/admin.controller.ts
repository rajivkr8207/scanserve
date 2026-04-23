import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AdminService } from "./admin.service.js";




export const VerifySeller = asyncHandler(async (req: Request, res: Response) => {
    const sellerId = req.params.id as string;
    const { verify } = req.body;
    const verified = await AdminService.VerifySeller(sellerId, verify)
    return res.status(200).json(new ApiResponse(200, verified, 'Seller verified successfully'));
});


export const AllSellers = asyncHandler(async (req: Request, res: Response) => {
    const sellers = await AdminService.getAllSellers();
    return res.status(200).json(new ApiResponse(200, sellers, 'Sellers fetched successfully'));
});


export const BanUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = req.user.id as string;
    const BanReason = req.body.BanReason as string;
    const banned = await AdminService.BanUser(userId, BanReason, user);
    return res.status(200).json(new ApiResponse(200, banned, 'User banned successfully'));
});


export const UnBanUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = req.user.id;
    const unBanned = await AdminService.UnBanUser(userId, user);
    return res.status(200).json(new ApiResponse(200, unBanned, 'User unbanned successfully'));
});
