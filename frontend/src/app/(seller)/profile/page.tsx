'use client';

import Link from 'next/link';
import { User, Mail, Phone, Shield, Calendar, Edit2, X, Save, LogOut } from 'lucide-react';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { useProfile } from '@/modules/auth/hooks/useProfile';

export default function ProfilePage() {
  const {
    profile,
    form,
    errors,
    isLoading,
    isSaving,
    isEditing,
    successMessage,
    setIsEditing,
    handleChange,
    handleSave,
    handleLogout,
    handleCancelEdit,
  } = useProfile();

  const avatarInitials = profile?.name
    ? profile.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '?';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner" aria-label="Loading profile" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/dashboard"
              style={{ color: 'var(--auth-text-secondary)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15L8 10l4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <h1 className="profile-header-title">My Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              background: 'none', border: '1.5px solid var(--auth-border)',
              borderRadius: '0.5rem', padding: '0.5rem 0.875rem',
              color: 'var(--auth-text-secondary)', cursor: 'pointer', fontSize: '0.875rem',
              fontWeight: '500', transition: 'all 0.15s',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444';
              (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--auth-border)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--auth-text-secondary)';
            }}
            id="profile-logout"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="auth-alert auth-alert--success" style={{ marginBottom: '1rem' }}>
            ✓ {successMessage}
          </div>
        )}
        {errors.general && (
          <div className="auth-alert auth-alert--error" style={{ marginBottom: '1rem' }}>
            <span>⚠</span> {errors.general}
          </div>
        )}

        {/* Card */}
        <div style={{ borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.1)' }}>
          {/* Avatar Banner */}
          <div className="profile-avatar-section">
            <div className="profile-avatar" aria-label="User initials">
              {avatarInitials}
            </div>
            <p className="profile-name">{profile?.name ?? 'User'}</p>
            <p className="profile-email">{profile?.email ?? ''}</p>
            <span className="profile-badge">{profile?.role ?? 'SELLER'}</span>
          </div>

          {/* Form Section */}
          <div className="profile-form-section">
            {isEditing ? (
              <form onSubmit={handleSave} noValidate>
                <AuthInput
                  id="profile-name"
                  label="Full name"
                  type="text"
                  value={form.name ?? ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  icon={<User size={17} />}
                  autoFocus
                />
                <AuthInput
                  id="profile-phone"
                  label="Phone number"
                  type="tel"
                  value={form.phone ?? ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  icon={<Phone size={17} />}
                  placeholder="+91 98765 43210"
                />

                <div className="profile-actions">
                  <AuthButton
                    type="submit"
                    isLoading={isSaving}
                    id="profile-save"
                    style={{ flex: 1, marginTop: 0 }}
                  >
                    <Save size={16} style={{ marginRight: '0.375rem' }} />
                    Save changes
                  </AuthButton>
                  <AuthButton
                    type="button"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    id="profile-cancel"
                    style={{ flex: 1, marginTop: 0 }}
                  >
                    <X size={16} style={{ marginRight: '0.375rem' }} />
                    Cancel
                  </AuthButton>
                </div>
              </form>
            ) : (
              <>
                <div className="profile-field-row">
                  <div>
                    <p className="profile-field-label"><User size={12} style={{ display: 'inline', marginRight: '0.375rem' }} />Full name</p>
                    <p className="profile-field-value">{profile?.name ?? '—'}</p>
                  </div>
                </div>
                <div className="profile-field-row">
                  <div>
                    <p className="profile-field-label"><Mail size={12} style={{ display: 'inline', marginRight: '0.375rem' }} />Email address</p>
                    <p className="profile-field-value">{profile?.email ?? '—'}</p>
                  </div>
                </div>
                <div className="profile-field-row">
                  <div>
                    <p className="profile-field-label"><Phone size={12} style={{ display: 'inline', marginRight: '0.375rem' }} />Phone number</p>
                    <p className="profile-field-value">{profile?.phone ?? '—'}</p>
                  </div>
                </div>
                <div className="profile-field-row">
                  <div>
                    <p className="profile-field-label"><Shield size={12} style={{ display: 'inline', marginRight: '0.375rem' }} />Role</p>
                    <p className="profile-field-value">{profile?.role ?? '—'}</p>
                  </div>
                </div>
                <div className="profile-field-row">
                  <div>
                    <p className="profile-field-label"><Calendar size={12} style={{ display: 'inline', marginRight: '0.375rem' }} />Joined</p>
                    <p className="profile-field-value">{formatDate(profile?.createdAt)}</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    id="profile-edit"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--auth-primary-light)', border: '1.5px solid rgba(108,71,255,0.2)',
                      borderRadius: '0.625rem', padding: '0.75rem 1.25rem',
                      color: 'var(--auth-primary)', cursor: 'pointer', fontWeight: '600',
                      fontSize: '0.9375rem', transition: 'all 0.15s', width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Edit2 size={16} />
                    Edit profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
