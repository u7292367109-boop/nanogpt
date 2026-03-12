import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

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
  const navigate = useNavigate()
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
    const claimed = hasClaimedToday(user.id)
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
    if (alreadyClaimed) { setClaimError('Already claimed today. Resets at midnight UTC.'); return }
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
  }

  return (
    <Layout showTopBar={false} showBack={false}>
      {/* Custom header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">N</span>
          </div>
          <span className="text-white font-bold text-base">My Power</span>
        </div>
        <button onClick={() => navigate('/fundlogs')} className="w-9 h-9 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </button>
      </div>

      <div className="pb-6">
        {/* Stats bar - green gradient */}
        <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-brand-900 via-green-900 to-emerald-800 p-4 border border-brand-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center">
                <span className="text-brand-300 text-sm">📈</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Daily Yield</p>
                <p className="text-brand-300 font-extrabold text-base">{assets?.daily_yield?.toFixed(3) ?? '0.000'} USDT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center">
                <span className="text-brand-300 text-sm">🔄</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Yield</p>
                <p className="text-white font-extrabold text-base">{assets?.total_yield?.toFixed(3) ?? '0.000'} USDT</p>
              </div>
            </div>
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
            Personal device
          </button>
          <button
            onClick={() => { setActiveTab('node'); navigate('/task') }}
            className="flex-1 py-2.5 text-sm font-bold text-gray-500"
          >
            Node power
          </button>
        </div>

        {/* Personal device content */}
        {activeTab === 'personal' && (
          <div className="mx-4 mt-4 space-y-4">
            {/* Device card */}
            <div className="bg-surface-card border border-surface-border rounded-2xl divide-y divide-surface-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Model:</span>
                <span className="text-white font-semibold text-sm">{device?.model ?? 'Computing Node'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Daily Yield</span>
                <span className="text-white font-semibold text-sm">+{dailyYield.toFixed(3)} USDT</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-400 text-sm">Training Task Profit</span>
                <button
                  onClick={alreadyClaimed ? handleClaimYield : handleClaimYield}
                  disabled={training}
                  className="flex items-center gap-1"
                >
                  {training ? (
                    <span className="flex items-center gap-1.5 bg-surface-muted border border-surface-border text-gray-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                      <Loader2 size={13} className="animate-spin" /> Claiming…
                    </span>
                  ) : alreadyClaimed ? (
                    <span className="flex items-center gap-1.5 bg-surface-muted border border-surface-border text-gray-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                      <CheckCircle size={13} className="text-brand-400" />
                      {formatCountdown(countdown)}
                    </span>
                  ) : (
                    <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg">
                      Start
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
                <p className="text-white font-bold text-sm">Training tasks</p>
                <button
                  onClick={() => navigate('/task')}
                  className="flex items-center gap-0.5 border border-brand-500/40 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  More profit <ChevronRight size={12} />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <img src="https://ai.neogpt.club/assets/movement-start.png" alt="No data" className="w-40 h-40 object-contain" />
                  <p className="text-gray-500 text-sm">– No data –</p>
                  <button
                    onClick={() => navigate('/task')}
                    className="px-8 py-2 rounded-full border border-surface-border text-gray-400 text-sm font-semibold"
                  >
                    Go now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-surface-card border border-surface-border rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-semibold text-sm capitalize">{order.task_type.replace('-', ' ')}</p>
                        <span className="text-xs text-brand-400 font-semibold bg-brand-500/10 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Investment: {order.investment_amount} USDT</span>
                        <span>Yield: {order.return_rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
