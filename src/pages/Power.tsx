import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, ChevronRight, TrendingUp, DollarSign, Layers, Wallet } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { pushAndRecord } from '../lib/notify'
import { getPackageName, getTypeEmoji, getDeadlineDays } from '../lib/packages'
import { useLang } from '../context/LanguageContext'

interface ActiveOrder {
  id: string
  task_type: string
  investment_amount: number
  return_rate: number
  started_at: string
  status: string
}

interface Device {
  device_id: string
  model: string
  platform: string
  os: string
}

const YIELD_BY_LEVEL = [0.014, 0.025, 0.045, 0.08, 0.15, 0.30, 0.60]
const ADMIN_EMAIL = 'affiliatesflow@gmail.com'

function getClaimKey(userId: string) {
  const d = new Date()
  return `yield_claimed_${userId}_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`
}
function hasClaimedToday(userId: string) { return localStorage.getItem(getClaimKey(userId)) === '1' }
function markClaimedToday(userId: string) { localStorage.setItem(getClaimKey(userId), '1') }
function secondsUntilMidnightUTC() {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
}
function formatCountdown(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

export default function Power() {
  const { user, profile, assets, refreshAssets } = useAuth()
  const isAdmin = user?.email === ADMIN_EMAIL
  const navigate = useNavigate()
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState<'personal' | 'node'>('personal')
  const [device, setDevice]          = useState<Device | null>(null)
  const [orders, setOrders]          = useState<ActiveOrder[]>([])
  const [training, setTraining]      = useState(false)
  const [success, setSuccess]        = useState('')
  const [claimError, setClaimError]  = useState('')
  const [alreadyClaimed, setClaimed] = useState(false)
  const [countdown, setCountdown]    = useState(0)

  const userLevel  = profile?.level ?? 0
  const dailyYield = YIELD_BY_LEVEL[Math.min(userLevel, YIELD_BY_LEVEL.length - 1)]

  useEffect(() => {
    if (!user) return
    supabase.from('devices').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data) setDevice(data) })
    supabase.from('orders').select('*').eq('user_id', user.id).eq('status', 'active').order('started_at', { ascending: false })
      .then(({ data }) => { if (data) setOrders(data) })
    const claimed = !isAdmin && hasClaimedToday(user.id)
    setClaimed(claimed)
    if (claimed) setCountdown(secondsUntilMidnightUTC())
  }, [user])

  useEffect(() => {
    if (!alreadyClaimed) return
    const t = setInterval(() => {
      setCountdown(s => {
        if (s <= 1) { clearInterval(t); setClaimed(false); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [alreadyClaimed])

  async function handleClaimYield() {
    if (!user) { setClaimError('Must be logged in.'); return }
    if (training) return
    if (alreadyClaimed && !isAdmin) { setClaimError('Already claimed today. Resets at midnight UTC.'); return }
    setClaimError(''); setSuccess('')
    setTraining(true)
    const earned = parseFloat(dailyYield.toFixed(3))
    let { data: fresh } = await supabase.from('assets').select('*').eq('user_id', user.id).maybeSingle()
    if (!fresh) {
      // Auto-create assets row if missing
      const { data: created } = await supabase.from('assets').insert({
        user_id: user.id, task_balance: 0, vault_balance: 0,
        withdrawal_balance: 0, daily_yield: 0, total_yield: 0,
      }).select().single()
      fresh = created
    }
    if (!fresh) { setClaimError('Unable to load balance. Please refresh.'); setTraining(false); return }
    const { error: updateErr } = await supabase.from('assets').update({
      daily_yield:        earned,
      total_yield:        parseFloat(((fresh.total_yield ?? 0) + earned).toFixed(3)),
      withdrawal_balance: parseFloat(((fresh.withdrawal_balance ?? 0) + earned).toFixed(3)),
    }).eq('user_id', user.id)
    if (updateErr) { setClaimError('Failed to credit: ' + updateErr.message); setTraining(false); return }
    await supabase.from('transactions').insert({
      user_id: user.id, type: 'yield', amount: earned, status: 'approved',
      note: `Daily node yield LV.${userLevel}`,
    })
    await refreshAssets()
    markClaimedToday(user.id)
    setClaimed(true)
    setCountdown(secondsUntilMidnightUTC())
    setTraining(false)
    setSuccess(`+${earned.toFixed(3)} USDT credited!`)
    setTimeout(() => setSuccess(''), 5000)
    // Push notification for yield claim
    await pushAndRecord(
      user.id,
      '✅ Daily Yield Claimed',
      `+${earned.toFixed(3)} USDT credited to your withdrawal balance. LV.${userLevel} node.`,
      'service',
    )
  }

  return (
    <Layout showTopBar={false} showBack={false}>
      {/* Custom header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">N</span>
          </div>
          <span className="text-white font-bold text-base">{t('my_power')}</span>
        </div>
        <button onClick={() => navigate('/fundlogs')} className="w-9 h-9 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </button>
      </div>

      <div className="pb-6">
        {/* Earnings cards — 2×2 grid */}
        <div className="mx-4 mt-4 grid grid-cols-2 gap-3">

          {/* Daily Yield */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d2b1a] to-[#0a1f14] border border-brand-500/25 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-brand-500/10 blur-xl" />
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-3">
              <TrendingUp size={17} className="text-brand-400" />
            </div>
            <p className="text-gray-400 text-[11px] font-medium mb-0.5">{t('daily_yield_card')}</p>
            <p className="text-white font-extrabold text-xl leading-none">{(assets?.daily_yield ?? 0).toFixed(3)}</p>
            <p className="text-brand-400 text-[10px] font-bold mt-0.5">USDT</p>
          </div>

          {/* Total Yield */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d2b2b] to-[#071a1a] border border-emerald-500/25 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl" />
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-3">
              <DollarSign size={17} className="text-emerald-400" />
            </div>
            <p className="text-gray-400 text-[11px] font-medium mb-0.5">{t('total_yield_card')}</p>
            <p className="text-white font-extrabold text-xl leading-none">{(assets?.total_yield ?? 0).toFixed(3)}</p>
            <p className="text-emerald-400 text-[10px] font-bold mt-0.5">USDT</p>
          </div>

          {/* Task Balance (active investment) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1a2b] to-[#07121a] border border-blue-500/25 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-blue-500/10 blur-xl" />
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-3">
              <Layers size={17} className="text-blue-400" />
            </div>
            <p className="text-gray-400 text-[11px] font-medium mb-0.5">{t('task_balance')}</p>
            <p className="text-white font-extrabold text-xl leading-none">{(assets?.task_balance ?? 0).toFixed(2)}</p>
            <p className="text-blue-400 text-[10px] font-bold mt-0.5">USDT</p>
          </div>

          {/* Withdrawable */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b1a07] to-[#1a1007] border border-amber-500/25 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-amber-500/10 blur-xl" />
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3">
              <Wallet size={17} className="text-amber-400" />
            </div>
            <p className="text-gray-400 text-[11px] font-medium mb-0.5">{t('withdrawable')}</p>
            <p className="text-white font-extrabold text-xl leading-none">{(assets?.withdrawal_balance ?? 0).toFixed(2)}</p>
            <p className="text-amber-400 text-[10px] font-bold mt-0.5">USDT</p>
          </div>

        </div>

        {/* Tabs */}
        <div className="mx-4 mt-4 flex border-b border-surface-border">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'personal'
                ? 'text-brand-400 border-b-2 border-brand-400'
                : 'text-gray-500'
            }`}
          >
            {t('personal_device')}
          </button>
          <button
            onClick={() => { setActiveTab('node'); navigate('/task') }}
            className="flex-1 py-2.5 text-sm font-bold text-gray-500"
          >
            {t('node_power')}
          </button>
        </div>

        {/* Personal device content */}
        {activeTab === 'personal' && (
          <div className="mx-4 mt-4 space-y-4">
            {/* Device card */}
            <div className="bg-surface-card border border-surface-border rounded-2xl divide-y divide-surface-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">{t('model_label')}</span>
                <span className="text-white font-semibold text-sm">{device?.model ?? 'Computing Node'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">{t('daily_yield_card')}</span>
                <span className="text-white font-semibold text-sm">+{dailyYield.toFixed(3)} USDT</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">{t('training_profit')}</span>
                <button
                  onClick={alreadyClaimed ? handleClaimYield : handleClaimYield}
                  disabled={training}
                  className="flex items-center gap-1"
                >
                  {training ? (
                    <span className="flex items-center gap-1.5 bg-surface-muted border border-surface-border text-gray-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                      <Loader2 size={13} className="animate-spin" /> {t('claiming')}
                    </span>
                  ) : alreadyClaimed ? (
                    <span className="flex items-center gap-1.5 bg-surface-muted border border-surface-border text-gray-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                      <CheckCircle size={13} className="text-brand-400" />
                      {formatCountdown(countdown)}
                    </span>
                  ) : (
                    <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg">
                      {t('claim')}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback messages */}
            {success && (
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl px-4 py-3 text-center">
                <p className="text-brand-400 text-sm font-bold">{success}</p>
              </div>
            )}
            {claimError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                <p className="text-red-400 text-sm">{claimError}</p>
              </div>
            )}

            {/* Training tasks section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold text-sm">{t('training_tasks')}</p>
                <button
                  onClick={() => navigate('/task')}
                  className="flex items-center gap-0.5 border border-brand-500/40 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {t('more_profit')} <ChevronRight size={12} />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <img src="https://ai.neogpt.club/assets/movement-start.png" alt="No data" className="w-40 h-40 object-contain" />
                  <p className="text-gray-500 text-sm">{t('no_data')}</p>
                  <button
                    onClick={() => navigate('/task')}
                    className="px-8 py-2 rounded-full border border-surface-border text-gray-400 text-sm font-semibold"
                  >
                    {t('go_now')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => {
                    const base     = order.started_at ? new Date(order.started_at) : new Date()
                    const deadlineDays = getDeadlineDays(order.return_rate)
                    const endDate  = new Date(base.getTime() + deadlineDays * 24 * 60 * 60 * 1000)
                    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
                    const pct      = Math.min(100, Math.round(((Date.now() - base.getTime()) / (deadlineDays * 24 * 60 * 60 * 1000)) * 100))
                    return (
                      <div key={order.id} className="bg-surface-card border border-brand-500/20 rounded-2xl px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{getTypeEmoji(order.task_type)}</span>
                            <p className="text-white font-semibold text-sm">{getPackageName(order.task_type, order.investment_amount, order.return_rate)}</p>
                          </div>
                          <span className="text-xs text-brand-400 font-semibold bg-brand-500/10 px-2 py-0.5 rounded-full">{t('status_active')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Invested: {order.investment_amount} USDT</span>
                          <span className="text-amber-400 font-semibold">Yield: {order.return_rate}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
                            <div className="h-full rounded-full bg-brand-500" style={{ width: pct + '%' }} />
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400">{t('completes')} <span className="text-white font-semibold">{endDate.toLocaleDateString()}</span></span>
                            <span className={daysLeft <= 5 ? 'text-amber-400 font-bold' : 'text-gray-400'}>
                              {daysLeft === 0 ? t('completing_soon') : daysLeft + t('days_left')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
