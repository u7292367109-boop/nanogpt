import { useEffect, useState } from 'react'
import { ShoppingBag, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Order {
  id: string
  task_type: string
  investment_amount: number
  return_rate: number
  status: string
  created_at: string
  completed_at: string | null
}

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  note: string | null
  created_at: string
}

const STATUS_META: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending:   { icon: Clock,         color: 'text-amber-400',  label: 'Pending' },
  active:    { icon: RefreshCw,     color: 'text-blue-400',   label: 'Processing' },
  completed: { icon: CheckCircle,   color: 'text-brand-400',  label: 'Completed' },
  failed:    { icon: XCircle,       color: 'text-red-400',    label: 'Failed' },
}

const TYPE_EMOJI: Record<string, string> = {
  text:        '📝',
  tabular:     '📊',
  picture:     '🖼️',
  video:       '🎥',
  accelerator: '🚀',
}

const TX_TYPE_LABEL: Record<string, string> = {
  deposit:      '↓ Deposit',
  withdrawal:   '↑ Withdrawal',
  yield:        '⚡ Daily Yield',
  task_profit:  '✅ Task Profit',
  team_reward:  '👥 Team Reward',
  accelerator:  '🚀 Accelerator Purchase',
}

export default function Orders() {
  const { user } = useAuth()
  const [tab, setTab]               = useState<'orders' | 'history'>('orders')
  const [orders, setOrders]         = useState<Order[]>([])
  const [transactions, setTx]       = useState<Transaction[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([
      supabase.from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase.from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]).then(([ordRes, txRes]) => {
      if (ordRes.data) setOrders(ordRes.data)
      if (txRes.data)  setTx(txRes.data)
      setLoading(false)
    })
  }, [user])

  return (
    <Layout title="My Orders" showBack showActions={false}>
      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {(['orders', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === t
                ? 'bg-brand-500 text-white'
                : 'bg-surface-muted text-gray-500 border border-surface-border'
            }`}
          >
            {t === 'orders' ? '📋 Task Orders' : '📜 History'}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'orders' ? (
          // Filter out accelerator orders — they're not tasks
          (() => { const taskOrders = orders.filter(o => o.task_type !== 'accelerator'); return (
          taskOrders.length === 0 ? (
            <div className="card text-center py-14 mt-2">
              <ShoppingBag size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No task orders yet</p>
              <p className="text-gray-600 text-sm mt-1">Open a task in the Task Center to get started</p>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {taskOrders.map((order) => {
                const meta    = STATUS_META[order.status] ?? STATUS_META.pending
                const Icon    = meta.icon
                const profit  = parseFloat(((order.investment_amount * order.return_rate / 100) - order.investment_amount).toFixed(2))
                const total   = parseFloat((order.investment_amount * order.return_rate / 100).toFixed(2))

                return (
                  <div key={order.id} className={`card ${order.status === 'active' ? 'border-brand-500/30' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-xl">
                          {TYPE_EMOJI[order.task_type] ?? '📋'}
                        </div>
                        <div>
                          <p className="text-white font-bold capitalize">{order.task_type} Task</p>
                          <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${meta.color}`}>
                        <Icon size={13} className={order.status === 'active' ? 'animate-spin' : ''} />
                        <span className="text-xs font-bold">{meta.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-border">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Invested</p>
                        <p className="text-white font-bold text-sm">{Number(order.investment_amount).toFixed(2)}</p>
                        <p className="text-[10px] text-gray-600">USDT</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Rate</p>
                        <p className="text-amber-400 font-bold text-sm">{Number(order.return_rate).toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">
                          {order.status === 'completed' ? 'Profit' : 'Expected'}
                        </p>
                        <p className={`font-bold text-sm ${order.status === 'completed' ? 'text-brand-400' : 'text-gray-400'}`}>
                          +{profit.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-gray-600">USDT</p>
                      </div>
                    </div>

                    {order.status === 'completed' && (
                      <div className="mt-2 pt-2 border-t border-surface-border flex items-center justify-between">
                        <span className="text-xs text-gray-500">Total received</span>
                        <span className="text-brand-400 font-extrabold">{total.toFixed(2)} USDT</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
          )})()
        ) : (
          transactions.length === 0 ? (
            <div className="card text-center py-14 mt-2">
              <ShoppingBag size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No transactions yet</p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden mt-2">
              {transactions.map((tx, i) => {
                const positive = tx.amount > 0
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < transactions.length - 1 ? 'border-b border-surface-border' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${positive ? 'bg-brand-500/10' : 'bg-red-500/10'}`}>
                      {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : tx.type === 'yield' ? '⚡' : tx.type === 'task_profit' ? '✅' : tx.type === 'accelerator' ? '🚀' : '👥'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{TX_TYPE_LABEL[tx.type] ?? tx.type}</p>
                      <p className="text-gray-500 text-xs">{new Date(tx.created_at).toLocaleString()}</p>
                      {tx.note && <p className="text-gray-600 text-[10px] mt-0.5">{tx.note}</p>}
                    </div>
                    <div className="text-right">
                      <p className={`font-extrabold text-sm ${positive ? 'text-brand-400' : 'text-red-400'}`}>
                        {positive ? '+' : ''}{Number(tx.amount).toFixed(3)}
                      </p>
                      <p className="text-gray-600 text-[10px]">USDT</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </Layout>
  )
}
