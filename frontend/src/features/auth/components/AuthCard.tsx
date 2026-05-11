import React from 'react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export const AuthCard = ({ title, subtitle, backHref, backLabel, children }: AuthCardProps) => {
  return (
    <div className="auth-card">
      {backHref && (
        <Link href={backHref} className="auth-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {backLabel ?? 'Back'}
        </Link>
      )}
      <div className="auth-card-header">
        <h2 className="auth-card-title">{title}</h2>
        {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
      </div>
      <div className="auth-card-body">{children}</div>
    </div>
  );
};
