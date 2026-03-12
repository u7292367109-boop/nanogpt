import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

const LEVELS = ['LV.0', 'LV.1', 'LV.2', 'LV.3']

export const TASK_CATEGORIES = [
  { id: 1, title: 'Text',    minReturn: 92,  maxReturn: 110, price: 50,   levelRange: 'LV.0-LV.6', minLevel: 0, tab: 'accelerator' },
  { id: 2, title: 'Tabular', minReturn: 120, maxReturn: 130, price: 600,  levelRange: 'LV.3-LV.6', minLevel: 3, tab: 'accelerator' },
  { id: 3, title: 'Picture', minReturn: 140, maxReturn: 140, price: 3000, levelRange: 'LV.5-LV.6', minLevel: 5, tab: 'accelerator' },
  { id: 4, title: 'Video',   minReturn: 150, maxReturn: 150, price: 6000, levelRange: 'LV.6',       minLevel: 6, tab: 'supercomputing' },
]

export default function Task() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'accelerator' | 'supercomputing'>('accelerator')

  const userLevel = profile?.level ?? 0
  const visibleCategories = TASK_CATEGORIES.filter(c => c.tab === activeTab)

  // Progress toward next level: if LV.0, need to buy 1 task to unlock LV.1
  const progressLabel = userLevel === 0 ? 'Unlock General Computing Power' : `Reach LV.${userLevel + 1}`

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
          Rules
        </button>
      </div>

      <div className="pb-6">
        {/* Level card */}
        <div className="mx-4 mt-4 rounded-2xl bg-surface-card border border-surface-border p-4">
          <div className="text-white font-extrabold text-4xl mb-4">LV.{userLevel}</div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Progress &nbsp; {progressLabel}</span>
              <span className="text-brand-400">0/1</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
              <div className="h-full rounded-full bg-brand-500" style={{ width: '0%' }} />
            </div>
          </div>

          {/* Level dots */}
          <div className="relative flex items-center justify-between pt-3">
            <div className="absolute left-0 right-0 h-px bg-surface-border top-[18px]" />
            {LEVELS.map((lv, i) => (
              <div key={lv} className="flex flex-col items-center gap-1.5 relative z-10">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  i <= userLevel
                    ? 'bg-brand-400 border-brand-400'
                    : 'bg-surface-muted border-surface-border'
                }`} />
                <span className={`text-xs ${i <= userLevel ? 'text-brand-400 font-bold' : 'text-gray-600'}`}>
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
                      {locked ? `Requires LV.${cat.minLevel}` : `Open now\n(${cat.price} USDT)`}
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
