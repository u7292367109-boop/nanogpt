/** Shared package metadata — single source of truth for all pages */

export const PACKAGE_INFO: Record<string, {
  name: string
  price: number
  deadlines: number
  dailyHours: number
  totalYield: number
  maxPurchase: number
  totalEarnings: number
  dailyEarnings: number
}> = {
  'text-1': { name: 'General Computing Power', price: 50,    deadlines: 60, dailyHours: 2, totalYield: 92,  maxPurchase: 2, totalEarnings: 96.00,    dailyEarnings: 1.60   },
  'text-2': { name: 'Accelerator I',            price: 100,   deadlines: 60, dailyHours: 2, totalYield: 104, maxPurchase: 2, totalEarnings: 204.00,   dailyEarnings: 3.40   },
  'text-3': { name: 'Accelerator II',           price: 200,   deadlines: 60, dailyHours: 2, totalYield: 110, maxPurchase: 2, totalEarnings: 420.00,   dailyEarnings: 7.00   },
  'tab-1':  { name: 'Tabular Node I',           price: 600,   deadlines: 60, dailyHours: 2, totalYield: 120, maxPurchase: 2, totalEarnings: 720.00,   dailyEarnings: 12.00  },
  'tab-2':  { name: 'Tabular Node II',          price: 1200,  deadlines: 60, dailyHours: 2, totalYield: 130, maxPurchase: 2, totalEarnings: 1560.00,  dailyEarnings: 26.00  },
  'pic-1':  { name: 'Visual Node I',            price: 3000,  deadlines: 60, dailyHours: 2, totalYield: 140, maxPurchase: 1, totalEarnings: 4200.00,  dailyEarnings: 70.00  },
  'pic-2':  { name: 'Visual Node II',           price: 5000,  deadlines: 60, dailyHours: 2, totalYield: 140, maxPurchase: 1, totalEarnings: 7000.00,  dailyEarnings: 116.67 },
  'vid-1':  { name: 'Video Node I',             price: 6000,  deadlines: 60, dailyHours: 2, totalYield: 150, maxPurchase: 1, totalEarnings: 9000.00,  dailyEarnings: 150.00 },
  'vid-2':  { name: 'Video Node II',            price: 10000, deadlines: 60, dailyHours: 2, totalYield: 150, maxPurchase: 1, totalEarnings: 15000.00, dailyEarnings: 250.00 },
}

/**
 * The orders table CHECK constraint only accepts these category names.
 * This mapping converts a package ID to the allowed DB value.
 */
export const PID_TO_CATEGORY: Record<string, string> = {
  'text-1': 'text',    'text-2': 'text',    'text-3': 'text',
  'tab-1':  'tabular', 'tab-2':  'tabular',
  'pic-1':  'picture', 'pic-2':  'picture',
  'vid-1':  'video',   'vid-2':  'video',
}

/** Category-level prefix used for emoji/display lookups */
const CATEGORY_PREFIX: Record<string, string> = {
  tabular: 'tab',
  picture: 'pic',
  video:   'vid',
  text:    'text',
}

export function getTypeEmoji(taskType: string): string {
  // Handles both 'text-1' (package ID) and 'text' (category name) formats
  if (taskType.startsWith('text'))    return '📝'
  if (taskType.startsWith('tab'))     return '📊'
  if (taskType.startsWith('pic'))     return '🖼️'
  if (taskType.startsWith('vid'))     return '🎥'
  return '📋'
}

/**
 * Get a human-readable package name.
 * Supports both 'text-1' (stored as package ID) and 'text' (category name from DB constraint).
 * Pass investmentAmount and returnRate for accurate lookup when using category names.
 */
export function getPackageName(
  taskType: string,
  investmentAmount?: number,
  returnRate?: number,
): string {
  // Direct package ID match (e.g., 'text-1')
  if (PACKAGE_INFO[taskType]) return PACKAGE_INFO[taskType].name

  // Category-based lookup (e.g., 'text', 'tabular', 'picture', 'video')
  const prefix = CATEGORY_PREFIX[taskType] ?? taskType
  const candidates = Object.entries(PACKAGE_INFO).filter(([id]) => id.startsWith(prefix))

  if (candidates.length === 1) return candidates[0][1].name

  // Disambiguate by returnRate, then by price divisibility
  if (returnRate !== undefined) {
    const byRate = candidates.filter(([, p]) => Math.abs(p.totalYield - returnRate) < 0.01)
    if (byRate.length === 1) return byRate[0][1].name

    if (investmentAmount !== undefined && investmentAmount > 0) {
      const byPrice = byRate.find(([, p]) => investmentAmount % p.price === 0)
      if (byPrice) return byPrice[1].name
    }
    if (byRate.length > 0) return byRate[0][1].name
  }

  // Fallback: first candidate in category
  if (candidates.length > 0) return candidates[0][1].name

  return taskType.charAt(0).toUpperCase() + taskType.slice(1) + ' Task'
}

/**
 * Level thresholds based on cumulative investment amount (USDT invested across all orders).
 * Index = level, value = minimum total USDT invested to reach that level.
 */
export const LEVEL_THRESHOLDS = [0, 50, 200, 600, 1200, 3000, 6000]

export function calcLevel(totalInvested: number): number {
  let lvl = 0
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalInvested >= LEVEL_THRESHOLDS[i]) lvl = i
  }
  return lvl
}
