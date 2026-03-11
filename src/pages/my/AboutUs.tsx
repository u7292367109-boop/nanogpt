import { Cpu, Globe, Shield, TrendingUp } from 'lucide-react'
import Layout from '../../components/Layout'

export default function AboutUs() {
  return (
    <Layout title="About Us" showBack showActions={false}>
      <div className="px-4 pt-4 space-y-4 pb-6">
        {/* Hero */}
        <div className="card bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border-indigo-500/20 text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
            <Cpu size={28} className="text-white" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-1">NanoGPT</h2>
          <p className="text-indigo-300 text-sm">Decentralized Computing Power Revenue Platform</p>
        </div>

        {/* Story */}
        <div className="card">
          <p className="section-title">Our Story</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            By 2026, AI had reshaped industries — yet the computing power behind it stayed concentrated in few hands. NanoGPT was formed to change that.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mt-3">
            A team of engineers and innovators came together to democratize AI infrastructure: letting anyone contribute idle compute and earn from the global demand for training capacity.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mt-3">
            Today, NanoGPT aggregates decentralized compute from individuals and providers worldwide, delivering it to enterprises and AI labs at scale.
          </p>
        </div>

        {/* Values */}
        <div className="card">
          <p className="section-title">Our Values</p>
          <div className="space-y-3">
            {[
              { icon: Globe, label: 'Decentralization', desc: 'No single point of control — everyone participates equally' },
              { icon: TrendingUp, label: 'Fair Rewards', desc: 'Transparent earnings tied directly to your contribution' },
              { icon: Shield, label: 'Privacy First', desc: 'Your data stays yours. We only use compute, not content' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="card">
          <p className="section-title">Contact Us</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-indigo-400 text-sm">support@nanogpt.ai</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-surface-border">
              <span className="text-gray-400 text-sm">Telegram</span>
              <span className="text-indigo-400 text-sm">@NanoGPT_Support</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          © 2026 NanoGPT. All rights reserved.
        </p>
      </div>
    </Layout>
  )
}
