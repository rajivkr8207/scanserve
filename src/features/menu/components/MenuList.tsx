'use client'

import { useMenu } from '../hooks/useMenu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/ui/loader'
import { EmptyState } from '@/components/ui/empty-state'

export function MenuList() {
  const { items, loading, deleteMenuItem } = useMenu()

  if (loading) {
    return <Loader />
  }

  if (items.length === 0) {
    return <EmptyState message="No menu items found" />
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, idx) => (
        <Card key={idx}>
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
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMenuItem(item._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Category: {item.category}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}