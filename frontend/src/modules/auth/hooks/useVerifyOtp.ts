'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

export const useVerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') ?? 'REGISTER') as 'REGISTER' | 'FORGOT_PASSWORD';

  const pendingEmail = useAuthStore((s) => s.pendingEmail);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no pending email
  useEffect(() => {
    if (!pendingEmail) {
      router.replace('/login');
    }
  }, [pendingEmail, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);
    // Auto-advance focus
    if (value && index < OTP_LENGTH - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }
    if (!pendingEmail) return;
    setIsLoading(true);
    try {
      const data = await authService.verifyOtp({ email: pendingEmail, otp: otpString, type });
      if (type === 'REGISTER') {
        setAuth(data.user, data.token);
        router.push('/dashboard');
      } else {
        router.push(`/reset-password`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP';
      setError(message);
      setOtp(Array(OTP_LENGTH).fill(''));
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend || !pendingEmail) return;
    setIsLoading(true);
    try {
      await authService.resendOtp(pendingEmail);
      setCountdown(RESEND_COUNTDOWN);
      setCanResend(false);
      setError(null);
      setOtp(Array(OTP_LENGTH).fill(''));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [canResend, pendingEmail]);

  return {
    otp,
    error,
    isLoading,
    countdown,
    canResend,
    pendingEmail,
    type,
    handleOtpChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
  };
};
