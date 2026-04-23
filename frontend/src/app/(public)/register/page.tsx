'use client';

import Link from 'next/link';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { AuthLayout } from '@/modules/auth/components/AuthLayout';
import { AuthCard } from '@/modules/auth/components/AuthCard';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { useRegister } from '@/modules/auth/hooks/useRegister';

export default function RegisterPage() {
  const { form, errors, isLoading, handleChange, handleSubmit } = useRegister();

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Start managing your restaurant with smart QR menus."
      >
        {errors.general && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span>⚠</span> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="register-name"
            label="Full name"
            type="text"
            placeholder="John Smith"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            icon={<User size={17} />}
            autoComplete="name"
            autoFocus
          />

          <AuthInput
            id="register-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            icon={<Mail size={17} />}
            autoComplete="email"
          />

          <AuthInput
            id="register-phone"
            label="Phone number (optional)"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            icon={<Phone size={17} />}
            autoComplete="tel"
          />

          <AuthInput
            id="register-password"
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            icon={<Lock size={17} />}
            autoComplete="new-password"
          />

          <AuthInput
            id="register-confirm-password"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            icon={<Lock size={17} />}
            autoComplete="new-password"
          />

          <AuthButton type="submit" isLoading={isLoading} id="register-submit">
            Create account →
          </AuthButton>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
