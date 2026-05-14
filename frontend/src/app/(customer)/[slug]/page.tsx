'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, Plus, Loader2, ShoppingCart, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMenuTheme } from '@/features/restaurant/hooks/useMenuTheme';
import { menuService } from '@/features/menu/services/menuService';
import type { IMenuItem } from '@shared/types/menu.type';
import type { IMenuCategory } from '@shared/types/category.type';
import { cn } from '@/lib/utils';

export default function RestaurantMenuPage({ params }: { params: { slug: string; tableId?: string } }) {
  const { slug, tableId } = React.use(params as any) as any;
  const dispatch = useAppDispatch();
  const { theme, loading: themeLoading } = useMenuTheme(undefined, slug);
  
  const [menuItems, setMenuItems] = React.useState<IMenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = React.useMemo(() => {
    const cats = new Set(menuItems.map(item => {
      if (typeof item.category === 'object' && item.category !== null) {
        return (item.category as IMenuCategory).name;
      }
      return null;
    }).filter(Boolean));
    return ['All', ...Array.from(cats as Set<string>)];
  }, [menuItems]);

  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        const data = await menuService.getMenuBySlug(slug);
        setMenuItems(data);
        if (data.length > 0) {
           // Maybe set first category as active if needed
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoadingMenu(false);
      }
    };
    if (slug) fetchMenu();
  }, [slug]);

  const filteredItems = React.useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || 
                              (typeof item.category === 'object' && item.category !== null && (item.category as IMenuCategory).name === activeCategory);
      return searchQuery ? matchesSearch : (matchesSearch && matchesCategory);
    });
  }, [searchQuery, activeCategory, menuItems]);

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
        '--brand-dark': theme.colors.primary + 'dd', // Subtle dark version
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
        {theme.visibility.showCategory && !searchQuery && (
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
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <GlassCard 
                    intensity={theme.layout.itemCardStyle === 'glass' ? 'light' : 'none'}
                    className={cn(
                      "p-4 flex gap-4 transition-all",
                      theme.layout.itemCardStyle === 'minimal' ? "bg-transparent border-b border-[var(--border)] rounded-none px-0" : "rounded-[2rem] border border-[var(--border)] shadow-sm bg-[var(--surface)]"
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {theme.visibility.showVegBadge && (
                          <div className={cn("w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center", item.isVeg ? "border-green-600" : "border-red-600")}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", item.isVeg ? "bg-green-600" : "bg-red-600")} />
                          </div>
                        )}
                        {item.isBestseller && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--brand)] bg-[var(--brand-light)] px-2 py-0.5 rounded-full">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-lg text-[var(--text-primary)] leading-tight">{item.name}</h3>
                      {theme.visibility.showPrice && (
                        <p className="font-black mt-1 text-[var(--brand)]">₹{item.price}</p>
                      )}
                      {theme.visibility.showDescription && item.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-md border border-[var(--border)]">
                        <img 
                          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300"} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        />
                        {theme.visibility.showAddToCart && (
                          <button
                            onClick={() => dispatch(addItem({ ...item, id: item._id, quantity: 1 } as any))}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[var(--brand)] border border-[var(--border)] font-black shadow-xl rounded-full px-5 py-2 hover:bg-[var(--surface-2)] transition-all flex items-center justify-center gap-1 active:scale-90"
                          >
                            ADD <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-20 text-[var(--text-muted)]">
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

      {/* Floating Cart Button */}
      {theme.visibility.showAddToCart && (
        <div className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none">
          <motion.button
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="pointer-events-auto bg-[var(--brand)] text-white px-8 py-4 rounded-3xl shadow-2xl shadow-[var(--brand-glow)] flex items-center gap-6 min-w-[300px] justify-between active:scale-95 transition-transform"
          >
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-xl">
                 <ShoppingCart size={20} />
               </div>
               <div className="text-left">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Your Order</p>
                 <p className="text-sm font-black">2 Items Added</p>
               </div>
             </div>
             <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
               View Cart
               <ChevronRight size={18} />
             </div>
          </motion.button>
        </div>
      )}
    </div>
  );
}
