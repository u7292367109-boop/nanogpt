import { useEffect, useState } from 'react'
import { Smartphone, Cpu, Globe, Monitor, Hash } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface DeviceInfo {
  device_id: string
  model: string
  platform: string
  os: string
  ip: string | null
}

export default function Device() {
  const { user } = useAuth()
  const [device, setDevice] = useState<DeviceInfo | null>(null)

  useEffect(() => {
    if (user) {
      supabase.from('devices').select('*').eq('user_id', user.id).single().then(({ data }) => {
        if (data) setDevice(data)
      })
    }
  }, [user])

  const fields = device ? [
    { icon: Hash, label: 'Device ID', value: device.device_id, mono: true },
    { icon: Smartphone, label: 'Mobile Model', value: device.model },
    { icon: Cpu, label: 'Device Platform', value: device.platform },
    { icon: Monitor, label: 'Operating System', value: device.os },
    { icon: Globe, label: 'IP Address', value: device.ip ?? 'Not available' },
  ] : []

  return (
    <Layout title="My Device" showBack showActions={false}>
      <div className="px-4 pt-4 space-y-4">
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-950 to-emerald-900 flex items-center justify-center text-4xl mb-3 glow-pulse">
            📱
          </div>
          <p className="text-white font-bold text-lg">{device?.model ?? 'Loading...'}</p>
          <p className="text-gray-400 text-xs mt-1">General Node Power Center</p>
        </div>

        <div className="card p-0 overflow-hidden">
          {fields.map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex items-start gap-3 p-4 border-b border-surface-border last:border-0">
              <Icon size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className={`text-white text-sm break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-brand-500/10 border-brand-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-brand-400" />
            <p className="text-brand-300 text-xs font-semibold">Node Status</p>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            Your device is registered as a General Computing Node in the NanoGPT network.
            It contributes idle processing power to train AI models and earns USDT rewards.
          </p>
        </div>
      </div>
    </Layout>
  )
}
