import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatUSDT } from '../lib/utils'
import { supabase } from '../lib/supabase'

const PARTNERS = ['NVIDIA', 'AWS', 'Google', 'Microsoft', 'Meta', 'Apple', 'Intel', 'AMD', 'Qualcomm']

export default function Home() {
  const { profile, assets } = useAuth()
  const [announcement, setAnnouncement] = useState('🎉 NanoGPT Computing Network — Powering the Future of AI Training')
  const [bannerIndex, setBannerIndex] = useState(0)
  const [nodeCount] = useState('2,847K')

  useEffect(() => {
    supabase
      .from('notifications')
      .select('title')
      .eq('type', 'announcement')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.title) setAnnouncement(data.title)
      })
  }, [])

  const banners = [
    { bg: 'from-indigo-900 to-violet-900', title: 'Start Earning Today', sub: 'Connect your device and earn USDT daily' },
    { bg: 'from-blue-900 to-indigo-900', title: 'Invite & Earn More', sub: 'Multi-level team rewards up to 10%' },
    { bg: 'from-purple-900 to-pink-900', title: 'AI Training Tasks', sub: 'Text, Image, Video — higher return rates' },
  ]

  useEffect(() => {
    const t = setInterval(() => setBannerIndex(i => (i + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <Layout>
      {/* Announcement marquee */}
      <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-4 py-2 overflow-hidden">
        <div className="marquee-text text-xs text-indigo-300">
          📢 {announcement} &nbsp;&nbsp;&nbsp; 📢 {announcement} &nbsp;&nbsp;&nbsp; 📢 {announcement}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Banner carousel */}
        <div className={`rounded-2xl bg-gradient-to-br ${banners[bannerIndex].bg} p-5 min-h-[120px] flex flex-col justify-end transition-all duration-500`}>
          <h3 className="text-white font-bold text-lg">{banners[bannerIndex].title}</h3>
          <p className="text-white/70 text-sm">{banners[bannerIndex].sub}</p>
          <div className="flex gap-1 mt-3">
            {banners.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === bannerIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Yield stats */}
        <div className="card">
          <div className="flex gap-3">
            <div className="stat-card">
              <p className="text-xs text-gray-400 mb-1">Daily Yield</p>
              <p className="text-lg font-bold yield-badge">+{formatUSDT(assets?.daily_yield ?? 0)} USDT</p>
            </div>
            <div className="stat-card">
              <p className="text-xs text-gray-400 mb-1">Total Yield</p>
              <p className="text-lg font-bold yield-badge">+{formatUSDT(assets?.total_yield ?? 0)} USDT</p>
            </div>
          </div>
        </div>

        {/* Device earning card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 font-medium">Training Progress</p>
            <span className="level-badge">LV.{profile?.level ?? 0}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-surface-muted flex items-center justify-center text-2xl">📱</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">iPhone</p>
              <p className="text-gray-400 text-xs mb-2">Daily yield: <span className="text-amber-400">+0.014 USDT</span></p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '38%' }} />
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-semibold border border-indigo-500/30">
              Claim
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { to: '/power', icon: '⚡', label: 'Task Center' },
            { to: '/tutorials', icon: '📖', label: 'Tutorials' },
            { to: '/profile', icon: '👥', label: 'Invite' },
            { to: '/my/about-us', icon: 'ℹ️', label: 'About Us' },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="card flex flex-col items-center gap-2 py-3 px-2 text-center active:opacity-70">
              <span className="text-xl">{icon}</span>
              <span className="text-xs text-gray-400 font-medium leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Node partner */}
        <Link to="/node-partner" className="card flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Node Partners Worldwide</p>
            <p className="text-white font-bold text-xl">{nodeCount}</p>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
            <Users size={16} />
            <span>Join</span>
            <ChevronRight size={14} />
          </div>
        </Link>

        {/* Partners */}
        <div className="card">
          <p className="section-title">Global Partners</p>
          <div className="grid grid-cols-3 gap-2">
            {PARTNERS.map((p) => (
              <div key={p} className="bg-surface-muted rounded-xl py-2 px-3 text-center">
                <span className="text-xs text-gray-400 font-medium">{p}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 text-center mt-3">
            Partners shown for display purposes only
          </p>
        </div>
      </div>
    </Layout>
  )
}
