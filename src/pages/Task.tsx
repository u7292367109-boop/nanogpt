import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Plus } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { LEVEL_THRESHOLDS } from '../lib/packages'
import { useLang } from '../context/LanguageContext'

const LEVELS = ['LV.0', 'LV.1', 'LV.2', 'LV.3', 'LV.4', 'LV.5', 'LV.6']

export const TASK_CATEGORIES = [
  { id: 1, title: 'Text',    minReturn: 15,  maxReturn: 25,  price: 50,   duration: '7D',  levelRange: 'LV.0-LV.6', minLevel: 0, tab: 'accelerator'    },
  { id: 2, title: 'Tabular', minReturn: 50,  maxReturn: 70,  price: 500,  duration: '14D', levelRange: 'LV.3-LV.6', minLevel: 3, tab: 'accelerator'    },
  { id: 3, title: 'Picture', minReturn: 100, maxReturn: 130, price: 3000, duration: '30D', levelRange: 'LV.5-LV.6', minLevel: 5, tab: 'accelerator'    },
  { id: 4, title: 'Video',   minReturn: 150, maxReturn: 200, price: 6000, duration: '60D', levelRange: 'LV.6',       minLevel: 6, tab: 'supercomputing' },
]

export default function Task() {
  const { user, profile, assets } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()
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
    ? t('max_level')
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
          <span className="text-white font-bold text-base">{t('task_center')}</span>
        </div>
        <button
          onClick={() => navigate('/my/orders')}
          className="flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
        >
          {t('my_orders')}
        </button>
      </div>

      <div className="pb-6">
        {/* Vault balance bar */}
        <div className="mx-4 mt-4 flex items-center justify-between bg-surface-card border border-surface-border rounded-2xl px-4 py-3">
          <div>
            <p className="text-gray-400 text-xs">{t('vault_balance')}</p>
            <p className="text-white font-extrabold text-base">{vaultBalance.toFixed(3)} <span className="text-gray-500 text-xs font-normal">USDT</span></p>
            <p className="text-gray-600 text-[10px] mt-0.5">{t('vault_balance_hint')}</p>
          </div>
          <button
            onClick={() => navigate('/my/deposit')}
            className="flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-3 py-2 rounded-xl"
          >
            <Plus size={13} /> {t('deposit')}
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
              <span>{t('level_progress')}</span>
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
            {t('accelerator')}
          </button>
          <button
            onClick={() => setActiveTab('supercomputing')}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'supercomputing'
                ? 'text-brand-400 border-b-2 border-brand-400'
                : 'text-gray-500'
            }`}
          >
            {t('supercomputing')}
          </button>
        </div>

        {/* Task category cards */}
        <div className="mx-4 mt-4 space-y-3">
          {visibleCategories.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              {t('no_tasks')}
            </div>
          )}
          {visibleCategories.map((cat) => {
            const returnLabel = cat.minReturn === cat.maxReturn
              ? `${cat.minReturn}%`
              : `${cat.minReturn}%–${cat.maxReturn}%`
            const locked = userLevel < cat.minLevel
            return (
              <div key={cat.id} className={`bg-surface-card border border-surface-border rounded-2xl p-4 ${locked ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm">{t('task_type_label')} {cat.title}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30">{cat.duration}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {t('total_return')} <span className="text-brand-400 font-bold">{returnLabel}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t('from_label')} <span className="text-white font-semibold">{cat.price.toLocaleString()} USDT</span>
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
                      {locked ? `Requires LV.${cat.minLevel}` : t('open_now')}
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
