import Pusher from 'pusher'

const pusherConfig = {
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'ap2',
  useTLS: true,
}

// Singleton Pusher instance
const pusher = (pusherConfig.appId) 
  ? new Pusher(pusherConfig)
  : null

/**
 * Triggers a real-time event. Fallbacks to console log if keys are missing.
 */
export async function triggerNotification(channel: string, event: string, data: any) {
  if (pusher) {
    try {
      await pusher.trigger(channel, event, data)
    } catch (err) {
      console.error('[Pusher Error]', err)
    }
  } else {
    console.log(`[Notification Fallback] Channel: ${channel}, Event: ${event}`, data)
  }
}
