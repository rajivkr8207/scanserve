import jsonwebtoken from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateToken = (payload: any) => {
  const token = jsonwebtoken.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
  return token;
};
