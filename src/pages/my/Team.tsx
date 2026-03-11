import { useEffect, useState } from 'react'
import { Users, UserPlus } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { LEVEL_CONFIG } from '../../lib/utils'

interface TeamMember {
  id: string
  username: string
  level: number
  created_at: string
  tier: number
}

export default function Team() {
  const { user, profile } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [activeTab, setActiveTab] = useState(1)

  useEffect(() => {
    if (user) {
      supabase
        .from('referrals')
        .select('tier, referred_id, created_at, profiles:referred_id(username, level)')
        .eq('referrer_id', user.id)
        .then(({ data }) => {
          if (data) {
            const m = data.map((r: any) => ({
              id: r.referred_id,
              username: r.profiles?.username ?? 'Unknown',
              level: r.profiles?.level ?? 0,
              created_at: r.created_at,
              tier: r.tier,
            }))
            setMembers(m)
          }
        })
    }
  }, [user])

  const userLevel = profile?.level ?? 0
  const levelConfig = LEVEL_CONFIG[userLevel]
  const filtered = members.filter(m => m.tier === activeTab)

  return (
    <Layout title="My Team" showBack showActions={false}>
      <div className="px-4 pt-4 space-y-4">
        {/* Team rewards */}
        <div className="card bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border-indigo-500/20">
          <p className="text-xs text-gray-400 mb-3">Your Team Reward Rate (LV.{userLevel})</p>
          <div className="grid grid-cols-3 gap-2">
            {['A-Level', 'B-Level', 'C-Level'].map((tier, i) => (
              <div key={tier} className="bg-white/5 rounded-xl py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{tier}</p>
                <p className="text-lg font-bold text-indigo-400">{levelConfig?.teamRewards[i] ?? 0}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(tier => (
            <div key={tier} className="stat-card">
              <p className="text-xs text-gray-400 mb-1">{['A', 'B', 'C'][tier - 1]}-Level</p>
              <p className="text-xl font-bold text-white">{members.filter(m => m.tier === tier).length}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[1, 2, 3].map(tier => (
            <button
              key={tier}
              onClick={() => setActiveTab(tier)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tier ? 'bg-indigo-600 text-white' : 'bg-surface-muted text-gray-400'
              }`}
            >
              {['A', 'B', 'C'][tier - 1]}-Level
            </button>
          ))}
        </div>

        {/* Member list */}
        {filtered.length === 0 ? (
          <div className="card text-center py-10">
            <Users size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No {['A', 'B', 'C'][activeTab - 1]}-level members yet</p>
            <p className="text-gray-600 text-xs mt-1">Invite friends to grow your team</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            {filtered.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-4 border-b border-surface-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  {member.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{member.username}</p>
                  <p className="text-gray-500 text-xs">LV.{member.level}</p>
                </div>
                <span className="text-xs text-gray-500">{new Date(member.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Invite CTA */}
        <button className="btn-primary flex items-center justify-center gap-2">
          <UserPlus size={16} />
          Invite Friends
        </button>
      </div>
    </Layout>
  )
}
