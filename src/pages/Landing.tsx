import { Link } from 'react-router-dom'
import { Cpu, TrendingUp, Users, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Cpu size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          Nano<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">GPT</span>
        </h1>

        <p className="text-gray-400 text-base mb-3 font-medium">
          Decentralized AI Computing Power Platform
        </p>

        <p className="text-gray-500 text-sm mb-10 max-w-xs leading-relaxed">
          Collect idle computing power and earn passive income while powering the next generation of AI models.
        </p>

        {/* Features */}
        <div className="w-full grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: Cpu, label: 'Idle Power', desc: 'Put your device to work' },
            { icon: TrendingUp, label: 'Daily Yield', desc: 'Earn USDT daily' },
            { icon: Users, label: 'Team Rewards', desc: 'Multi-level bonuses' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card text-center p-3">
              <Icon size={20} className="text-indigo-400 mx-auto mb-1.5" />
              <p className="text-white text-xs font-semibold">{label}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-tight">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full space-y-3">
          <Link to="/login" className="btn-primary flex items-center justify-center gap-2">
            Get Started
            <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn-secondary block text-center">
            Create Account
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-600">
          By continuing, you agree to our{' '}
          <Link to="/privacy" className="text-indigo-400">Privacy Policy</Link>
        </p>
      </div>

      {/* Partners */}
      <div className="px-6 pb-8">
        <p className="text-center text-xs text-gray-600 mb-4">Trusted by global partners</p>
        <div className="flex justify-center items-center gap-6 opacity-40">
          {['NVIDIA', 'AWS', 'Google', 'Meta'].map((p) => (
            <span key={p} className="text-xs font-bold text-gray-400">{p}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
