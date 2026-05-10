'use client';

import React, { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChefHat, 
  Utensils, 
  Star, 
  Clock, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Hash,
  Layers,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

const MOCK_CATEGORIES = [
  { _id: 'cat_1', name: 'Recommended', count: 12 },
  { _id: 'cat_2', name: 'Starters', count: 8 },
  { _id: 'cat_3', name: 'Main Course', count: 24 },
  { _id: 'cat_4', name: 'Breads', count: 6 },
  { _id: 'cat_5', name: 'Desserts', count: 10 },
];

const MOCK_ITEMS = [
  { _id: 'item_1', name: 'Paneer Tikka', description: 'Cottage cheese marinated in yogurt and spices, grilled in tandoor.', price: 280, originalPrice: 350, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop', category: 'cat_2', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.9, preparationTime: 20 },
  { _id: 'item_2', name: 'Butter Chicken', description: 'Succulent chicken pieces cooked in a creamy tomato gravy with butter.', price: 450, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop', category: 'cat_3', isVeg: false, isAvailable: true, isBestseller: true, rating: 4.8, preparationTime: 25 },
  { _id: 'item_3', name: 'Dal Makhani', description: 'Black lentils slow cooked overnight with butter and cream.', price: 320, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop', category: 'cat_3', isVeg: true, isAvailable: true, rating: 4.7, preparationTime: 15 },
];

export default function MenuManagementPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const [activeCategory, setActiveCategory] = useState('cat_1');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Menu Management</h1>
          <p className="text-[var(--text-secondary)] font-medium">Design and organize your digital catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost gap-2 font-bold">
            <Layers size={18} /> Manage Categories
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary btn-lg gap-2 shadow-xl shadow-[var(--brand-glow)]"
          >
            <Plus size={20} /> Add Dish
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="sticky top-20 z-20 bg-[var(--bg)]/80 backdrop-blur-md py-4 -mx-2 px-2 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--brand)] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search items by name, description, or tags..." 
            className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl outline-none focus:border-[var(--brand)] transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {MOCK_CATEGORIES.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
                activeCategory === cat._id
                  ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
              )}
            >
              {cat.name} <span className="ml-1 opacity-50">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_ITEMS.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card group hover:border-[var(--brand)] transition-all flex h-44 overflow-hidden"
          >
            <div className="w-44 h-full bg-[var(--surface-2)] flex-shrink-0 relative">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>
              )}
              {item.isBestseller && (
                <span className="absolute top-2 left-2 badge badge-warning text-[8px] font-black uppercase py-0.5 px-2">Bestseller</span>
              )}
            </div>
            
            <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={item.isVeg ? 'veg-dot' : 'non-veg-dot'} />
                    <h3 className="font-black text-[var(--text-primary)] truncate tracking-tight">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 font-medium leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-[var(--brand)]">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-[10px] text-[var(--text-muted)] line-through ml-2 font-bold">₹{item.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase">
                    <Star size={12} fill="currentColor" /> {item.rating}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[var(--text-muted)] uppercase">
                    <Clock size={12} /> {item.preparationTime}m
                  </div>
                  <div className="flex items-center">
                    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-green-500 cursor-pointer">
                      <span className="translate-x-4 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add dish large trigger */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="card border-4 border-dashed border-[var(--border)] bg-transparent hover:bg-[var(--brand-light)] hover:border-[var(--brand)] transition-all flex items-center justify-center gap-4 py-10 group"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all shadow-sm">
            <Plus size={24} />
          </div>
          <span className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest group-hover:text-[var(--brand)]">Create New Dish</span>
        </button>
      </div>

      {/* Add Modal */}
      <Modal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Dish"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Dish Name</label>
              <input type="text" placeholder="e.g. Classic Margherita Pizza" className="input-field" />
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Price (₹)</label>
              <input type="number" placeholder="299" className="input-field" />
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Category</label>
              <select className="input-field">
                <option>Main Course</option>
                <option>Starters</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Description</label>
              <textarea placeholder="Tell your customers about this dish..." className="input-field h-24 resize-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border-2 border-[var(--border)] group-hover:border-[var(--brand)] flex items-center justify-center transition-colors">
                <div className="w-2.5 h-2.5 bg-[var(--brand)] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">Pure Veg</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border-2 border-[var(--border)] group-hover:border-[var(--brand)] flex items-center justify-center transition-colors">
                <div className="w-2.5 h-2.5 bg-[var(--brand)] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">Bestseller</span>
            </label>
          </div>

          <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-[var(--brand)] hover:bg-[var(--brand-light)] transition-all cursor-pointer">
            <ImageIcon size={32} className="text-[var(--text-muted)]" />
            <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Upload Dish Image</span>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="btn btn-ghost flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary flex-[2]">Create Dish</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
