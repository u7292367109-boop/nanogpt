import { useState } from 'react'
import { Lock, CheckCircle, Loader2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { LEVEL_CONFIG, TASK_TYPES } from '../lib/utils'

const TABS = ['LV.0', 'LV.1', 'LV.2', 'LV.3', 'LV.4', 'LV.5', 'LV.6']

export default function Task() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [openingTask, setOpeningTask] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const userLevel = profile?.level ?? 0

  const currentLevel = LEVEL_CONFIG[activeTab]

  async function handleOpenTask(taskType: typeof TASK_TYPES[0]) {
    if (userLevel < taskType.minLevel) {
      setMessage(`Requires LV.${taskType.minLevel} or higher`)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    setOpeningTask(taskType.type)
    // In a real app, this would process payment and create order
    await new Promise(r => setTimeout(r, 1500))
    setOpeningTask(null)
    setMessage('Task opened! Check your orders.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <Layout title="Task Center" showBack={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* Level tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-surface-muted text-gray-400'
              } ${i <= userLevel ? '' : 'opacity-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Level info card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">{currentLevel.name}</p>
              <span className="level-badge mt-1 inline-block">LV.{activeTab}</span>
            </div>
            {userLevel >= activeTab ? (
              <CheckCircle size={24} className="text-green-400" />
            ) : (
              <Lock size={24} className="text-gray-600" />
            )}
          </div>

          {activeTab > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-medium">Team Rewards</p>
              <div className="flex gap-2">
                {['A-Level', 'B-Level', 'C-Level'].map((tier, i) => (
                  <div key={tier} className="flex-1 bg-surface-muted rounded-lg py-2 text-center">
                    <p className="text-xs text-gray-500">{tier}</p>
                    <p className="text-sm font-bold text-indigo-400">{currentLevel.teamRewards[i]}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress requirements */}
          {activeTab >= 3 && (
            <div className="mt-3 space-y-2 pt-3 border-t border-surface-border">
              <p className="text-xs text-gray-400 font-medium">Requirements to unlock</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Invite A-level</span>
                <span className="text-xs text-white">0 / {currentLevel.inviteA}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }} />
              </div>
              {activeTab >= 3 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Invite B+C level</span>
                    <span className="text-xs text-white">0 / {currentLevel.inviteBC}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }} />
                  </div>
                </>
              )}
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
                <div key={task.type} className={`card ${locked ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${task.color} flex items-center justify-center text-2xl`}>
                        {task.emoji}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{task.label} Task</p>
                        <p className="text-xs text-gray-400">{task.levelRange}</p>
                      </div>
                    </div>
                    {locked && <Lock size={16} className="text-gray-600 mt-1" />}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Total Return</p>
                      <p className="text-amber-400 font-bold">{task.returnRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Investment</p>
                      <p className="text-white font-bold">{task.price} USDT</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenTask(task)}
                    disabled={!!openingTask || locked}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
                      ${locked
                        ? 'bg-surface-muted text-gray-500 cursor-not-allowed'
                        : `bg-gradient-to-r ${task.color} text-white`
                      }`}
                  >
                    {openingTask === task.type ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : locked ? (
                      <>
                        <Lock size={14} />
                        Requires LV.{task.minLevel}
                      </>
                    ) : (
                      `Open Now (${task.price} USDT)`
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {message && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50">
            {message}
          </div>
        )}
      </div>
    </Layout>
  )
}
