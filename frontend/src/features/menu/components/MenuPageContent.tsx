'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Loader2, ShoppingCart, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItem, toggleCart } from '@/store/slices/cartSlice';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMenuTheme } from '@/features/restaurant/hooks/useMenuTheme';
import { menuService } from '@/features/menu/services/menuService';
import type { IMenuItem } from '@shared/types/menu.type';
import type { IMenuCategory } from '@shared/types/category.type';
import { cn } from '@/lib/utils';

interface MenuPageContentProps {
  slug?: string;
  restaurantId?: string;
  tableId?: string;
}

export function MenuPageContent({ slug, restaurantId, tableId }: MenuPageContentProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { theme, loading: themeLoading } = useMenuTheme(restaurantId, slug);

  const [menuItems, setMenuItems] = React.useState<IMenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = React.useMemo(() => {
    const cats = new Set(menuItems.map(item => {
      if (item.category && typeof item.category === 'object' && 'name' in item.category) {
        return (item.category as any).name;
      }
      return null;
    }).filter(Boolean));
    return ['All', ...Array.from(cats as Set<string>)];
  }, [menuItems]);

  React.useEffect(() => {
    if (!restaurantId && (!slug || slug === 'undefined')) return;

    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        let data: IMenuItem[];
        if (restaurantId) {
          data = await menuService.getMenuById(restaurantId);
        } else if (slug) {
          data = await menuService.getMenuBySlug(slug);
        } else {
          data = [];
        }
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [slug, restaurantId]);

  const filteredItems = React.useMemo(() => {
    return menuItems.filter((item) => {
      const itemName = item.name || '';
      const itemDesc = item.description || '';
      const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itemDesc.toLowerCase().includes(searchQuery.toLowerCase());

      const itemCategoryName = (item.category && typeof item.category === 'object' && 'name' in item.category)
        ? (item.category as any).name
        : null;

      const matchesCategory = activeCategory === 'All' || itemCategoryName === activeCategory;

      return searchQuery ? matchesSearch : (matchesSearch && matchesCategory);
    });
  }, [searchQuery, activeCategory, menuItems]);

  const renderMenuItem = (item: IMenuItem, index: number) => {
    const layout = theme?.layout.templateStyle; // 'grid', 'list', 'cards'

    // Grid Layout (Image 1 style: Image top, content below)
    if (layout === 'grid') {
      return (
        <motion.div
          key={item._id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: index * 0.05 }}
          className="bg-[var(--surface)] rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-sm flex flex-col"
        >
          <div className="relative aspect-square w-full">
            <img
              src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.isBestseller && (
              <div className="absolute top-3 left-3 bg-[var(--brand)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Best Seller
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-black text-lg leading-tight text-[var(--text-primary)]">{item.name}</h3>
              {theme?.visibility.showVegBadge && (
                <div className={cn("shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center", item.isVeg ? "border-green-600" : "border-red-600")}>
                  <div className={cn("w-2 h-2 rounded-full", item.isVeg ? "bg-green-600" : "bg-red-600")} />
                </div>
              )}
            </div>
            {theme?.visibility.showDescription && item.description && (
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4 flex-1">{item.description}</p>
            )}
            <div className="flex justify-between items-center mt-auto">
              {theme?.visibility.showPrice && (
                <span className="font-black text-xl text-[var(--text-primary)]">₹{item.price}</span>
              )}
              {theme?.visibility.showAddToCart && (
                <button
                  onClick={() => dispatch(addItem({ ...item, id: item._id, quantity: 1 } as any))}
                  className="bg-[var(--brand)] text-white p-2.5 rounded-2xl shadow-lg shadow-[var(--brand-glow)] active:scale-90 transition-all"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    // List Layout (Image 2 style: Minimal row)
    if (layout === 'list') {
      return (
        <motion.div
          key={item._id}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center justify-between py-4 border-b border-[var(--border)] group"
        >
          <div className="flex items-start gap-3 flex-1">
            {theme?.visibility.showVegBadge && (
              <div className={cn("mt-1 w-4 h-4 rounded-sm border-2 flex items-center justify-center", item.isVeg ? "border-green-600" : "border-red-600")}>
                <div className={cn("w-2 h-2 rounded-full", item.isVeg ? "bg-green-600" : "bg-red-600")} />
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="font-bold text-base text-[var(--text-primary)]">{item.name}</h3>
              {item.isBestseller && (
                <span className="text-[10px] text-[var(--brand)] font-bold flex items-center gap-1 mt-0.5">
                  ★ Best Seller
                </span>
              )}
              {theme?.visibility.showDescription && item.description && (
                <p className="text-xs text-[var(--text-muted)] mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{item.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {theme?.visibility.showPrice && (
              <span className="font-black text-base">₹{item.price}</span>
            )}
            {theme?.visibility.showAddToCart && (
              <button
                onClick={() => dispatch(addItem({ ...item, id: item._id, quantity: 1 } as any))}
                className="w-8 h-8 rounded-full border-2 border-[var(--brand)] flex items-center justify-center text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-all active:scale-90"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </motion.div>
      );
    }

    // Horizontal Card (User's 3rd option: Image left, content center, button right)
    return (
      <motion.div
        key={item._id}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--surface)] p-3 rounded-3xl border border-[var(--border)] shadow-sm flex gap-4 items-center group"
      >
        <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-inner">
          <img
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300"}
            alt={item.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
          />
        </div>
        <div className="flex-1 flex flex-col py-1">
          <div className="flex items-center gap-2 mb-1">
            {theme?.visibility.showVegBadge && (
              <div className={cn("w-3 h-3 rounded-sm border-[1.5px] flex items-center justify-center", item.isVeg ? "border-green-600" : "border-red-600")}>
                <div className={cn("w-1.5 h-1.5 rounded-full", item.isVeg ? "bg-green-600" : "bg-red-600")} />
              </div>
            )}
            <h3 className="font-black text-base text-[var(--text-primary)]">{item.name}</h3>
          </div>
          {theme?.visibility.showDescription && item.description && (
            <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-tight mb-2">{item.description}</p>
          )}
          <div className="flex justify-between items-center mt-auto">
            <span className="font-black text-base text-[var(--brand)]">₹{item.price}</span>
            {theme?.visibility.showAddToCart && (
              <button
                onClick={() => dispatch(addItem({ ...item, id: item._id, quantity: 1 } as any))}
                className="bg-[var(--brand)] text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow-md shadow-[var(--brand-glow)] active:scale-90 transition-all flex items-center gap-1.5"
              >
                ADD <Plus size={12} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (themeLoading || loadingMenu) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-xl font-bold">Menu not found</h2>
        <p className="text-[var(--text-secondary)]">The requested restaurant menu could not be loaded.</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[var(--bg)]"
      style={{
        fontFamily: theme.typography.bodyFont,
        '--brand': theme.colors.primary,
        '--brand-dark': theme.colors.primary + 'dd',
      } as any}
    >
      {/* Hero Section */}
      <div className="relative h-72 w-full shrink-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src={theme.branding.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"}
          alt={theme.branding.restaurantName}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: theme.typography.headingFont }}
            >
              {theme.branding.restaurantName}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-white/80 font-bold uppercase tracking-widest text-xs">
                {theme.branding.tagline || "Authentic Culinary Experience"}
              </p>
              {tableId && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                  Table {tableId}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6 text-xs font-black uppercase tracking-widest">
              {theme.visibility.showRatings && (
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/20">
                  ⭐ 4.8
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/20">
                🕒 20-30 MIN
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Controls */}
      <div className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur-2xl border-b border-[var(--border)] pt-4 pb-2 px-4 shadow-sm">
        {theme.visibility.showSearch && (
          <Input
            placeholder="Search for your favorites..."
            leftIcon={<Search size={18} className="text-[var(--brand)]" />}
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="bg-[var(--surface-2)]/50 rounded-2xl h-12 border-none ring-1 ring-[var(--border)] focus:ring-2 focus:ring-[var(--brand)]"
          />
        )}

        {/* Categories Carousel */}
        {theme.visibility.showCategory && !searchQuery && categories.length > 1 && (
          <div className="flex overflow-x-auto gap-2.5 mt-4 pb-2 hide-scrollbar snap-x">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "snap-start whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeCategory === category
                    ? "bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand-glow)]"
                    : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 p-4 pb-32">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <motion.div
            layout
            className={cn(
              "gap-4",
              theme.layout.templateStyle === 'grid' ? "grid grid-cols-2" : "flex flex-col"
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => renderMenuItem(item, index))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="text-center py-20 text-[var(--text-muted)] col-span-full">
                <div className="w-20 h-20 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="opacity-20" />
                </div>
                <p className="font-black text-xl text-[var(--text-primary)]">No dishes found</p>
                <p className="text-sm font-medium mt-1">Try searching for something else</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
