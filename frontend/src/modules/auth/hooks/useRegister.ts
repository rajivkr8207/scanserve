'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAppDispatch } from '@/store/hooks';
import { setPendingEmail } from '@/store/slices/authSlice';
import type { RegisterDto } from '@shared/types/user.type';

interface RegisterForm extends RegisterDto {
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  fullName?: string;
  email?: string;
  phoneno?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const useRegister = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<RegisterForm>({
    username: '',
    fullName: '',
    email: '',
    phoneno: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authService.register({
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        phoneno: form.phoneno || undefined,
        password: form.password,
      });
      dispatch(setPendingEmail(form.email));
      router.push('/verify-otp?type=REGISTER');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, errors, isLoading, handleChange, handleSubmit };
};
