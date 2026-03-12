import { useState, useEffect } from 'react'
import { Zap, Clock, TrendingUp, CheckCircle, Loader2, AlertCircle, ArrowRight, Rocket } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

const ACCELERATORS = [
  { tier: 1, name: 'Accelerator I',   price: 100,  dailyRate: 3.40,  duration: 60 },
  { tier: 2, name: 'Accelerator II',  price: 200,  dailyRate: 7.00,  duration: 60 },
  { tier: 3, name: 'Accelerator III', price: 600,  dailyRate: 22.00, duration: 60 },
  { tier: 4, name: 'Accelerator IV',  price: 1200, dailyRate: 46.00, duration: 60 },
  { tier: 5, name: 'Accelerator V',   price: 3000, dailyRate: 120.00, duration: 60 },
  { tier: 6, name: 'Accelerator VI',  price: 6000, dailyRate: 250.00, duration: 60 },
]

interface AccOrder {
  id: string
  return_rate: number
  started_at: string | null
  created_at: string
}

export default function Accelerate() {
  const { user, assets, refreshAssets } = useAuth()
  const [activeAcc, setActiveAcc]   = useState<AccOrder | null>(null)
  const [loadingAcc, setLoadingAcc] = useState(true)
  const [buying, setBuying]         = useState<number | null>(null)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  useEffect(() => {
    if (user) loadActiveAccelerator()
  }, [user])

  async function loadActiveAccelerator() {
    setLoadingAcc(true)
    const { data } = await supabase
      .from('orders')
      .select('id, return_rate, started_at, created_at')
      .eq('user_id', user!.id)
      .eq('task_type', 'accelerator')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data) {
      const refDate = data.started_at ?? data.created_at
      const daysElapsed = (Date.now() - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24)
      if (daysElapsed >= 60) {
        await supabase.from('orders').update({ status: 'expired' }).eq('id', data.id)
        setActiveAcc(null)
      } else {
        setActiveAcc(data)
      }
    } else {
      setActiveAcc(null)
    }
    setLoadingAcc(false)
  }

  function getDaysRemaining(acc: AccOrder): number {
    const refDate = acc.started_at ?? acc.created_at
    const daysElapsed = (Date.now() - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24)
    return Math.max(0, Math.floor(60 - daysElapsed))
  }

  async function handleBuy(acc: typeof ACCELERATORS[0]) {
    if (!user || buying !== null) return
    setError('')
    setSuccess('')

    const balance = assets?.withdrawal_balance ?? 0
    if (balance < acc.price) {
      setError(`Insufficient balance. Need ${formatUSDT(acc.price)} USDT, you have ${formatUSDT(balance)} USDT.`)
      return
    }

    setBuying(acc.tier)
    try {
      const { data: fresh } = await supabase
        .from('assets')
        .select('withdrawal_balance')
        .eq('user_id', user.id)
        .single()

      if (!fresh || fresh.withdrawal_balance < acc.price) {
        setError('Insufficient balance.')
        setBuying(null)
        return
      }

      // Deduct price from withdrawal_balance
      await supabase.from('assets').update({
        withdrawal_balance: parseFloat((fresh.withdrawal_balance - acc.price).toFixed(2)),
      }).eq('user_id', user.id)

      // Expire any existing active accelerator
      if (activeAcc) {
        await supabase.from('orders').update({ status: 'expired' }).eq('id', activeAcc.id)
      }

      // Create accelerator order
      const now = new Date().toISOString()
      await supabase.from('orders').insert({
        user_id:           user.id,
        task_type:         'accelerator',
        investment_amount: acc.price,
        return_rate:       acc.dailyRate,
        status:            'active',
        started_at:        now,
      })

      // Record purchase transaction (negative = deduction)
      await supabase.from('transactions').insert({
        user_id: user.id,
        type:    'accelerator',
        amount:  -acc.price,
        status:  'approved',
        note:    `Activated ${acc.name} — $${acc.dailyRate.toFixed(2)}/day × 60 days`,
      })

      await refreshAssets()
      await loadActiveAccelerator()
      setSuccess(`🚀 ${acc.name} activated! Earn +$${acc.dailyRate.toFixed(2)} USDT every day for 60 days. Claim in Power section.`)
      setTimeout(() => setSuccess(''), 8000)
    } catch {
      setError('Purchase failed. Please try again.')
    }
    setBuying(null)
  }

  const activeAccTier = activeAcc
    ? ACCELERATORS.find(a => Math.abs(a.dailyRate - activeAcc.return_rate) < 0.01)
    : null

  return (
    <Layout title="Accelerators" showBack>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Hero */}
        <div className="card bg-gradient-to-br from-brand-900/50 to-green-950/50 border-brand-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center glow-pulse shrink-0">
              <Rocket size={22} className="text-brand-400" />
            </div>
            <div>
              <p className="text-white font-extrabold text-base">Yield Accelerators</p>
              <p className="text-gray-500 text-xs">Multiply your daily node earnings</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-muted/60 rounded-xl p-3 border border-surface-border text-center">
              <p className="text-xs text-gray-500 mb-0.5">Your Balance</p>
              <p className="text-brand-400 font-extrabold text-lg">{formatUSDT(assets?.withdrawal_balance ?? 0)}</p>
              <p className="text-xs text-gray-600">USDT</p>
            </div>
            <div className="bg-surface-muted/60 rounded-xl p-3 border border-surface-border text-center">
              <p className="text-xs text-gray-500 mb-0.5">Max Daily</p>
              <p className="text-brand-400 font-extrabold text-lg">$250.00</p>
              <p className="text-xs text-gray-600">USDT/day</p>
            </div>
          </div>
        </div>

        {/* Active accelerator card */}
        {!loadingAcc && activeAcc && (
          <div className="card border-brand-500/40 bg-brand-500/5 fade-in">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-brand-400" />
              <p className="text-sm font-bold text-brand-400">Active Accelerator</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-extrabold text-base">{activeAccTier?.name ?? 'Accelerator'}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="text-brand-400 font-semibold">+${activeAcc.return_rate.toFixed(2)} USDT/day</span>
                  {' '}· {getDaysRemaining(activeAcc)} days remaining
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Days Left</p>
                <p className="text-white font-extrabold text-2xl">{getDaysRemaining(activeAcc)}</p>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(getDaysRemaining(activeAcc) / 60) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-start gap-2 p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl fade-in">
            <CheckCircle size={16} className="text-brand-400 shrink-0 mt-0.5" />
            <p className="text-brand-400 text-sm font-semibold">{success}</p>
          </div>
        )}

        {/* Packages list */}
        <p className="section-title">Packages</p>
        <div className="space-y-3">
          {ACCELERATORS.map((acc) => {
            const totalReturn = acc.dailyRate * acc.duration
            const isActive    = activeAcc !== null && Math.abs(activeAcc.return_rate - acc.dailyRate) < 0.01
            const isBuying    = buying === acc.tier
            const canAfford   = (assets?.withdrawal_balance ?? 0) >= acc.price

            return (
              <div
                key={acc.tier}
                className={`card transition-all ${isActive ? 'border-brand-500/40 bg-brand-500/5' : ''}`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm border transition-all ${
                      isActive
                        ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                        : 'bg-surface-muted border-surface-border text-gray-400'
                    }`}>
                      {acc.tier}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">{acc.name}</p>
                        {isActive && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{acc.duration} days duration</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-extrabold text-lg">${acc.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">USDT</p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-surface-muted rounded-xl p-3 border border-surface-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap size={10} className="text-brand-400" />
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Daily</p>
                    </div>
                    <p className="text-brand-400 font-extrabold">+${acc.dailyRate.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-600">USDT</p>
                  </div>
                  <div className="bg-surface-muted rounded-xl p-3 border border-surface-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={10} className="text-gray-500" />
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Days</p>
                    </div>
                    <p className="text-white font-extrabold">{acc.duration}</p>
                    <p className="text-[10px] text-gray-600">days</p>
                  </div>
                  <div className="bg-surface-muted rounded-xl p-3 border border-surface-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={10} className="text-brand-400" />
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Total</p>
                    </div>
                    <p className="text-brand-400 font-extrabold">${totalReturn.toFixed(0)}</p>
                    <p className="text-[10px] text-gray-600">USDT</p>
                  </div>
                </div>

                {/* Buy / status button */}
                <button
                  onClick={() => handleBuy(acc)}
                  disabled={isBuying || isActive || !canAfford}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] ${
                    isActive
                      ? 'bg-brand-500/10 border border-brand-500/20 text-brand-400 cursor-default'
                      : canAfford && !isBuying
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-brand-sm'
                        : 'bg-surface-muted border border-surface-border text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isBuying ? (
                    <><Loader2 size={15} className="animate-spin" /> Activating…</>
                  ) : isActive ? (
                    <><CheckCircle size={15} /> Currently Active</>
                  ) : canAfford ? (
                    <>Activate for ${acc.price.toLocaleString()} USDT <ArrowRight size={14} /></>
                  ) : (
                    <>Insufficient Balance — need ${acc.price.toLocaleString()} USDT</>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* How it works */}
        <div className="bg-surface-muted rounded-2xl p-4 border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-brand-400" />
            <p className="text-xs font-bold text-gray-300">How Accelerators Work</p>
          </div>
          <ul className="space-y-2 text-xs text-gray-500">
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold shrink-0">1.</span>
              Purchase with your available USDT balance
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold shrink-0">2.</span>
              Earn enhanced daily yield instead of base node yield
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold shrink-0">3.</span>
              Claim your daily earnings in the Power section
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold shrink-0">4.</span>
              Accelerator runs for 60 days then expires automatically
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold shrink-0">5.</span>
              Upgrade anytime — previous accelerator is replaced
            </li>
          </ul>
        </div>

      </div>
    </Layout>
  )
}
