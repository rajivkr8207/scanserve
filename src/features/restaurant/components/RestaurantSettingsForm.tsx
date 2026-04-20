'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRestaurant } from '../hooks/useRestaurant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from '@/components/ui/loader'

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type RestaurantFormData = z.infer<typeof restaurantSchema>

export function RestaurantSettingsForm() {
  const { restaurant, loading, createRestaurant, updateRestaurant } = useRestaurant()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    values: restaurant ? {
      name: restaurant.name,
      address: restaurant.address,
      logo: restaurant.logo || '',
    } : undefined
  })

  const onSubmit = async (data: RestaurantFormData) => {
    if (restaurant) {
      await updateRestaurant(data)
    } else {
      await createRestaurant(data)
    }
  }

  if (loading && !restaurant) {
    return <div className="flex justify-center p-8"><Loader /></div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{restaurant ? 'Restaurant Settings' : 'Register Your Restaurant'}</CardTitle>
        <CardDescription>
          {restaurant 
            ? 'Update your restaurant information and appearance' 
            : 'Fill in the details below to start your business'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              placeholder="e.g. Tasty Bites"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g. 123 Food Street, City"
              {...register('address')}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              placeholder="https://example.com/logo.png"
              {...register('logo')}
            />
            {errors.logo && (
              <p className="text-sm text-red-500">{errors.logo.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : restaurant ? 'Update Restaurant' : 'Create Restaurant'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
