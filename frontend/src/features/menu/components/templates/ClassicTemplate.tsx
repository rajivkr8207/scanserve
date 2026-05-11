'use client';

import React from 'react';
import type { IRestaurant } from '@shared/types/restaurant.type';
import type { IMenuItem } from '@shared/types/menu.type';

interface TemplateProps {
  restaurant: IRestaurant;
  menu: IMenuItem[];
}

const ClassicTemplate: React.FC<TemplateProps> = ({ restaurant, menu }) => {
  const categories = Array.from(new Set(menu.map((item) => (item.category as any)?.name || 'Uncategorized')));

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#2c1810] font-serif p-8 md:p-16">
      <div className="max-w-3xl mx-auto border-4 border-[#2c1810] p-4 md:p-12 relative">
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#2c1810] pointer-events-none" />
        
        <header className="text-center mb-16 relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#2c1810] rounded-full p-2 flex items-center justify-center">
            <span className="text-3xl font-black">{restaurant.name[0]}</span>
          </div>
          <h1 className="text-5xl font-black mb-4 uppercase tracking-[0.2em]">{restaurant.name}</h1>
          <div className="w-24 h-0.5 bg-[#2c1810] mx-auto mb-6" />
          {restaurant.description && (
            <p className="italic text-lg max-w-lg mx-auto opacity-80">{restaurant.description}</p>
          )}
          <p className="mt-4 text-sm font-bold uppercase tracking-widest">
            {restaurant.address.street}, {restaurant.address.city}
          </p>
        </header>

        <div className="space-y-16 relative z-10">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-3xl font-bold text-center mb-8 uppercase tracking-widest border-b-2 border-[#2c1810] pb-2 inline-block mx-auto w-full">
                {category}
              </h2>
              <div className="space-y-8">
                {menu
                  .filter((item) => (item.category as any)?.name === category || (!item.category && category === 'Uncategorized'))
                  .map((item) => (
                    <div key={item._id} className="group">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-xl font-bold uppercase group-hover:text-red-800 transition-colors">{item.name}</h3>
                        <div className="flex-1 mx-4 border-b border-dotted border-[#2c1810] opacity-30" />
                        <span className="text-xl font-bold tracking-tighter">₹{item.price}</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <p className="flex-1 italic text-[#5c4033] text-sm leading-relaxed">
                          {item.description || 'Traditional house specialty prepared with secret spices.'}
                        </p>
                        {item.image && (
                          <div className="w-16 h-16 border border-[#2c1810] p-1 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center border-t border-[#2c1810] pt-12">
          <p className="text-xs uppercase tracking-[0.3em] font-bold">Est. 2024 • ScanServe Culinary Experience</p>
          <div className="mt-6 flex justify-center gap-4">
             <div className="w-2 h-2 rounded-full bg-[#2c1810]" />
             <div className="w-2 h-2 rounded-full bg-[#2c1810]" />
             <div className="w-2 h-2 rounded-full bg-[#2c1810]" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ClassicTemplate;
