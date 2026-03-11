import { useState } from 'react'
import { Lock, CheckCircle, Loader2, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { LEVEL_CONFIG, TASK_TYPES } from '../lib/utils'

const TABS = ['LV.0', 'LV.1', 'LV.2', 'LV.3', 'LV.4', 'LV.5', 'LV.6']

export default function Task() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab]     = useState(0)
  const [openingTask, setOpeningTask] = useState<string | null>(null)
  const [message, setMessage]         = useState('')
  const userLevel                     = profile?.level ?? 0
  const currentLevel                  = LEVEL_CONFIG[activeTab]

  async function handleOpenTask(task: typeof TASK_TYPES[0]) {
    if (userLevel < task.minLevel) {
      setMessage(`Requires LV.${task.minLevel} or higher`)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    setOpeningTask(task.type)
    await new Promise(r => setTimeout(r, 1500))
    setOpeningTask(null)
    setMessage('Task opened! Check your orders.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <Layout title="Task Center" showBack={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Level tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === i
                  ? 'bg-brand-500 text-white shadow-brand-sm'
                  : 'bg-surface-muted text-gray-500 border border-surface-border'
              } ${i > userLevel ? 'opacity-40' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Level info card */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white font-extrabold text-base">{currentLevel.name}</p>
              <span className="level-badge mt-1 inline-block">LV.{activeTab}</span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userLevel >= activeTab ? 'bg-brand-500/15 border border-brand-500/20' : 'bg-surface-muted'}`}>
              {userLevel >= activeTab
                ? <CheckCircle size={20} className="text-brand-400" />
                : <Lock size={20} className="text-gray-600" />
              }
            </div>
          </div>

          {activeTab > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Team Rewards</p>
              <div className="flex gap-2">
                {['A-Level', 'B-Level', 'C-Level'].map((tier, i) => (
                  <div key={tier} className="flex-1 bg-surface-muted rounded-xl py-2.5 text-center border border-surface-border">
                    <p className="text-xs text-gray-500 mb-0.5">{tier}</p>
                    <p className="text-sm font-extrabold text-brand-400">{currentLevel.teamRewards[i]}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab >= 3 && (
            <div className="mt-4 space-y-2 pt-4 border-t border-surface-border">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Unlock Requirements</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Invite A-level</span>
                <span className="text-xs text-brand-400 font-bold">0 / {currentLevel.inviteA}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Invite B+C level</span>
                <span className="text-xs text-brand-400 font-bold">0 / {currentLevel.inviteBC}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
            </div>
          )}
        </div>

        {/* Task types */}
        <div>
          <p className="section-title">Available Tasks</p>
          <div className="space-y-3">
            {TASK_TYPES.map((task) => {
              const locked = userLevel < task.minLevel
              return (
                <div key={task.type} className={`card transition-opacity ${locked ? 'opacity-55' : ''}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${task.color} flex items-center justify-center text-2xl shrink-0`}>
                      {task.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold">{task.label} Task</p>
                        {locked && <Lock size={14} className="text-gray-600" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{task.levelRange}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 bg-surface-muted rounded-xl p-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total Return</p>
                      <p className="text-amber-400 font-extrabold text-sm">{task.returnRange}</p>
                    </div>
                    <div className="w-px h-8 bg-surface-border" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Investment</p>
                      <p className="text-white font-extrabold text-sm">{task.price} USDT</p>
                    </div>
                    <div className="w-px h-8 bg-surface-border" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Min Level</p>
                      <p className="text-brand-400 font-extrabold text-sm">LV.{task.minLevel}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenTask(task)}
                    disabled={!!openingTask || locked}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                      ${locked
                        ? 'bg-surface-muted text-gray-600 cursor-not-allowed border border-surface-border'
                        : `bg-gradient-to-r ${task.color} text-white shadow-brand-sm active:scale-[0.98]`
                      }`}
                  >
                    {openingTask === task.type ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : locked ? (
                      <><Lock size={13} /> Requires LV.{task.minLevel}</>
                    ) : (
                      <>Open Task — {task.price} USDT <ChevronRight size={14} /></>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Toast notification */}
        {message && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-brand z-50 fade-in whitespace-nowrap">
            {message}
          </div>
        )}
      </div>
    </Layout>
  )
}
