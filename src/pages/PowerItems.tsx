import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, TrendingUp, Clock, Zap, Shield } from 'lucide-react'
import { PACKAGE_INFO, PID_TO_CATEGORY, CATEGORY_PIDS, CATEGORY_LEVEL_RANGE } from '../lib/packages'

const CATEGORY_META: Record<number, { emoji: string; color: string; glow: string }> = {
  1: { emoji: '📝', color: 'from-blue-600/30 to-brand-600/20',   glow: 'border-brand-500/30'  },
  2: { emoji: '📊', color: 'from-purple-600/30 to-blue-600/20',  glow: 'border-purple-500/30' },
  3: { emoji: '🖼️', color: 'from-amber-600/30 to-orange-600/20', glow: 'border-amber-500/30'  },
  4: { emoji: '🎥', color: 'from-red-600/30 to-pink-600/20',     glow: 'border-red-500/30'    },
}

const YIELD_COLOR = (y: number) =>
  y >= 150 ? 'text-red-400' : y >= 100 ? 'text-amber-400' : y >= 50 ? 'text-purple-400' : 'text-brand-400'

const YIELD_BG = (y: number) =>
  y >= 150 ? 'bg-red-500/15 border-red-500/30' : y >= 100 ? 'bg-amber-500/15 border-amber-500/30' : y >= 50 ? 'bg-purple-500/15 border-purple-500/30' : 'bg-brand-500/15 border-brand-500/30'

export default function PowerItems() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const cateId    = parseInt(searchParams.get('cate_id') ?? '1', 10)
  const cateTitle = searchParams.get('cate_title') ?? 'Text'
  const meta      = CATEGORY_META[cateId] ?? CATEGORY_META[1]

  const pids     = CATEGORY_PIDS[cateId] ?? CATEGORY_PIDS[1]
  const packages = pids.map(pid => ({
    id:         pid,
    levelRange: CATEGORY_LEVEL_RANGE[PID_TO_CATEGORY[pid] ?? 'text'] ?? 'LV.0-LV.6',
    ...PACKAGE_INFO[pid],
  }))

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-surface-border sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}
      >
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base">{meta.emoji}</span>
          <span className="text-white font-bold text-base">{cateTitle} Node</span>
        </div>
        <button
          onClick={() => navigate('/my/orders')}
          className="text-xs text-brand-400 font-bold bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full"
        >
          📋 Orders
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
      {/* Category banner */}
      <div className={`mx-4 mt-4 rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.glow} p-4 flex items-center justify-between`}>
        <div>
          <p className="text-white font-extrabold text-lg">{cateTitle} AI Node</p>
          <p className="text-gray-300 text-xs mt-0.5">
            {packages.length} package{packages.length !== 1 ? 's' : ''} available
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={11} className="text-gray-400" />
            <span className="text-gray-400 text-[10px]">{packages[0]?.levelRange}</span>
          </div>
        </div>
        <div className="text-5xl opacity-80">{meta.emoji}</div>
      </div>

      {/* Package cards */}
      <div className="px-4 mt-4 space-y-4 pb-8 overscroll-contain">
        {packages.map((pkg) => {
          const dailyRate = ((pkg.totalYield / pkg.deadlines)).toFixed(2)
          return (
            <div key={pkg.id} className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              {/* Card top — yield badge */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-surface-border">
                <div>
                  <p className="text-white font-bold text-sm">{pkg.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {pkg.deadlines}-day cycle · from {pkg.price.toLocaleString()} USDT
                  </p>
                </div>
                <div className={`flex flex-col items-end gap-1`}>
                  <span className={`text-base font-extrabold border rounded-xl px-2.5 py-1 ${YIELD_BG(pkg.totalYield)} ${YIELD_COLOR(pkg.totalYield)}`}>
                    +{pkg.totalYield}%
                  </span>
                  <span className="text-gray-600 text-[10px]">total yield</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-surface-border">
                <div className="flex items-center gap-2.5 px-4 py-3">
                  <Clock size={14} className="text-gray-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500">Duration</p>
                    <p className="text-white font-bold text-sm">{pkg.deadlines} Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-3">
                  <TrendingUp size={14} className="text-brand-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500">Daily Earnings</p>
                    <p className="text-brand-400 font-bold text-sm">+{pkg.dailyEarnings.toFixed(2)} USDT</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-3">
                  <Zap size={14} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500">Daily Rate</p>
                    <p className="text-amber-400 font-bold text-sm">{dailyRate}% / day</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-3">
                  <span className="text-sm shrink-0">🪙</span>
                  <div>
                    <p className="text-[10px] text-gray-500">Total Earnings</p>
                    <p className="text-white font-bold text-sm">{pkg.totalEarnings.toLocaleString()} USDT</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-surface-border bg-surface-muted/30">
                <div>
                  <p className="text-[10px] text-gray-500">Invest</p>
                  <p className="text-white font-extrabold">{pkg.price.toLocaleString()} <span className="text-gray-500 text-xs font-normal">USDT</span></p>
                </div>
                <button
                  onClick={() => navigate(`/poweritems/buy?pid=${pkg.id}&cate_id=${cateId}`)}
                  className={`font-bold px-6 py-2.5 rounded-xl text-sm transition-all text-white bg-brand-500 hover:bg-brand-400 active:scale-95`}
                >
                  Buy Now →
                </button>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
