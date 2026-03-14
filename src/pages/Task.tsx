import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Plus } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { LEVEL_THRESHOLDS } from '../lib/packages'

const LEVELS = ['LV.0', 'LV.1', 'LV.2', 'LV.3', 'LV.4', 'LV.5', 'LV.6']

export const TASK_CATEGORIES = [
  { id: 1, title: 'Text',    minReturn: 92,  maxReturn: 110, price: 50,   levelRange: 'LV.0-LV.6', minLevel: 0, tab: 'accelerator' },
  { id: 2, title: 'Tabular', minReturn: 120, maxReturn: 130, price: 600,  levelRange: 'LV.3-LV.6', minLevel: 3, tab: 'accelerator' },
  { id: 3, title: 'Picture', minReturn: 140, maxReturn: 140, price: 3000, levelRange: 'LV.5-LV.6', minLevel: 5, tab: 'accelerator' },
  { id: 4, title: 'Video',   minReturn: 150, maxReturn: 150, price: 6000, levelRange: 'LV.6',       minLevel: 6, tab: 'supercomputing' },
]

export default function Task() {
  const { user, profile, assets } = useAuth()
  const navigate = useNavigate()
  const vaultBalance = assets?.vault_balance ?? 0
  const [activeTab, setActiveTab] = useState<'accelerator' | 'supercomputing'>('accelerator')
  const [totalInvested, setTotalInvested] = useState(0)

  const userLevel = profile?.level ?? 0

  // Fetch actual total invested from orders
  useEffect(() => {
    if (!user) return
    supabase.from('orders').select('investment_amount').eq('user_id', user.id)
      .then(({ data }) => {
        const total = (data ?? []).reduce(
          (sum, o) => sum + (parseFloat(String(o.investment_amount)) || 0), 0
        )
        setTotalInvested(total)
      })
  }, [user])

  // Progress toward next level
  const currentThreshold = LEVEL_THRESHOLDS[userLevel] ?? 0
  const nextThreshold = userLevel < LEVEL_THRESHOLDS.length - 1
    ? LEVEL_THRESHOLDS[userLevel + 1]
    : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const progressPct = userLevel >= 6
    ? 100
    : Math.min(100, Math.round(((totalInvested - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
  const progressNeeded = Math.max(0, nextThreshold - totalInvested)
  const progressLabel = userLevel >= 6
    ? 'Max Level Reached'
    : `${totalInvested.toFixed(0)} / ${nextThreshold} USDT to LV.${userLevel + 1}`

  const visibleCategories = TASK_CATEGORIES.filter(c => c.tab === activeTab)

  return (
    <Layout showTopBar={false} showBack={false}>
      {/* Custom header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">N</span>
          </div>
          <span className="text-white font-bold text-base">Numerical Center</span>
        </div>
        <button
          onClick={() => navigate('/my/orders')}
          className="flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
        >
          My Orders
        </button>
      </div>

      <div className="pb-6">
        {/* Vault balance bar */}
        <div className="mx-4 mt-4 flex items-center justify-between bg-surface-card border border-surface-border rounded-2xl px-4 py-3">
          <div>
            <p className="text-gray-400 text-xs">Vault Balance</p>
            <p className="text-white font-extrabold text-base">{vaultBalance.toFixed(3)} <span className="text-gray-500 text-xs font-normal">USDT</span></p>
            <p className="text-gray-600 text-[10px] mt-0.5">Used to purchase task packages below</p>
          </div>
          <button
            onClick={() => navigate('/my/deposit')}
            className="flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-3 py-2 rounded-xl"
          >
            <Plus size={13} /> Deposit
          </button>
        </div>

        {/* Level card */}
        <div className="mx-4 mt-4 rounded-2xl bg-surface-card border border-surface-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white font-extrabold text-4xl">LV.{userLevel}</div>
            {userLevel < 6 && (
              <div className="text-right">
                <p className="text-gray-500 text-[10px]">Need {progressNeeded.toFixed(0)} more USDT</p>
                <p className="text-gray-500 text-[10px]">to unlock LV.{userLevel + 1}</p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Level Progress</span>
              <span className="text-brand-400">{progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-gray-600 text-[10px] mt-1">{progressLabel}</p>
          </div>

          {/* Level dots — show all 7 levels */}
          <div className="relative flex items-center justify-between pt-3">
            <div className="absolute left-0 right-0 h-px bg-surface-border top-[18px]" />
            {LEVELS.map((lv, i) => (
              <div key={lv} className="flex flex-col items-center gap-1.5 relative z-10">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  i <= userLevel
                    ? 'bg-brand-400 border-brand-400'
                    : 'bg-surface-muted border-surface-border'
                }`} />
                <span className={`text-[9px] ${i <= userLevel ? 'text-brand-400 font-bold' : 'text-gray-600'}`}>
                  {lv}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-4 mt-4 flex border-b border-surface-border">
          <button
            onClick={() => setActiveTab('accelerator')}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'accelerator'
                ? 'text-brand-400 border-b-2 border-brand-400'
                : 'text-gray-500'
            }`}
          >
            Accelerator
          </button>
          <button
            onClick={() => setActiveTab('supercomputing')}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'supercomputing'
                ? 'text-brand-400 border-b-2 border-brand-400'
                : 'text-gray-500'
            }`}
          >
            SuperComputing
          </button>
        </div>

        {/* Task category cards */}
        <div className="mx-4 mt-4 space-y-3">
          {visibleCategories.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No tasks available in this category.
            </div>
          )}
          {visibleCategories.map((cat) => {
            const returnLabel = cat.minReturn === cat.maxReturn
              ? `${cat.minReturn}.00%`
              : `${cat.minReturn}.00%-${cat.maxReturn}.00%`
            const locked = userLevel < cat.minLevel
            return (
              <div key={cat.id} className={`bg-surface-card border border-surface-border rounded-2xl p-4 ${locked ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Type of task: {cat.title}</p>
                    <p className="text-xs text-gray-400">
                      Total return: <span className="text-brand-400 font-semibold">{returnLabel}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      From: <span className="text-white font-semibold">{cat.price.toLocaleString()} USDT</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-amber-400 font-semibold">{cat.levelRange}</span>
                      <Info size={10} className="text-gray-500" />
                    </div>
                    <button
                      onClick={() => navigate(`/poweritems?cate_id=${cat.id}&cate_title=${cat.title}`)}
                      disabled={locked}
                      className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                        locked
                          ? 'bg-surface-muted text-gray-600 cursor-not-allowed'
                          : 'bg-brand-500 hover:bg-brand-400 text-white'
                      }`}
                    >
                      {locked ? `Requires LV.${cat.minLevel}` : 'Open now'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
