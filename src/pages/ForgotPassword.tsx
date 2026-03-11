import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Loader2, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto px-6 py-10">
      <Link to="/login" className="flex items-center gap-1 text-gray-400 mb-8">
        <ChevronLeft size={20} />
        <span className="text-sm">Back to Login</span>
      </Link>

      <h2 className="text-2xl font-bold text-white mb-1">Reset Password</h2>
      <p className="text-gray-400 text-sm mb-8">
        Enter your email to receive a reset link
      </p>

      {sent ? (
        <div className="card text-center py-8">
          <Mail size={40} className="text-brand-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Check your email</h3>
          <p className="text-gray-400 text-sm">
            We've sent a password reset link to <span className="text-white">{email}</span>
          </p>
          <Link to="/login" className="btn-primary block mt-6">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  )
}
