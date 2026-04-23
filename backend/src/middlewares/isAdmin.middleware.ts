import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/types/user.type.js';
import { ApiError } from '../utils/ApiError.js';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  if (req.user.role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Unauthorized access, admin only');
  }

  next();
};
