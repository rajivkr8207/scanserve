'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              ScanServe
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">Menu</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/settings">Settings</Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Welcome, {user?.name}
            </span>
            <ThemeToggle />
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>



      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}