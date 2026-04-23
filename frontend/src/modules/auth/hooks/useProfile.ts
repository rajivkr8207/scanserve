'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import type { UpdateProfileDto, ISharedUser } from '@shared/types/user.type';

interface FormErrors {
  name?: string;
  phone?: string;
  general?: string;
}

export const useProfile = () => {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();

  const [profile, setProfile] = useState<ISharedUser | null>(null);
  const [form, setForm] = useState<UpdateProfileDto>({ name: '', phone: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await authService.getProfile();
        setProfile(data);
        setForm({ name: data.name, phone: data.phone ?? '' });
      } catch {
        // Fallback to local store data if API fails
        if (user) {
          setProfile(user as ISharedUser);
          setForm({ name: user.name ?? '', phone: user.phone ?? '' });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name?.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof UpdateProfileDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    try {
      const updated = await authService.updateProfile(form);
      setProfile(updated);
      updateUser(updated);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setErrors({ general: message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue logout even if API fails
    } finally {
      logout();
      router.push('/login');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setForm({ name: profile?.name ?? '', phone: profile?.phone ?? '' });
    setErrors({});
  };

  return {
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
  };
};
