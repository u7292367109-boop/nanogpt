export function formatUSDT(value: number, decimals = 3): string {
  return value.toFixed(decimals)
}

export function generateUID(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function generateDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export const LEVEL_CONFIG = [
  { level: 0, name: 'General', teamRewards: [0, 0, 0], inviteA: 0, inviteBC: 0 },
  { level: 1, name: 'Starter', teamRewards: [5, 3, 1], inviteA: 1, inviteBC: 0 },
  { level: 2, name: 'Basic', teamRewards: [6, 4, 2], inviteA: 1, inviteBC: 0 },
  { level: 3, name: 'Regular Node', teamRewards: [7, 5, 3], inviteA: 3, inviteBC: 15 },
  { level: 4, name: 'Primary Node', teamRewards: [8, 6, 4], inviteA: 10, inviteBC: 30 },
  { level: 5, name: 'Intermediate Node', teamRewards: [9, 7, 5], inviteA: 20, inviteBC: 60 },
  { level: 6, name: 'Advance Node', teamRewards: [10, 8, 6], inviteA: 30, inviteBC: 100 },
]

export const TASK_TYPES = [
  {
    type: 'text',
    label: 'Text',
    emoji: '📝',
    levelRange: 'LV.0 - LV.6',
    returnRange: '92% - 110%',
    price: 50,
    minLevel: 0,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    type: 'tabular',
    label: 'Tabular',
    emoji: '📊',
    levelRange: 'LV.3 - LV.6',
    returnRange: '120% - 130%',
    price: 600,
    minLevel: 3,
    color: 'from-violet-600 to-purple-600',
  },
  {
    type: 'picture',
    label: 'Picture',
    emoji: '🖼️',
    levelRange: 'LV.5 - LV.6',
    returnRange: '140%',
    price: 3000,
    minLevel: 5,
    color: 'from-pink-600 to-rose-600',
  },
  {
    type: 'video',
    label: 'Video',
    emoji: '🎥',
    levelRange: 'LV.6',
    returnRange: '150%',
    price: 6000,
    minLevel: 6,
    color: 'from-amber-600 to-orange-600',
  },
]
