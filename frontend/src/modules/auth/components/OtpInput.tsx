import React from 'react';

interface OtpInputProps {
  otp: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
}

export const OtpInput = ({
  otp,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
  error,
}: OtpInputProps) => {
  return (
    <div className="otp-input-row">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          className={`otp-box ${error ? 'otp-box--error' : ''} ${digit ? 'otp-box--filled' : ''}`}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={index === 0 ? onPaste : undefined}
          autoComplete="one-time-code"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
