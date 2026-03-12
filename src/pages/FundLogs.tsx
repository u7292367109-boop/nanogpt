import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  created_at: string
  note: string | null
}

const TYPE_LABELS: Record<string, string> = {
  yield:       'Daily Yield',
  task_profit: 'Task Profit',
  deposit:     'Deposit',
  withdrawal:  'Withdrawal',
  purchase:    'Purchase',
  referral:    'Referral Bonus',
}

const FILTER_OPTIONS = ['All', 'Yield', 'Task Profit', 'Deposit', 'Withdrawal', 'Purchase']

export default function FundLogs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setTransactions(data ?? [])
        setLoading(false)
      })
  }, [user])

  const filtered = transactions.filter(tx => {
    if (filter === 'All') return true
    const label = TYPE_LABELS[tx.type] ?? tx.type
    return label.toLowerCase() === filter.toLowerCase()
  })

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md"
           style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white">
          <ChevronLeft size={22} className="text-gray-400" />
        </button>
        <span className="text-white font-bold text-base">Fund Logs</span>
        <div className="w-9" />
      </div>

      {/* Filter bar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="text-white font-bold text-sm">Data Overview</p>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1.5 border border-surface-border rounded-xl px-3 py-1.5 text-white text-sm font-semibold"
          >
            {filter}
            <ChevronDown size={14} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-surface-card border border-surface-border rounded-xl overflow-hidden z-50 shadow-card">
              {FILTER_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setFilter(opt); setShowFilter(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    filter === opt ? 'text-brand-400 font-bold bg-brand-500/10' : 'text-gray-400 hover:bg-surface-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mx-4 bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-3 px-4 py-2.5 border-b border-surface-border">
          <span className="text-gray-500 text-xs font-semibold">Category</span>
          <span className="text-gray-500 text-xs font-semibold text-center">Amount</span>
          <span className="text-gray-500 text-xs font-semibold text-right">Time</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-24 h-24 flex items-center justify-center">
              <span className="text-6xl">📦</span>
            </div>
            <p className="text-gray-500 text-sm">– No transactions found –</p>
          </div>
        ) : (
          filtered.map(tx => (
            <div key={tx.id} className="grid grid-cols-3 px-4 py-3 border-b border-surface-border last:border-0 items-center">
              <div>
                <p className="text-white text-xs font-semibold">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                {tx.note && <p className="text-gray-500 text-[10px] mt-0.5 truncate max-w-[90px]">{tx.note}</p>}
              </div>
              <p className={`text-sm font-bold text-center ${tx.amount >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
                {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(3)}
              </p>
              <p className="text-gray-500 text-[10px] text-right leading-relaxed">{formatTime(tx.created_at)}</p>
            </div>
          ))
        )}
      </div>

      <div className="pb-8" />
    </div>
  )
}
