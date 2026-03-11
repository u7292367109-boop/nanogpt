import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Zap, TrendingUp, ChevronRight, Loader2, Cpu } from 'lucide-react'
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

export default function Power() {
  const { user, profile, assets, refreshAssets } = useAuth()
  const [device, setDevice]     = useState<Device | null>(null)
  const [training, setTraining] = useState(false)
  const [success, setSuccess]   = useState('')

  const userLevel  = profile?.level ?? 0
  const dailyYield = YIELD_BY_LEVEL[Math.min(userLevel, YIELD_BY_LEVEL.length - 1)]
  const now        = new Date()
  const dayPct     = (now.getHours() * 60 + now.getMinutes()) / (24 * 60)
  const progress   = Math.round(dayPct * 100)

  useEffect(() => {
    if (user) {
      supabase.from('devices').select('*').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setDevice(data) })
    }
  }, [user])

  async function handleStartTraining() {
    if (!user || training) return
    setTraining(true)
    await supabase.from('assets').update({
      daily_yield: (assets?.daily_yield ?? 0) + dailyYield,
      total_yield: (assets?.total_yield ?? 0) + dailyYield,
    }).eq('user_id', user.id)
    await supabase.from('transactions').insert({
      user_id: user.id, type: 'yield', amount: dailyYield, status: 'approved',
    })
    await refreshAssets()
    setSuccess(`+${dailyYield.toFixed(3)} USDT earned from today's training!`)
    setTraining(false)
    setTimeout(() => setSuccess(''), 4000)
  }

  return (
    <Layout title="My Power" showBack={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        <div className="card">
          <p className="section-title">Power Stats</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-surface-muted rounded-2xl p-4 text-center border border-surface-border">
              <p className="text-xs text-gray-500 mb-1">Daily Yield</p>
              <p className="font-extrabold text-brand-400 text-xl">{formatUSDT(assets?.daily_yield ?? 0)}</p>
              <p className="text-xs text-gray-600 mt-0.5">USDT</p>
            </div>
            <div className="flex-1 bg-surface-muted rounded-2xl p-4 text-center border border-surface-border">
              <p className="text-xs text-gray-500 mb-1">Total Yield</p>
              <p className="font-extrabold text-brand-400 text-xl">{formatUSDT(assets?.total_yield ?? 0)}</p>
              <p className="text-xs text-gray-600 mt-0.5">USDT</p>
            </div>
          </div>
        </div>

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
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Training Progress (Today)</span>
              <span className="text-xs text-brand-400 font-bold">{progress}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <p className="text-xs text-gray-600 mt-1.5">Resets daily at midnight UTC</p>
          </div>
          <button onClick={handleStartTraining} disabled={training} className="btn-primary shadow-brand disabled:opacity-60">
            {training
              ? <><Loader2 size={17} className="animate-spin" /> Training…</>
              : <><Play size={17} /> Claim Daily Yield</>}
          </button>
          {success && (
            <div className="mt-3 py-3 px-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-center fade-in">
              <p className="text-brand-400 text-sm font-bold">{success}</p>
            </div>
          )}
        </div>

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

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Training Profit</p>
            <Link to="/my/orders" className="flex items-center gap-0.5 text-xs text-brand-400 font-bold">
              History <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mb-3">
              <TrendingUp size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm font-semibold">Claim your daily yield above</p>
            <p className="text-gray-600 text-xs mt-1">Or earn more via Task Center</p>
          </div>
          <Link to="/task" className="btn-secondary text-sm">Go to Task Center →</Link>
        </div>

      </div>
    </Layout>
  )
}
