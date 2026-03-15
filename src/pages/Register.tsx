import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Cpu, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [searchParams] = useSearchParams()
  const [form, setForm]             = useState({ username: '', email: '', password: '', referralCode: searchParams.get('ref') ?? '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const { signUp }                  = useAuth()
  const navigate                    = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.username, form.referralCode)
    setLoading(false)
    if (error) setError(error.message || 'Registration failed. Please try again.')
    else navigate('/home')
  }

  return (
    <div className="h-full bg-surface flex flex-col px-5 relative overflow-y-auto">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-56 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2 pt-14 relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand-sm">
          <Cpu size={17} className="text-white" />
        </div>
        <span className="font-extrabold text-white text-xl tracking-tight">UltraGPT</span>
      </div>

      <div className="relative mt-8 mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Create Account</h2>
        <p className="text-gray-500 text-sm">Join the AI computing revolution</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {[
          { name: 'username', label: 'Username',   placeholder: 'Choose a username',  type: 'text',  ac: 'username' },
          { name: 'email',    label: 'Email',       placeholder: 'your@email.com',     type: 'email', ac: 'email' },
        ].map(({ name, label, placeholder, type, ac }) => (
          <div key={name}>
            <label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">{label}</label>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              className="input-field"
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              required
              autoComplete={ac}
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className="input-field pr-12"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 active:text-gray-300">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">
            Referral Code <span className="text-gray-600 normal-case font-normal">(optional)</span>
          </label>
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
          <div className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary shadow-brand mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 relative">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 font-bold">Sign In</Link>
      </p>

      <p className="mt-auto py-8 text-center text-xs text-gray-700">
        By registering you agree to our{' '}
        <Link to="/privacy" className="text-brand-400/50">Privacy Policy</Link>
      </p>
    </div>
  )
}
