'use client';

import React, { useEffect, useState, use } from 'react';
import { 
  Save, 
  Layout, 
  CheckCircle2, 
  Monitor, 
  Smartphone,
  Info
} from 'lucide-react';
import { restaurantService } from '@/modules/restaurant/services/restaurantService';
import { MenuTemplate } from '@shared/types/restaurant.type';
import type { IRestaurant } from '@shared/types/restaurant.type';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { cn } from '@/lib/utils';

export default function RestaurantSettingsPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = use(params);
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplate>(MenuTemplate.MODERN);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Since we are in the context of the seller, we can just get their restaurant
        const data = await restaurantService.getMyRestaurants();
        // Assuming one seller has one restaurant for now based on previous context
        const res = Array.isArray(data) ? data.find(r => r._id === restaurantId) : data;
        if (res) {
          setRestaurant(res);
          setSelectedTemplate(res.menuTemplate || MenuTemplate.MODERN);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await restaurantService.updateRestaurant({
        menuTemplate: selectedTemplate
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse bg-slate-100 rounded-3xl h-64" />;

  const templates = [
    { 
      id: MenuTemplate.MODERN, 
      name: 'Modern UI', 
      desc: 'Vibrant colors, dish images, and smooth animations.',
      preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      color: 'bg-indigo-600'
    },
    { 
      id: MenuTemplate.CLASSIC, 
      name: 'Classic Elegant', 
      desc: 'Traditional restaurant style with serif fonts.',
      preview: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
      color: 'bg-amber-800'
    },
    { 
      id: MenuTemplate.MINIMAL, 
      name: 'Minimalist', 
      desc: 'Clean, simple, and content-focused.',
      preview: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=400&q=80',
      color: 'bg-slate-900'
    },
    { 
      id: MenuTemplate.VIBRANT, 
      name: 'Vibrant Fun', 
      desc: 'Playful, bold, and high energy.',
      preview: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Menu Customization</h1>
          <p className="text-slate-500">Choose how your customers see your menu</p>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={20} />
              Saved Successfully
            </div>
          )}
          <AuthButton onClick={handleSave} isLoading={saving} className="w-40">
            <Save size={18} className="mr-2" />
            Save Changes
          </AuthButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Template Selector */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Layout size={22} className="text-indigo-600" />
              Select Template
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                    selectedTemplate === t.id 
                      ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" 
                      : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg", t.color)}>
                     <Layout size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                       <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
             <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
               <Info size={18} />
               Public URL
             </h3>
             <p className="text-sm text-indigo-700 mb-4">
               This is the URL your QR code should link to. Customers can view your menu here.
             </p>
             <div className="bg-white p-3 rounded-xl border border-indigo-200 font-mono text-xs text-indigo-600 break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/${restaurant?.slug}/menu` : `/${restaurant?.slug}/menu`}
             </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Monitor size={22} className="text-indigo-600" />
                Live Preview
              </h2>
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Smartphone size={16} />
                 </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden relative border-4 border-slate-800 shadow-2xl min-h-[400px]">
               <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={templates.find(t => t.id === selectedTemplate)?.preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-50 blur-sm scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-4 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">{restaurant?.name[0]}</span>
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2">{restaurant?.name}</h3>
                     <p className="text-slate-300 text-xs uppercase tracking-widest mb-6">Template: {templates.find(t => t.id === selectedTemplate)?.name}</p>
                     
                     <div className="w-full space-y-3">
                        <div className="h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10" />
                        <div className="h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10" />
                        <div className="h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10" />
                     </div>
                  </div>
               </div>
               
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
