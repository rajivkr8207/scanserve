'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/ui/loader'
import { EmptyState } from '@/components/ui/empty-state'

// Mock data - in real app, fetch from API
const mockRestaurant = {
  name: 'Sample Restaurant',
  description: 'A great place to eat',
  menu: [
    {
      id: '1',
      name: 'Burger',
      description: 'Delicious burger',
      price: 10.99,
      category: 'Main Course',
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Pizza',
      description: 'Cheesy pizza',
      price: 12.99,
      category: 'Main Course',
      isAvailable: true,
    },
  ],
}

export default function StorePage() {
  const params = useParams()
  const { slug, tableId } = params
  const [loading, setLoading] = useState(true)
  const [restaurant, setRestaurant] = useState(mockRestaurant)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">Table {tableId}</p>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Menu</h2>
        </div>

        {restaurant.menu.length === 0 ? (
          <EmptyState message="No menu items available" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {restaurant.menu.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                    <Button>Add to Cart</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Category: {item.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}