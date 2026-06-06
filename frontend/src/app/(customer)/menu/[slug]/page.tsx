'use client';

import * as React from 'react';
import { use } from 'react';
import { Loader2 } from 'lucide-react';
import { MenuPageContent } from '@/features/menu/components/MenuPageContent';

export default function RestaurantMenuPage({ params }: { params: any }) {
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const slug = resolvedParams?.slug;
  const tableId = resolvedParams?.tableId;

  if (!slug) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }
  
  return <MenuPageContent slug={slug} tableId={tableId} />;
}
