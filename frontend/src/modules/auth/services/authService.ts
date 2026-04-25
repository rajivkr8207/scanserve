import api from '@/lib/axios';
import type {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
  ISharedUser,
} from '@shared/types/user.type';

export interface AuthResponse {
  user: ISharedUser;
  token: string;
}

export const authService = {
  register: async (dto: RegisterDto): Promise<{ message: string }> => {
    console.log(dto);
    const res = await api.post('/auth/register', dto);
    return res.data;
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', dto);
    console.log(res.data);
    return res.data.data;
  },

  verifyOtp: async (dto: VerifyOtpDto): Promise<AuthResponse> => {
    const res = await api.post(`/auth/verify/${dto.email}`, { otp: dto.otp });
    return res.data.data;
  },

  verifyForgotPasswordOtp: async (email: string, otp: string): Promise<{ message: string }> => {
    const res = await api.post(`/auth/verify-reset/${email}`, { otp });
    return res.data;
  },

  resendOtp: async (email: string): Promise<{ message: string }> => {
    const res = await api.post(`/auth/resend-otp/${email}`);
    return res.data;
  },

  forgotPassword: async (dto: ForgotPasswordDto): Promise<{ message: string }> => {
    const res = await api.post('/auth/forgot-password', dto);
    return res.data;
  },

  resetPassword: async (dto: ResetPasswordDto): Promise<{ message: string }> => {
    const res = await api.post(`/auth/reset-password/${dto.email}`, {
      otp: dto.otp,
      password: dto.newPassword,
    });
    return res.data;
  },

  getProfile: async (): Promise<ISharedUser> => {
    const res = await api.get('/auth/profile');
    return res.data.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<ISharedUser> => {
    const res = await api.put('/auth/profile', dto);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
