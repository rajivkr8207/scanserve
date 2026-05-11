'use client';

import React from 'react';
import type { IRestaurant } from '@shared/types/restaurant.type';
import type { IMenuItem } from '@shared/types/menu.type';

interface TemplateProps {
  restaurant: IRestaurant;
  menu: IMenuItem[];
}

const VibrantTemplate: React.FC<TemplateProps> = ({ restaurant, menu }) => {
  const categories = Array.from(new Set(menu.map((item) => (item.category as any)?.name || 'Uncategorized')));

  return (
    <div className="min-h-screen bg-[#FFF5F5] font-sans pb-10">
      <div className="bg-[#FF4D4D] p-8 md:p-12 text-white rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 p-2 shadow-2xl flex items-center justify-center border-4 border-yellow-400">
             <span className="text-4xl font-black text-[#FF4D4D]">{restaurant.name[0]}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{restaurant.name}</h1>
          <p className="bg-yellow-400 text-[#2C2C2C] px-6 py-1 rounded-full inline-block font-black text-sm uppercase tracking-tighter">
             Fresh • Tasty • Fast
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} className="px-6 py-3 bg-white rounded-2xl shadow-lg font-black text-[#2C2C2C] border-b-4 border-[#EAEAEA] active:border-b-0 active:translate-y-1 transition-all whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-3xl font-black text-[#2C2C2C] mb-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl rotate-12 flex items-center justify-center text-xl">🔥</div>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu
                  .filter((item) => (item.category as any)?.name === category || (!item.category && category === 'Uncategorized'))
                  .map((item) => (
                    <div key={item._id} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-transparent hover:border-[#FF4D4D] transition-all group overflow-hidden relative">
                      {item.isVeg ? (
                         <div className="absolute top-4 right-4 w-6 h-6 border-2 border-green-500 flex items-center justify-center rounded-md">
                           <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                         </div>
                      ) : (
                        <div className="absolute top-4 right-4 w-6 h-6 border-2 border-red-500 flex items-center justify-center rounded-md">
                           <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        </div>
                      )}
                      
                      <div className="mb-4 w-full h-40 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                        <img src={item.image || 'https://via.placeholder.com/300x200?text=Food'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h3 className="text-xl font-black text-[#2C2C2C] mb-2">{item.name}</h3>
                      <p className="text-slate-500 text-sm font-bold mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-slate-200">
                        <span className="text-2xl font-black text-[#FF4D4D]">₹{item.price}</span>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-[#2C2C2C] px-4 py-2 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all">
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-20 py-10 bg-[#2C2C2C] text-white text-center rounded-t-[3rem]">
        <p className="font-black text-2xl mb-2">ScanServe</p>
        <p className="text-slate-400 text-sm">Join the food revolution</p>
      </footer>
    </div>
  );
};

export default VibrantTemplate;
