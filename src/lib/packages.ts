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
  // ── 7-Day AI Nodes (Text category) — LV.0+ entry level ────────────────────
  'text-1': { name: 'Basic AI Node',    price: 50,    deadlines: 7,  dailyHours: 2, totalYield: 15,  maxPurchase: 2, totalEarnings: 57.50,    dailyEarnings: 1.07   },
  'text-2': { name: 'Standard AI Node', price: 100,   deadlines: 7,  dailyHours: 2, totalYield: 20,  maxPurchase: 2, totalEarnings: 120.00,   dailyEarnings: 2.86   },
  'text-3': { name: 'Pro AI Node',      price: 300,   deadlines: 7,  dailyHours: 2, totalYield: 25,  maxPurchase: 2, totalEarnings: 375.00,   dailyEarnings: 10.71  },
  // ── 14-Day Accelerators (Tabular category) — LV.3+ ────────────────────────
  'tab-1':  { name: 'Accelerator I',    price: 500,   deadlines: 14, dailyHours: 2, totalYield: 50,  maxPurchase: 2, totalEarnings: 750.00,   dailyEarnings: 17.86  },
  'tab-2':  { name: 'Accelerator II',   price: 1200,  deadlines: 14, dailyHours: 2, totalYield: 70,  maxPurchase: 2, totalEarnings: 2040.00,  dailyEarnings: 60.00  },
  // ── 30-Day SuperNodes (Picture category) — LV.5+ ──────────────────────────
  'pic-1':  { name: 'SuperNode I',      price: 3000,  deadlines: 30, dailyHours: 2, totalYield: 100, maxPurchase: 1, totalEarnings: 6000.00,  dailyEarnings: 100.00 },
  'pic-2':  { name: 'SuperNode II',     price: 5000,  deadlines: 30, dailyHours: 2, totalYield: 130, maxPurchase: 1, totalEarnings: 11500.00, dailyEarnings: 191.67 },
  // ── 60-Day Elite Nodes (Video category) — LV.6 ────────────────────────────
  'vid-1':  { name: 'Elite Node I',     price: 6000,  deadlines: 60, dailyHours: 2, totalYield: 150, maxPurchase: 1, totalEarnings: 15000.00, dailyEarnings: 150.00 },
  'vid-2':  { name: 'Elite Node II',    price: 10000, deadlines: 60, dailyHours: 2, totalYield: 200, maxPurchase: 1, totalEarnings: 30000.00, dailyEarnings: 333.33 },
}

/**
 * Maps return rate → deadline days.
 * Each package has a unique return rate, so this is an unambiguous lookup.
 */
const RATE_TO_DAYS: Record<number, number> = {
  15: 7,  20: 7,  25: 7,
  50: 14, 70: 14,
  100: 30, 130: 30,
  150: 60, 200: 60,
}

/** Return the deadline duration in days for a given order return rate. */
export function getDeadlineDays(returnRate: number): number {
  return RATE_TO_DAYS[Math.round(returnRate)] ?? 30
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

/** Package IDs grouped by category (cate_id from Task.tsx → PowerItems.tsx) */
export const CATEGORY_PIDS: Record<number, string[]> = {
  1: ['text-1', 'text-2', 'text-3'],
  2: ['tab-1', 'tab-2'],
  3: ['pic-1', 'pic-2'],
  4: ['vid-1', 'vid-2'],
}

/** Level range label for each category */
export const CATEGORY_LEVEL_RANGE: Record<string, string> = {
  text:    'LV.0 – LV.6',
  tabular: 'LV.3 – LV.6',
  picture: 'LV.5 – LV.6',
  video:   'LV.6',
}

export function getTypeEmoji(taskType: string): string {
  if (taskType.startsWith('text'))    return '📝'
  if (taskType.startsWith('tab'))     return '📊'
  if (taskType.startsWith('pic'))     return '🖼️'
  if (taskType.startsWith('vid'))     return '🎥'
  return '📋'
}

/**
 * Get a human-readable package name.
 * Supports both 'text-1' (stored as package ID) and 'text' (category name from DB constraint).
 */
export function getPackageName(
  taskType: string,
  investmentAmount?: number,
  returnRate?: number,
): string {
  if (PACKAGE_INFO[taskType]) return PACKAGE_INFO[taskType].name

  const prefixMap: Record<string, string> = { tabular: 'tab', picture: 'pic', video: 'vid', text: 'text' }
  const prefix = prefixMap[taskType] ?? taskType
  const candidates = Object.entries(PACKAGE_INFO).filter(([id]) => id.startsWith(prefix))

  if (candidates.length === 1) return candidates[0][1].name

  if (returnRate !== undefined) {
    const byRate = candidates.filter(([, p]) => Math.abs(p.totalYield - returnRate) < 0.01)
    if (byRate.length === 1) return byRate[0][1].name
    if (investmentAmount !== undefined && investmentAmount > 0) {
      const byPrice = byRate.find(([, p]) => investmentAmount % p.price === 0)
      if (byPrice) return byPrice[1].name
    }
    if (byRate.length > 0) return byRate[0][1].name
  }

  if (candidates.length > 0) return candidates[0][1].name
  return taskType.charAt(0).toUpperCase() + taskType.slice(1) + ' Task'
}

/**
 * Level thresholds based on cumulative investment amount (USDT invested across all orders).
 * Index = level, value = minimum total USDT invested to reach that level.
 */
export const LEVEL_THRESHOLDS = [0, 50, 300, 500, 1200, 3000, 6000]

export function calcLevel(totalInvested: number): number {
  let lvl = 0
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalInvested >= LEVEL_THRESHOLDS[i]) lvl = i
  }
  return lvl
}
