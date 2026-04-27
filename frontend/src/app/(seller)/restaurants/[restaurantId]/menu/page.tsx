'use client';

import React, { useEffect, useState, use } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Tag, 
  Layers,
  ChevronRight,
  Utensils,
  AlertCircle
} from 'lucide-react';
import { useMenuManagement } from '@/modules/menu/hooks/useMenuManagement';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { cn } from '@/lib/utils';

export default function MenuPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const { 
    categories, 
    menuItems, 
    loading, 
    error, 
    fetchData, 
    createCategory, 
    deleteCategory,
    createMenuItem,
    deleteMenuItem,
    toggleAvailability 
  } = useMenuManagement(restaurantId);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  // Category Form
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  
  // Item Form
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isVeg: true,
    preparationTime: 15
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(catForm);
      setIsCatModalOpen(false);
      setCatForm({ name: '', description: '' });
    } catch (err) {}
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMenuItem(itemForm);
      setIsItemModalOpen(false);
      setItemForm({
        name: '',
        description: '',
        price: 0,
        category: '',
        isVeg: true,
        preparationTime: 15
      });
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
          <p className="text-slate-500">Organize your dishes and categories</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCatModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Layers size={18} />
            New Category
          </button>
          <button 
            onClick={() => setIsItemModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <Plus size={18} />
            Add Dish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar: Categories */}
        <div className="lg:col-span-1 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Categories</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {categories.length} Total
              </span>
            </div>
            <div className="p-2 space-y-1">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-medium",
                  selectedCategory === 'all' ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>All Dishes</span>
                <ChevronRight size={16} />
              </button>
              {categories.map(cat => (
                <div key={cat._id} className="group relative">
                  <button 
                    onClick={() => setSelectedCategory(cat._id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-medium",
                      selectedCategory === cat._id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span className="truncate pr-6">{cat.name}</span>
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat._id)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Dishes */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by dish name..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Dishes List */}
          {loading && menuItems.length === 0 ? (
             <div className="space-y-4 animate-pulse">
               {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
             </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map(item => (
                <div key={item._id} className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Utensils size={32} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("w-3 h-3 border-2 rounded-sm", item.isVeg ? "border-green-600" : "border-red-600")}>
                        <span className={cn("block w-full h-full rounded-[1px]", item.isVeg ? "bg-green-600" : "bg-red-600")} />
                      </span>
                      <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">{item.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-600 font-bold">₹{item.price}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        {categories.find(c => c._id === item.category)?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleAvailability(item._id)}
                      className={cn(
                        "p-2 rounded-xl transition-all",
                        item.isAvailable ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" : "text-slate-400 bg-slate-50 hover:bg-slate-100"
                      )}
                      title={item.isAvailable ? "Available" : "Unavailable"}
                    >
                      {item.isAvailable ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => deleteMenuItem(item._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Utensils size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No dishes found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-6">Start by adding your first dish to this category.</p>
              <button 
                onClick={() => setIsItemModalOpen(true)}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Add Dish Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">New Category</h3>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <AuthInput 
                id="cat-name" label="Category Name" type="text" placeholder="e.g. Main Course" required
                value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})}
              />
              <AuthInput 
                id="cat-desc" label="Description" type="text" placeholder="Optional"
                value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <AuthButton type="submit" isLoading={loading} className="flex-1">Create Category</AuthButton>
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 py-2 font-bold text-slate-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsItemModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Dish</h3>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <AuthInput 
                id="item-name" label="Dish Name" type="text" placeholder="e.g. Butter Chicken" required
                value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})}
              />
              <AuthInput 
                id="item-desc" label="Description" type="text" placeholder="Short description..."
                value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <AuthInput 
                  id="item-price" label="Price (₹)" type="number" placeholder="199" required
                  value={String(itemForm.price)} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})}
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={itemForm.category}
                    onChange={e => setItemForm({...itemForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" checked={itemForm.isVeg} 
                    onChange={e => setItemForm({...itemForm, isVeg: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Vegetarian Dish</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <AuthButton type="submit" isLoading={loading} className="flex-1">Add to Menu</AuthButton>
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="flex-1 py-2 font-bold text-slate-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
