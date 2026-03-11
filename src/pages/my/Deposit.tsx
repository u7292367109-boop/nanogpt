import { useState } from 'react'
import { Copy, Info } from 'lucide-react'
import Layout from '../../components/Layout'

const WALLET_ADDRESS = 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'

export default function Deposit() {
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState('')

  function copyAddress() {
    navigator.clipboard.writeText(WALLET_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout title="Deposit" showBack showActions={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* Network info */}
        <div className="card bg-amber-500/10 border-amber-500/20">
          <div className="flex gap-2">
            <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-xs font-semibold mb-1">Important Notice</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Only send USDT (TRC-20) to this address. Sending other assets may result in permanent loss.
                Minimum deposit: 10 USDT.
              </p>
            </div>
          </div>
        </div>

        {/* QR placeholder */}
        <div className="card text-center">
          <p className="section-title mb-4">Deposit Address (USDT-TRC20)</p>
          <div className="w-40 h-40 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded grid grid-cols-8 gap-0.5 p-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
              ))}
            </div>
          </div>

          <div className="bg-surface-muted rounded-xl px-4 py-3 flex items-center gap-2">
            <p className="flex-1 text-xs text-gray-300 font-mono truncate">{WALLET_ADDRESS}</p>
            <button onClick={copyAddress} className="text-indigo-400 flex-shrink-0">
              <Copy size={14} />
            </button>
          </div>

          {copied && <p className="text-green-400 text-xs mt-2">✓ Address copied!</p>}
        </div>

        {/* Amount input */}
        <div className="card">
          <label className="text-xs text-gray-400 mb-1.5 block">Deposit Amount (USDT)</label>
          <div className="relative">
            <input
              type="number"
              placeholder="Enter amount"
              className="input-field pr-16"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="10"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">USDT</span>
          </div>
          <div className="flex gap-2 mt-3">
            {[50, 100, 500, 1000].map(v => (
              <button
                key={v}
                onClick={() => setAmount(v.toString())}
                className="flex-1 py-1.5 rounded-lg bg-surface-muted text-xs text-gray-300 font-medium"
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="card">
          <p className="section-title">How to Deposit</p>
          {[
            'Copy the wallet address above',
            'Open your crypto wallet or exchange',
            'Send USDT (TRC-20) to the address',
            'Funds arrive within 1-5 minutes',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xs text-indigo-400 font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-gray-400 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
