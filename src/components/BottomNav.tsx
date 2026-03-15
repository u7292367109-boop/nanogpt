import { Link, useLocation } from 'react-router-dom'
import { Zap, ListTodo, Home, Bot, User } from 'lucide-react'
import { cn } from '../lib/utils'
import { useLang } from '../context/LanguageContext'

export default function BottomNav() {
  const { pathname } = useLocation()
  const { t } = useLang()

  const navItems = [
    { path: '/task',    icon: ListTodo, label: t('nav_task')    },
    { path: '/power',   icon: Zap,      label: t('nav_power')   },
    { path: '/home',    icon: Home,     label: t('nav_home')    },
    { path: '/ai',      icon: Bot,      label: t('nav_ai')      },
    { path: '/profile', icon: User,     label: t('nav_profile') },
  ]

  return (
    <nav className="bottom-nav md:hidden">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = pathname === path ||
          (path === '/profile' && (pathname === '/profile' || pathname.startsWith('/my/'))) ||
          (path !== '/home' && path !== '/profile' && pathname.startsWith(path))
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
