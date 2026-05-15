'use client';

import * as React from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { menuService } from '@/features/menu/services/menuService';
import { MenuPageContent } from '@/features/menu/components/MenuPageContent';
import { Loader2 } from 'lucide-react';

export default function QRPage({ params }: { params: any }) {
  // Use 'use' to unwrap params if it's a promise, otherwise use as is
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const identifier = resolvedParams?.slug;
  
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [isId, setIsId] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!identifier || identifier === 'undefined' || identifier === '[slug]' || identifier === '[id]') {
      return;
    }

    const checkIdentifier = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Check if it's a valid MongoDB ID
        const isPotentialId = /^[0-9a-fA-F]{24}$/.test(identifier);
        
        if (isPotentialId) {
          try {
            const restaurant = await menuService.getRestaurantInfoById(identifier);
            if (restaurant) {
              setIsId(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Not a valid ID, continue to slug check
          }
        }

        // 2. Try as slug
        try {
          const restaurant = await menuService.getRestaurantInfo(identifier);
          const actualId = restaurant?._id || restaurant?.id;
          
          if (actualId) {
            router.replace(`/qr/${actualId}`);
          } else {
            setError('Restaurant not found');
            setLoading(false);
          }
        } catch (e) {
          setError('Restaurant not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('QR Check Error:', err);
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    };

    checkIdentifier();
  }, [identifier, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
        <h2 className="text-xl font-bold text-red-500">{error}</h2>
        <p className="text-[var(--text-secondary)]">The link might be broken or the restaurant no longer exists.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[var(--brand)] text-white rounded-full font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isId) {
    return <MenuPageContent restaurantId={identifier} />;
  }

  return null;
}
