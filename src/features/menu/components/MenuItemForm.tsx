'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMenu } from '../hooks/useMenu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean(),
})

type MenuItemFormData = z.infer<typeof menuItemSchema>

interface MenuItemFormProps {
  onSuccess?: () => void
}

export function MenuItemForm({ onSuccess }: MenuItemFormProps) {
  const { createMenuItem, loading } = useMenu()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      isAvailable: true,
    },
  })

  const onSubmit = async (data: MenuItemFormData) => {
    await createMenuItem(data)
    reset()
    onSuccess?.()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Menu Item</CardTitle>
        <CardDescription>
          Create a new item for your restaurant menu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter item description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Enter price"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Enter category"
              {...register('category')}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isAvailable"
              type="checkbox"
              {...register('isAvailable')}
            />
            <Label htmlFor="isAvailable">Available</Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}