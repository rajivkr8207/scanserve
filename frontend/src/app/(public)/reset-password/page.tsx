'use client';

import Link from 'next/link';
import { Key, Lock } from 'lucide-react';
import { AuthLayout } from '@/modules/auth/components/AuthLayout';
import { AuthCard } from '@/modules/auth/components/AuthCard';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { useResetPassword } from '@/modules/auth/hooks/useResetPassword';

export default function ResetPasswordPage() {
  const { form, errors, isLoading, success, pendingEmail, handleChange, handleSubmit } =
    useResetPassword();

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        subtitle="Enter the code we sent and choose a new password."
        backHref="/forgot-password"
        backLabel="Back"
      >
        {success && (
          <div className="auth-alert auth-alert--success" role="status">
            ✓ Password reset! Redirecting to login…
          </div>
        )}

        {errors.general && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span>⚠</span> {errors.general}
          </div>
        )}

        {pendingEmail && (
          <p className="auth-otp-info" style={{ marginBottom: '0.75rem' }}>
            Code sent to <span className="auth-otp-email">{pendingEmail}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="reset-otp"
            label="Reset code"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={form.otp}
            onChange={(e) => handleChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={errors.otp}
            icon={<Key size={17} />}
            maxLength={6}
            autoFocus
            disabled={success}
          />

          <AuthInput
            id="reset-new-password"
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            value={form.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            error={errors.newPassword}
            icon={<Lock size={17} />}
            autoComplete="new-password"
            disabled={success}
          />

          <AuthInput
            id="reset-confirm-password"
            label="Confirm new password"
            type="password"
            placeholder="Repeat your new password"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            icon={<Lock size={17} />}
            autoComplete="new-password"
            disabled={success}
          />

          <AuthButton type="submit" isLoading={isLoading} disabled={success} id="reset-submit">
            Reset password
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
