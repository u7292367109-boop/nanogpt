import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Zap, TrendingUp, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

export default function Power() {
  const { user, assets, refreshAssets } = useAuth()
  const [training, setTraining] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleStartTraining() {
    if (!user || training) return
    setTraining(true)

    // Simulate training task - add small yield
    const yieldAmount = 0.014
    await supabase.from('assets').update({
      daily_yield: (assets?.daily_yield ?? 0) + yieldAmount,
      total_yield: (assets?.total_yield ?? 0) + yieldAmount,
    }).eq('user_id', user.id)

    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'yield',
      amount: yieldAmount,
      status: 'approved',
    })

    await refreshAssets()
    setSuccess(`+${yieldAmount} USDT earned!`)
    setTraining(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <Layout title="My Power" showBack={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* Stats */}
        <div className="card">
          <p className="section-title">My Power Stats</p>
          <div className="flex gap-3">
            <div className="stat-card">
              <p className="text-xs text-gray-400 mb-1">Daily Yield</p>
              <p className="font-bold yield-badge text-lg">{formatUSDT(assets?.daily_yield ?? 0)}</p>
              <p className="text-xs text-gray-500">USDT</p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-400 mb-1">Total Yield</p>
              <p className="font-bold yield-badge text-lg">{formatUSDT(assets?.total_yield ?? 0)}</p>
              <p className="text-xs text-gray-500">USDT</p>
            </div>
          </div>
        </div>

        {/* Device */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Personal Device</p>
            <span className="text-xs text-gray-400">Node Power</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900 to-violet-900 flex items-center justify-center text-3xl glow-pulse">
              📱
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">iPhone</p>
              <p className="text-xs text-gray-400 mb-1">General Computing Node</p>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Daily: +0.014 USDT</span>
              </div>
            </div>
          </div>

          {/* Training button */}
          <button
            onClick={handleStartTraining}
            disabled={training}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm
                       bg-gradient-to-r from-indigo-600 to-violet-600 text-white
                       disabled:opacity-50 transition-all"
          >
            {training ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Play size={16} />
                Start Training Task
              </>
            )}
          </button>

          {success && (
            <div className="mt-3 py-2 px-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
              <p className="text-green-400 text-sm font-semibold">{success}</p>
            </div>
          )}
        </div>

        {/* Training profit history */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Training Task Profit</p>
            <Link to="/my/orders" className="flex items-center gap-1 text-xs text-indigo-400">
              More <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <TrendingUp size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No profit history yet</p>
              <p className="text-gray-600 text-xs mt-1">Start training to earn rewards</p>
            </div>
          </div>
          <Link to="/task" className="btn-secondary block text-center text-sm mt-2">
            Go to Task Center →
          </Link>
        </div>
      </div>
    </Layout>
  )
}
