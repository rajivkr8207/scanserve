'use client';

import { Suspense } from 'react';
import { AuthLayout } from '@/modules/auth/components/AuthLayout';
import { AuthCard } from '@/modules/auth/components/AuthCard';
import { OtpInput } from '@/modules/auth/components/OtpInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { useVerifyOtp } from '@/modules/auth/hooks/useVerifyOtp';

function VerifyOtpContent() {
  const {
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
  } = useVerifyOtp();

  const isRegistration = type === 'REGISTER';

  return (
    <AuthCard
      title={isRegistration ? 'Verify your email' : 'Enter reset code'}
      subtitle={
        isRegistration
          ? 'We sent a 6-digit code to verify your account.'
          : 'We sent a reset code to your email address.'
      }
      backHref={isRegistration ? '/register' : '/forgot-password'}
      backLabel={isRegistration ? 'Back to register' : 'Back'}
    >
      <p className="auth-otp-info">
        Code sent to{' '}
        <span className="auth-otp-email">{pendingEmail ?? '...'}</span>
      </p>

      {error && (
        <div className="auth-alert auth-alert--error" role="alert">
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <OtpInput
          otp={otp}
          onChange={handleOtpChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={isLoading}
          error={!!error}
        />

        <AuthButton type="submit" isLoading={isLoading} id="verify-otp-submit">
          Verify code
        </AuthButton>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
        <span className="auth-countdown" style={{ fontSize: '0.875rem', color: 'var(--auth-text-secondary)' }}>
          Didn&apos;t receive it?
        </span>
        {canResend ? (
          <button
            type="button"
            className="auth-resend-btn"
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend code
          </button>
        ) : (
          <span className="auth-countdown">
            Resend in{' '}
            <strong style={{ color: 'var(--auth-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {String(countdown).padStart(2, '0')}s
            </strong>
          </span>
        )}
      </div>
    </AuthCard>
  );
}

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div style={{ color: 'var(--auth-text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
        <VerifyOtpContent />
      </Suspense>
    </AuthLayout>
  );
}
