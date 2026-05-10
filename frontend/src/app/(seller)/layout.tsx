'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setSidebarOpen } from '@/store/slices/uiSlice';
import { SellerSidebar } from '@/components/navigation/SellerSidebar';
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function getPageTitle(pathname: string) {
  if (pathname === '/seller/dashboard') return 'Dashboard';
  if (pathname.startsWith('/seller/restaurants')) return 'Restaurants';
  if (pathname.includes('/seller/menu')) return 'Menu Management';
  if (pathname.includes('/seller/orders')) return 'Live Orders';
  if (pathname.includes('/seller/analytics')) return 'Analytics';
  if (pathname.includes('/seller/qr')) return 'QR Codes';
  if (pathname.includes('/seller/coupons')) return 'Coupons';
  if (pathname.includes('/seller/theme')) return 'Theme Customizer';
  if (pathname === '/seller/profile') return 'My Profile';
  if (pathname === '/seller/settings') return 'Settings';
  return 'Seller Dashboard';
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const unreadCount = useAppSelector(s => s.ui.unreadCount);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <SellerSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight hidden sm:block">
              {getPageTitle(pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] transition-colors">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--brand)] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
