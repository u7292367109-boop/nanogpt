import { useEffect, useState } from 'react'
import { Bell, Megaphone, Wrench } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { timeAgo } from '../lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  content: string | null
  read: boolean
  created_at: string
}

const TABS = [
  { key: 'update', label: 'Update', icon: Wrench },
  { key: 'service', label: 'Service', icon: Bell },
  { key: 'announcement', label: 'Announcement', icon: Megaphone },
]

export default function Notifications() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('update')
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (user) {
      supabase.from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .eq('type', activeTab)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setNotifications(data)
        })
    }
  }, [user, activeTab])

  return (
    <Layout title="Notifications" showBack showActions={false}>
      {/* Tabs */}
      <div className="flex border-b border-surface-border">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-all
              ${activeTab === key
                ? 'text-brand-400 border-b-2 border-brand-500'
                : 'text-gray-500'
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {notifications.length === 0 ? (
          <div className="text-center py-14">
            <Bell size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`card ${!n.read ? 'border-brand-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-1">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-gray-300'}`}>{n.title}</p>
                  <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{timeAgo(n.created_at)}</span>
                </div>
                {n.content && <p className="text-gray-400 text-xs leading-relaxed">{n.content}</p>}
                {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 absolute top-4 right-4" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
