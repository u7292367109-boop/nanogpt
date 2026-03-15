import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, ListTodo, Home, Bot, User, PlusCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

const NAV_ITEMS = [
  { path: '/home',    icon: Home,     label: 'Home'    },
  { path: '/power',   icon: Zap,      label: 'Power'   },
  { path: '/task',    icon: ListTodo, label: 'Tasks'   },
  { path: '/ai',      icon: Bot,      label: 'AI'      },
  { path: '/profile', icon: User,     label: 'Profile' },
]

function DesktopSidebar() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-56 bg-[#070f09] border-r border-white/[0.06] z-40">
      {/* Logo */}
      <Link
        to="/home"
        className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand-sm shrink-0">
          <span className="text-white font-extrabold text-sm">U</span>
        </div>
        <span className="font-extrabold text-white text-lg tracking-tight">UltraGPT</span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active =
            pathname === path ||
            (path === '/profile' && (pathname === '/profile' || pathname.startsWith('/my/'))) ||
            (path !== '/home' && path !== '/profile' && pathname.startsWith(path))
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: deposit + user */}
      <div className="px-2 py-4 border-t border-white/[0.06] space-y-2">
        <Link
          to="/my/deposit"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-400 active:bg-brand-600 transition-colors shadow-brand-sm"
        >
          <PlusCircle size={15} />
          Deposit USDT
        </Link>
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-300 font-medium truncate">{user.email}</p>
              <p className="text-[10px] text-green-600 mt-0.5">● Active</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  /* ── Authenticated: sidebar + full content layout ── */
  if (user) {
    return (
      <>
        <DesktopSidebar />
        {/* On md+: offset by sidebar (224px) and cap content at max-w-2xl centered */}
        <div className="w-full h-screen overflow-hidden md:ml-56 bg-[#0a1a0e]">
          <div className="h-full md:max-w-2xl md:mx-auto">
            {children}
          </div>
        </div>
      </>
    )
  }

  /* ── Public: phone-frame mockup (desktop) / full-screen (mobile) ── */
  return (
    <>
      {/* Desktop decorative background */}
      <div className="hidden md:block fixed inset-0 -z-10 bg-[#030806]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,210,106,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,210,106,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,210,106,0.10) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96"
          style={{ background: 'radial-gradient(ellipse at bottom-left, rgba(0,210,106,0.06) 0%, transparent 60%)' }}
        />

        {/* Left marketing panel */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-center pl-16 pr-8 max-w-sm xl:max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
              <span className="text-white font-extrabold text-base">U</span>
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tight">UltraGPT</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Earn Daily<br />with <span className="text-brand-400">AI Power</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Decentralized AI computing platform. Put your idle device to work and earn USDT automatically.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-10">
            {[
              { v: '2.8M+', l: 'Active Nodes' },
              { v: '$12M+', l: 'Paid Out'      },
              { v: '200%',  l: 'Max Return'    },
              { v: '24/7',  l: 'Auto Earning'  },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
                <p className="text-brand-400 font-extrabold text-xl">{v}</p>
                <p className="text-gray-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest mb-3">Partners</p>
          <div className="flex gap-4 flex-wrap">
            {['NVIDIA', 'AWS', 'Google', 'Microsoft'].map(p => (
              <span key={p} className="text-xs font-extrabold text-gray-600 tracking-wider">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Phone frame */}
      <div className="
        w-full h-screen overflow-hidden
        md:w-[430px] md:h-[88vh] md:max-h-[900px]
        md:rounded-[44px] md:overflow-hidden
        md:fixed md:right-[8%] lg:right-[12%] xl:right-[16%] md:top-1/2 md:-translate-y-1/2
        md:shadow-[0_0_0_8px_#08100a,0_0_0_9px_rgba(0,210,106,0.15),0_40px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(0,210,106,0.12)]
        md:border md:border-brand-500/20
      ">
        {children}
      </div>
    </>
  )
}
