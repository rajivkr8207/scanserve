'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Store, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NAV = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Restaurants', href: '/admin/restaurants', icon: Store },
    { name: 'Sellers', href: '/admin/sellers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col h-full border-r border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight font-[var(--font-outfit)]">Admin Panel</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl font-medium transition-colors',
                  active ? 'bg-red-50 text-red-600 dark:bg-red-950/30' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 glass border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-lg font-bold">God-Mode Dashboard</h1>
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">A</div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
