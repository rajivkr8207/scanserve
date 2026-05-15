'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Palette,
  LayoutTemplate,
  Type,
  Eye,
  Settings,
  Image as ImageIcon,
  Check,
  Loader2,
  ChevronRight,
  Smartphone,
  Search,
  ShoppingCart,
  Plus
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMenuTheme } from '@/features/restaurant/hooks/useMenuTheme';
import { cn } from '@/lib/utils';

const COLORS = [
  { name: 'Indigo', value: '#6c47ff' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Slate', value: '#475569' },
];

const FONTS = [
  { name: 'Inter (Modern)', value: 'Inter, sans-serif' },
  { name: 'Outfit (Geometric)', value: 'Outfit, sans-serif' },
  { name: 'Playfair (Classic)', value: 'Playfair Display, serif' },
  { name: 'Poppins (Soft)', value: 'Poppins, sans-serif' },
];

const TABS = [
  { id: 'branding', label: 'Branding', icon: ImageIcon },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'layout', label: 'Layout', icon: LayoutTemplate },
  { id: 'visibility', label: 'Visibility', icon: Eye },
];

export default function ThemeCustomizerPage() {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const { theme, setTheme, loading, saving, saveTheme } = useMenuTheme();
  const [activeTab, setActiveTab] = React.useState('branding');

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Palette size={48} className="text-[var(--text-muted)]" />
        <h2 className="text-xl font-bold">No theme found</h2>
        <p className="text-[var(--text-secondary)]">We couldn't load your theme settings. Please try refreshing.</p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }

  const updateNestedField = (path: string, value: any) => {
    const keys = path.split('.');
    setTheme((prev: any) => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleSave = () => {
    if (theme) {
      saveTheme(theme);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-200px)]">
      {/* Controls Panel */}
      <div className="w-full xl:w-[400px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Brand Theme</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-1">Design your digital experience.</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="shadow-xl shadow-[var(--brand-glow)]"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-[var(--surface-2)] rounded-2xl gap-1 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white text-[var(--brand)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-white/50"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <GlassCard intensity="light" className="p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Branding Section */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">Store Identity</h3>
                    <Input
                      label="Restaurant Name"
                      value={theme.branding.restaurantName}
                      onChange={(e: any) => updateNestedField('branding.restaurantName', e.target.value)}
                    />
                    <Input
                      label="Tagline"
                      value={theme.branding.tagline}
                      onChange={(e: any) => updateNestedField('branding.tagline', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">Images (URLs)</h3>
                    <Input
                      label="Logo URL"
                      value={theme.branding.logo}
                      onChange={(e: any) => updateNestedField('branding.logo', e.target.value)}
                    />
                    <Input
                      label="Cover Image URL"
                      value={theme.branding.coverImage}
                      onChange={(e: any) => updateNestedField('branding.coverImage', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Colors Section */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                      <Palette size={18} /> Primary Color
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => updateNestedField('colors.primary', color.value)}
                          className={cn(
                            "group relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all hover:scale-105",
                            theme.colors.primary === color.value ? "ring-2 ring-offset-2 ring-offset-[var(--bg)] ring-[var(--text-primary)]" : ""
                          )}
                          style={{ backgroundColor: color.value }}
                        >
                          {theme.colors.primary === color.value && <Check size={16} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)]">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest mb-4">Base Theme</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setNextTheme('light')}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all",
                          nextTheme === 'light' ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]" : "border-[var(--border)] text-[var(--text-secondary)]"
                        )}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setNextTheme('dark')}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all",
                          nextTheme === 'dark' ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]" : "border-[var(--border)] text-[var(--text-secondary)]"
                        )}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Section */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)] text-sm uppercase tracking-widest">
                      Heading Font
                    </h3>
                    <div className="space-y-3">
                      {FONTS.map((font) => (
                        <button
                          key={font.name}
                          onClick={() => updateNestedField('typography.headingFont', font.value)}
                          className={cn(
                            "w-full text-left py-3 px-4 rounded-xl border-2 transition-all",
                            theme.typography.headingFont === font.value
                              ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)] font-bold shadow-sm"
                              : "border-[var(--border)] text-[var(--text-secondary)] font-medium"
                          )}
                          style={{ fontFamily: font.value }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Section */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest mb-4">Template Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['cards', 'list', 'grid'].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateNestedField('layout.templateStyle', style)}
                          className={cn(
                            "py-3 px-4 rounded-xl border-2 font-bold transition-all capitalize",
                            theme.layout.templateStyle === style ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]" : "border-[var(--border)] text-[var(--text-secondary)]"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest mb-4">Category Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['tabs', 'sidebar', 'accordion'].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateNestedField('layout.categoryStyle', style)}
                          className={cn(
                            "py-3 px-4 rounded-xl border-2 font-bold transition-all capitalize",
                            theme.layout.categoryStyle === style ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]" : "border-[var(--border)] text-[var(--text-secondary)]"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Visibility Section */}
              {activeTab === 'visibility' && (
                <div className="space-y-4">
                  {[
                    { id: 'showSearch', label: 'Search Bar' },
                    { id: 'showCategory', label: 'Category Tabs' },
                    { id: 'showPrice', label: 'Item Prices' },
                    { id: 'showAddToCart', label: 'Add to Cart Button' },
                    { id: 'showRatings', label: 'Customer Ratings' },
                    { id: 'showVegBadge', label: 'Veg/Non-Veg Badges' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
                      <span className="font-bold text-sm text-[var(--text-secondary)]">{item.label}</span>
                      <button
                        onClick={() => updateNestedField(`visibility.${item.id}`, !theme.visibility[item.id as keyof typeof theme.visibility])}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-colors duration-300",
                          theme.visibility[item.id as keyof typeof theme.visibility] ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                        )}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"
                          animate={{ x: theme.visibility[item.id as keyof typeof theme.visibility] ? 20 : 0 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </div>

      {/* Live Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-white shadow-sm text-[var(--brand)]">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)]">Real-time Preview</h3>
            <p className="text-[var(--text-secondary)] text-sm font-medium">See how your customers will experience your menu.</p>
          </div>
        </div>

        <GlassCard intensity="heavy" className="flex-1 min-h-[600px] bg-[var(--surface-2)] flex items-center justify-center relative overflow-hidden rounded-[3rem] border-dashed border-2 border-[var(--border)]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${theme.colors.primary} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

          {/* Mobile Mockup */}
          <motion.div
            layout
            className="w-[340px] h-[700px] bg-[var(--bg)] rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border-[8px] border-[var(--surface-2)] overflow-hidden relative flex flex-col"
            style={{
              fontFamily: theme.typography.bodyFont,
              '--preview-brand': theme.colors.primary,
            } as any}
          >
            {/* Header / Cover */}
            <div className="relative h-48 shrink-0">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={theme.branding.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"}
                className="w-full h-full object-cover"
                alt="Cover"
              />
              <div className="absolute bottom-4 left-6 z-20">
                <motion.h2
                  layout
                  className="text-white text-2xl font-black tracking-tight"
                  style={{ fontFamily: theme.typography.headingFont }}
                >
                  {theme.branding.restaurantName || "My Restaurant"}
                </motion.h2>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">
                  {theme.branding.tagline || "Delicious Food Awaits"}
                </p>
              </div>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--surface-2)]/30">
              {/* Search Bar */}
              {theme.visibility.showSearch && (
                <div className="p-4">
                  <div className="bg-[var(--surface)] h-11 rounded-2xl border border-[var(--border)] flex items-center px-4 gap-3 text-[var(--text-muted)] shadow-sm">
                    <Search size={16} />
                    <span className="text-xs font-medium">Search for dishes...</span>
                  </div>
                </div>
              )}

              {/* Categories */}
              {theme.visibility.showCategory && (
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto hide-scrollbar">
                  {['Bestsellers', 'Starters', 'Main'].map((cat, i) => (
                    <div
                      key={cat}
                      className={cn(
                        "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                        i === 0 ? "text-white" : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
                      )}
                      style={{ backgroundColor: i === 0 ? theme.colors.primary : undefined }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}

              {/* Menu Items */}
              <div className={cn(
                "p-4 gap-4",
                theme.layout.templateStyle === 'grid' ? "grid grid-cols-2" : "flex flex-col"
              )}>
                {[1, 2].map((i) => {
                  const style = theme.layout.templateStyle;
                  
                  if (style === 'grid') {
                    return (
                      <div key={i} className="bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] flex flex-col shadow-sm">
                        <div className="aspect-square bg-[var(--surface-2)]">
                           <img
                            src={i === 1 ? "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=200"}
                            className="w-full h-full object-cover"
                            alt="Item"
                          />
                        </div>
                        <div className="p-2 flex flex-col flex-1">
                          <h4 className="font-bold text-[10px] line-clamp-1">{i === 1 ? "Butter Chicken" : "Garlic Naan"}</h4>
                          <p className="text-[10px] font-black mt-1" style={{ color: theme.colors.primary }}>₹{i === 1 ? "350" : "60"}</p>
                          <div className="mt-auto pt-2 flex justify-end">
                             <div className="bg-[var(--brand)] text-white p-1 rounded-lg" style={{ backgroundColor: theme.colors.primary }}>
                               <Plus size={12} />
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (style === 'list') {
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                        <div className="flex flex-col">
                          <h4 className="font-bold text-xs">{i === 1 ? "Butter Chicken" : "Garlic Naan"}</h4>
                          <p className="text-[10px] text-[var(--text-muted)]">Authentic recipe...</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs">₹{i === 1 ? "350" : "60"}</span>
                          <div className="w-6 h-6 rounded-full border border-[var(--brand)] flex items-center justify-center text-[var(--brand)]" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
                            <Plus size={12} />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Default Horizontal Card
                  return (
                    <div
                      key={i}
                      className="bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)] flex gap-3 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[var(--surface-2)] overflow-hidden shrink-0">
                        <img
                          src={i === 1 ? "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=200"}
                          className="w-full h-full object-cover"
                          alt="Item"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-[var(--text-primary)]">
                          {i === 1 ? "Butter Chicken" : "Garlic Naan"}
                        </h4>
                        <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-1">
                          Authentic recipe with secret spices.
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs font-black" style={{ color: theme.colors.primary }}>₹{i === 1 ? "350" : "60"}</p>
                          {theme.visibility.showAddToCart && (
                            <div
                              className="bg-[var(--brand)] text-white px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-1"
                              style={{ backgroundColor: theme.colors.primary }}
                            >
                              ADD <Plus size={10} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floating Cart (Bottom) */}
            {theme.visibility.showAddToCart && (
              <div className="p-4 bg-gradient-to-t from-[var(--surface)] to-transparent">
                <div
                  className="p-3.5 rounded-2xl text-white text-[11px] font-black flex justify-between shadow-2xl items-center uppercase tracking-widest"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={14} />
                    <span>2 Items</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>View Cart</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}
