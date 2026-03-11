import { Link } from 'react-router-dom'
import { Bell, Headphones, Globe, ChevronLeft } from 'lucide-react'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showActions?: boolean
}

export default function TopBar({ title, showBack, showActions = true }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link to={-1 as never} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            {title && <span className="font-semibold text-white">{title}</span>}
          </Link>
        ) : (
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">NanoGPT</span>
          </Link>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-1">
          <Link to="/lang" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Globe size={18} />
          </Link>
          <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Headphones size={18} />
          </a>
          <Link to="/notifications" className="p-2 text-gray-400 hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          </Link>
        </div>
      )}
    </header>
  )
}
