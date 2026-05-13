'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Layers,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useMenuManagement } from '@/features/menu/hooks/useMenuManagement';
import { toast } from 'sonner';

export default function MenuManagementPage({ params }: { params: React.Usable<{ restaurantId: string }> }) {
  // Use React.use to unwrap params in Next.js 15
  const { restaurantId } = React.use(params);
  
  const {
    categories,
    menuItems,
    loading,
    error,
    fetchData,
    createCategory,
    deleteCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
  } = useMenuManagement(restaurantId);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isVeg: true,
    isAvailable: true,
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [fetchData]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    try {
      await createMenuItem(formData);
      setIsAddModalOpen(false);
      toast.success('Dish added successfully');
      setFormData({ name: '', description: '', price: 0, category: '', isVeg: true, isAvailable: true });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add dish');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      toast.success('Category added successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will not delete dishes but they will be uncategorized.')) return;
    try {
      await deleteCategory(id);
      toast.success('Category removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check for both string ID and populated object ID
    const itemCatId = typeof item.category === 'object' ? item.category?._id : item.category;
    const matchesCategory = activeCategory === 'all' || itemCatId === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Menu Management</h1>
          <p className="text-[var(--text-secondary)] font-medium">Design and organize your digital catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="btn btn-ghost gap-2 font-bold"
          >
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
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
              activeCategory === 'all'
                ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
            )}
          >
            All Items
          </button>
          {categories.map(cat => (
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
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item, i) => (
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
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("w-2 h-2 rounded-full", item.isVeg ? "bg-green-500" : "bg-red-500")} />
                    <h3 className="font-black text-[var(--text-primary)] truncate tracking-tight">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item._id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 font-medium leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-[var(--brand)]">₹{item.price}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div
                      onClick={() => toggleAvailability(item._id)}
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-colors",
                        item.isAvailable ? "bg-green-500" : "bg-gray-300"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition",
                        item.isAvailable ? "translate-x-4" : "translate-x-1"
                      )} />
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

      {/* Categories Management Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Manage Categories"
        maxWidth="md"
      >
        <div className="space-y-6">
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input 
              type="text"
              placeholder="New category name..."
              className="input-field"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-6">Add</button>
          </form>

          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat._id} className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-2xl group">
                <span className="font-bold text-[var(--text-primary)]">{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center py-8 text-[var(--text-muted)] font-medium italic">No categories yet.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Dish"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateItem} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Dish Name</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Classic Margherita Pizza"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Price (₹)</label>
              <input
                type="number"
                required
                className="input-field"
                placeholder="299"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Category</label>
              <select
                required
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Description</label>
              <textarea
                className="input-field h-24 resize-none"
                placeholder="Tell your customers about this dish..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="hidden"
                checked={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
              />
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                formData.isVeg ? "border-green-500" : "border-red-500"
              )}>
                {formData.isVeg && <div className="w-2.5 h-2.5 bg-green-500 rounded-sm" />}
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">{formData.isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" className="btn btn-ghost flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-[2]">Create Dish</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
