import { useState, useEffect, useRef } from 'react'
import { Lock, CheckCircle, Loader2, ChevronRight, AlertCircle, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { LEVEL_CONFIG, TASK_TYPES, formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

const TABS = ['LV.0', 'LV.1', 'LV.2', 'LV.3', 'LV.4', 'LV.5', 'LV.6']

// Return rate as percentage stored in DB (e.g. 101 = 101% = get back 101% of investment)
const RETURN_RATE: Record<string, number> = {
  text:    101,
  tabular: 125,
  picture: 140,
  video:   150,
}

// Seconds each task takes to process
const TASK_DURATION: Record<string, number> = {
  text:    8,
  tabular: 12,
  picture: 15,
  video:   20,
}

const DAILY_TASK_LIMIT = 10

function getTodayKey(userId: string) {
  const d = new Date()
  return `tasks_${userId}_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`
}

function getDailyCount(userId: string): number {
  return parseInt(localStorage.getItem(getTodayKey(userId)) ?? '0', 10)
}

function incrementDailyCount(userId: string) {
  const key = getTodayKey(userId)
  const val = parseInt(localStorage.getItem(key) ?? '0', 10)
  localStorage.setItem(key, (val + 1).toString())
}

interface ActiveTask {
  orderId: string
  taskType: string
  label: string
  investment: number
  returnRate: number
  totalReturn: number
  duration: number
  startedAt: number
}

export default function Task() {
  const { profile, assets, user, refreshAssets } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [openingTask, setOpeningTask] = useState<string | null>(null)
  const [message, setMessage] = useState({ text: '', ok: true })
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null)
  const [taskProgress, setTaskProgress] = useState(0)
  const [taskRemaining, setTaskRemaining] = useState(0)
  const [dailyCount, setDailyCount] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const userLevel = profile?.level ?? 0
  const currentLevel = LEVEL_CONFIG[activeTab]
  const dailyRemaining = DAILY_TASK_LIMIT - dailyCount

  useEffect(() => {
    if (user) setDailyCount(getDailyCount(user.id))
  }, [user])

  function showMsg(text: string, ok = true) {
    setMessage({ text, ok })
    setTimeout(() => setMessage({ text: '', ok: true }), 4500)
  }

  // Task countdown & auto-complete
  useEffect(() => {
    if (!activeTask) return

    progressRef.current = setInterval(async () => {
      const elapsed = (Date.now() - activeTask.startedAt) / 1000
      const pct = Math.min(100, (elapsed / activeTask.duration) * 100)
      const rem = Math.max(0, Math.ceil(activeTask.duration - elapsed))
      setTaskProgress(pct)
      setTaskRemaining(rem)

      if (elapsed >= activeTask.duration) {
        clearInterval(progressRef.current!)
        await finishTask(activeTask)
      }
    }, 200)

    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [activeTask])

  async function finishTask(task: ActiveTask) {
    if (!user) return

    // Fetch fresh assets to avoid stale values
    const { data: fresh } = await supabase.from('assets').select('*').eq('user_id', user.id).single()
    if (!fresh) return

    const profit = parseFloat((task.totalReturn - task.investment).toFixed(2))

    await supabase.from('assets').update({
      task_balance:       Math.max(0, (fresh.task_balance ?? 0) - task.investment),
      withdrawal_balance: parseFloat(((fresh.withdrawal_balance ?? 0) + task.totalReturn).toFixed(2)),
    }).eq('user_id', user.id)

    await supabase.from('orders').update({
      status:       'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', task.orderId)

    await supabase.from('transactions').insert({
      user_id: user.id,
      type:    'task_profit',
      amount:  profit,
      status:  'approved',
      note:    `${task.label} task profit`,
    })

    await refreshAssets()
    setActiveTask(null)
    setTaskProgress(0)
    showMsg(`✅ ${task.label} task completed! +${profit.toFixed(2)} USDT profit credited`)
  }

  async function handleOpenTask(task: typeof TASK_TYPES[0]) {
    if (!user) return
    if (activeTask) { showMsg('A task is already processing. Please wait.', false); return }

    if (userLevel < task.minLevel) {
      showMsg(`Requires LV.${task.minLevel} or higher`, false)
      return
    }

    const vaultBal = assets?.vault_balance ?? 0
    if (vaultBal < task.price) {
      showMsg(`Need ${task.price} USDT in vault (you have ${formatUSDT(vaultBal)})`, false)
      return
    }

    if (dailyRemaining <= 0) {
      showMsg(`Daily limit reached (${DAILY_TASK_LIMIT}/day). Resets at midnight UTC.`, false)
      return
    }

    setOpeningTask(task.type)

    const returnRate  = RETURN_RATE[task.type]
    const totalReturn = parseFloat((task.price * returnRate / 100).toFixed(2))

    // Create order with correct column names
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id:           user.id,
        task_type:         task.type,
        investment_amount: task.price,
        return_rate:       returnRate,
        status:            'active',
        started_at:        new Date().toISOString(),
      })
      .select('id')
      .single()

    if (orderErr || !orderData) {
      setOpeningTask(null)
      showMsg('Failed to create order. Please try again.', false)
      return
    }

    // Deduct vault, add to task_balance
    await supabase.from('assets').update({
      vault_balance: parseFloat((vaultBal - task.price).toFixed(2)),
      task_balance:  parseFloat(((assets?.task_balance ?? 0) + task.price).toFixed(2)),
    }).eq('user_id', user.id)

    incrementDailyCount(user.id)
    const newCount = getDailyCount(user.id)
    setDailyCount(newCount)

    await refreshAssets()
    setOpeningTask(null)

    // Start processing animation
    const at: ActiveTask = {
      orderId:   orderData.id,
      taskType:  task.type,
      label:     task.label,
      investment: task.price,
      returnRate,
      totalReturn,
      duration:  TASK_DURATION[task.type],
      startedAt: Date.now(),
    }
    setActiveTask(at)
    setTaskProgress(0)
    setTaskRemaining(TASK_DURATION[task.type])

    showMsg(`🤖 ${task.label} task started — AI processing…`)
  }

  return (
    <Layout title="Task Center" showBack={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Balance + daily counter */}
        <div className="flex items-center justify-between bg-surface-card rounded-2xl px-4 py-3 border border-surface-border">
          <div>
            <p className="text-xs text-gray-500">Vault Balance</p>
            <p className="text-white font-extrabold text-lg">
              {formatUSDT(assets?.vault_balance ?? 0)}
              <span className="text-xs text-gray-500 font-normal ml-1">USDT</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Tasks Today</p>
            <p className={`font-extrabold text-sm ${dailyRemaining > 0 ? 'text-brand-400' : 'text-red-400'}`}>
              {dailyCount}/{DAILY_TASK_LIMIT}
            </p>
          </div>
          <Link
            to="/my/deposit"
            className="px-3 py-1.5 bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold rounded-xl active:opacity-70"
          >
            + Deposit
          </Link>
        </div>

        {/* Active task processing card */}
        {activeTask && (
          <div className="card border-brand-500/40 bg-gradient-to-br from-brand-500/5 to-surface-card fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                <p className="text-white font-bold text-sm">{activeTask.label} Task Processing</p>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Timer size={12} />
                <span>{taskRemaining}s remaining</span>
              </div>
            </div>
            <div className="progress-bar mb-2">
              <div
                className="progress-fill transition-all duration-200"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">AI model training in progress…</span>
              <span className="text-brand-400 font-bold">
                +{(activeTask.totalReturn - activeTask.investment).toFixed(2)} USDT profit
              </span>
            </div>
          </div>
        )}

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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              userLevel >= activeTab ? 'bg-brand-500/20 border border-brand-500/20' : 'bg-surface-muted'
            }`}>
              {userLevel >= activeTab
                ? <CheckCircle size={20} className="text-brand-400" />
                : <Lock size={20} className="text-gray-600" />}
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

        {/* Task cards */}
        <div>
          <p className="section-title">Available Tasks</p>
          <div className="space-y-3">
            {TASK_TYPES.map((task) => {
              const locked      = userLevel < task.minLevel
              const noFunds     = !locked && (assets?.vault_balance ?? 0) < task.price
              const isActive    = activeTask?.taskType === task.type
              const profit      = (task.price * (RETURN_RATE[task.type] / 100 - 1)).toFixed(2)
              const totalReturn = (task.price * RETURN_RATE[task.type] / 100).toFixed(2)
              const btnDisabled = !!openingTask || !!activeTask || locked || dailyRemaining <= 0

              return (
                <div key={task.type} className={`card transition-all ${locked ? 'opacity-50' : ''} ${isActive ? 'border-brand-500/40' : ''}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${task.color} flex items-center justify-center text-2xl shrink-0`}>
                      {task.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold">{task.label} Task</p>
                        {locked
                          ? <Lock size={14} className="text-gray-600" />
                          : isActive
                            ? <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                            : null}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{task.levelRange}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-surface-muted rounded-xl p-2.5 text-center border border-surface-border">
                      <p className="text-[10px] text-gray-500 mb-0.5">Investment</p>
                      <p className="text-white font-extrabold text-sm">{task.price}</p>
                      <p className="text-[10px] text-gray-600">USDT</p>
                    </div>
                    <div className="bg-surface-muted rounded-xl p-2.5 text-center border border-surface-border">
                      <p className="text-[10px] text-gray-500 mb-0.5">Return</p>
                      <p className="text-amber-400 font-extrabold text-sm">{RETURN_RATE[task.type]}%</p>
                    </div>
                    <div className="bg-brand-500/10 rounded-xl p-2.5 text-center border border-brand-500/20">
                      <p className="text-[10px] text-gray-500 mb-0.5">Profit</p>
                      <p className="text-brand-400 font-extrabold text-sm">+{profit}</p>
                      <p className="text-[10px] text-gray-600">USDT</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs text-gray-500">Total you receive</span>
                    <span className="text-white font-bold">{totalReturn} USDT</span>
                  </div>

                  {noFunds && !isActive && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertCircle size={13} className="text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs">
                        Insufficient vault balance —{' '}
                        <Link to="/my/deposit" className="font-bold underline">Deposit USDT</Link>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenTask(task)}
                    disabled={btnDisabled}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      locked || dailyRemaining <= 0
                        ? 'bg-surface-muted text-gray-600 cursor-not-allowed border border-surface-border'
                        : isActive
                          ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40 cursor-not-allowed'
                          : activeTask
                            ? 'bg-surface-muted text-gray-500 border border-surface-border cursor-not-allowed'
                            : `bg-gradient-to-r ${task.color} text-white shadow-brand-sm`
                    }`}
                  >
                    {openingTask === task.type ? (
                      <><Loader2 size={15} className="animate-spin" /> Opening…</>
                    ) : isActive ? (
                      <><Loader2 size={15} className="animate-spin" /> Processing ({taskRemaining}s)…</>
                    ) : locked ? (
                      <><Lock size={13} /> Requires LV.{task.minLevel}</>
                    ) : dailyRemaining <= 0 ? (
                      <>Daily limit reached — resets midnight</>
                    ) : activeTask ? (
                      <>Wait for current task to finish</>
                    ) : (
                      <>Open Task — {task.price} USDT <ChevronRight size={14} /></>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Toast */}
        {message.text && (
          <div className={`fixed bottom-20 left-4 right-4 z-50 fade-in py-3 px-4 rounded-2xl text-sm font-bold text-center shadow-card ${
            message.ok ? 'bg-brand-500 text-white' : 'bg-red-500/90 text-white'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </Layout>
  )
}
