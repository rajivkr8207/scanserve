'use client'

import { MenuItemForm } from '../components/MenuItemForm'
import { MenuList } from '../components/MenuList'

export default function MenuPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's menu items
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MenuItemForm />
        </div>
        <div className="lg:col-span-2">
          <MenuList />
        </div>
      </div>
    </div>
  )
}