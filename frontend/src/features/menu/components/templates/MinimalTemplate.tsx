'use client';

import React from 'react';
import type { IRestaurant } from '@shared/types/restaurant.type';
import type { IMenuItem } from '@shared/types/menu.type';

interface TemplateProps {
  restaurant: IRestaurant;
  menu: IMenuItem[];
}

const MinimalTemplate: React.FC<TemplateProps> = ({ restaurant, menu }) => {
  const categories = Array.from(new Set(menu.map((item) => (item.category as any)?.name || 'Uncategorized')));

  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-12 selection:bg-black selection:text-white">
      <header className="mb-20">
        <h1 className="text-4xl font-light tracking-tight mb-2">{restaurant.name}</h1>
        <p className="text-slate-400 text-sm">{restaurant.address.city}, {restaurant.address.state}</p>
      </header>

      <div className="max-w-2xl">
        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mb-8">
                {category}
              </h2>
              <div className="space-y-10">
                {menu
                  .filter((item) => (item.category as any)?.name === category || (!item.category && category === 'Uncategorized'))
                  .map((item) => (
                    <div key={item._id} className="group">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium tracking-tight group-hover:underline underline-offset-4 decoration-1">{item.name}</h3>
                        <span className="text-sm font-light text-slate-500">{item.price}</span>
                      </div>
                      <p className="text-slate-400 text-sm font-light leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-40 py-8 border-t border-slate-100">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400">
          <span>{restaurant.name}</span>
          <span>© 2024 Powered by ScanServe</span>
        </div>
      </footer>
    </div>
  );
};

export default MinimalTemplate;
