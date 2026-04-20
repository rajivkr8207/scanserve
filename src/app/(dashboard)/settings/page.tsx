import SettingsPage from '@/features/restaurant/pages/SettingsPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function RestaurantSettingsRoute() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  )
}
