import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const TUTORIALS = [
  { title: 'How to register', category: 'Basic Tutorial' },
  { title: 'How to reset password', category: 'Basic Tutorial' },
  { title: 'How to set up funds password', category: 'Basic Tutorial' },
  { title: 'How to bind your own device', category: 'Basic Tutorial' },
  { title: 'How to start a Task', category: 'Basic Tutorial' },
  { title: 'How to check profit history', category: 'Basic Tutorial' },
  { title: 'How to invite friends', category: 'Basic Tutorial' },
  { title: 'How to check team rewards', category: 'Basic Tutorial' },
  { title: 'How to deposit', category: 'Basic Tutorial' },
  { title: 'How to withdraw', category: 'Basic Tutorial' },
  { title: 'How to edit your profile', category: 'Basic Tutorial' },
  { title: 'How to do KYC', category: 'Basic Tutorial' },
]

export default function Tutorials() {
  return (
    <div className="page-container">
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
        <Link to="/home" className="text-gray-400"><ChevronLeft size={22} /></Link>
        <h1 className="text-white font-semibold">Tutorials</h1>
      </header>

      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-brand-400" />
          <p className="text-gray-400 text-sm">Learn how to use UltraGPT</p>
        </div>

        <div className="card p-0 overflow-hidden">
          {TUTORIALS.map((t, i) => (
            <button key={i} className="menu-item w-full text-left">
              <div>
                <p className="text-white text-sm font-medium">{t.title}</p>
                <p className="text-xs text-brand-400 mt-0.5">{t.category}</p>
              </div>
              <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
