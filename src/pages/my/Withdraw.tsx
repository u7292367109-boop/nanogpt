import { useState } from 'react'
import { ArrowUpFromLine, Info, Loader2, CheckCircle } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatUSDT } from '../../lib/utils'
import { pushAndRecord } from '../../lib/notify'

const MIN_WITHDRAW = 10
const FEE = 1

const MIN_WITHDRAW = 10
const FEE = 1

export default function Withdraw() {
  const { user, assets, refreshAssets } = useAuth()
  const [address, setAddress] = useState('')
  const [amount, setAmount]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const available = assets?.withdrawal_balance ?? 0
  const amt       = parseFloat(amount) || 0
  const net       = Math.max(0, amt - FEE)

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!address.trim()) { setError('Please enter a wallet address'); return }
    if (amt < MIN_WITHDRAW) { setError(`Minimum withdrawal is ${MIN_WITHDRAW} USDT`); return }
    if (amt > available) { setError('Insufficient available balance'); return }

    setLoading(true)

    await supabase.from('transactions').insert({
      user_id: user!.id,
      type:    'withdrawal',
      amount:  -amt,
      status:  'pending',
      note:    `Withdraw to ${address.slice(0, 8)}…`,
    })

    await supabase.from('assets').update({
      withdrawal_balance: parseFloat((available - amt).toFixed(3)),
    }).eq('user_id', user!.id)

    await refreshAssets()
    // Push notification
    await pushAndRecord(
      user!.id,
      '📤 Withdrawal Submitted',
      `Your withdrawal of ${amt.toFixed(2)} USDT is being processed. You will receive ${net.toFixed(2)} USDT.`,
      'service',
    )
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <Layout title="Withdraw" showBack showActions={false}>
        <div className="px-4 pt-6">
          <div className="card text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500/30 flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-brand-400" />
            </div>
            <div>
              <h3 className="text-white font-extrabold text-xl mb-1">Withdrawal Submitted</h3>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-bold">{amt.toFixed(2)} USDT</span> withdrawal is being processed.
              </p>
            </div>
            <div className="bg-surface-muted rounded-2xl p-4 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span className="text-amber-400 font-bold">Pending</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Network fee</span>
                <span className="text-white font-semibold">{FEE} USDT</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">You receive</span>
                <span className="text-brand-400 font-bold">{net.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Est. processing</span>
                <span className="text-white font-semibold">1–3 business days</span>
              </div>
            </div>
            <button
              onClick={() => { setSuccess(false); setAmount(''); setAddress('') }}
              className="btn-secondary text-sm"
            >
              Make Another Withdrawal
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Withdraw" showBack showActions={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Balance */}
        <div className="card bg-gradient-to-br from-brand-900/40 to-brand-900/40 border-brand-500/20">
          <p className="text-xs text-gray-400 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-white">
            {formatUSDT(available)}
            <span className="text-lg text-gray-400 ml-1">USDT</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">From completed tasks + daily yield</p>
        </div>

        {/* Notice */}
        <div className="card bg-amber-500/10 border-amber-500/20">
          <div className="flex gap-2">
            <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs leading-relaxed">
              Withdrawals are processed to USDT (TRC-20) addresses only.
              Minimum: <strong className="text-white">{MIN_WITHDRAW} USDT</strong>.
              Network fee: <strong className="text-white">{FEE} USDT</strong>.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleWithdraw} className="card space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Wallet Address (TRC-20)</label>
            <input
              className="input-field"
              placeholder="Enter USDT TRC-20 address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Amount (USDT)</label>
            <div className="relative">
              <input
                type="number"
                className="input-field pr-16"
                placeholder={`Min. ${MIN_WITHDRAW} USDT`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min={MIN_WITHDRAW}
                required
              />
              <button
                type="button"
                onClick={() => setAmount(available.toFixed(2))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-400 font-semibold"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Net amount preview */}
          {amt >= MIN_WITHDRAW && (
            <div className="bg-surface-muted rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Amount</span>
                <span className="text-white font-semibold">{amt.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Network fee</span>
                <span className="text-red-400 font-semibold">-{FEE} USDT</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-surface-border">
                <span className="text-gray-400 font-bold">You receive</span>
                <span className="text-brand-400 font-extrabold">{net.toFixed(2)} USDT</span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || amt < MIN_WITHDRAW || amt > available}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
              : <><ArrowUpFromLine size={16} /> Withdraw {amt > 0 ? `${amt.toFixed(2)} USDT` : 'USDT'}</>}
          </button>
        </form>
      </div>
    </Layout>
  )
}
