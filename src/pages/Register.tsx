import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Cpu, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', referralCode: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.username, form.referralCode)
    setLoading(false)
    if (error) {
      setError(error.message || 'Registration failed')
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Cpu size={18} className="text-white" />
        </div>
        <span className="font-bold text-white text-xl">NanoGPT</span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
      <p className="text-gray-400 text-sm mb-8">Join the AI computing revolution</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'username', label: 'Username', placeholder: 'Choose a username', type: 'text' },
          { name: 'email', label: 'Email', placeholder: 'Enter your email', type: 'email' },
        ].map(({ name, label, placeholder, type }) => (
          <div key={name}>
            <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              className="input-field"
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className="input-field pr-10"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Referral Code <span className="text-gray-600">(optional)</span></label>
          <input
            name="referralCode"
            type="text"
            placeholder="Enter referral code"
            className="input-field"
            value={form.referralCode}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 font-medium">Sign In</Link>
      </p>

      <p className="mt-4 text-center text-xs text-gray-600">
        By registering, you agree to our{' '}
        <Link to="/privacy" className="text-indigo-400/70">Privacy Policy</Link>
      </p>
    </div>
  )
}
