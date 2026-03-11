import { useState } from 'react'
import { Lock, CheckCircle, Loader2, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { LEVEL_CONFIG, TASK_TYPES, formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

const TABS = ['LV.0', 'LV.1', 'LV.2', 'LV.3', 'LV.4', 'LV.5', 'LV.6']

const RETURN_MAP: Record<string, number> = {
  text:    1.01,
  tabular: 1.25,
  picture: 1.40,
  video:   1.50,
}

export default function Task() {
  const { profile, assets, user, refreshAssets } = useAuth()
  const [activeTab, setActiveTab]     = useState(0)
  const [openingTask, setOpeningTask] = useState<string | null>(null)
  const [message, setMessage]         = useState({ text: '', ok: true })

  const userLevel    = profile?.level ?? 0
  const currentLevel = LEVEL_CONFIG[activeTab]

  function showMsg(text: string, ok = true) {
    setMessage({ text, ok })
    setTimeout(() => setMessage({ text: '', ok: true }), 3500)
  }

  async function handleOpenTask(task: typeof TASK_TYPES[0]) {
    if (!user) return

    if (userLevel < task.minLevel) {
      showMsg(`Requires LV.${task.minLevel} or higher`, false)
      return
    }

    const vaultBal = assets?.vault_balance ?? 0
    if (vaultBal < task.price) {
      showMsg(`Need ${task.price} USDT in vault (you have ${formatUSDT(vaultBal)})`, false)
      return
    }

    setOpeningTask(task.type)

    const expectedReturn = parseFloat((task.price * RETURN_MAP[task.type]).toFixed(2))

    const { error: orderErr } = await supabase.from('orders').insert({
      user_id: user.id,
      task_type: task.type,
      amount: task.price,
      expected_return: expectedReturn,
      status: 'pending',
    })

    if (orderErr) {
      setOpeningTask(null)
      showMsg('Failed to create order. Please try again.', false)
      return
    }

    await supabase.from('assets').update({
      vault_balance: vaultBal - task.price,
      task_balance:  (assets?.task_balance ?? 0) + task.price,
    }).eq('user_id', user.id)

    await refreshAssets()
    setOpeningTask(null)
    showMsg(`✓ ${task.label} task started! +${(task.price * (RETURN_MAP[task.type] - 1)).toFixed(2)} USDT expected return`)
  }

  return (
    <Layout title="Task Center" showBack={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Vault balance pill */}
        <div className="flex items-center justify-between bg-surface-card rounded-2xl px-4 py-3 border border-surface-border">
          <div>
            <p className="text-xs text-gray-500">Vault Balance</p>
            <p className="text-white font-extrabold text-lg">
              {formatUSDT(assets?.vault_balance ?? 0)}
              <span className="text-xs text-gray-500 font-normal ml-1">USDT</span>
            </p>
          </div>
          <Link to="/my/deposit" className="px-3 py-1.5 bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold rounded-xl active:opacity-70">
            + Deposit
          </Link>
        </div>

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

        {/* Level info */}
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
              const locked    = userLevel < task.minLevel
              const noFunds   = !locked && (assets?.vault_balance ?? 0) < task.price
              const profit    = (task.price * (RETURN_MAP[task.type] - 1)).toFixed(2)
              const returnAmt = (task.price * RETURN_MAP[task.type]).toFixed(2)

              return (
                <div key={task.type} className={`card transition-all ${locked ? 'opacity-50' : ''}`}>
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

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-surface-muted rounded-xl p-2.5 text-center border border-surface-border">
                      <p className="text-[10px] text-gray-500 mb-0.5">Investment</p>
                      <p className="text-white font-extrabold text-sm">{task.price}</p>
                      <p className="text-[10px] text-gray-600">USDT</p>
                    </div>
                    <div className="bg-surface-muted rounded-xl p-2.5 text-center border border-surface-border">
                      <p className="text-[10px] text-gray-500 mb-0.5">Return</p>
                      <p className="text-amber-400 font-extrabold text-sm">{task.returnRange}</p>
                    </div>
                    <div className="bg-brand-500/10 rounded-xl p-2.5 text-center border border-brand-500/20">
                      <p className="text-[10px] text-gray-500 mb-0.5">Profit</p>
                      <p className="text-brand-400 font-extrabold text-sm">+{profit}</p>
                      <p className="text-[10px] text-gray-600">USDT</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs text-gray-500">Total you receive</span>
                    <span className="text-white font-bold">{returnAmt} USDT</span>
                  </div>

                  {noFunds && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertCircle size={13} className="text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs">
                        Insufficient balance —{' '}
                        <Link to="/my/deposit" className="font-bold underline">Deposit USDT</Link>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenTask(task)}
                    disabled={!!openingTask || locked}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      locked
                        ? 'bg-surface-muted text-gray-600 cursor-not-allowed border border-surface-border'
                        : `bg-gradient-to-r ${task.color} text-white shadow-brand-sm`
                    }`}
                  >
                    {openingTask === task.type ? (
                      <><Loader2 size={15} className="animate-spin" /> Opening…</>
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
