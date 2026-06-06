import type { DecodedToken } from '@shared/types/user.type.js';
import { ENV } from '../../config/env.js';
import { User } from './user.model.js';
import jwt from 'jsonwebtoken'
import { GenrateAccessToken } from '../../utils/generateToken.js';
export const AuthService = {
  async findUserForLogin(usernameOrEmail: string) {
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }],
    }).select('+password');
    return user;
  },
  async findByUserNameOrEmail(username: string, email: string) {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    return user;
  },
  GenAccessToken(token: string) {
    const decodeToken = jwt.verify(token, ENV.JWT_SECRET as string) as DecodedToken
    const payload: DecodedToken = {
      id: decodeToken.id,
      role: decodeToken.role,
      username: decodeToken.username,
    }
    const accessToken = GenrateAccessToken(payload);

    return accessToken;
  },
  async findByEmail(email: string) {
    const user = await User.findOne({ email })
    console.log(user);
    return user;
  },

  async registerUser(
    fullName: string,
    username: string,
    email: string,
    phoneno: string,
    password: string,
    otp: string,
  ) {
    const user = await User.create({
      fullName,
      username,
      email,
      phoneno,
      password,
      otp,
      otpExpire: new Date(Date.now() + 1000 * 60 * 15),
    });
    return user;
  },

  async findById(id: string) {
    const user = await User.findById(id);
    return user;
  },
};
