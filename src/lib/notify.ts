import { supabase } from './supabase'

/** Ask the user for browser push-notification permission.
 *  Safe to call multiple times – resolves immediately if already granted/denied. */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'default') {
    return Notification.requestPermission()
  }
  return Notification.permission
}

/** Show a native browser push notification (foreground + background).
 *  Silently skips if permission is not granted. */
export function showPushNotification(title: string, body: string, icon = '/vite.svg') {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon })
  } catch {
    // Some browsers (e.g. iOS Safari) block Notification constructor – ignore
  }
}

/** Insert a notification row into the DB (shown in the in-app Notifications page). */
export async function recordNotification(
  userId: string,
  type: 'service' | 'update' | 'announcement',
  title: string,
  content: string,
) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    content,
    read: false,
  })
}

/** All-in-one helper: request permission, show browser push, AND save to DB. */
export async function pushAndRecord(
  userId: string,
  title: string,
  body: string,
  dbType: 'service' | 'update' | 'announcement' = 'service',
) {
  await requestNotificationPermission()
  showPushNotification(title, body)
  await recordNotification(userId, dbType, title, body)
}
