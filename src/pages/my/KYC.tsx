import { useEffect, useState } from 'react'
import { Shield, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function KYC() {
  const { user } = useAuth()
  const [status, setStatus] = useState<string>('unverified')
  const [form, setForm] = useState({ full_name: '', document_type: 'passport', document_number: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      supabase.from('kyc').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setStatus(data.status)
          if (data.full_name) setForm(f => ({ ...f, full_name: data.full_name ?? '' }))
        }
      })
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    await supabase.from('kyc').update({
      ...form,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    }).eq('user_id', user.id)
    setLoading(false)
    setStatus('pending')
  }

  const STATUS_CONFIG = {
    unverified: { icon: Shield, color: 'text-gray-400', label: 'Not Verified', bg: 'bg-gray-500/10 border-gray-500/20' },
    pending: { icon: Clock, color: 'text-amber-400', label: 'Under Review', bg: 'bg-amber-500/10 border-amber-500/20' },
    verified: { icon: CheckCircle, color: 'text-green-400', label: 'Verified', bg: 'bg-green-500/10 border-green-500/20' },
    rejected: { icon: XCircle, color: 'text-red-400', label: 'Rejected', bg: 'bg-red-500/10 border-red-500/20' },
  }

  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unverified
  const StatusIcon = config.icon

  return (
    <Layout title="KYC Verification" showBack showActions={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* Status card */}
        <div className={`card border ${config.bg}`}>
          <div className="flex items-center gap-3">
            <StatusIcon size={28} className={config.color} />
            <div>
              <p className="text-white font-semibold">Verification Status</p>
              <p className={`text-sm ${config.color}`}>{config.label}</p>
            </div>
          </div>
        </div>

        {status === 'verified' ? (
          <div className="card text-center py-10">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">Identity Verified!</p>
            <p className="text-gray-400 text-sm mt-2">Your account has been fully verified</p>
          </div>
        ) : status === 'pending' ? (
          <div className="card text-center py-10">
            <Clock size={48} className="text-amber-400 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">Under Review</p>
            <p className="text-gray-400 text-sm mt-2">Your documents are being reviewed.<br />This usually takes 1-3 business days.</p>
          </div>
        ) : (
          <>
            <div className="card bg-brand-500/10 border-brand-500/20">
              <p className="text-brand-300 text-xs font-semibold mb-1">Why verify?</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                KYC verification unlocks higher withdrawal limits and enhanced security features for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="card space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                  <input
                    className="input-field"
                    placeholder="As shown on your ID"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Document Type</label>
                  <select
                    className="input-field"
                    value={form.document_type}
                    onChange={e => setForm(f => ({ ...f, document_type: e.target.value }))}
                  >
                    <option value="passport">Passport</option>
                    <option value="id_card">National ID Card</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Document Number</label>
                  <input
                    className="input-field"
                    placeholder="Enter document number"
                    value={form.document_number}
                    onChange={e => setForm(f => ({ ...f, document_number: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Submit for Verification'}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  )
}
