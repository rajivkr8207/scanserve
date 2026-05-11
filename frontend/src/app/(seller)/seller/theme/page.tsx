'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Palette, LayoutTemplate, Type, Eye } from 'lucide-react';
import { useTheme } from 'next-themes';

const COLORS = [
  { name: 'Indigo (Default)', value: '#6c47ff' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Fuchsia', value: '#d946ef' },
];

const FONTS = [
  { name: 'Inter (Modern)', value: 'var(--font-inter)' },
  { name: 'Outfit (Geometric)', value: 'var(--font-outfit)' },
  { name: 'Playfair (Classic)', value: 'var(--font-playfair)' },
];

export default function ThemeCustomizerPage() {
  const { theme, setTheme } = useTheme();
  const [activeColor, setActiveColor] = React.useState(COLORS[0].value);
  const [activeFont, setActiveFont] = React.useState(FONTS[0].value);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Controls Panel */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Brand Theme</h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1">Customize your restaurant's digital presence.</p>
        </div>

        <GlassCard intensity="light" className="p-6 space-y-8">
          {/* Mode */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
              <Eye size={18} /> Base Mode
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                  theme === 'light' ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]' : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                  theme === 'dark' ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]' : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
              <Palette size={18} /> Primary Color
            </h3>
            <div className="grid grid-cols-6 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setActiveColor(color.value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                    activeColor === color.value ? 'ring-2 ring-offset-2 ring-offset-[var(--bg)] ring-[var(--text-primary)]' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
              <Type size={18} /> Typography
            </h3>
            <div className="space-y-3">
              {FONTS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => setActiveFont(font.value)}
                  className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-all ${
                    activeFont === font.value ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)] font-bold' : 'border-[var(--border)] text-[var(--text-secondary)] font-medium'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full">Save Changes</Button>
        </GlassCard>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-2/3">
        <GlassCard intensity="heavy" className="p-2 sm:p-4 h-[700px] bg-[var(--surface-2)] flex flex-col items-center justify-center relative overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-4 left-6 flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm">
            <LayoutTemplate size={16} /> Live Customer Preview
          </div>
          
          {/* Mobile Mockup */}
          <div className="w-[320px] h-[650px] bg-[var(--bg)] rounded-[2.5rem] shadow-2xl border-4 border-[var(--border)] overflow-hidden relative" style={{ fontFamily: activeFont }}>
            {/* Header */}
            <div className="h-48 relative">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute bottom-4 left-4 z-20">
                <h2 className="text-white text-xl font-bold">Spice Garden</h2>
                <p className="text-white/80 text-xs mt-1">Authentic Indian</p>
              </div>
            </div>
            
            {/* Nav */}
            <div className="flex gap-2 p-3 overflow-x-hidden">
              <div className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md" style={{ backgroundColor: activeColor }}>Bestsellers</div>
              <div className="px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--text-secondary)]">Starters</div>
            </div>

            {/* Menu Items */}
            <div className="p-3 space-y-3">
              <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] flex gap-3 shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Butter Chicken</h4>
                  <p className="text-xs font-bold mt-1" style={{ color: activeColor }}>₹350</p>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg relative">
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold border" style={{ color: activeColor }}>ADD</div>
                </div>
              </div>
              <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] flex gap-3 shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Garlic Naan</h4>
                  <p className="text-xs font-bold mt-1" style={{ color: activeColor }}>₹60</p>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg relative">
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold border" style={{ color: activeColor }}>ADD</div>
                </div>
              </div>
            </div>

            {/* Floating Cart */}
            <div className="absolute bottom-4 inset-x-4 p-3 rounded-full text-white text-sm font-bold flex justify-between shadow-lg" style={{ backgroundColor: activeColor }}>
              <span>2 Items</span>
              <span>View Cart →</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
