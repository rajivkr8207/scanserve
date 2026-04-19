import { connectDB } from '@/lib/db'
import Order, { IOrderItem, ICustomer } from '@/models/Order'
import Restaurant from '@/models/Restaurant'
import MenuItem from '@/models/MenuItem'
import Table from '@/models/Table'
import { canAcceptOrder } from '@/utils/storeAvailability'
import { Types } from 'mongoose'
import { triggerNotification } from '@/lib/pusher'

export interface CreateOrderInput {
  restaurantId: string
  tableId: string
  items: Array<{ itemId: string; qty: number }>
  paymentMethod: 'COD' | 'ONLINE'
  customer: ICustomer
  riskMeta?: { ip?: string; deviceId?: string; userAgent?: string }
}

export const orderService = {
  async create(input: CreateOrderInput) {
    await connectDB()

    // 1. Fetch restaurant and check availability
    const restaurant = await Restaurant.findById(input.restaurantId)
    if (!restaurant) throw new Error('Restaurant not found')

    const availability = canAcceptOrder(restaurant)
    if (!availability.isOpen) {
      throw new Error(`Cannot place order: ${availability.message}`)
    }

    // 2. Validate table belongs to this restaurant
    const table = await Table.findOne({
      _id: input.tableId,
      restaurantId: input.restaurantId,
    })
    if (!table) throw new Error('Invalid table for this restaurant')

    // 3. Validate COD rules
    if (input.paymentMethod === 'COD') {
      if (restaurant.orderSettings.prepaidOnly) {
        throw new Error('This restaurant only accepts online payments')
      }
      if (!restaurant.orderSettings.codEnabled) {
        throw new Error('Cash on delivery is not available for this restaurant')
      }
    }

    // 4. Fetch menu items and build order items
    const itemIds = input.items.map((i) => new Types.ObjectId(i.itemId))
    const menuItems = await MenuItem.find({
      _id: { $in: itemIds },
      restaurantId: input.restaurantId,
      isAvailable: true,
    })

    if (menuItems.length !== input.items.length) {
      throw new Error('One or more items are unavailable or don’t belong to this store')
    }

    const menuMap = new Map(menuItems.map((m) => [String(m._id), m]))
    const orderItems: IOrderItem[] = input.items.map((i) => {
      const menuItem = menuMap.get(i.itemId)!
      return {
        itemId: new Types.ObjectId(i.itemId),
        name: menuItem.name,
        qty: i.qty,
        price: menuItem.price,
      }
    })

    // 5. Calculate total
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0)

    // 6. COD max amount check
    if (input.paymentMethod === 'COD' && totalAmount > restaurant.orderSettings.codMaxAmount) {
      throw new Error(`COD orders are limited to ₹${restaurant.orderSettings.codMaxAmount}`)
    }

    // 7. Create order
    const order = await Order.create({
      restaurantId: new Types.ObjectId(input.restaurantId),
      tableId: new Types.ObjectId(input.tableId),
      items: orderItems,
      totalAmount,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'PENDING',
      status: 'PENDING',
      customer: input.customer,
      riskMeta: input.riskMeta ?? {},
    })

    // Trigger real-time notification to the restaurant dashboard
    await triggerNotification(`restaurant_${input.restaurantId}`, 'new_order', {
      orderId: order._id.toString(),
      tableNumber: table.tableNumber,
      totalAmount: order.totalAmount,
      customerName: order.customer.name,
    })

    return order
  },

  async getByRestaurant(restaurantId: string, status?: string) {
    await connectDB()
    const query: Record<string, unknown> = { restaurantId }
    if (status) query.status = status
    return Order.find(query).sort({ createdAt: -1 }).populate('tableId', 'tableNumber')
  },

  async updateStatus(orderId: string, status: string, ownerId: string) {
    await connectDB()
    const order = await Order.findById(orderId)
    if (!order) throw new Error('Order not found')

    const restaurant = await Restaurant.findOne({ _id: order.restaurantId, ownerId })
    if (!restaurant) throw new Error('Not authorized to update this order')

    order.status = status as any
    const savedOrder = await order.save()

    // Notify customer about status change
    await triggerNotification(`order_${orderId}`, 'order_updated', {
      orderId: order._id.toString(),
      status: savedOrder.status,
      message: `Your order is now ${savedOrder.status.toLowerCase()}`,
    })

    return savedOrder
  },

  async getById(orderId: string) {
    await connectDB()
    return Order.findById(orderId)
      .populate('tableId', 'tableNumber')
      .populate('restaurantId', 'name slug logo')
  },
}
