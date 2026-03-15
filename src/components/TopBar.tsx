import { Link } from 'react-router-dom'
import { Bell, Headphones, Globe, ChevronLeft } from 'lucide-react'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showActions?: boolean
}

export default function TopBar({ title, showBack, showActions = true }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 bg-surface-card/95 backdrop-blur-md border-b border-surface-border sticky top-0 z-40"
            style={{ paddingTop: 'env(safe-area-inset-top, 12px)', paddingBottom: '10px' }}>
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link to={-1 as never} className="flex items-center gap-1.5 text-white">
            <ChevronLeft size={22} className="text-gray-400" />
            {title && <span className="font-bold text-white text-base">{title}</span>}
          </Link>
        ) : (
          <Link to="/home" className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand-sm">
              <span className="text-white font-extrabold text-sm">U</span>
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">UltraGPT</span>
          </Link>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-0.5">
          <Link to="/lang" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-white active:bg-surface-muted transition-colors">
            <Globe size={18} />
          </Link>
          <a href="https://t.me/ultragptsupport" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-white active:bg-surface-muted transition-colors">
            <Headphones size={18} />
          </a>
          <Link to="/notifications" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-white active:bg-surface-muted transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-400 rounded-full shadow-brand-sm" />
          </Link>
        </div>
      )}
    </header>
  )
}
