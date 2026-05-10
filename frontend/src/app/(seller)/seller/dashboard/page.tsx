'use client';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Store, TrendingUp, Clock, CheckCircle2, ChefHat, Bell } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { RevenueChart, OrdersChart } from '@/components/charts/Charts';
import { useAppSelector } from '@/store/hooks';

const MOCK_DAILY = [
  { date: 'Mon', revenue: 4200, orders: 18 },
  { date: 'Tue', revenue: 6800, orders: 27 },
  { date: 'Wed', revenue: 5100, orders: 22 },
  { date: 'Thu', revenue: 8900, orders: 35 },
  { date: 'Fri', revenue: 11200, orders: 44 },
  { date: 'Sat', revenue: 14500, orders: 58 },
  { date: 'Sun', revenue: 9800, orders: 40 },
];

const MOCK_ORDERS = [
  { id: '#1043', table: 'T-4', items: 'Butter Chicken, Naan ×2', total: 560, status: 'preparing', time: '8 min ago' },
  { id: '#1044', table: 'T-7', items: 'Dal Makhani, Rice', total: 320, status: 'pending', time: '2 min ago' },
  { id: '#1045', table: 'T-2', items: 'Paneer Tikka, Lassi', total: 480, status: 'ready', time: '15 min ago' },
  { id: '#1046', table: 'T-9', items: 'Biryani ×2', total: 700, status: 'served', time: '22 min ago' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'badge-warning',
  preparing: 'badge-brand',
  ready: 'badge-success',
  served: 'badge-dark',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={10} />,
  preparing: <ChefHat size={10} />,
  ready: <Bell size={10} />,
  served: <CheckCircle2 size={10} />,
};

export default function DashboardPage() {
  const user = useAppSelector(s => s.auth.user);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Good evening, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">Here's what's happening with your restaurants today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹60,500" icon={DollarSign} trend={18.2} trendLabel="vs last week" delay={0} />
        <StatCard title="Total Orders" value={244} icon={ShoppingBag} iconColor="text-purple-500" iconBg="bg-purple-50 dark:bg-purple-950/30" trend={12.5} trendLabel="vs last week" delay={0.05} />
        <StatCard title="Restaurants" value={2} icon={Store} iconColor="text-orange-500" iconBg="bg-orange-50 dark:bg-orange-950/30" delay={0.1} />
        <StatCard title="Avg Order Value" value="₹248" icon={TrendingUp} iconColor="text-green-500" iconBg="bg-green-50 dark:bg-green-950/30" trend={5.3} trendLabel="vs last week" delay={0.15} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Revenue Overview</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Last 7 days</p>
            </div>
            <span className="badge badge-success text-xs">+18.2% ↑</span>
          </div>
          <RevenueChart data={MOCK_DAILY} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[var(--text-primary)]">Orders</h3>
            <span className="badge badge-brand text-xs">This Week</span>
          </div>
          <OrdersChart data={MOCK_DAILY} />
        </motion.div>
      </div>

      {/* Live Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Live Orders</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Real-time order tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-600 font-semibold">Live</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
                  <td className="font-bold text-[var(--brand)]">{order.id}</td>
                  <td>
                    <span className="font-semibold text-[var(--text-primary)] bg-[var(--surface-2)] px-2 py-0.5 rounded-lg text-sm">{order.table}</span>
                  </td>
                  <td className="text-[var(--text-secondary)] max-w-[180px] truncate">{order.items}</td>
                  <td className="font-bold text-[var(--text-primary)]">₹{order.total}</td>
                  <td>
                    <span className={`badge ${STATUS_STYLES[order.status]} flex items-center gap-1 w-fit`}>
                      {STATUS_ICONS[order.status]} {order.status}
                    </span>
                  </td>
                  <td className="text-[var(--text-muted)] text-sm">{order.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
