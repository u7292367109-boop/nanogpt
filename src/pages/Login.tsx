import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Cpu, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('Invalid email or password')
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Cpu size={18} className="text-white" />
        </div>
        <span className="font-bold text-white text-xl">NanoGPT</span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
      <p className="text-gray-400 text-sm mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Email / Username</label>
          <input
            type="text"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="input-field pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Link to="/forgot-password" className="text-xs text-indigo-400 block text-right">
          Forgot password?
        </Link>

        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 font-medium">Register</Link>
      </p>

      <p className="mt-auto pt-8 text-center text-xs text-gray-600">
        <Link to="/privacy" className="text-indigo-400/70">Privacy Policy & Terms</Link>
      </p>
    </div>
  )
}
