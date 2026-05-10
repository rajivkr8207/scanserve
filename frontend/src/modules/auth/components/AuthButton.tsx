import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const AuthButton = ({
  isLoading = false,
  variant = 'primary',
  children,
  disabled,
  ...props
}: AuthButtonProps) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`auth-btn auth-btn--${variant} ${isLoading ? 'auth-btn--loading bg-amber-300' : ''}`}
      {...props}
    >
      {isLoading ? (
        <span className="auth-spinner-wrap">
          <span className="auth-spinner" />
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
