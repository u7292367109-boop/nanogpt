import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, ShoppingBag, DollarSign, LayoutDashboard,
  CheckCircle, XCircle, Clock, RefreshCw, Send,
  ChevronDown, ChevronUp, Loader2, LogOut, Search,
  ArrowDownCircle, ArrowUpCircle, BadgeCheck, AlertCircle,
  Megaphone, Wallet,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { adminSupabase } from '../lib/adminSupabase'

const ADMIN_EMAIL = 'affiliatesflow@gmail.com'

// ─── types ────────────────────────────────────────────────────────────────────
interface UserRow {
  id: string; email: string; username: string; uid: string
  level: number; referral_code: string; created_at: string
  vault_balance: number; task_balance: number
  withdrawal_balance: number; daily_yield: number; total_yield: number
  kyc_status: string
}
interface OrderRow {
  id: string; user_id: string; task_type: string
  investment_amount: number; return_rate: number
  status: string; created_at: string; completed_at: string | null
  username?: string; email?: string
}
interface TxRow {
  id: string; user_id: string; type: string; amount: number
  status: string; note: string | null; created_at: string
  username?: string; email?: string
}
interface KycRow {
  id: string; user_id: string; status: string; created_at: string
  username?: string; email?: string
}

type Tab = 'dashboard' | 'users' | 'orders' | 'deposits' | 'withdrawals' | 'kyc' | 'broadcast'

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) { return Number(n ?? 0).toFixed(2) }
function fmtDate(s: string) {
  return new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const STATUS_CHIP: Record<string, string> = {
  pending:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  active:     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  approved:   'bg-brand-500/15 text-brand-400 border-brand-500/30',
  completed:  'bg-brand-500/15 text-brand-400 border-brand-500/30',
  failed:     'bg-red-500/15 text-red-400 border-red-500/30',
  rejected:   'bg-red-500/15 text-red-400 border-red-500/30',
  verified:   'bg-brand-500/15 text-brand-400 border-brand-500/30',
  unverified: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
}
function Chip({ s }: { s: string }) {
  return (
    <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${STATUS_CHIP[s] ?? STATUS_CHIP.pending}`}>
      {s}
    </span>
  )
}

// ─── main component ───────────────────────────────────────────────────────────
export default function Admin() {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [depositToast, setDepositToast] = useState<{ amount: number } | null>(null)
  const [depositBadge, setDepositBadge] = useState(0)

  // guard: redirect non-admins once auth has resolved
  useEffect(() => {
    if (!loading && user && user.email !== ADMIN_EMAIL) navigate('/home')
  }, [user, loading, navigate])

  // Realtime: show alert whenever a new deposit is submitted
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return
    const channel = adminSupabase
      .channel('admin-deposit-alerts')
      .on(
        'postgres_changes' as never,
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: 'type=eq.deposit' },
        (payload: { new: TxRow }) => {
          const tx = payload.new
          setDepositToast({ amount: tx.amount })
          setDepositBadge(n => n + 1)
          setTimeout(() => setDepositToast(null), 8000)
        }
      )
      .subscribe()
    return () => { adminSupabase.removeChannel(channel) }
  }, [user])

  // Show spinner while auth is resolving
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Auth resolved but not admin
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Access denied</p>
          <button
            onClick={() => navigate('/login')}
            className="text-brand-400 text-sm hover:underline"
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
    { id: 'users',       label: 'Users',        icon: Users          },
    { id: 'orders',      label: 'Orders',       icon: ShoppingBag    },
    { id: 'deposits',    label: 'Deposits',     icon: ArrowDownCircle},
    { id: 'withdrawals', label: 'Withdrawals',  icon: ArrowUpCircle  },
    { id: 'kyc',         label: 'KYC',          icon: BadgeCheck     },
    { id: 'broadcast',   label: 'Broadcast',    icon: Megaphone      },
  ]

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col">

      {/* ── Deposit toast notification ── */}
      {depositToast && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-3 bg-[#0c1a0f] border border-brand-500/40 text-white rounded-2xl px-4 py-3 shadow-[0_0_30px_rgba(0,210,106,0.2)] animate-fade-in">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
            <ArrowDownCircle size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-brand-400">New Deposit!</p>
            <p className="text-xs text-gray-400">{depositToast.amount.toFixed(2)} USDT — pending confirmation</p>
          </div>
          <button
            onClick={() => setDepositToast(null)}
            className="ml-2 text-gray-600 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-surface-card border-b border-surface-border flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center">
            <LayoutDashboard size={15} className="text-brand-400" />
          </div>
          <span className="text-white font-bold text-sm md:text-base">UltraGPT Admin</span>
          <span className="hidden md:inline text-gray-600 text-xs ml-2">· {user.email}</span>
        </div>
        <button
          onClick={() => { signOut(); navigate('/login') }}
          className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-surface-border bg-surface-card/50 p-3 gap-0.5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id === 'deposits') setDepositBadge(0) }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full ${
                tab === id
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-surface-muted'
              }`}
            >
              <Icon size={15} />
              {label}
              {id === 'deposits' && depositBadge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {depositBadge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main content area ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile tab bar */}
          <div className="md:hidden flex gap-1 px-3 pt-3 pb-1 overflow-x-auto scrollbar-none">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  tab === id ? 'bg-brand-500 text-white' : 'bg-surface-muted text-gray-400 border border-surface-border'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-3 md:px-6 pb-10 max-w-6xl">
            {tab === 'dashboard'   && <DashboardTab />}
            {tab === 'users'       && <UsersTab />}
            {tab === 'orders'      && <OrdersTab />}
            {tab === 'deposits'    && <DepositsTab />}
            {tab === 'withdrawals' && <WithdrawalsTab />}
            {tab === 'kyc'         && <KycTab />}
            {tab === 'broadcast'   && <BroadcastTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState({
    totalUsers: 0, activeOrders: 0, pendingDeposits: 0,
    pendingWithdrawals: 0, totalDeposited: 0, totalTaskBalance: 0, pendingKyc: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [usersRes, ordersRes, txRes, kycRes, assetsRes] = await Promise.all([
        adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
        adminSupabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        adminSupabase.from('transactions').select('type,amount,status').in('type', ['deposit','withdrawal']),
        adminSupabase.from('kyc').select('id', { count: 'exact', head: true }).eq('status', 'unverified'),
        adminSupabase.from('assets').select('vault_balance,task_balance'),
      ])
      const txData = txRes.data ?? []
      const totalDeposited = txData.filter(t => t.type === 'deposit' && t.status !== 'rejected').reduce((s, t) => s + (t.amount || 0), 0)
      const pendingWithdrawals = txData.filter(t => t.type === 'withdrawal' && t.status === 'pending').length
      const pendingDeposits = txData.filter(t => t.type === 'deposit' && t.status === 'pending').length
      const totalTaskBalance = (assetsRes.data ?? []).reduce((s, a) => s + (a.task_balance || 0), 0)
      setStats({
        totalUsers: usersRes.count ?? 0,
        activeOrders: ordersRes.count ?? 0,
        pendingDeposits,
        pendingWithdrawals,
        totalDeposited,
        totalTaskBalance,
        pendingKyc: kycRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner />

  const cards = [
    { label: 'Total Users',          value: stats.totalUsers,             icon: Users,           color: 'text-blue-400'    },
    { label: 'Active Orders',         value: stats.activeOrders,           icon: RefreshCw,       color: 'text-brand-400'   },
    { label: 'Pending Deposits',      value: stats.pendingDeposits,        icon: ArrowDownCircle, color: 'text-amber-400'   },
    { label: 'Pending Withdrawals',   value: stats.pendingWithdrawals,     icon: ArrowUpCircle,   color: 'text-purple-400'  },
    { label: 'Total Deposited (USDT)',value: fmt(stats.totalDeposited),    icon: DollarSign,      color: 'text-brand-400'   },
    { label: 'Total Task Balance',    value: fmt(stats.totalTaskBalance),  icon: Wallet,          color: 'text-green-400'   },
    { label: 'Pending KYC',           value: stats.pendingKyc,             icon: BadgeCheck,      color: 'text-amber-400'   },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={16} className={color} />
            <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wide">{label}</span>
          </div>
          <p className="text-white font-extrabold text-xl">{value}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Users ────────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<UserRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [editVault, setEditVault] = useState('')
  const [editTask, setEditTask] = useState('')
  const [editWithdraw, setEditWithdraw] = useState('')
  const [editLevel, setEditLevel] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data: profiles } = await adminSupabase.from('profiles').select('*').order('id')
    const { data: assets   } = await adminSupabase.from('assets').select('*')
    const { data: kycs     } = await adminSupabase.from('kyc').select('user_id,status')
    const { data: authUsers } = await adminSupabase.auth.admin.listUsers()

    const assetMap = Object.fromEntries((assets ?? []).map(a => [a.user_id, a]))
    const kycMap   = Object.fromEntries((kycs   ?? []).map(k => [k.user_id, k.status]))
    const emailMap = Object.fromEntries((authUsers?.users ?? []).map(u => [u.id, u.email ?? '']))

    const rows: UserRow[] = (profiles ?? []).map(p => ({
      id: p.id, email: emailMap[p.id] ?? '', username: p.username, uid: p.uid,
      level: p.level ?? 0, referral_code: p.referral_code,
      created_at: p.created_at ?? '',
      vault_balance:      assetMap[p.id]?.vault_balance ?? 0,
      task_balance:       assetMap[p.id]?.task_balance ?? 0,
      withdrawal_balance: assetMap[p.id]?.withdrawal_balance ?? 0,
      daily_yield:        assetMap[p.id]?.daily_yield ?? 0,
      total_yield:        assetMap[p.id]?.total_yield ?? 0,
      kyc_status: kycMap[p.id] ?? 'unverified',
    }))
    setUsers(rows)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function startEdit(u: UserRow) {
    setEditing(u)
    setEditVault(String(u.vault_balance))
    setEditTask(String(u.task_balance))
    setEditWithdraw(String(u.withdrawal_balance))
    setEditLevel(String(u.level))
  }

  async function saveUser() {
    if (!editing) return
    setSaving(true)
    await Promise.all([
      adminSupabase.from('assets').update({
        vault_balance:      parseFloat(editVault)    || 0,
        task_balance:       parseFloat(editTask)     || 0,
        withdrawal_balance: parseFloat(editWithdraw) || 0,
      }).eq('user_id', editing.id),
      adminSupabase.from('profiles').update({
        level: parseInt(editLevel) || 0,
      }).eq('id', editing.id),
    ])
    setSaving(false)
    setEditing(null)
    load()
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.uid?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div className="pt-3 space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by username, email or UID…"
          className="w-full bg-surface-card border border-surface-border rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500/60"
        />
      </div>
      <p className="text-gray-600 text-xs">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-2">
        {filtered.map(u => (
          <div key={u.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-bold text-sm">{u.username}</p>
                <p className="text-gray-500 text-xs">{u.email}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">UID: {u.uid}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">LV.{u.level}</span>
                <Chip s={u.kyc_status} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-surface-border mb-3">
              <div>
                <p className="text-[10px] text-gray-500">Vault</p>
                <p className="text-white text-xs font-bold">{fmt(u.vault_balance)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Task</p>
                <p className="text-blue-400 text-xs font-bold">{fmt(u.task_balance)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Withdraw</p>
                <p className="text-brand-400 text-xs font-bold">{fmt(u.withdrawal_balance)}</p>
              </div>
            </div>
            <button
              onClick={() => startEdit(u)}
              className="w-full py-2 rounded-xl border border-surface-border text-gray-400 text-xs font-bold hover:text-white hover:border-brand-500/40 transition-all"
            >
              Edit Balances / Level
            </button>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-white font-bold">Edit: {editing.username}</h3>
            {[
              { label: 'Vault Balance (USDT)', val: editVault, set: setEditVault },
              { label: 'Task Balance (USDT)',  val: editTask,  set: setEditTask  },
              { label: 'Withdrawal Balance (USDT)', val: editWithdraw, set: setEditWithdraw },
              { label: 'Level (0–6)',          val: editLevel, set: setEditLevel },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <input
                  type="number" value={val} onChange={e => set(e.target.value)}
                  className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/60"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-surface-border text-gray-400 font-bold text-sm">Cancel</button>
              <button onClick={saveUser} disabled={saving} className="flex-1 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await adminSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (!data) { setLoading(false); return }

    const userIds = [...new Set(data.map(o => o.user_id))]
    const { data: profiles } = await adminSupabase.from('profiles').select('id,username').in('id', userIds)
    const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))

    setOrders(data.map(o => ({ ...o, username: profileMap[o.user_id] ?? '—' })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function completeOrder(order: OrderRow) {
    setCompleting(order.id)
    const profit = parseFloat((order.investment_amount * order.return_rate / 100).toFixed(2))
    const total  = parseFloat((order.investment_amount + profit).toFixed(2))

    const { data: assets } = await adminSupabase
      .from('assets').select('task_balance,withdrawal_balance').eq('user_id', order.user_id).maybeSingle()

    if (assets) {
      const newTask  = parseFloat(((assets.task_balance ?? 0) - order.investment_amount).toFixed(2))
      const newWithd = parseFloat(((assets.withdrawal_balance ?? 0) + total).toFixed(2))

      await Promise.all([
        adminSupabase.from('assets').update({
          task_balance: Math.max(0, newTask),
          withdrawal_balance: newWithd,
        }).eq('user_id', order.user_id),

        adminSupabase.from('orders').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        }).eq('id', order.id),

        adminSupabase.from('transactions').insert({
          user_id: order.user_id,
          type: 'task_profit',
          amount: profit,
          status: 'approved',
          note: `Order completed — ${order.task_type} task`,
        }),
      ])
    }
    setCompleting(null)
    load()
  }

  const filtered = orders.filter(o => filterStatus === 'all' || o.status === filterStatus)

  if (loading) return <Spinner />

  return (
    <div className="pt-3 space-y-3">
      <div className="flex gap-2 flex-wrap">
        {['all','active','pending','completed','failed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${filterStatus === s ? 'bg-brand-500 text-white border-brand-500' : 'bg-surface-muted text-gray-400 border-surface-border'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <p className="text-gray-600 text-xs">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-2">
        {filtered.map(o => {
          const profit = parseFloat((o.investment_amount * o.return_rate / 100).toFixed(2))
          return (
            <div key={o.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-bold text-sm capitalize">{o.task_type} task</p>
                  <p className="text-gray-500 text-xs">{o.username}</p>
                  <p className="text-gray-600 text-[10px]">{fmtDate(o.created_at)}</p>
                </div>
                <Chip s={o.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-surface-border">
                <div>
                  <p className="text-[10px] text-gray-500">Invested</p>
                  <p className="text-white text-xs font-bold">{fmt(o.investment_amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Rate</p>
                  <p className="text-amber-400 text-xs font-bold">{o.return_rate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Profit</p>
                  <p className="text-brand-400 text-xs font-bold">+{fmt(profit)}</p>
                </div>
              </div>
              {o.status === 'active' && (
                <button
                  onClick={() => completeOrder(o)}
                  disabled={completing === o.id}
                  className="mt-3 w-full py-2.5 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-500/30 transition-all"
                >
                  {completing === o.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  Mark Complete (+{fmt(profit)} USDT profit)
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Deposits ─────────────────────────────────────────────────────────────────
function DepositsTab() {
  const [txs, setTxs] = useState<TxRow[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await adminSupabase
      .from('transactions')
      .select('*')
      .eq('type', 'deposit')
      .order('created_at', { ascending: false })
      .limit(200)

    if (!data) { setLoading(false); return }
    const userIds = [...new Set(data.map(t => t.user_id))]
    const { data: profiles } = await adminSupabase.from('profiles').select('id,username').in('id', userIds)
    const pm = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))
    setTxs(data.map(t => ({ ...t, username: pm[t.user_id] ?? '—' })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function approveDeposit(tx: TxRow) {
    setActing(tx.id)
    // Vault balance was already credited on submit — just mark approved
    await adminSupabase.from('transactions').update({ status: 'approved' }).eq('id', tx.id)
    setActing(null)
    load()
  }

  async function rejectDeposit(tx: TxRow) {
    setActing(tx.id)
    // Deduct vault_balance since we're rejecting
    const { data: assets } = await adminSupabase
      .from('assets').select('vault_balance').eq('user_id', tx.user_id).maybeSingle()
    if (assets) {
      await adminSupabase.from('assets').update({
        vault_balance: parseFloat(Math.max(0, (assets.vault_balance ?? 0) - tx.amount).toFixed(2))
      }).eq('user_id', tx.user_id)
    }
    await adminSupabase.from('transactions').update({ status: 'rejected' }).eq('id', tx.id)
    setActing(null)
    load()
  }

  if (loading) return <Spinner />

  return (
    <div className="pt-3 space-y-2">
      <p className="text-gray-600 text-xs">{txs.length} deposit{txs.length !== 1 ? 's' : ''}</p>
      {txs.map(tx => (
        <div key={tx.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white font-bold text-sm">{tx.username}</p>
              <p className="text-brand-400 font-extrabold">+{fmt(tx.amount)} USDT</p>
              <p className="text-gray-600 text-[10px]">{fmtDate(tx.created_at)}</p>
            </div>
            <Chip s={tx.status} />
          </div>
          {tx.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => rejectDeposit(tx)}
                disabled={acting === tx.id}
                className="flex-1 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => approveDeposit(tx)}
                disabled={acting === tx.id}
                className="flex-1 py-2 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold hover:bg-brand-500/30 transition-all flex items-center justify-center gap-1"
              >
                {acting === tx.id ? <Loader2 size={12} className="animate-spin" /> : null}
                Approve
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────
function WithdrawalsTab() {
  const [txs, setTxs] = useState<TxRow[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await adminSupabase
      .from('transactions')
      .select('*')
      .eq('type', 'withdrawal')
      .order('created_at', { ascending: false })
      .limit(200)

    if (!data) { setLoading(false); return }
    const userIds = [...new Set(data.map(t => t.user_id))]
    const { data: profiles } = await adminSupabase.from('profiles').select('id,username').in('id', userIds)
    const pm = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))
    setTxs(data.map(t => ({ ...t, username: pm[t.user_id] ?? '—' })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function approveWithdrawal(tx: TxRow) {
    setActing(tx.id)
    // withdrawal_balance already deducted at submission — just mark approved
    await adminSupabase.from('transactions').update({ status: 'approved' }).eq('id', tx.id)
    setActing(null)
    load()
  }

  async function rejectWithdrawal(tx: TxRow) {
    setActing(tx.id)
    // Return the amount to withdrawal_balance
    const absAmt = Math.abs(tx.amount)
    const { data: assets } = await adminSupabase
      .from('assets').select('withdrawal_balance').eq('user_id', tx.user_id).maybeSingle()
    if (assets) {
      await adminSupabase.from('assets').update({
        withdrawal_balance: parseFloat(((assets.withdrawal_balance ?? 0) + absAmt).toFixed(2))
      }).eq('user_id', tx.user_id)
    }
    await adminSupabase.from('transactions').update({ status: 'rejected' }).eq('id', tx.id)
    setActing(null)
    load()
  }

  if (loading) return <Spinner />

  return (
    <div className="pt-3 space-y-2">
      <p className="text-gray-600 text-xs">{txs.length} withdrawal{txs.length !== 1 ? 's' : ''}</p>
      {txs.map(tx => (
        <div key={tx.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white font-bold text-sm">{tx.username}</p>
              <p className="text-red-400 font-extrabold">{fmt(Math.abs(tx.amount))} USDT</p>
              {tx.note && <p className="text-gray-500 text-xs">{tx.note}</p>}
              <p className="text-gray-600 text-[10px]">{fmtDate(tx.created_at)}</p>
            </div>
            <Chip s={tx.status} />
          </div>
          {tx.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => rejectWithdrawal(tx)}
                disabled={acting === tx.id}
                className="flex-1 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => approveWithdrawal(tx)}
                disabled={acting === tx.id}
                className="flex-1 py-2 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold hover:bg-brand-500/30 transition-all flex items-center justify-center gap-1"
              >
                {acting === tx.id ? <Loader2 size={12} className="animate-spin" /> : null}
                Approve
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── KYC ──────────────────────────────────────────────────────────────────────
function KycTab() {
  const [kycs, setKycs] = useState<KycRow[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await adminSupabase
      .from('kyc')
      .select('*')
      .order('created_at', { ascending: false })

    if (!data) { setLoading(false); return }
    const userIds = [...new Set(data.map(k => k.user_id))]
    const { data: profiles } = await adminSupabase.from('profiles').select('id,username').in('id', userIds)
    const pm = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))
    setKycs(data.map(k => ({ ...k, username: pm[k.user_id] ?? '—' })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function updateKyc(kyc: KycRow, status: 'verified' | 'rejected') {
    setActing(kyc.id)
    await adminSupabase.from('kyc').update({ status }).eq('id', kyc.id)
    setActing(null)
    load()
  }

  const filtered = kycs.filter(k => filterStatus === 'all' || k.status === filterStatus)

  if (loading) return <Spinner />

  return (
    <div className="pt-3 space-y-3">
      <div className="flex gap-2">
        {['all','unverified','verified','rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${filterStatus === s ? 'bg-brand-500 text-white border-brand-500' : 'bg-surface-muted text-gray-400 border-surface-border'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(k => (
          <div key={k.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-bold text-sm">{k.username}</p>
                <p className="text-gray-600 text-[10px]">{fmtDate(k.created_at)}</p>
              </div>
              <Chip s={k.status} />
            </div>
            {k.status === 'unverified' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateKyc(k, 'rejected')}
                  disabled={acting === k.id}
                  className="flex-1 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateKyc(k, 'verified')}
                  disabled={acting === k.id}
                  className="flex-1 py-2 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold hover:bg-brand-500/30 transition-all flex items-center justify-center gap-1"
                >
                  {acting === k.id ? <Loader2 size={12} className="animate-spin" /> : <BadgeCheck size={12} />}
                  Verify
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Broadcast ────────────────────────────────────────────────────────────────
function BroadcastTab() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  async function send() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)
    try {
      const { data: profiles } = await adminSupabase.from('profiles').select('id')
      if (!profiles || profiles.length === 0) {
        setResult({ ok: false, msg: 'No users found.' })
        setSending(false)
        return
      }
      const rows = profiles.map(p => ({
        user_id: p.id,
        title: title.trim(),
        body: body.trim(),
        type: 'broadcast',
        read: false,
      }))
      // Insert in chunks of 50
      const CHUNK = 50
      for (let i = 0; i < rows.length; i += CHUNK) {
        await adminSupabase.from('notifications').insert(rows.slice(i, i + CHUNK))
      }
      setResult({ ok: true, msg: `Broadcast sent to ${profiles.length} users!` })
      setTitle('')
      setBody('')
    } catch (e: unknown) {
      setResult({ ok: false, msg: String(e) })
    }
    setSending(false)
  }

  return (
    <div className="pt-3 space-y-4">
      <div className="bg-surface-card border border-surface-border rounded-2xl p-4 space-y-4">
        <h3 className="text-white font-bold">Send Notification to All Users</h3>
        <div>
          <p className="text-gray-400 text-xs mb-1.5">Title</p>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. System Update"
            className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500/60"
          />
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1.5">Message</p>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            rows={4}
            placeholder="Write your message here…"
            className="w-full bg-surface-muted border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500/60 resize-none"
          />
        </div>
        <button
          onClick={send}
          disabled={sending || !title.trim() || !body.trim()}
          className="w-full py-3 rounded-xl bg-brand-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          Send to All Users
        </button>
        {result && (
          <div className={`rounded-xl p-3 text-sm font-semibold ${result.ok ? 'bg-brand-500/10 text-brand-400' : 'bg-red-500/10 text-red-400'}`}>
            {result.ok ? '✓ ' : '✗ '}{result.msg}
          </div>
        )}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
        <div className="flex gap-2.5">
          <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300 text-xs leading-relaxed">
            Broadcasts are sent to <strong>all registered users</strong>. They will appear in the Notifications section of each user's app.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Unused imports silenced
const _unused = { ChevronDown, ChevronUp, Clock, XCircle, RefreshCw, DollarSign, Megaphone, Wallet }
void _unused
