'use client';

import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthInput } from '@/features/auth/components/AuthInput';
import { AuthButton } from '@/features/auth/components/AuthButton';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginPage() {
  const { form, errors, isLoading, handleChange, handleSubmit } = useLogin();

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to manage your restaurant and QR menus."
      >
        {errors.general && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span>⚠</span> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="login-username"
            label="Email or Username"
            type="text"
            placeholder="Enter your username or email"
            value={form.usernameOrEmail}
            onChange={(e: any) => handleChange('usernameOrEmail', e.target.value)}
            error={errors.usernameOrEmail}
            icon={<User size={17} />}
            autoComplete="email"
            autoFocus
          />

          <AuthInput
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e: any) => handleChange('password', e.target.value)}
            error={errors.password}
            icon={<Lock size={17} />}
            autoComplete="current-password"
          />

          <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.5rem' }}>
            <Link href="/forgot-password" className="auth-link" style={{ fontSize: '0.875rem' }}>
              Forgot password?
            </Link>
          </div>

          <AuthButton type="submit" isLoading={isLoading} id="login-submit">
            Sign in
          </AuthButton>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-link">
            Create one free
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
