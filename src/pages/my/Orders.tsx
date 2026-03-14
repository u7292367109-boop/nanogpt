import { useEffect, useState, useCallback } from 'react'
import { ShoppingBag, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { getPackageName, getTypeEmoji } from '../../lib/packages'

const DEADLINE_DAYS = 60

interface Order {
  id: string
  task_type: string
  investment_amount: number
  return_rate: number
  status: string
  created_at: string
  started_at: string | null
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
  pending:   { icon: Clock,       color: 'text-amber-400', label: 'Pending'   },
  active:    { icon: RefreshCw,   color: 'text-blue-400',  label: 'Active'    },
  completed: { icon: CheckCircle, color: 'text-brand-400', label: 'Completed' },
  failed:    { icon: XCircle,     color: 'text-red-400',   label: 'Failed'    },
}

const TX_TYPE_LABEL: Record<string, string> = {
  deposit:     '↓ Deposit',
  withdrawal:  '↑ Withdrawal',
  yield:       '⚡ Daily Yield',
  task_profit: '✅ Task Profit',
  team_reward: '👥 Team Reward',
  purchase:    '🛒 Task Purchase',
}

function getEndDate(order: Order): Date {
  const base = order.started_at ? new Date(order.started_at) : new Date(order.created_at)
  return new Date(base.getTime() + DEADLINE_DAYS * 24 * 60 * 60 * 1000)
}

function getDaysRemaining(order: Order): number {
  return Math.max(0, Math.ceil((getEndDate(order).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
}

function getProgressPct(order: Order): number {
  const base = order.started_at ? new Date(order.started_at) : new Date(order.created_at)
  const elapsed = Date.now() - base.getTime()
  const total = DEADLINE_DAYS * 24 * 60 * 60 * 1000
  return Math.min(100, Math.round((elapsed / total) * 100))
}

export default function Orders() {
  const { user } = useAuth()
  const [tab, setTab]         = useState<'orders' | 'history'>('orders')
  const [orders, setOrders]   = useState<Order[]>([])
  const [transactions, setTx] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [ordRes, txRes] = await Promise.all([
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])

    const fetchedOrders: Order[] = ordRes.data ?? []

    // Auto-complete expired active orders
    const expired = fetchedOrders.filter(o => o.status === 'active' && getDaysRemaining(o) === 0)
    if (expired.length > 0) {
      await Promise.all(expired.map(async (order) => {
        const total  = parseFloat((order.investment_amount * order.return_rate / 100).toFixed(2))
        const profit = parseFloat((total - order.investment_amount).toFixed(2))
        const { data: updated } = await supabase
          .from('orders')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', order.id).eq('status', 'active').select()
        if (updated && updated.length > 0) {
          const { data: assets } = await supabase
            .from('assets').select('task_balance,withdrawal_balance').eq('user_id', user.id).maybeSingle()
          if (assets) {
            await supabase.from('assets').update({
              task_balance:       parseFloat(Math.max(0, (assets.task_balance ?? 0) - order.investment_amount).toFixed(2)),
              withdrawal_balance: parseFloat(((assets.withdrawal_balance ?? 0) + total).toFixed(2)),
            }).eq('user_id', user.id)
          }
          await supabase.from('transactions').insert({
            user_id: user.id, type: 'task_profit', amount: profit, status: 'approved',
            note: `Task completed — ${order.task_type} node (60-day cycle)`,
          })
        }
      }))
      const refreshed = await supabase
        .from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setOrders(refreshed.data ?? [])
    } else {
      setOrders(fetchedOrders)
    }

    if (txRes.data) setTx(txRes.data)
    setLoading(false)
  }, [user])

  useEffect(() => { loadData() }, [loadData])

  return (
    <Layout title="My Orders" showBack showActions={false}>
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {(['orders', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === t ? 'bg-brand-500 text-white' : 'bg-surface-muted text-gray-500 border border-surface-border'
            }`}>
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
          orders.length === 0 ? (
            <div className="card text-center py-14 mt-2">
              <ShoppingBag size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No task orders yet</p>
              <p className="text-gray-600 text-sm mt-1">Open a task in the Task Center to get started</p>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {orders.map((order) => {
                const meta        = STATUS_META[order.status] ?? STATUS_META.pending
                const Icon        = meta.icon
                const profit      = parseFloat(((order.investment_amount * order.return_rate / 100) - order.investment_amount).toFixed(2))
                const total       = parseFloat((order.investment_amount * order.return_rate / 100).toFixed(2))
                const endDate     = getEndDate(order)
                const daysLeft    = getDaysRemaining(order)
                const progressPct = order.status === 'active' ? getProgressPct(order) : (order.status === 'completed' ? 100 : 0)

                return (
                  <div key={order.id} className={`card ${order.status === 'active' ? 'border-brand-500/30' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-xl">
                          {getTypeEmoji(order.task_type)}
                        </div>
                        <div>
                          <p className="text-white font-bold">{getPackageName(order.task_type, order.investment_amount, order.return_rate)}</p>
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

                    {order.status === 'active' && (
                      <div className="mt-3 pt-3 border-t border-surface-border space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500">{DEADLINE_DAYS}-day cycle progress</span>
                          <span className="text-brand-400 font-bold">{progressPct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
                          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span>Completes: {endDate.toLocaleDateString()}</span>
                          <span className={daysLeft <= 5 ? 'text-amber-400 font-bold' : ''}>
                            {daysLeft === 0 ? 'Completing…' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                          </span>
                        </div>
                      </div>
                    )}

                    {order.status === 'completed' && (
                      <div className="mt-2 pt-2 border-t border-surface-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Total received</span>
                          <span className="text-brand-400 font-extrabold">{total.toFixed(2)} USDT</span>
                        </div>
                        {order.completed_at && (
                          <p className="text-[10px] text-gray-600 mt-0.5 text-right">
                            Completed {new Date(order.completed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
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
                  <div key={tx.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < transactions.length - 1 ? 'border-b border-surface-border' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${positive ? 'bg-brand-500/10' : 'bg-red-500/10'}`}>
                      {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : tx.type === 'yield' ? '⚡' : tx.type === 'task_profit' ? '✅' : tx.type === 'purchase' ? '🛒' : '👥'}
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
