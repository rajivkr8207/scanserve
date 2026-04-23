export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  MANAGER = 'MANAGER',
}

export interface ISharedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DecodedToken {
  id: string;
  role: UserRole;
  username: string;
}

// Auth DTOs
export interface RegisterDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
  type: 'REGISTER' | 'FORGOT_PASSWORD';
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string;
}