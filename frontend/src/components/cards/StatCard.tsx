'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  delay?: number;
  prefix?: string;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  delay = 0, 
  prefix,
  iconColor = "text-[var(--brand)]",
  iconBg = "bg-[var(--brand-light)]"
}: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <GlassCard intensity="light" hoverEffect className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-secondary)] text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-[var(--text-primary)]">
              {prefix}{value}
            </h3>
          </div>
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
            <Icon size={24} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            {trendLabel && <span className="text-[var(--text-muted)]">{trendLabel}</span>}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
