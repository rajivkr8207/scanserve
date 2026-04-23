import type { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../modules/user/user.model.js';
import { UserRole } from '../../../shared/types/user.type.js';

interface JwtPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const decoded = jsonwebtoken.verify(token, ENV.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'User not found or session expired');
    }

    req.user = {
      id: user._id,
      role: user.role,
      username: user.username,
    };
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
});

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Unauthorized access');
    }

    next();
  };
};
