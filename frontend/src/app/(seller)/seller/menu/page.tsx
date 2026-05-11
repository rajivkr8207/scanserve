'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit2, Trash2, MoreVertical, GripVertical } from 'lucide-react';
import Modal from '@/components/ui/Modal';

// Mock Data
const INITIAL_MENU = [
  { id: '1', name: 'Butter Chicken', price: 350, category: 'Bestsellers', isVeg: false, available: true },
  { id: '2', name: 'Paneer Tikka Masala', price: 280, category: 'Bestsellers', isVeg: true, available: true },
  { id: '3', name: 'Garlic Naan', price: 60, category: 'Main Course', isVeg: true, available: true },
  { id: '4', name: 'Chicken Biryani', price: 320, category: 'Main Course', isVeg: false, available: false },
];

export default function MenuManagementPage() {
  const [items, setItems] = React.useState(INITIAL_MENU);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input 
          placeholder="Search menu items..." 
          leftIcon={<Search size={18} />}
          className="max-w-md bg-[var(--surface-2)] border-transparent"
        />
        <Button leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Add Menu Item
        </Button>
      </div>

      <GlassCard intensity="light" className="p-0 overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-12"></th>
                <th>Item Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <td className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-grab">
                      <GripVertical size={18} />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-[3px] border-[1.5px] flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                        <span className="font-semibold text-[var(--text-primary)]">{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="font-bold text-[var(--text-primary)]">₹{item.price}</td>
                    <td>
                      <button 
                        className={`badge ${item.available ? 'badge-success' : 'badge-error'} cursor-pointer`}
                        onClick={() => {
                          setItems(items.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
                        }}
                      >
                        {item.available ? 'Available' : 'Out of Stock'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          onClick={() => setItems(items.filter(i => i.id !== item.id))}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Menu Item">
        <div className="space-y-4">
          <Input label="Item Name *" placeholder="e.g. Garlic Naan" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹) *" type="number" placeholder="0.00" />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Category *</label>
              <select className="w-full bg-[var(--surface-2)] text-[var(--text-primary)] border-[1.5px] border-[var(--border)] rounded-xl px-4 py-3 text-base outline-none focus:border-[var(--brand)] transition-all">
                <option>Bestsellers</option>
                <option>Starters</option>
                <option>Main Course</option>
                <option>Desserts</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="diet" defaultChecked className="accent-green-600 w-4 h-4" />
              <span className="text-sm font-medium">Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="diet" className="accent-red-600 w-4 h-4" />
              <span className="text-sm font-medium">Non-Vegetarian</span>
            </label>
          </div>
          
          <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button>Save Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
