import { Link, useLocation } from 'react-router-dom'
import { Zap, ListTodo, Home, Bot, User } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { path: '/task', icon: ListTodo, label: 'Task' },
  { path: '/power', icon: Zap, label: 'Power' },
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/ai', icon: Bot, label: 'AI' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav safe-area-bottom">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = pathname === path || (path !== '/home' && pathname.startsWith(path))
        return (
          <Link
            key={path}
            to={path}
            className={cn('nav-item', active && 'active')}
          >
            <Icon
              size={22}
              className={active ? 'text-indigo-400' : 'text-gray-500'}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span className={active ? 'text-indigo-400' : 'text-gray-500'}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
