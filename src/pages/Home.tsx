import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Headphones, Bell, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

const PARTNERS = [
  { name: 'facebook',   emoji: '🔵' },
  { name: 'Hugging Face', emoji: '🤗' },
  { name: 'Google',    emoji: '🔴' },
  { name: 'OpenAI',    emoji: '🟢' },
  { name: 'Meta',      emoji: '🔷' },
  { name: 'BioMap',    emoji: '⚡' },
  { name: 'x.AI',      emoji: '✖️' },
  { name: 'NVIDIA',    emoji: '💚' },
  { name: 'Amazon',    emoji: '🟠' },
]

export default function Home() {
  const { profile, assets } = useAuth()
  const navigate = useNavigate()
  const [announcement, setAnnouncement] = useState('Partner Announcement')
  const [nodeCount] = useState('2000K')

  useEffect(() => {
    supabase.from('notifications').select('title').eq('type', 'announcement')
      .order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => { if (data?.title) setAnnouncement(data.title) })
  }, [])

  const now = new Date()
  const dayPct = (now.getHours() * 60 + now.getMinutes()) / (24 * 60)
  const trainingProgress = Math.round(dayPct * 100)

  const dailyYield  = assets?.daily_yield  ?? 0
  const totalYield  = assets?.total_yield  ?? 0

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 border-b border-surface-border bg-surface-card/95 backdrop-blur-md sticky top-0 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top, 12px)', paddingBottom: '10px' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">N</span>
          </div>
          <span className="text-white font-bold text-base">Welcome To NeoGPT</span>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/lang" className="w-9 h-9 flex items-center justify-center text-gray-400">
            <Globe size={18} />
          </Link>
          <a href="#" className="w-9 h-9 flex items-center justify-center text-gray-400">
            <Headphones size={18} />
          </a>
          <Link to="/notifications" className="w-9 h-9 flex items-center justify-center text-gray-400 relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-400 rounded-full" />
          </Link>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-4">
        {/* Hero banner */}
        <div className="relative mx-0 overflow-hidden">
          <div className="bg-gradient-to-br from-green-950 via-teal-950 to-brand-900 relative overflow-hidden" style={{ minHeight: '280px' }}>
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(rgba(52,211,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Glow blobs */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 px-6 py-8 flex items-center">
              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/80 flex items-center justify-center">
                    <span className="text-white font-extrabold text-sm">N</span>
                  </div>
                  <span className="text-brand-300 font-bold text-sm">NeoGPT</span>
                </div>
                <h1 className="text-white font-extrabold text-3xl leading-tight mb-3">
                  BUILD THE<br />
                  INTELLIGENCE<br />
                  OF TOMORROW<br />
                  WITH <span className="text-brand-400">NEOGPT</span>
                </h1>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Turn unused computing power into<br />
                  real-world intelligence and value.
                </p>
              </div>
              {/* AI Robot illustration */}
              <div className="w-32 h-44 rounded-2xl bg-gradient-to-b from-teal-800/40 to-brand-900/40 border border-brand-500/20 flex items-center justify-center flex-shrink-0 ml-4">
                <span className="text-7xl">🤖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-card/80 border-b border-surface-border overflow-hidden">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded shrink-0">Notice</span>
          <div className="flex-1 overflow-hidden">
            <div className="marquee-text text-xs text-gray-400">
              {announcement}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{announcement}
            </div>
          </div>
          <button onClick={() => navigate('/notifications')} className="shrink-0 text-xs text-gray-500 flex items-center gap-0.5">
            Partner Announ <ChevronRight size={10} />
          </button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-0 px-0 mt-4 mx-4">
          {[
            { to: '/task',        icon: '🖥️', label: 'Task Center'  },
            { to: '/tutorials',   icon: '📚', label: 'Tutorials'    },
            { to: '/my/share',    icon: '🤝', label: 'Invitation'   },
            { to: '/my/about-us', icon: '👤', label: 'About us'     },
          ].map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1.5 py-3 text-center active:opacity-70"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center text-2xl">
                {icon}
              </div>
              <span className="text-xs text-gray-400 font-medium leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Yield + training progress card */}
        <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-r from-brand-900 via-green-900 to-emerald-800 p-4 border border-brand-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center">
                <span className="text-brand-300 text-sm">📈</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Daily yield</p>
                <p className="text-brand-300 font-extrabold">+{dailyYield.toFixed(2)}USDT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center">
                <span className="text-brand-300 text-sm">🔄</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total yield</p>
                <p className="text-white font-extrabold">+{totalYield.toFixed(3)}USDT</p>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Training progress</span>
              <span>{trainingProgress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
              <div className="h-full rounded-full bg-brand-400 transition-all duration-500" style={{ width: `${trainingProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Make Profit + Node Partner cards */}
        <div className="grid grid-cols-2 gap-3 mx-4 mt-3">
          {/* Make Profit */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <p className="text-white font-bold text-sm mb-3">Make Profit</p>
            <div className="flex items-end justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <span className="text-xl">🪙</span>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px]">{profile?.username ? 'Personal Node' : 'iPhone'}</p>
                <p className="text-white font-extrabold text-base">
                  {(assets?.daily_yield ?? 0.014).toFixed(3)}
                  <span className="text-gray-500 text-xs ml-1">USDT</span>
                </p>
                <Link to="/power" className="text-brand-400 text-xs font-bold">Claim &gt;</Link>
              </div>
            </div>
          </div>

          {/* Node Partner */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <p className="text-white font-bold text-sm mb-3">Node Partner</p>
            <div className="flex items-end justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div className="text-right">
                <p className="text-white font-extrabold text-base">{nodeCount}</p>
                <Link to="/node-partner" className="text-brand-400 text-xs font-bold">Node partner &gt;</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Partners section */}
        <div className="mx-4 mt-4">
          <h3 className="text-white font-bold text-sm mb-3 border-b-2 border-brand-400 pb-1 inline-block">Partners</h3>
          <div className="bg-gradient-to-b from-surface-card to-green-950/20 border border-surface-border rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-y-4 gap-x-2">
              {PARTNERS.map((p) => (
                <div key={p.name} className="flex items-center justify-center gap-1.5 py-2">
                  <span className="text-lg">{p.emoji}</span>
                  <span className="text-gray-300 text-xs font-semibold">{p.name}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-[10px] text-center mt-4 leading-relaxed">
              The above partners are in no particular order and are for display only.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
