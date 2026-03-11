import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Cpu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const { signIn }                    = useAuth()
  const navigate                      = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError('Invalid email or password. Please try again.')
    else navigate('/home')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto px-5 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-56 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2 pt-14 pb-0 relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand-sm">
          <Cpu size={17} className="text-white" />
        </div>
        <span className="font-extrabold text-white text-xl tracking-tight">NanoGPT</span>
      </div>

      <div className="relative mt-8 mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Welcome back</h2>
        <p className="text-gray-500 text-sm">Sign in to continue earning</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div>
          <label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-400 font-semibold">Forgot?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="input-field pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 active:text-gray-300"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
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
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 relative">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-400 font-bold">Create Account</Link>
      </p>

      <p className="mt-auto py-8 text-center text-xs text-gray-700">
        <Link to="/privacy" className="text-brand-400/50">Terms & Privacy Policy</Link>
      </p>
    </div>
  )
}
