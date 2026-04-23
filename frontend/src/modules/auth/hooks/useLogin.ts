'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginDto } from '@shared/types/user.type';

interface FormErrors {
  usernameOrEmail?: string;
  password?: string;
  general?: string;
}

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  const [form, setForm] = useState<LoginDto>({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.usernameOrEmail.trim()) {
      errs.usernameOrEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.usernameOrEmail)) {
      errs.usernameOrEmail = 'Enter a valid email address';
    }
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof LoginDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const data = await authService.login(form);
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      // If email not verified, redirect to OTP
      if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('otp')) {
        setPendingEmail(form.email);
        router.push('/verify-otp?type=REGISTER');
      } else {
        setErrors({ general: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { form, errors, isLoading, handleChange, handleSubmit };
};
