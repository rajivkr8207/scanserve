'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPendingEmail } from '@/store/slices/authSlice';

interface ResetForm {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export const useResetPassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pendingEmail = useAppSelector((s) => s.auth.pendingEmail);

  const [form, setForm] = useState<ResetForm>({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.otp.trim() || form.otp.length < 6) errs.otp = 'Enter the 6-digit OTP';
    if (!form.newPassword) {
      errs.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      errs.newPassword = 'Password must be at least 8 characters';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof ResetForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !pendingEmail) return;
    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: pendingEmail,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      dispatch(setPendingEmail(null));
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset failed';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, errors, isLoading, success, pendingEmail, handleChange, handleSubmit };
};
