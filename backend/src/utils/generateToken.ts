import jsonwebtoken from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import type { DecodedToken } from '../../../shared/types/user.type.js';

export const generateToken = (payload: DecodedToken) => {
  const token = jsonwebtoken.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
  return token;
};
