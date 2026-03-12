import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Zap, TrendingUp, ChevronRight, Loader2, Cpu, CheckCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

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

function hasClaimedToday(userId: string): boolean {
  return localStorage.getItem(getClaimKey(userId)) === '1'
}

function markClaimedToday(userId: string) {
  localStorage.setItem(getClaimKey(userId), '1')
}

function secondsUntilMidnightUTC(): number {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
}

function formatCountdown(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Power() {
  const { user, profile, assets, refreshAssets } = useAuth()
  const [device, setDevice]          = useState<Device | null>(null)
  const [training, setTraining]      = useState(false)
  const [success, setSuccess]        = useState('')
  const [claimError, setClaimError]  = useState('')
  const [alreadyClaimed, setClaimed] = useState(false)
  const [countdown, setCountdown]    = useState(0)

  const userLevel  = profile?.level ?? 0
  const dailyYield = YIELD_BY_LEVEL[Math.min(userLevel, YIELD_BY_LEVEL.length - 1)]
  const now        = new Date()
  const dayPct     = (now.getHours() * 60 + now.getMinutes()) / (24 * 60)
  const progress   = Math.round(dayPct * 100)

  useEffect(() => {
    if (user) {
      supabase.from('devices').select('*').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setDevice(data) })
      const claimed = hasClaimedToday(user.id)
      setClaimed(claimed)
      if (claimed) setCountdown(secondsUntilMidnightUTC())
    }
  }, [user])

  // Countdown tick
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
    setClaimError(''); setSuccess('');
    setTraining(true)

    const earned = parseFloat(dailyYield.toFixed(3))
    const { data: fresh, error: fetchErr } = await supabase.from('assets').select('*').eq('user_id', user.id).single()
    if (fetchErr || !fresh) { setClaimError('Unable to load balance. Please refresh.'); setTraining(false); return }

    const { error: updateErr } = await supabase.from('assets').update({
      daily_yield:        earned,
      total_yield:        parseFloat(((fresh.total_yield ?? 0) + earned).toFixed(3)),
      withdrawal_balance: parseFloat(((fresh.withdrawal_balance ?? 0) + earned).toFixed(3)),
    }).eq('user_id', user.id)
    if (updateErr) { setClaimError('Failed to credit: ' + updateErr.message); setTraining(false); return }

    await supabase.from('transactions').insert({
      user_id: user.id,
      type:    'yield',
      amount:  earned,
      status:  'approved',
      note:    `Daily node yield LV.${userLevel}`,
    })

    await refreshAssets()
    markClaimedToday(user.id)
    setClaimed(true)
    setCountdown(secondsUntilMidnightUTC())
    setTraining(false)
    setSuccess(`+${earned.toFixed(3)} USDT credited to available balance!`)
    setTimeout(() => setSuccess(''), 5000)
  }

  return (
    <Layout title="My Power" showBack={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Stats */}
        <div className="card">
          <p className="section-title">Power Stats</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-surface-muted rounded-2xl p-4 text-center border border-surface-border">
              <p className="text-xs text-gray-500 mb-1">Daily Yield</p>
              <p className="font-extrabold text-brand-400 text-xl">+{dailyYield.toFixed(3)}</p>
              <p className="text-xs text-gray-600 mt-0.5">USDT</p>
            </div>
            <div className="flex-1 bg-surface-muted rounded-2xl p-4 text-center border border-surface-border">
              <p className="text-xs text-gray-500 mb-1">Total Yield</p>
              <p className="font-extrabold text-brand-400 text-xl">{formatUSDT(assets?.total_yield ?? 0)}</p>
              <p className="text-xs text-gray-600 mt-0.5">USDT</p>
            </div>
          </div>
        </div>

        {/* Node card */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-white">Personal Node</p>
            <span className="text-xs text-brand-400 font-semibold bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
              LV.{userLevel} Active
            </span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-950 to-brand-900 flex items-center justify-center glow-pulse shrink-0 border border-brand-500/20">
              <Cpu size={28} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold mb-0.5">{device?.model ?? 'Computing Node'}</p>
              <p className="text-xs text-gray-500 mb-2">{device?.platform ?? 'NanoGPT Network'}</p>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-brand-400" />
                <span className="text-xs text-brand-400 font-bold">Daily: +{dailyYield.toFixed(3)} USDT</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Training Progress (Today)</span>
              <span className="text-xs text-brand-400 font-bold">{progress}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <p className="text-xs text-gray-600 mt-1.5">Resets daily at midnight UTC</p>
          </div>

          {/* Claim / cooldown */}
          {alreadyClaimed ? (
            <div className="space-y-3">
              <div className="w-full py-3.5 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
                <CheckCircle size={17} className="text-brand-400" />
                Claimed Today
              </div>
              <p className="text-center text-xs text-gray-500">
                Next claim in{' '}
                <span className="text-brand-400 font-bold font-mono">{formatCountdown(countdown)}</span>
              </p>
            </div>
          ) : (
            <button
              onClick={handleClaimYield}
              disabled={training}
              className="btn-primary shadow-brand disabled:opacity-60"
            >
              {training
                ? <><Loader2 size={17} className="animate-spin" /> Claiming…</>
                : <><Play size={17} /> Claim Daily Yield (+{dailyYield.toFixed(3)} USDT)</>}
            </button>
          )}

          {success && (
            <div className="mt-3 py-3 px-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-center fade-in">
              <p className="text-brand-400 text-sm font-bold">{success}</p>
            </div>
          )}
          {claimError && (
            <div className="mt-3 py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl fade-in">
              <p className="text-red-400 text-sm font-semibold">{claimError}</p>
            </div>
          )}
        </div>

        {/* Node info */}
        {device && (
          <div className="card">
            <p className="section-title">Node Information</p>
            <div className="space-y-3">
              {[
                { label: 'Device ID', value: device.device_id.slice(0, 16) + '…' },
                { label: 'Model',     value: device.model },
                { label: 'OS',        value: device.os },
                { label: 'Network',   value: device.platform },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs text-white font-semibold font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to task center */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Earn More</p>
            <Link to="/my/orders" className="flex items-center gap-0.5 text-xs text-brand-400 font-bold">
              History <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mb-3">
              <TrendingUp size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm font-semibold">Boost earnings with AI tasks</p>
            <p className="text-gray-600 text-xs mt-1">Up to 150% return on investments</p>
          </div>
          <Link to="/task" className="btn-secondary text-sm">Go to Task Center →</Link>
        </div>

      </div>
    </Layout>
  )
}
