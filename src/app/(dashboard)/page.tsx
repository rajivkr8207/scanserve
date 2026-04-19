import MenuPage from '@/features/menu/pages/MenuPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <MenuPage />
    </DashboardLayout>
  )
}