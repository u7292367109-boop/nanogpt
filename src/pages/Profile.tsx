import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, Smartphone, Users, ShoppingBag,
  Share2, Shield, Headphones, Layers, Globe, Info, LogOut, Copy
} from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'

export default function Profile() {
  const { profile, assets, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  function copyUID() {
    navigator.clipboard.writeText(profile?.uid ?? '')
  }

  const menuItems = [
    { icon: ShoppingBag, label: 'My Orders',        to: '/my/orders',    color: 'text-brand-400',  bg: 'bg-brand-500/20' },
    { icon: Share2,      label: 'Share & Invite',   to: '/my/share',     color: 'text-pink-400',   bg: 'bg-pink-500/20' },
    { icon: Shield,      label: 'KYC Verification', to: '/my/kyc',       color: 'text-amber-400',  bg: 'bg-amber-500/20' },
    { icon: Headphones,  label: 'Customer Service', to: 'https://t.me/nanogptsupport',             color: 'text-brand-300',  bg: 'bg-brand-500/10' },
    { icon: Layers,      label: 'Task Center',      to: '/task',         color: 'text-brand-400',  bg: 'bg-brand-500/20' },
    { icon: Globe,       label: 'Language',         to: '/lang',         color: 'text-teal-400',   bg: 'bg-teal-500/20' },
    { icon: Info,        label: 'About Us',         to: '/my/about-us',  color: 'text-gray-400',   bg: 'bg-gray-500/20' },
  ]

  const totalAssets = (assets?.task_balance ?? 0) + (assets?.vault_balance ?? 0)

  return (
    <Layout title="Profile" showBack={false}>
      <div className="px-4 pt-4 pb-6 space-y-3">

        {/* User card */}
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-extrabold text-white shrink-0 shadow-brand-sm">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-lg truncate">{profile?.username ?? '—'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-gray-500 text-xs">UID: {profile?.uid ?? '—'}</p>
              <button onClick={copyUID} className="text-gray-600 active:text-brand-400 transition-colors">
                <Copy size={11} />
              </button>
            </div>
            <span className="level-badge mt-1.5 inline-block">LV.{profile?.level ?? 0}</span>
          </div>
        </div>

        {/* Asset overview */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-900/60 via-green-950/40 to-surface-card border border-brand-500/20 p-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Assets</p>
          <p className="text-3xl font-extrabold text-white mb-4">
            {formatUSDT(totalAssets)}
            <span className="text-base text-gray-500 ml-1.5">USDT</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Task',      value: formatUSDT(assets?.task_balance ?? 0),       to: '/my/orders' },
              { label: 'Vault',     value: (assets?.vault_balance ?? 0).toFixed(2),     to: '/my/deposit' },
              { label: 'Withdrawn', value: formatUSDT(assets?.withdrawal_balance ?? 0), to: '/my/withdraw' },
            ].map(({ label, value, to }) => (
              <Link key={label} to={to} className="bg-brand-500/10 rounded-xl p-3 text-center border border-brand-500/20 active:opacity-70">
                <p className="text-gray-500 text-xs mb-0.5">{label}</p>
                <p className="text-brand-400 font-extrabold text-sm">{value}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Deposit / Withdraw buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/my/deposit" className="btn-primary py-3 text-sm font-bold shadow-brand-sm">
            Deposit
          </Link>
          <Link to="/my/withdraw" className="btn-secondary py-3 text-sm font-bold">
            Withdraw
          </Link>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/my/device" className="card flex items-center gap-3 active:opacity-70">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
              <Smartphone size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">My Device</p>
              <p className="text-gray-500 text-xs">Node info</p>
            </div>
          </Link>
          <Link to="/my/team" className="card flex items-center gap-3 active:opacity-70">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
              <Users size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">My Team</p>
              <p className="text-gray-500 text-xs">Referrals</p>
            </div>
          </Link>
        </div>

        {/* Menu list */}
        <div className="card p-0 divide-y divide-surface-border overflow-hidden">
          {menuItems.map(({ icon: Icon, label, to, color, bg }) => (
            <Link key={label} to={to} className="flex items-center justify-between px-4 py-3.5 active:bg-surface-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={color} />
                </div>
                <span className="text-white text-sm font-semibold">{label}</span>
              </div>
              <ChevronRight size={15} className="text-gray-600" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full py-3.5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 font-bold text-sm flex items-center justify-center gap-2 active:opacity-70"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </Layout>
  )
}
