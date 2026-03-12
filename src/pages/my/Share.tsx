import { useState } from 'react'
import { Copy, Share2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'

export default function Share() {
  const { profile } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralCode = profile?.referral_code ?? ''
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(referralLink)}&size=200x200&bgcolor=030806&color=00d26a&margin=10&format=png`

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Join NeoGPT',
        text: 'Join me on NeoGPT and earn USDT by contributing idle computing power to AI training!',
        url: referralLink,
      })
    } else {
      copyLink()
    }
  }

  return (
    <Layout title="Invite Friends" showBack showActions={false}>
      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* QR Code card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex flex-col items-center gap-4">
          <p className="text-white font-bold text-sm self-start">Scan QR Code</p>
          <div className="rounded-xl overflow-hidden border-2 border-brand-500/30 bg-[#030806] p-2">
            {referralCode ? (
              <img
                src={qrUrl}
                alt="Referral QR Code"
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-gray-600 text-sm">
                Loading…
              </div>
            )}
          </div>
          <p className="text-gray-400 text-xs text-center">
            Friend scans this to register with your referral code
          </p>
        </div>

        {/* Referral code */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4 space-y-3">
          <p className="text-white font-bold text-sm">Your Referral Code</p>
          <div className="flex items-center gap-3 bg-surface-muted rounded-xl px-4 py-3">
            <p className="flex-1 text-brand-300 font-mono font-bold tracking-widest text-base">
              {referralCode || '—'}
            </p>
            <button onClick={copyLink} className="text-brand-400 active:opacity-60">
              <Copy size={16} />
            </button>
          </div>

          <p className="text-xs text-gray-500">Or share your full invite link:</p>
          <div className="flex items-center gap-2 bg-surface-muted rounded-xl px-3 py-2">
            <p className="flex-1 text-xs text-gray-400 truncate">{referralLink}</p>
            <button onClick={copyLink} className="text-brand-400 flex-shrink-0 active:opacity-60">
              <Copy size={14} />
            </button>
          </div>

          {copied && (
            <p className="text-center text-xs text-brand-400 font-semibold">✓ Copied to clipboard!</p>
          )}

          <button onClick={handleShare} className="btn-primary flex items-center justify-center gap-2 mt-1">
            <Share2 size={16} />
            Share Invite Link
          </button>
        </div>

        {/* Reward rates */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <p className="text-white font-bold text-sm mb-3">Team Reward Rates</p>
          <div className="space-y-3">
            {[
              { level: 'A-Level (Direct)',   rate: '5% – 10%', desc: 'Direct invites you bring' },
              { level: 'B-Level (2nd tier)', rate: '3% – 8%',  desc: 'Friends of your friends'  },
              { level: 'C-Level (3rd tier)', rate: '1% – 6%',  desc: 'Extended network'         },
            ].map(({ level, rate, desc }) => (
              <div key={level} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{level}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
                <span className="text-amber-400 font-bold text-sm">{rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <p className="text-white font-bold text-sm mb-3">How It Works</p>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Share your link',         desc: 'Send your referral link to friends'   },
              { step: '2', title: 'They join & participate', desc: 'Friends register and start tasks'     },
              { step: '3', title: 'You both earn',           desc: 'Receive team rewards automatically'  },
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
