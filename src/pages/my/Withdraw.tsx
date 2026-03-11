import { useState } from 'react'
import { ArrowUpFromLine, Info, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatUSDT } from '../../lib/utils'

export default function Withdraw() {
  const { user, assets, refreshAssets } = useAuth()
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (amt < 10) { setError('Minimum withdrawal is 10 USDT'); return }
    if (amt > (assets?.withdrawal_balance ?? 0)) { setError('Insufficient balance'); return }
    if (!address) { setError('Please enter a wallet address'); return }

    setLoading(true)
    setError('')

    await supabase.from('transactions').insert({
      user_id: user!.id,
      type: 'withdrawal',
      amount: -amt,
      status: 'pending',
    })

    await supabase.from('assets').update({
      withdrawal_balance: (assets?.withdrawal_balance ?? 0) - amt,
    }).eq('user_id', user!.id)

    await refreshAssets()
    setLoading(false)
    setSuccess('Withdrawal request submitted! Processing in 1-3 business days.')
    setAmount('')
    setAddress('')
  }

  return (
    <Layout title="Withdraw" showBack showActions={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* Balance */}
        <div className="card bg-gradient-to-br from-brand-900/40 to-brand-900/40 border-brand-500/20">
          <p className="text-xs text-gray-400 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-white">
            {formatUSDT(assets?.withdrawal_balance ?? 0)}
            <span className="text-lg text-gray-400 ml-1">USDT</span>
          </p>
        </div>

        {/* Warning */}
        <div className="card bg-amber-500/10 border-amber-500/20">
          <div className="flex gap-2">
            <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs leading-relaxed">
              Withdrawals are processed to USDT (TRC-20) addresses only. Minimum: 10 USDT. Fee: 1 USDT.
            </p>
          </div>
        </div>

        {success ? (
          <div className="card text-center py-8">
            <ArrowUpFromLine size={36} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-semibold">{success}</p>
          </div>
        ) : (
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
                  placeholder="Min. 10 USDT"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(formatUSDT(assets?.withdrawal_balance ?? 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-400 font-semibold"
                >
                  MAX
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Funds Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter funds password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowUpFromLine size={16} />Withdraw USDT</>}
            </button>
          </form>
        )}
      </div>
    </Layout>
  )
}
