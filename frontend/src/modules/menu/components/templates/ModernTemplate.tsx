'use client';

import React from 'react';
import type { IRestaurant } from '@shared/types/restaurant.type';
import type { IMenuItem } from '@shared/types/menu.type';
import { Search, Info, Clock, MapPin, Phone } from 'lucide-react';

interface TemplateProps {
  restaurant: IRestaurant;
  menu: IMenuItem[];
}

const ModernTemplate: React.FC<TemplateProps> = ({ restaurant, menu }) => {
  // Group menu by category
  const categories = Array.from(new Set(menu.map((item) => (item.category as any)?.name || 'Uncategorized')));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header / Hero */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {restaurant.coverImage ? (
          <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-80" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-end gap-6">
          <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-2xl flex-shrink-0">
            <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-indigo-600">{restaurant.name[0]}</span>
              )}
            </div>
          </div>
          <div className="flex-1 text-white pb-2">
            <h1 className="text-3xl font-extrabold mb-1">{restaurant.name}</h1>
            <p className="text-slate-200 text-sm flex items-center gap-2">
              <MapPin size={14} /> {restaurant.address.city} • <Clock size={14} /> {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              onClick={() => {
                document.getElementById(`category-${category}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Description */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        {restaurant.description && (
          <p className="text-slate-500 mb-8 leading-relaxed text-lg italic">
            "{restaurant.description}"
          </p>
        )}
        
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-lg"
          />
        </div>

        {/* Menu Items */}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category} id={`category-${category}`} className="scroll-mt-24">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menu
                  .filter((item) => (item.category as any)?.name === category || (!item.category && category === 'Uncategorized'))
                  .map((item) => (
                    <div key={item._id} className="group bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                          <span className="font-black text-indigo-600">₹{item.price}</span>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                          {item.description || 'No description available for this item.'}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.isVeg ? (
                            <span className="w-4 h-4 border-2 border-green-600 flex items-center justify-center p-0.5">
                              <span className="w-full h-full bg-green-600 rounded-full" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 border-2 border-red-600 flex items-center justify-center p-0.5">
                              <span className="w-full h-full bg-red-600 rounded-full" />
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                      </div>
                      {item.image && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer info */}
      <div className="max-w-4xl mx-auto px-6 mt-12 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm font-medium mb-4">Crafted with care by</p>
        <div className="flex items-center justify-center gap-2 mb-6">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <span className="text-white text-xs font-bold">S</span>
           </div>
           <span className="text-xl font-black text-slate-900 tracking-tighter">ScanServe</span>
        </div>
        <div className="flex justify-center gap-6 text-slate-400">
           <Phone size={18} />
           <Info size={18} />
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
