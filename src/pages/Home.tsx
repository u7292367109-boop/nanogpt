import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Headphones, Bell, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import { requestNotificationPermission } from '../lib/notify'
import { useLang } from '../context/LanguageContext'

const YIELD_BY_LEVEL = [0.014, 0.025, 0.045, 0.08, 0.15, 0.30, 0.60]

const BASE = 'https://ai.neogpt.club/assets'
const BANNER_IMG = `${BASE}/banners/69a55be52a7b6657a46d9585420a55b1.png`
const PARTNERS = [
  { name: 'facebook',    img: `${BASE}/partners/51f0048dff416cfcc63120a8ad64b4c8.png` },
  { name: 'Hugging Face',img: `${BASE}/partners/aaee6d405723c715c260cff68ff6ee06.png` },
  { name: 'Google',      img: `${BASE}/partners/243364cb5829a9e66a486b523ecbdbf2.png` },
  { name: 'OpenAI',      img: `${BASE}/partners/b41bff43d3a632c3e0562f7baff4e61d.png` },
  { name: 'Meta',        img: `${BASE}/partners/4efed7a6a90b7d48c432143a22ba2d76.png` },
  { name: 'BioMap',      img: `${BASE}/partners/28b5d0bf6991a47ebbda1359bf41dfdc.png` },
  { name: 'x.AI',        img: `${BASE}/partners/9549d9490470e0168a2be4ac1a363d9a.png` },
  { name: 'NVIDIA',      img: `${BASE}/partners/77bd58ea3cea8e4116bdc4a043d7e193.png` },
  { name: 'Amazon',      img: `${BASE}/partners/0c46e41a17462c4381aac3ef2773b13e.png` },
]

export default function Home() {
  const { user, profile, assets } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()
  const [announcement, setAnnouncement] = useState('Partner Announcement')
  const [nodeCount] = useState('2000K')
  const [deviceModel, setDeviceModel] = useState('Personal Node')
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  async function handleBellClick() {
    const perm = await requestNotificationPermission()
    setNotifPerm(perm)
    navigate('/notifications')
  }

  useEffect(() => {
    supabase.from('notifications').select('title').eq('type', 'announcement')
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { if (data?.title) setAnnouncement(data.title) })
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('devices').select('model').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.model) setDeviceModel(data.model) })
  }, [user])

  // Daily yield RATE based on level (what will be earned on next claim)
  const userLevel   = profile?.level ?? 0
  const yieldRate   = YIELD_BY_LEVEL[Math.min(userLevel, YIELD_BY_LEVEL.length - 1)]

  // Displayed values from DB
  const dailyYield  = assets?.daily_yield  ?? 0
  const totalYield  = assets?.total_yield  ?? 0

  // Training progress: 0% until training is active (total_yield > 0), then % of day
  const now = new Date()
  const dayPct = (now.getHours() * 60 + now.getMinutes()) / (24 * 60)
  const trainingProgress = totalYield > 0 ? Math.round(dayPct * 100) : 0

  return (
    <div className="page-container bg-surface">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 border-b border-surface-border bg-surface-card/95 backdrop-blur-md sticky top-0 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top, 12px)', paddingBottom: '10px' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">U</span>
          </div>
          <span className="text-white font-bold text-base">{t('welcome')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/lang" className="w-9 h-9 flex items-center justify-center text-gray-400">
            <Globe size={18} />
          </Link>
          <a href="https://t.me/ultragptsupport" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center text-gray-400">
            <Headphones size={18} />
          </a>
          <button onClick={handleBellClick} className="w-9 h-9 flex items-center justify-center text-gray-400 relative">
            <Bell size={18} className={notifPerm === 'granted' ? 'text-brand-400' : 'text-gray-400'} />
            {notifPerm !== 'granted' && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-4">
        {/* Hero banner */}
        <div className="relative mx-0 overflow-hidden rounded-xl mx-3 mt-2">
          <img
            src={BANNER_IMG}
            alt="Banner"
            className="w-full object-cover rounded-xl"
            style={{ maxHeight: '300px' }}
          />
        </div>

        {/* Notice bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-card/80 border-b border-surface-border overflow-hidden">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded shrink-0">{t('notice')}</span>
          <div className="flex-1 overflow-hidden">
            <div className="marquee-text text-xs text-gray-400">
              {announcement}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{announcement}
            </div>
          </div>
          <button onClick={() => navigate('/notifications')} className="shrink-0 text-xs text-gray-500 flex items-center gap-0.5">
            {t('notice')} <ChevronRight size={10} />
          </button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-0 px-0 mt-4 mx-4">
          {[
            { to: '/task',        icon: '🖥️', label: t('task_center') },
            { to: '/tutorials',   icon: '📚', label: t('tutorials')   },
            { to: '/my/share',    icon: '🤝', label: t('invitation')  },
            { to: '/my/about-us', icon: '👤', label: t('about_us')    },
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
                <p className="text-gray-400 text-xs">{t('daily_yield')}</p>
                <p className="text-brand-300 font-extrabold">+{dailyYield.toFixed(3)}USDT</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center">
                <span className="text-brand-300 text-sm">🔄</span>
              </div>
              <div>
                <p className="text-gray-400 text-xs">{t('total_yield')}</p>
                <p className="text-white font-extrabold">+{totalYield.toFixed(3)}USDT</p>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>{t('training_progress')}</span>
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
            <p className="text-white font-bold text-sm mb-3">{t('make_profit')}</p>
            <div className="flex items-end justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <span className="text-xl">🪙</span>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px]">{deviceModel}</p>
                <p className="text-white font-extrabold text-base">
                  {yieldRate.toFixed(3)}
                  <span className="text-gray-500 text-xs ml-1">USDT</span>
                </p>
                <Link to="/power" className="text-brand-400 text-xs font-bold">{t('claim')} &gt;</Link>
              </div>
            </div>
          </div>

          {/* Node Partner */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <p className="text-white font-bold text-sm mb-3">{t('node_partner')}</p>
            <div className="flex items-end justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div className="text-right">
                <p className="text-white font-extrabold text-base">{nodeCount}</p>
                <Link to="/node-partner" className="text-brand-400 text-xs font-bold">{t('node_partner')} &gt;</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Partners section */}
        <div className="mx-4 mt-4">
          <h3 className="text-white font-bold text-sm mb-3 border-b-2 border-brand-400 pb-1 inline-block">{t('partners')}</h3>
          <div className="bg-gradient-to-b from-surface-card to-green-950/20 border border-surface-border rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-y-4 gap-x-2">
              {PARTNERS.map((p) => (
                <div key={p.name} className="flex items-center justify-center py-2">
                  <img src={p.img} alt={p.name} className="h-7 object-contain" />
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
