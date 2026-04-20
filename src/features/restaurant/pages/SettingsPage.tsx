'use client'

import { RestaurantSettingsForm } from '../components/RestaurantSettingsForm'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your restaurant profile and configurations
        </p>
      </div>
      <RestaurantSettingsForm />
    </div>
  )
}
