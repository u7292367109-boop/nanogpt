import { useState, useEffect, useRef } from 'react'
import { Copy, CheckCircle, ChevronLeft, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

// ── Wallet addresses per network ─────────────────────────────────────────
// Update WALLET_ADDRESS with the real Trust Wallet TRC-20 address
const WALLET_ADDRESS = 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'

const NETWORKS = [
  {
    id: 'USDT-TRC20',
    label: 'USDT',
    sub: 'TRC-20 · TRON',
    badge: 'Recommended',
    icon: '🟢',
    minDeposit: 10,
    fee: 'Free',
    wallet: WALLET_ADDRESS,
    confirmations: '~1 min',
  },
  {
    id: 'USDT-ERC20',
    label: 'USDT',
    sub: 'ERC-20 · Ethereum',
    badge: '',
    icon: '🔵',
    minDeposit: 50,
    fee: '~$5',
    wallet: WALLET_ADDRESS,
    confirmations: '~3 min',
  },
  {
    id: 'USDT-BEP20',
    label: 'USDT',
    sub: 'BEP-20 · BSC',
    badge: '',
    icon: '🟡',
    minDeposit: 10,
    fee: 'Free',
    wallet: WALLET_ADDRESS,
    confirmations: '~1 min',
  },
]

const PRESETS = [50, 100, 500, 1000]

// Simple countdown timer
function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(s => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])
  const m = String(Math.floor(remaining / 60)).padStart(2, '0')
  const s = String(remaining % 60).padStart(2, '0')
  return `${m}:${s}`
}

function CheckoutStep({
  network, amount, onBack, onConfirm, submitting,
}: {
  network: typeof NETWORKS[0]
  amount: string
  onBack: () => void
  onConfirm: () => void
  submitting: boolean
}) {
  const [copied, setCopied] = useState(false)
  const timer = useCountdown(30 * 60) // 30-min window

  function copy() {
    navigator.clipboard.writeText(network.wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="px-4 pt-3 pb-6 space-y-4">

      {/* Back row */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 active:text-white transition-colors">
        <ChevronLeft size={18} />
        <span className="text-sm">Change network / amount</span>
      </button>

      {/* Order card */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-900/70 via-green-950/50 to-surface-card border border-brand-500/25 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Summary</p>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <Clock size={11} />
            <span>{timer}</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Amount to send</span>
            <span className="text-brand-400 font-extrabold text-xl">{amount} <span className="text-sm text-gray-400">USDT</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Network</span>
            <span className="text-white text-xs font-bold">{network.sub}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Fee</span>
            <span className="text-white text-xs font-bold">{network.fee}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Est. arrival</span>
            <span className="text-brand-400 text-xs font-bold">{network.confirmations}</span>
          </div>
        </div>
      </div>

      {/* QR + Address */}
      <div className="card text-center space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Send exactly <span className="text-white">{amount} USDT</span> to this address
        </p>

        {/* QR code visual */}
        <div className="w-48 h-48 bg-white rounded-2xl mx-auto flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(0,210,106,0.15)]">
          <svg viewBox="0 0 256 256" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Top-left finder */}
            <rect x="10" y="10" width="70" height="70" rx="6" fill="#111" />
            <rect x="22" y="22" width="46" height="46" rx="3" fill="white" />
            <rect x="32" y="32" width="26" height="26" rx="2" fill="#111" />
            {/* Top-right finder */}
            <rect x="176" y="10" width="70" height="70" rx="6" fill="#111" />
            <rect x="188" y="22" width="46" height="46" rx="3" fill="white" />
            <rect x="198" y="32" width="26" height="26" rx="2" fill="#111" />
            {/* Bottom-left finder */}
            <rect x="10" y="176" width="70" height="70" rx="6" fill="#111" />
            <rect x="22" y="188" width="46" height="46" rx="3" fill="white" />
            <rect x="32" y="198" width="26" height="26" rx="2" fill="#111" />
            {/* Data modules */}
            {[96,104,112,120,128,136,144,152,160,96,112,128,144,160,100,108,116,124,132,140,148,156,
              100,120,140,160,104,112,124,136,148,108,116,128,140,152,112,120,132,144,116,124,136,148,
              160,120,128,140,152,124,132,144,128,136,148,160,132,140,152,136,144,140,148,160].map((x, i) => (
              <rect key={i} x={x} y={80 + (i % 13) * 12} width="8" height="8" rx="1" fill="#111" />
            ))}
          </svg>
        </div>

        {/* Address box */}
        <div className="bg-surface-muted rounded-xl px-4 py-3 flex items-start gap-3 text-left">
          <p className="flex-1 text-xs text-gray-200 font-mono break-all leading-relaxed">{network.wallet}</p>
          <button
            onClick={copy}
            className={`shrink-0 p-2 rounded-lg transition-all ${
              copied ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-card text-gray-400 active:text-white'
            }`}
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
        </div>
        {copied && (
          <p className="text-brand-400 text-xs font-semibold fade-in">✓ Address copied!</p>
        )}
      </div>

      {/* Steps */}
      <div className="card space-y-3">
        <p className="section-title mb-0">Steps to complete</p>
        {[
          'Copy the wallet address above',
          `Open your wallet app and select ${network.sub.split('·')[1]?.trim()} network`,
          `Send exactly ${amount} USDT to the address`,
          'Return here and tap the button below',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xs text-brand-400 font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-gray-400 text-sm leading-snug">{step}</p>
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        disabled={submitting}
        className="btn-primary shadow-brand disabled:opacity-60"
      >
        {submitting
          ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
          : <>✓ I've Completed Payment</>}
      </button>
      <p className="text-center text-xs text-gray-600">
        Funds will be credited within 1–5 minutes after blockchain confirmation
      </p>
    </div>
  )
}

export default function Deposit() {
  const { user, refreshAssets } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedNet, setSelectedNet] = useState('USDT-TRC20')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const network = NETWORKS.find(n => n.id === selectedNet)!
  const amt = parseFloat(amount) || 0
  const canProceed = amt >= network.minDeposit

  function handleProceed() {
    if (!canProceed) return
    setStep(2)
  }

  async function handleConfirmPaid() {
    if (!user || submitting) return
    setSubmitting(true)
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amt,
      status: 'pending',
    })
    // Credit vault_balance immediately so user can start tasks
    var fr = await supabase.from('assets').select('vault_balance').eq('user_id', user.id).single()
    if (fr.data) await supabase.from('assets').update({ vault_balance: parseFloat(((fr.data.vault_balance||0)+amt).toFixed(3)) }).eq('user_id', user.id)
    await refreshAssets()
    setSubmitting(false)
    setDone(true)
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <Layout title="Deposit" showBack showActions={false}>
        <div className="px-4 pt-4">
          <div className="card text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500/30 flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-brand-400" />
            </div>
            <div>
              <h3 className="text-white font-extrabold text-xl mb-1">Payment Submitted</h3>
              <p className="text-gray-400 text-sm">
                Your deposit of <span className="text-white font-bold">{amount} USDT</span> is being processed.
              </p>
            </div>
            <div className="bg-surface-muted rounded-2xl p-4 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span className="text-amber-400 font-bold">Pending Confirmation</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Network</span>
                <span className="text-white font-semibold">{network.sub}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Est. arrival</span>
                <span className="text-brand-400 font-semibold">{network.confirmations}</span>
              </div>
            </div>
            <button
              onClick={() => { setStep(1); setAmount(''); setDone(false) }}
              className="btn-secondary text-sm"
            >
              Make Another Deposit
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Step 2: Checkout ─────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <Layout title="Payment" showBack={false} showActions={false}>
        <CheckoutStep
          network={network}
          amount={amount}
          onBack={() => setStep(1)}
          onConfirm={handleConfirmPaid}
          submitting={submitting}
        />
      </Layout>
    )
  }

  // ── Step 1: Select network + amount ──────────────────────────────────────
  return (
    <Layout title="Deposit" showBack showActions={false}>
      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Network selection */}
        <div>
          <p className="section-title">Select Network</p>
          <div className="space-y-2.5">
            {NETWORKS.map(n => (
              <button
                key={n.id}
                onClick={() => setSelectedNet(n.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                  selectedNet === n.id
                    ? 'bg-brand-500/10 border-brand-500/50 shadow-brand-sm'
                    : 'bg-surface-card border-surface-border'
                }`}
              >
                <span className="text-2xl">{n.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm">{n.label}</p>
                    {n.badge && (
                      <span className="text-[10px] font-bold text-brand-400 bg-brand-500/15 border border-brand-500/30 px-1.5 py-0.5 rounded-full">
                        {n.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{n.sub}</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-xs text-gray-500">Min: <span className="text-white">{n.minDeposit}</span></p>
                  <p className="text-xs text-gray-500">Fee: <span className={n.fee === 'Free' ? 'text-brand-400' : 'text-white'}>{n.fee}</span></p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  selectedNet === n.id ? 'border-brand-400' : 'border-gray-600'
                }`}>
                  {selectedNet === n.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <p className="section-title">Deposit Amount</p>
          <div className="card space-y-3">
            <div className="relative">
              <input
                type="number"
                className="input-field pr-20 text-xl font-extrabold"
                placeholder={`Min. ${network.minDeposit}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min={network.minDeposit}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">USDT</span>
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(v.toString())}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    amount === v.toString()
                      ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                      : 'bg-surface-muted text-gray-500 border-surface-border'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Estimated credit */}
            {amt > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                <span className="text-xs text-gray-500">You will receive</span>
                <span className="text-brand-400 font-extrabold">{amt.toFixed(2)} USDT</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="card bg-amber-500/10 border-amber-500/20">
          <div className="flex gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-xs font-bold mb-0.5">Important Notice</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Only send <strong className="text-white">USDT</strong> via the{' '}
                <strong className="text-white">{network.sub}</strong> network to avoid permanent loss.
                Minimum deposit is <strong className="text-white">{network.minDeposit} USDT</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className="btn-primary shadow-brand disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Proceed to Payment
        </button>
      </div>
    </Layout>
  )
}
