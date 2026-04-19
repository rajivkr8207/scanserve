import { IRestaurant, WeekDay } from '@/models/Restaurant'

export interface StoreAvailabilityResult {
  isOpen: boolean
  message: string
}

const DAY_NAMES: WeekDay[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
]

/**
 * Parse "HH:MM" → total minutes from midnight
 */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Determines if the restaurant can currently accept orders.
 * Checks (in order):
 *   1. Temporary closure
 *   2. Manual online/offline mode
 *   3. Working hours for today
 */
export function canAcceptOrder(restaurant: IRestaurant): StoreAvailabilityResult {
  // 1. Temporary closure
  const closure = restaurant.temporaryClosure
  if (closure.isActive) {
    const untilText = closure.until
      ? ` until ${new Date(closure.until).toLocaleString()}`
      : ''
    const reason = closure.reason ? ` — ${closure.reason}` : ''
    return {
      isOpen: false,
      message: `Store is temporarily closed${reason}${untilText}.`,
    }
  }

  // 2. Manual mode gate
  if (restaurant.storeStatus.manualMode === 'OFFLINE') {
    return { isOpen: false, message: 'Store is currently offline.' }
  }

  // 3. Working hours check
  const now = new Date()
  const todayName = DAY_NAMES[now.getDay()]
  const todayHours = restaurant.workingHours[todayName]

  if (!todayHours?.isOpen) {
    return { isOpen: false, message: `Store is closed on ${todayName}s.` }
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = toMinutes(todayHours.open)
  const closeMinutes = toMinutes(todayHours.close)

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      message: `Store opens at ${todayHours.open} today.`,
    }
  }

  if (currentMinutes >= closeMinutes) {
    return {
      isOpen: false,
      message: `Store closed at ${todayHours.close} today.`,
    }
  }

  return { isOpen: true, message: 'Store is open.' }
}
