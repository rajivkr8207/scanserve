'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Loader } from '@/components/ui/loader'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  )
}
