'use client'

import { useRestaurant } from '@/features/restaurant/hooks/useRestaurant'
import { MenuItemForm } from '../components/MenuItemForm'
import { MenuList } from '../components/MenuList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader } from '@/components/ui/loader'

export default function MenuPage() {
  const { restaurant, loading } = useRestaurant()

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader /></div>
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-2">No Restaurant Found</h2>
        <p className="text-muted-foreground mb-6">
          You need to set up your restaurant before you can manage your menu.
        </p>
        <Button asChild>
          <Link href="/settings">Create Restaurant</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage {restaurant.name}&apos;s menu items
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MenuItemForm restaurantId={restaurant._id} />
        </div>
        <div className="lg:col-span-2">
          <MenuList />
        </div>
      </div>
    </div>
  )
}