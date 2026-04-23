'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { AuthLayout } from '@/modules/auth/components/AuthLayout';
import { AuthCard } from '@/modules/auth/components/AuthCard';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { useForgotPassword } from '@/modules/auth/hooks/useForgotPassword';

export default function ForgotPasswordPage() {
  const { email, errors, isLoading, success, handleChange, handleSubmit } = useForgotPassword();

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a reset code."
        backHref="/login"
        backLabel="Back to login"
      >
        {success && (
          <div className="auth-alert auth-alert--success" role="status">
            ✓ Reset code sent! Redirecting…
          </div>
        )}

        {errors.general && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span>⚠</span> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="forgot-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            error={errors.email}
            icon={<Mail size={17} />}
            autoComplete="email"
            autoFocus
            disabled={success}
          />

          <AuthButton type="submit" isLoading={isLoading} disabled={success} id="forgot-submit">
            Send reset code
          </AuthButton>
        </form>

        <p className="auth-footer-text">
          Remembered it?{' '}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
