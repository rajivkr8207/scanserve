import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration?: React.ReactNode;
}

export const AuthLayout = ({ children, illustration }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-panel-left">
        <div className="auth-panel-brand">
          <div className="auth-logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="white" fillOpacity="0.15" />
              <path
                d="M8 8h8v8H8zM20 8h8v8h-8zM8 20h8v8H8zM22 20h6v2h-6zM22 24h6v2h-6zM22 28h6v2h-6z"
                fill="white"
              />
            </svg>
            <span className="auth-logo-text">ScanServe</span>
          </div>
          <div className="auth-panel-content">
            {illustration ?? (
              <>
                <h1 className="auth-panel-heading">
                  Smart QR Menus for Modern Restaurants
                </h1>
                <p className="auth-panel-sub">
                  Boost orders, reduce wait times, and delight your guests with a seamless digital dining experience.
                </p>
                <div className="auth-features">
                  {[
                    'Contactless QR ordering',
                    'Real-time order management',
                    'Detailed analytics dashboard',
                    'Multi-restaurant support',
                  ].map((feat) => (
                    <div key={feat} className="auth-feature-item">
                      <span className="auth-feature-check">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <p className="auth-panel-footer">
            © 2026 ScanServe. Transforming dining experiences.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel-right">
        <div className="auth-form-container">{children}</div>
      </div>
    </div>
  );
};
