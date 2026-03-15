import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { PACKAGE_INFO, PID_TO_CATEGORY, calcLevel } from '../lib/packages'

const ADMIN_EMAIL = 'affiliatesflow@gmail.com'

export default function PowerItemsBuy() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, profile, assets, refreshAssets, refreshProfile } = useAuth()
  const isAdmin = user?.email === ADMIN_EMAIL

  const pid    = searchParams.get('pid') ?? 'text-1'
  const pkg    = PACKAGE_INFO[pid] ?? PACKAGE_INFO['text-1']

  const [qty, setQty]           = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const maxQty     = isAdmin ? 99 : pkg.maxPurchase
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

    const { data: fresh } = await supabase.from('assets').select('*').eq('user_id', user.id).maybeSingle()
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

    // Create order record — use DB-allowed category name for task_type
    // (DB has CHECK constraint: only 'text','tabular','picture','video' are allowed)
    const taskCategory = PID_TO_CATEGORY[pid] ?? 'text'
    const { error: orderErr } = await supabase.from('orders').insert({
      user_id:           user.id,
      task_type:         taskCategory,
      investment_amount: totalPrice,
      return_rate:       pkg.totalYield,
      status:            'active',
      started_at:        new Date().toISOString(),
    })

    if (orderErr) {
      // Roll back assets update if order creation failed
      await supabase.from('assets').update({
        vault_balance: parseFloat(((fresh.vault_balance ?? 0)).toFixed(2)),
        task_balance:  parseFloat(((fresh.task_balance ?? 0)).toFixed(2)),
      }).eq('user_id', user.id)
      setError('Order creation failed: ' + orderErr.message + '. Your balance has been restored.')
      setLoading(false)
      setShowConfirm(false)
      return
    }

    // Create transaction record
    const { error: txErr } = await supabase.from('transactions').insert({
      user_id: user.id,
      type:    'purchase',
      amount:  -totalPrice,
      status:  'approved',
      note:    `Purchased ${qty}x ${pkg.name}`,
    })
    if (txErr) console.warn('Transaction record failed (non-critical):', txErr.message)

    // ── Level progression ──────────────────────────────────────────────────
    // Calculate new level from total investment across all orders
    const { data: allOrders } = await supabase
      .from('orders')
      .select('investment_amount')
      .eq('user_id', user.id)
    const totalInvested = (allOrders ?? []).reduce(
      (sum, o) => sum + (parseFloat(String(o.investment_amount)) || 0), 0
    )
    const newLevel = calcLevel(totalInvested)
    const currentLevel = profile?.level ?? 0
    if (newLevel > currentLevel) {
      await supabase.from('profiles').update({ level: newLevel }).eq('id', user.id)
      await refreshProfile()
    }

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
        {/* Vault balance display */}
        <div className="bg-surface-card border border-surface-border rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Your Vault Balance</p>
            <p className={`font-extrabold text-base ${(assets?.vault_balance ?? 0) >= totalPrice ? 'text-brand-400' : 'text-red-400'}`}>
              {(assets?.vault_balance ?? 0).toFixed(3)} USDT
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Required</p>
            <p className="text-white font-bold text-base">{totalPrice.toFixed(2)} USDT</p>
          </div>
        </div>

        {/* Product card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-surface-border">
            <div>
              <p className="text-brand-400 font-bold text-sm">{pkg.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{pkg.deadlines}-day training cycle</p>
            </div>
            <div className="bg-brand-500/15 border border-brand-500/30 rounded-xl px-3 py-1.5 text-right">
              <p className="text-brand-400 font-extrabold text-lg leading-none">+{pkg.totalYield}%</p>
              <p className="text-gray-500 text-[10px]">total yield</p>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-surface-border">
            <div className="px-4 py-3">
              <p className="text-[10px] text-gray-500">Duration</p>
              <p className="text-white font-bold text-sm">{pkg.deadlines} Days</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-gray-500">Daily Earnings</p>
              <p className="text-brand-400 font-bold text-sm">+{pkg.dailyEarnings.toFixed(2)} USDT</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-gray-500">Training Hours</p>
              <p className="text-white font-bold text-sm">{pkg.dailyHours} H / day</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-gray-500">Total Earnings</p>
              <p className="text-white font-bold text-sm">{(pkg.totalEarnings * qty).toLocaleString()} USDT</p>
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
                onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                className="w-8 h-8 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-center text-white font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <span className="text-gray-500 text-xs">Price:&nbsp;</span>
            <span className="text-red-400 font-bold text-sm">{pkg.price * qty} USDT</span>
          </div>
        </div>

        {/* Max purchase info */}
        <div className="border border-dashed border-brand-500/40 rounded-2xl px-4 py-3">
          <p className="text-brand-400 text-sm text-center">
            You can purchase up to {maxQty} items.
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
          <span className="text-gray-400 text-sm">Total: </span>
          <span className="text-brand-400 font-extrabold text-base">{totalPrice} USDT</span>
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
