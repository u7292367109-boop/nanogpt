import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Info } from 'lucide-react'

// All packages mapped by category id
const PACKAGES: Record<number, {
  id: string; name: string; price: number; deadlines: number;
  dailyHours: number; dailyEarnings: number; totalEarnings: number;
  totalYield: number; maxPurchase: number; levelRange: string;
}[]> = {
  1: [
    { id: 'text-1', name: 'General Computing Power', price: 50,  deadlines: 60, dailyHours: 2, dailyEarnings: 1.60, totalEarnings: 96.00,  totalYield: 92,  maxPurchase: 2, levelRange: 'LV.0-LV.6' },
    { id: 'text-2', name: 'Accelerator I',            price: 100, deadlines: 60, dailyHours: 2, dailyEarnings: 3.40, totalEarnings: 204.00, totalYield: 104, maxPurchase: 2, levelRange: 'LV.0-LV.6' },
    { id: 'text-3', name: 'Accelerator II',           price: 200, deadlines: 60, dailyHours: 2, dailyEarnings: 7.00, totalEarnings: 420.00, totalYield: 110, maxPurchase: 2, levelRange: 'LV.0-LV.6' },
  ],
  2: [
    { id: 'tab-1', name: 'Tabular Node I',  price: 600,  deadlines: 60, dailyHours: 2, dailyEarnings: 12.00, totalEarnings: 720.00,  totalYield: 120, maxPurchase: 2, levelRange: 'LV.3-LV.6' },
    { id: 'tab-2', name: 'Tabular Node II', price: 1200, deadlines: 60, dailyHours: 2, dailyEarnings: 26.00, totalEarnings: 1560.00, totalYield: 130, maxPurchase: 2, levelRange: 'LV.3-LV.6' },
  ],
  3: [
    { id: 'pic-1', name: 'Visual Node I',  price: 3000, deadlines: 60, dailyHours: 2, dailyEarnings: 70.00,  totalEarnings: 4200.00, totalYield: 140, maxPurchase: 1, levelRange: 'LV.5-LV.6' },
    { id: 'pic-2', name: 'Visual Node II', price: 5000, deadlines: 60, dailyHours: 2, dailyEarnings: 116.67, totalEarnings: 7000.00, totalYield: 140, maxPurchase: 1, levelRange: 'LV.5-LV.6' },
  ],
  4: [
    { id: 'vid-1', name: 'Video Node I',  price: 6000,  deadlines: 60, dailyHours: 2, dailyEarnings: 150.00, totalEarnings: 9000.00,  totalYield: 150, maxPurchase: 1, levelRange: 'LV.6' },
    { id: 'vid-2', name: 'Video Node II', price: 10000, deadlines: 60, dailyHours: 2, dailyEarnings: 250.00, totalEarnings: 15000.00, totalYield: 150, maxPurchase: 1, levelRange: 'LV.6' },
  ],
}

// Simple server images as CSS gradients (numbered 1-4 to vary appearance)
const SERVER_COLORS = [
  'from-gray-700 to-gray-800',
  'from-gray-600 to-gray-700',
  'from-slate-700 to-slate-800',
  'from-zinc-700 to-zinc-800',
]

export default function PowerItems() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const cateId    = parseInt(searchParams.get('cate_id') ?? '1', 10)
  const cateTitle = searchParams.get('cate_title') ?? 'Text'

  const packages = PACKAGES[cateId] ?? PACKAGES[1]

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md"
           style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white">
          <ChevronLeft size={22} className="text-gray-400" />
        </button>
        <span className="text-white font-bold text-base">Accelerator {cateTitle}</span>
        <button onClick={() => navigate('/my/orders')} className="w-9 h-9 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </button>
      </div>

      {/* Title with info */}
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-white font-bold text-sm">Accelerator {cateTitle}</span>
        <Info size={14} className="text-gray-500" />
      </div>

      {/* Package cards */}
      <div className="px-4 space-y-4 pb-8">
        {packages.map((pkg, idx) => (
          <div key={pkg.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-brand-400 font-bold text-sm mb-3">{pkg.name}</p>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Prices:</span>
                    <span className="text-white font-semibold">{pkg.price.toFixed(2)}USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadlines:</span>
                    <span className="text-white font-semibold">{pkg.deadlines}Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily training hours:</span>
                    <span className="text-white font-semibold">{pkg.dailyHours} H</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily earnings:</span>
                    <span className="text-white font-semibold">{pkg.dailyEarnings.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total earnings:</span>
                    <span className="text-white font-semibold">{pkg.totalEarnings.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total yield:</span>
                    <span className="text-white font-semibold">{pkg.totalYield}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum purchase:</span>
                    <span className="text-white font-semibold">{pkg.maxPurchase}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/poweritems/buy?pid=${pkg.id}&cate_id=${cateId}`)}
                  className="mt-4 bg-brand-500 text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-brand-400 transition-colors"
                >
                  Buy now
                </button>
              </div>
              {/* Server image placeholder */}
              <div className={`w-28 h-24 rounded-xl bg-gradient-to-br ${SERVER_COLORS[idx % SERVER_COLORS.length]} flex items-center justify-center shrink-0 border border-surface-border`}>
                <span className="text-4xl">🖥️</span>
              </div>
            </div>
            {/* Level badge top right */}
            <div className="flex items-center gap-1 mt-3">
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full">{pkg.levelRange}</span>
              <Info size={9} className="text-gray-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
