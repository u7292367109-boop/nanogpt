import { useEffect, useState } from 'react'
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react'
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
}

const STATUS_ICONS: Record<string, { icon: typeof Clock, color: string }> = {
  pending: { icon: Clock, color: 'text-amber-400' },
  active: { icon: Clock, color: 'text-blue-400' },
  completed: { icon: CheckCircle, color: 'text-green-400' },
  failed: { icon: XCircle, color: 'text-red-400' },
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setOrders(data)
      })
    }
  }, [user])

  return (
    <Layout title="My Orders" showBack showActions={false}>
      <div className="px-4 pt-4">
        {orders.length === 0 ? (
          <div className="card text-center py-14 mt-4">
            <ShoppingBag size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No orders yet</p>
            <p className="text-gray-600 text-sm mt-1">Open a task to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo = STATUS_ICONS[order.status] ?? STATUS_ICONS.pending
              const Icon = statusInfo.icon
              return (
                <div key={order.id} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold capitalize">{order.task_type} Task</p>
                      <p className="text-gray-500 text-xs mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                      <Icon size={14} />
                      <span className="text-xs capitalize">{order.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                    <div>
                      <p className="text-xs text-gray-400">Investment</p>
                      <p className="text-white font-bold">{order.investment_amount} USDT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Return Rate</p>
                      <p className="text-amber-400 font-bold">{order.return_rate}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Expected</p>
                      <p className="text-green-400 font-bold">
                        {(order.investment_amount * order.return_rate / 100).toFixed(2)} USDT
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
