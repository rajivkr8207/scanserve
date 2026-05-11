'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Store, User, Settings, LogOut, UtensilsCrossed,
  ChevronRight, X, Bell, BarChart3, QrCode, Ticket, Palette,
  ShoppingBag, Menu as MenuIcon
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar, setSidebarOpen } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
      { name: 'Restaurants', href: '/seller/restaurants', icon: Store },
    ],
  },
  {
    label: 'Manage',
    items: [
      { name: 'Orders', href: '/seller/orders', icon: ShoppingBag },
      { name: 'Menu', href: '/seller/menu', icon: MenuIcon },
      { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Tools',
    items: [
      { name: 'QR Codes', href: '/seller/qr', icon: QrCode },
      { name: 'Coupons', href: '/seller/coupons', icon: Ticket },
      { name: 'Themes', href: '/seller/theme', icon: Palette },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile', href: '/seller/profile', icon: User },
      { name: 'Settings', href: '/seller/settings', icon: Settings },
    ],
  },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const sidebarOpen = useAppSelector(s => s.ui.sidebarOpen);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-64 flex flex-col h-full border-r border-[var(--border)] bg-[var(--surface)] shadow-xl lg:shadow-none"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-[var(--shadow-brand)]">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">ScanServe</span>
          </Link>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link key={item.name} href={item.href}
                      className={cn('sidebar-nav-item', active && 'active')}
                      onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}
                    >
                      <item.icon size={18} className={active ? 'text-[var(--brand)]' : 'text-[var(--text-muted)]'} />
                      <span>{item.name}</span>
                      {active && <ChevronRight size={14} className="ml-auto text-[var(--brand)]" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)] mb-2">
            <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name ?? 'Seller'}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="sidebar-nav-item text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}
