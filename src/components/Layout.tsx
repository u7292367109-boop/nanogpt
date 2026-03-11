import { type ReactNode } from 'react'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
  showTopBar?: boolean
  showBottomNav?: boolean
  title?: string
  showBack?: boolean
  showActions?: boolean
}

export default function Layout({
  children,
  showTopBar = true,
  showBottomNav = true,
  title,
  showBack = false,
  showActions = true,
}: LayoutProps) {
  return (
    <div className="page-container">
      {showTopBar && (
        <TopBar title={title} showBack={showBack} showActions={showActions} />
      )}
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
