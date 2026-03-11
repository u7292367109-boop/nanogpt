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
    { icon: ShoppingBag, label: 'My Orders', to: '/my/orders', color: 'text-violet-400' },
    { icon: Share2, label: 'Share / Invite', to: '/my/share', color: 'text-pink-400' },
    { icon: Shield, label: 'KYC Verification', to: '/my/kyc', color: 'text-amber-400' },
    { icon: Headphones, label: 'Customer Service', to: '#', color: 'text-blue-400' },
    { icon: Layers, label: 'Task Center', to: '/task', color: 'text-indigo-400' },
    { icon: Globe, label: 'Language', to: '/lang', color: 'text-teal-400' },
    { icon: Info, label: 'About Us', to: '/my/about-us', color: 'text-gray-400' },
  ]

  return (
    <Layout title="Profile" showBack={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* User header */}
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg truncate">{profile?.username ?? '—'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-gray-400 text-xs">UID: {profile?.uid ?? '—'}</p>
              <button onClick={copyUID} className="text-gray-600 hover:text-indigo-400 transition-colors">
                <Copy size={11} />
              </button>
            </div>
            <span className="level-badge mt-1 inline-block">LV.{profile?.level ?? 0}</span>
          </div>
        </div>

        {/* Total assets */}
        <div className="card bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border-indigo-500/20">
          <p className="text-xs text-gray-400 mb-1">My Total Assets</p>
          <p className="text-3xl font-bold text-white mb-4">
            {formatUSDT((assets?.task_balance ?? 0) + (assets?.vault_balance ?? 0))}
            <span className="text-lg text-gray-400 ml-1">USDT</span>
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Task', value: formatUSDT(assets?.task_balance ?? 0), to: '/my/orders' },
              { label: 'Vault', value: (assets?.vault_balance ?? 0).toFixed(2), to: '/my/deposit' },
              { label: 'Withdrawal', value: formatUSDT(assets?.withdrawal_balance ?? 0), to: '/my/withdraw' },
            ].map(({ label, value, to }) => (
              <Link key={label} to={to} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/my/device" className="card flex items-center gap-3 active:opacity-70">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Smartphone size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">My Device</p>
              <p className="text-gray-500 text-xs">Node info</p>
            </div>
          </Link>
          <Link to="/my/team" className="card flex items-center gap-3 active:opacity-70">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Users size={20} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">My Team</p>
              <p className="text-gray-500 text-xs">0 members</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <div className="card p-0 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, to, color }) => (
            <Link key={label} to={to} className="menu-item">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center`}>
                  <Icon size={16} className={color} />
                </div>
                <span className="text-white text-sm font-medium">{label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 mb-4"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </Layout>
  )
}
