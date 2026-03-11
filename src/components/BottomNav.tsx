import { Link, useLocation } from 'react-router-dom'
import { Zap, ListTodo, Home, Bot, User } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { path: '/task',    icon: ListTodo, label: 'Task'    },
  { path: '/power',   icon: Zap,      label: 'Power'   },
  { path: '/home',    icon: Home,     label: 'Home'    },
  { path: '/ai',      icon: Bot,      label: 'AI'      },
  { path: '/profile', icon: User,     label: 'Profile' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = pathname === path || (path !== '/home' && pathname.startsWith(path))
        return (
          <Link
            key={path}
            to={path}
            className={cn('nav-item', active && 'active')}
          >
            {/* Active indicator pill */}
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-400 rounded-full" />
            )}
            <div className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200',
              active ? 'bg-brand-500/20' : ''
            )}>
              <Icon
                size={20}
                className={active ? 'text-brand-400' : 'text-gray-600'}
                strokeWidth={active ? 2.5 : 1.8}
              />
            </div>
            <span className={cn('leading-none', active ? 'text-brand-400' : 'text-gray-600')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
