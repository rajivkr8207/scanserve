import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  id: string;
}

export const AuthInput = ({ label, error, icon, type, id, ...props }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="auth-input-group">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="auth-input-wrapper">
        {icon && <span className="auth-input-icon">{icon}</span>}
        <input
          id={id}
          type={inputType}
          className={`auth-input ${icon ? 'auth-input--icon' : ''} ${error ? 'auth-input--error' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="auth-error-msg">{error}</p>}
    </div>
  );
};
