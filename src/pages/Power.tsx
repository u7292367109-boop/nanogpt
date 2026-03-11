import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Zap, TrendingUp, ChevronRight, Loader2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

export default function Power() {
  const { user, assets, refreshAssets } = useAuth()
  const [training, setTraining] = useState(false)
  const [success, setSuccess]   = useState('')

  async function handleStartTraining() {
    if (!user || training) return
    setTraining(true)
    const yieldAmount = 0.014
    await supabase.from('assets').update({
      daily_yield: (assets?.daily_yield ?? 0) + yieldAmount,
      total_yield: (assets?.total_yield ?? 0) + yieldAmount,
    }).eq('user_id', user.id)
    await supabase.from('transactions').insert({
      user_id: user.id, type: 'yield', amount: yieldAmount, status: 'approved',
    })
    await refreshAssets()
    setSuccess(`+${yieldAmount} USDT earned!`)
    setTraining(false)
    setTimeout(() => setSuccess(''), 3000)
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

        {/* Device training card */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-white">Personal Node</p>
            <span className="text-xs text-gray-500 font-semibold">Computing Power</span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-950 to-brand-900 flex items-center justify-center text-3xl glow-pulse shrink-0 border border-brand-500/20">
              📱
            </div>
            <div className="flex-1">
              <p className="text-white font-bold mb-0.5">iPhone</p>
              <p className="text-xs text-gray-500 mb-2">General Computing Node</p>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-brand-400" />
                <span className="text-xs text-brand-400 font-bold">Daily: +0.014 USDT</span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Training Progress</span>
              <span className="text-xs text-brand-400 font-bold">38%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '38%' }} />
            </div>
          </div>

          <button
            onClick={handleStartTraining}
            disabled={training}
            className="btn-primary shadow-brand disabled:opacity-60"
          >
            {training ? (
              <><Loader2 size={17} className="animate-spin" /> Training…</>
            ) : (
              <><Play size={17} /> Start Training Task</>
            )}
          </button>

          {success && (
            <div className="mt-3 py-3 px-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-center fade-in">
              <p className="text-brand-400 text-sm font-bold">{success}</p>
            </div>
          )}
        </div>

        {/* Profit history */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Training Profit</p>
            <Link to="/my/orders" className="flex items-center gap-0.5 text-xs text-brand-400 font-bold">
              History <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mb-3">
              <TrendingUp size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm font-semibold">No profit history yet</p>
            <p className="text-gray-600 text-xs mt-1">Start training to earn rewards</p>
          </div>
          <Link to="/task" className="btn-secondary text-sm">
            Go to Task Center →
          </Link>
        </div>

      </div>
    </Layout>
  )
}
