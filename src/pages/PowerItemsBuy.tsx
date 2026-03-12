import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// All packages by ID
const ALL_PACKAGES: Record<string, {
  name: string; price: number; deadlines: number;
  dailyHours: number; totalYield: number; maxPurchase: number;
  totalEarnings: number; dailyEarnings: number;
}> = {
  'text-1': { name: 'General Computing Power', price: 50,   deadlines: 60, dailyHours: 2, totalYield: 92,  maxPurchase: 2, totalEarnings: 96.00,   dailyEarnings: 1.60  },
  'text-2': { name: 'Accelerator I',            price: 100,  deadlines: 60, dailyHours: 2, totalYield: 104, maxPurchase: 2, totalEarnings: 204.00,  dailyEarnings: 3.40  },
  'text-3': { name: 'Accelerator II',           price: 200,  deadlines: 60, dailyHours: 2, totalYield: 110, maxPurchase: 2, totalEarnings: 420.00,  dailyEarnings: 7.00  },
  'tab-1':  { name: 'Tabular Node I',           price: 600,  deadlines: 60, dailyHours: 2, totalYield: 120, maxPurchase: 2, totalEarnings: 720.00,  dailyEarnings: 12.00 },
  'tab-2':  { name: 'Tabular Node II',          price: 1200, deadlines: 60, dailyHours: 2, totalYield: 130, maxPurchase: 2, totalEarnings: 1560.00, dailyEarnings: 26.00 },
  'pic-1':  { name: 'Visual Node I',            price: 3000, deadlines: 60, dailyHours: 2, totalYield: 140, maxPurchase: 1, totalEarnings: 4200.00, dailyEarnings: 70.00 },
  'pic-2':  { name: 'Visual Node II',           price: 5000, deadlines: 60, dailyHours: 2, totalYield: 140, maxPurchase: 1, totalEarnings: 7000.00, dailyEarnings: 116.67 },
  'vid-1':  { name: 'Video Node I',             price: 6000, deadlines: 60, dailyHours: 2, totalYield: 150, maxPurchase: 1, totalEarnings: 9000.00, dailyEarnings: 150.00 },
  'vid-2':  { name: 'Video Node II',            price: 10000,deadlines: 60, dailyHours: 2, totalYield: 150, maxPurchase: 1, totalEarnings: 15000.00,dailyEarnings: 250.00 },
}

export default function PowerItemsBuy() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, assets, refreshAssets } = useAuth()

  const pid    = searchParams.get('pid') ?? 'text-1'
  const pkg    = ALL_PACKAGES[pid] ?? ALL_PACKAGES['text-1']

  const [qty, setQty]           = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const totalPrice = pkg.price * qty

  async function handleBuy() {
    if (!user) return
    setLoading(true)
    setError('')

    const vaultBal = assets?.vault_balance ?? 0
    if (vaultBal < totalPrice) {
      setError(`Insufficient vault balance. You have ${vaultBal.toFixed(2)} USDT but need ${totalPrice.toFixed(2)} USDT.`)
      setLoading(false)
      setShowConfirm(false)
      return
    }

    const { data: fresh } = await supabase.from('assets').select('*').eq('user_id', user.id).single()
    if (!fresh) {
      setError('Failed to fetch balance. Please try again.')
      setLoading(false)
      setShowConfirm(false)
      return
    }

    const { error: updateErr } = await supabase.from('assets').update({
      vault_balance:      parseFloat(((fresh.vault_balance ?? 0) - totalPrice).toFixed(2)),
      task_balance:       parseFloat(((fresh.task_balance ?? 0) + totalPrice).toFixed(2)),
    }).eq('user_id', user.id)

    if (updateErr) {
      setError('Purchase failed: ' + updateErr.message)
      setLoading(false)
      setShowConfirm(false)
      return
    }

    // Create order record
    await supabase.from('orders').insert({
      user_id:           user.id,
      task_type:         pid,
      investment_amount: totalPrice,
      return_rate:       pkg.totalYield,
      status:            'active',
      started_at:        new Date().toISOString(),
    })

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: user.id,
      type:    'purchase',
      amount:  totalPrice,
      status:  'approved',
      note:    `Purchased ${qty}x ${pkg.name}`,
    })

    await refreshAssets()
    setLoading(false)
    setShowConfirm(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="page-container bg-surface flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-brand-400" />
        </div>
        <h2 className="text-white font-extrabold text-2xl mb-2">Purchase Successful!</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          {qty}x {pkg.name} has been activated. Your investment is now processing.
        </p>
        <button
          onClick={() => navigate('/power')}
          className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold text-base"
        >
          View My Power
        </button>
        <button
          onClick={() => navigate('/task')}
          className="mt-3 w-full py-4 rounded-2xl border border-surface-border text-gray-400 font-bold text-base"
        >
          Back to Tasks
        </button>
      </div>
    )
  }

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md"
           style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white">
          <ChevronLeft size={22} className="text-gray-400" />
        </button>
        <span className="text-white font-bold text-base">Product details</span>
        <button onClick={() => navigate('/my/orders')} className="w-9 h-9 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </button>
      </div>

      <div className="px-4 pt-4 pb-32 space-y-4">
        {/* Product card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-brand-400 font-bold text-sm mb-3">{pkg.name}</p>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between gap-8">
                  <span>Daily training hours:</span>
                  <span className="text-white font-semibold">{pkg.dailyHours} H</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span>Deadlines:</span>
                  <span className="text-white font-semibold">{pkg.deadlines}Days</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span>Total yield:</span>
                  <span className="text-white font-semibold">{pkg.totalYield}%</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span>Prices:</span>
                  <span className="text-white font-semibold">${pkg.price} USDT</span>
                </div>
              </div>
            </div>
            <div className="w-24 h-20 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shrink-0 border border-surface-border">
              <span className="text-3xl">🖥️</span>
            </div>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-center text-white font-bold"
              >
                −
              </button>
              <span className="text-white font-bold text-base w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(pkg.maxPurchase, q + 1))}
                className="w-8 h-8 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-center text-white font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <span className="text-gray-500 text-xs">Price:&nbsp;</span>
            <span className="text-red-400 font-bold text-sm">${pkg.price * qty}</span>
          </div>
        </div>

        {/* Max purchase info */}
        <div className="border border-dashed border-brand-500/40 rounded-2xl px-4 py-3">
          <p className="text-brand-400 text-sm text-center">
            You can purchase up to {pkg.maxPurchase} items.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-4 py-4 border-t border-surface-border bg-surface/95 backdrop-blur-md flex items-center justify-between"
           style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
        <div>
          <span className="text-gray-400 text-sm">Total amount: </span>
          <span className="text-brand-400 font-extrabold text-base">${totalPrice}</span>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-brand-500 text-white font-bold px-8 py-3 rounded-2xl text-sm"
        >
          Buy now
        </button>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-8">
          <div className="bg-surface-card border border-surface-border rounded-3xl w-full max-w-xs overflow-hidden">
            <div className="flex flex-col items-center px-6 pt-8 pb-2">
              <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                <span className="text-3xl">❓</span>
              </div>
              <p className="text-white font-bold text-base text-center mb-6">
                Are you sure you want to purchase this accelerator?
              </p>
            </div>
            <div className="flex border-t border-surface-border">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 text-gray-400 font-semibold text-sm border-r border-surface-border"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={loading}
                className="flex-1 py-4 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
