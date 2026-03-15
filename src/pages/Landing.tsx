import { Link } from 'react-router-dom'
import { Cpu, Users, ArrowRight, Zap, Shield } from 'lucide-react'

export default function Landing() {
  return (
    <div className="h-full bg-surface flex flex-col overflow-y-auto relative">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2 relative">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand-sm">
            <Cpu size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">UltraGPT</span>
        </div>
        <Link to="/login" className="text-xs font-bold text-brand-400 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10">
          Sign In
        </Link>
      </div>

      {/* Hero content */}
      <div className="flex-1 flex flex-col px-5 pt-8 relative">
        {/* Live badge */}
        <div className="self-start flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-xs font-bold text-brand-400 tracking-widest uppercase">Live Network</span>
        </div>

        <h1 className="text-4xl font-extrabold text-white leading-[1.15] mb-4 tracking-tight">
          Earn Daily with<br />
          <span className="text-brand-400">AI Computing</span><br />
          Power
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
          Put your idle device to work. Contribute to decentralized AI training and earn USDT every day — automatically.
        </p>

        {/* Stats row */}
        <div className="flex gap-2.5 mb-8">
          {[
            { value: '2.8M+', label: 'Active Nodes' },
            { value: '$12M+', label: 'Paid Out' },
            { value: '200%', label: 'Max Return' },
          ].map(({ value, label }) => (
            <div key={label} className="flex-1 bg-surface-card rounded-2xl p-3 text-center border border-surface-border">
              <p className="text-brand-400 font-extrabold text-base leading-none">{value}</p>
              <p className="text-gray-500 text-xs mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <Link to="/register" className="btn-primary shadow-brand mb-3">
          Start Earning Free
          <ArrowRight size={17} />
        </Link>
        <Link to="/login" className="btn-secondary">
          Already have an account
        </Link>

        {/* Feature grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-8">
          {[
            { icon: Zap,       title: 'Daily Yield',  desc: 'Earn USDT every day' },
            { icon: Shield,    title: 'Secure',       desc: 'Non-custodial model' },
            { icon: Users,     title: 'Team Bonus',   desc: 'Up to 10% referral' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-surface-card rounded-2xl p-3 border border-surface-border text-center">
              <Icon size={17} className="text-brand-400 mx-auto mb-2" />
              <p className="text-white text-xs font-bold mb-0.5">{title}</p>
              <p className="text-gray-500 text-[10px] leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-6 pb-10">
        <p className="text-center text-xs text-gray-700 mb-3 font-medium">Trusted by global AI partners</p>
        <div className="flex items-center justify-center gap-5 mb-4">
          {['NVIDIA', 'AWS', 'Google', 'Meta'].map((p) => (
            <span key={p} className="text-xs font-extrabold text-gray-600 tracking-wider">{p}</span>
          ))}
        </div>
        <p className="text-center text-xs text-gray-700">
          <Link to="/privacy" className="text-brand-400/60">Terms & Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
