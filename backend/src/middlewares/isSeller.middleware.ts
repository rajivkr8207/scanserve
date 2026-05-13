import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/types/user.type.js';
import { ApiError } from '../utils/ApiError.js';

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new ApiError(401, 'Authentication required');
    }

    if (req.user.role !== UserRole.SELLER) {
        throw new ApiError(403, 'Unauthorized access, seller only');
    }

    next();
};
