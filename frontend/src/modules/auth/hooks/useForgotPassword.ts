'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';

interface FormErrors {
  email?: string;
  general?: string;
}

export const useForgotPassword = () => {
  const router = useRouter();
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setPendingEmail(email);
      setSuccess(true);
      setTimeout(() => router.push('/verify-otp?type=FORGOT_PASSWORD'), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return { email, errors, isLoading, success, handleChange, handleSubmit };
};
