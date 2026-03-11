import { useState } from 'react'
import { Copy, Share2, Gift } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'

export default function Share() {
  const { profile } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralLink = `${window.location.origin}/register?ref=${profile?.referral_code ?? ''}`

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Join NanoGPT',
        text: 'Join me on NanoGPT and earn USDT by contributing idle computing power to AI training!',
        url: referralLink,
      })
    } else {
      copyLink()
    }
  }

  return (
    <Layout title="Invite Friends" showBack showActions={false}>
      <div className="px-4 pt-6 space-y-6">
        {/* Hero */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
            <Gift size={36} className="text-white" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Invite & Earn Together</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Share your referral link and earn team rewards when your friends join and participate
          </p>
        </div>

        {/* Rewards breakdown */}
        <div className="card">
          <p className="section-title">Team Reward Rates</p>
          <div className="space-y-3">
            {[
              { level: 'A-Level (Direct)', rate: '5% - 10%', desc: 'Direct invites you bring' },
              { level: 'B-Level (2nd tier)', rate: '3% - 8%', desc: 'Friends of your friends' },
              { level: 'C-Level (3rd tier)', rate: '1% - 6%', desc: 'Extended network' },
            ].map(({ level, rate, desc }) => (
              <div key={level} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{level}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
                <span className="text-amber-400 font-bold">{rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral code */}
        <div className="card">
          <p className="section-title">Your Referral Code</p>
          <div className="flex items-center gap-3 bg-surface-muted rounded-xl px-4 py-3 mb-3">
            <p className="flex-1 text-brand-300 font-mono font-semibold tracking-widest">
              {profile?.referral_code ?? '—'}
            </p>
            <button onClick={copyLink} className="text-brand-400">
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">Or share your full invite link:</p>
          <div className="flex items-center gap-2 bg-surface-muted rounded-xl px-3 py-2 mb-4">
            <p className="flex-1 text-xs text-gray-400 truncate">{referralLink}</p>
            <button onClick={copyLink} className="text-brand-400 flex-shrink-0">
              <Copy size={14} />
            </button>
          </div>

          {copied && (
            <p className="text-center text-xs text-green-400 mb-3">✓ Copied to clipboard!</p>
          )}

          <button onClick={handleShare} className="btn-primary flex items-center justify-center gap-2">
            <Share2 size={16} />
            Share Invite Link
          </button>
        </div>

        {/* How it works */}
        <div className="card">
          <p className="section-title">How It Works</p>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Share your link', desc: 'Send your referral link to friends' },
              { step: '2', title: 'They join & participate', desc: 'Friends register and start tasks' },
              { step: '3', title: 'You both earn', desc: 'Receive team rewards automatically' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
