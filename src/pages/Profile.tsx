import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, Smartphone, Users, ShoppingBag,
  Share2, Shield, Headphones, Layers, Globe, Info, LogOut, Bell, Settings, Cpu
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const { profile, assets, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const totalAssets = (assets?.task_balance ?? 0) + (assets?.vault_balance ?? 0) + (assets?.withdrawal_balance ?? 0)

  const menuItems = [
    { icon: Smartphone, label: 'My Device',       to: '/my/device'                  },
    { icon: Users,      label: 'My Team',          to: '/my/team'                    },
    { icon: ShoppingBag,label: 'My Orders',        to: '/my/orders'                  },
    { icon: Share2,     label: 'Share',            to: '/my/share'                   },
    { icon: Shield,     label: 'KYC',              to: '/my/kyc'                     },
    { icon: Headphones, label: 'Customer Service', to: 'https://t.me/nanogptsupport' },
    { icon: Layers,     label: 'Task Center',      to: '/task'                       },
    { icon: Cpu,        label: 'Computing Pool',   to: '/power'                      },
    { icon: Globe,      label: 'Language',         to: '/lang'                       },
    { icon: Info,       label: 'About Us',         to: '/my/about-us'                },
  ]

  return (
    <div className="page-container bg-surface">
      <div
        className="flex items-center justify-between px-4 border-b border-surface-border bg-surface-card/95 backdrop-blur-md sticky top-0 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top, 12px)', paddingBottom: '10px' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-extrabold text-lg border-2 border-brand-400/40 shrink-0">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{profile?.username ?? '—'}</p>
            <p className="text-gray-500 text-xs">UID: {profile?.uid ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/notifications" className="w-9 h-9 flex items-center justify-center text-gray-400 relative">
            <Bell size={18} />
          </Link>
          <Link to="/lang" className="w-9 h-9 flex items-center justify-center text-gray-400">
            <Settings size={18} />
          </Link>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-4">
        <div className="px-4 pt-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-gray-400 text-xs mb-1">My total assets</p>
              <p className="text-white font-extrabold text-3xl">
                {totalAssets.toFixed(3)}
                <span className="text-gray-500 text-base font-normal ml-1.5">USDT</span>
              </p>
            </div>
            <Link to="/fundlogs" className="bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-full">
              Asset Center
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Task',       sub: 'Active orders',    value: (assets?.task_balance ?? 0).toFixed(3),       to: '/my/orders'   },
              { label: 'Vault',      sub: 'Buy task packages',value: (assets?.vault_balance ?? 0).toFixed(3),       to: '/task'        },
              { label: 'Withdrawal', sub: 'Withdraw earnings', value: (assets?.withdrawal_balance ?? 0).toFixed(3), to: '/my/withdraw' },
            ].map(({ label, sub, value, to }) => (
              <Link key={label} to={to} className="bg-surface-card border border-surface-border rounded-xl p-3 text-center active:opacity-70">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-brand-400 text-sm font-bold">🪙</span>
                  <span className="text-white font-extrabold text-sm">{value}</span>
                </div>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="text-gray-600 text-[10px] mt-0.5 leading-tight">{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-4 mt-4 bg-surface-card border border-surface-border rounded-2xl overflow-hidden divide-y divide-surface-border">
          {menuItems.map(({ icon: Icon, label, to }) => {
            const isExternal = to.startsWith('http')
            if (isExternal) return (
              <a key={label} href={to} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-between px-4 py-3.5 active:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Icon size={17} className="text-gray-400" />
                  <span className="text-white text-sm font-medium">{label}</span>
                </div>
                <ChevronRight size={15} className="text-gray-600" />
              </a>
            )
            return (
              <Link key={label} to={to}
                    className="flex items-center justify-between px-4 py-3.5 active:bg-surface-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Icon size={17} className="text-gray-400" />
                  <span className="text-white text-sm font-medium">{label}</span>
                </div>
                <ChevronRight size={15} className="text-gray-600" />
              </Link>
            )
          })}
          <button onClick={handleSignOut}
                  className="w-full flex items-center justify-between px-4 py-3.5 active:bg-surface-muted transition-colors">
            <div className="flex items-center gap-3">
              <LogOut size={17} className="text-gray-400" />
              <span className="text-white text-sm font-medium">Logout</span>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
