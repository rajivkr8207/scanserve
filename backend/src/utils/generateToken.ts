import jsonwebtoken from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import type { DecodedToken } from '../../../shared/types/user.type.js';
import type { Response } from 'express';
export const generateTokenSetToken = (payload: DecodedToken, res: Response) => {
  const accesstoken = GenrateAccessToken(payload)
  const refreshtoken = genrateRefreshToken(payload)

  res.cookie("scanserve_access", accesstoken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  })

  res.cookie("scanserve_refresh", refreshtoken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  })
};

export const GenrateAccessToken = (payload: DecodedToken) => {
  const token = jsonwebtoken.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return token;
};

export const genrateRefreshToken = (payload: DecodedToken) => {
  const token = jsonwebtoken.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
  return token;
};