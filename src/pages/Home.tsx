import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Users, Zap, TrendingUp, BookOpen, Info } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

const PARTNERS = ['NVIDIA', 'AWS', 'Google', 'Microsoft', 'Meta', 'Apple', 'Intel', 'AMD', 'Qualcomm']

const banners = [
  { gradient: 'from-brand-900 via-green-950 to-emerald-900', tag: 'Earning', title: 'Start Earning Today',    sub: 'Connect your device and earn USDT daily',            icon: '⚡' },
  { gradient: 'from-emerald-950 via-teal-950 to-green-900', tag: 'Referral', title: 'Invite & Earn More',   sub: 'Multi-level team rewards up to 10%',                   icon: '👥' },
  { gradient: 'from-green-950 via-brand-900 to-teal-950',   tag: 'New',      title: 'AI Training Tasks',    sub: 'Text, Image, Video — up to 150% return',               icon: '🤖' },
]

export default function Home() {
  const { profile, assets } = useAuth()
  const [announcement, setAnnouncement] = useState('🎉 NanoGPT Computing Network — Powering the Future of AI Training')
  const [bannerIndex, setBannerIndex] = useState(0)
  const [nodeCount] = useState('2,847K')

  useEffect(() => {
    supabase.from('notifications').select('title').eq('type', 'announcement').order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => { if (data?.title) setAnnouncement(data.title) })
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBannerIndex(i => (i + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <Layout>
      {/* Announcement ticker */}
      <div className="bg-brand-500/10 border-b border-brand-500/20 px-4 py-2 overflow-hidden">
        <div className="marquee-text text-xs text-brand-400 font-semibold">
          📢 &nbsp;{announcement}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;📢 &nbsp;{announcement}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* Banner carousel */}
        <div className={`rounded-2xl bg-gradient-to-br ${banners[bannerIndex].gradient} p-5 min-h-[128px] flex flex-col justify-between border border-brand-500/10 transition-all duration-500`}>
          <div className="flex items-start justify-between">
            <span className="text-2xl">{banners[bannerIndex].icon}</span>
            <span className="text-xs font-bold text-brand-400 bg-brand-500/20 border border-brand-500/25 px-2.5 py-0.5 rounded-full">
              {banners[bannerIndex].tag}
            </span>
          </div>
          <div>
            <h3 className="text-white font-extrabold text-lg leading-tight">{banners[bannerIndex].title}</h3>
            <p className="text-white/55 text-xs mt-0.5">{banners[bannerIndex].sub}</p>
            <div className="flex gap-1 mt-3">
              {banners.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === bannerIndex ? 'w-6 bg-brand-400' : 'w-2 bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Yield stats */}
        <div className="card">
          <div className="flex gap-3">
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 mb-1">Daily Yield</p>
              <p className="text-xl font-extrabold text-brand-400">+{formatUSDT(assets?.daily_yield ?? 0)}</p>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">USDT</p>
            </div>
            <div className="w-px bg-surface-border" />
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Yield</p>
              <p className="text-xl font-extrabold text-brand-400">+{formatUSDT(assets?.total_yield ?? 0)}</p>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">USDT</p>
            </div>
          </div>
        </div>

        {/* Device card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Training Progress</p>
            <span className="level-badge">LV.{profile?.level ?? 0}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl shrink-0">📱</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Personal Node</p>
              <p className="text-gray-500 text-xs mb-2">Daily: <span className="text-brand-400 font-semibold">+0.014 USDT</span></p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '38%' }} />
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/25 shrink-0">
              Claim
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { to: '/power',       icon: <Zap size={20} className="text-brand-400" />,      label: 'Power' },
            { to: '/tutorials',   icon: <BookOpen size={20} className="text-brand-400" />, label: 'Tutorials' },
            { to: '/my/share',    icon: <Users size={20} className="text-brand-400" />,    label: 'Invite' },
            { to: '/my/about-us', icon: <Info size={20} className="text-brand-400" />,     label: 'About' },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="bg-surface-card border border-surface-border rounded-2xl flex flex-col items-center gap-2 py-4 px-1 text-center active:opacity-70 transition-opacity">
              {icon}
              <span className="text-xs text-gray-400 font-semibold leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Node partner CTA */}
        <Link to="/node-partner" className="card flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Global Node Partners</p>
            <p className="text-white font-extrabold text-2xl">{nodeCount}</p>
          </div>
          <div className="flex items-center gap-1.5 text-brand-400 text-sm font-bold">
            <Users size={16} />
            <span>Join Now</span>
            <ChevronRight size={14} />
          </div>
        </Link>

        {/* Asset summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title mb-0">My Assets</p>
            <Link to="/my/orders" className="text-xs text-brand-400 font-bold flex items-center gap-0.5">
              History <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Task',      value: formatUSDT(assets?.task_balance ?? 0) },
              { label: 'Vault',     value: formatUSDT(assets?.vault_balance ?? 0) },
              { label: 'Withdrawn', value: formatUSDT(assets?.withdrawal_balance ?? 0) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-muted rounded-xl p-3 text-center">
                <p className="text-brand-400 font-extrabold text-sm">{value}</p>
                <p className="text-gray-600 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="card">
          <p className="section-title">Global AI Partners</p>
          <div className="grid grid-cols-3 gap-2">
            {PARTNERS.map((p) => (
              <div key={p} className="bg-surface-muted rounded-xl py-2.5 px-3 text-center border border-surface-border">
                <span className="text-xs text-gray-400 font-bold">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders link */}
        <Link to="/my/orders" className="card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Training Records</p>
              <p className="text-gray-500 text-xs">View all orders & history</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-600" />
        </Link>
      </div>
    </Layout>
  )
}
