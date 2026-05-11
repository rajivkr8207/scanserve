'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, Info, Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';

// Mock Data
const RESTAURANT = {
  name: 'Spice Symphony',
  tagline: 'Authentic Indian Cuisine',
  rating: 4.8,
  deliveryTime: '30-45 min',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
};

const CATEGORIES = ['Bestsellers', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

const MENU_ITEMS = [
  { id: '1', name: 'Butter Chicken', description: 'Creamy tomato gravy with tender chicken pieces.', price: 350, isVeg: false, category: 'Bestsellers', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=500' },
  { id: '2', name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in spicy gravy.', price: 280, isVeg: true, category: 'Bestsellers', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=500' },
  { id: '3', name: 'Garlic Naan', description: 'Freshly baked flatbread with garlic butter.', price: 60, isVeg: true, category: 'Main Course', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500' },
  { id: '4', name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with spices and chicken.', price: 320, isVeg: false, category: 'Main Course', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500' },
  { id: '5', name: 'Gulab Jamun', description: 'Deep-fried milk dumplings in sugar syrup.', price: 120, isVeg: true, category: 'Desserts', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=500' },
];

export default function RestaurantMenuPage({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = React.useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = React.useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      // If searching, ignore category filter to show all matches
      return searchQuery ? matchesSearch : (matchesSearch && matchesCategory);
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src={RESTAURANT.coverImage} alt={RESTAURANT.name} className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[var(--surface)] to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 z-30 p-6 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{RESTAURANT.name}</h1>
            <p className="text-[var(--text-secondary)] mt-1">{RESTAURANT.tagline}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm font-medium">
              <span className="flex items-center gap-1 bg-[var(--surface-2)] px-2.5 py-1 rounded-full text-[var(--text-primary)]">
                ⭐ {RESTAURANT.rating}
              </span>
              <span className="flex items-center gap-1 bg-[var(--surface-2)] px-2.5 py-1 rounded-full text-[var(--text-primary)]">
                🕒 {RESTAURANT.deliveryTime}
              </span>
              <button className="ml-auto text-[var(--brand)] p-2 bg-[var(--brand-light)] rounded-full">
                <Info size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Controls */}
      <div className="sticky top-0 z-30 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] pt-4 pb-2 px-4 shadow-sm">
        <Input 
          placeholder="Search for dishes..." 
          leftIcon={<Search size={18} />}
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          className="bg-[var(--surface-2)]/50 rounded-2xl h-12"
        />
        
        {/* Categories Carousel */}
        {!searchQuery && (
          <div className="flex overflow-x-auto gap-3 mt-4 pb-2 custom-scrollbar hide-scrollbar snap-x">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-md'
                    : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 p-4 pb-12">
        <div className="flex flex-col gap-6">
          <motion.div layout className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard hoverEffect intensity="light" className="p-4 flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-[3px] border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                      </div>
                      {item.category === 'Bestsellers' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--brand)] bg-[var(--brand-light)] px-2 py-0.5 rounded-sm">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{item.name}</h3>
                    <p className="font-bold mt-1 text-[var(--text-primary)]">₹{item.price}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => dispatch(addItem({ ...item, quantity: 1 }))}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-[var(--brand)] border border-[var(--border-brand)] font-bold shadow-lg rounded-xl px-5 py-2 hover:bg-[var(--brand-light)] transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        ADD <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-lg">No dishes found</p>
                <p>Try searching for something else</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
