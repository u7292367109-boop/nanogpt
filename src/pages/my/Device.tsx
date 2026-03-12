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

function detectUA() {
  const ua = navigator.userAgent
  let model = 'Computing Node', os = 'Unknown OS', br = 'Browser'
  if (ua.indexOf('iPhone') > -1) {
    model = 'iPhone'
    const m = ua.match(/iPhone OS ([\d_]+)/); os = m ? 'iOS ' + m[1].replace(/_/g, '.') : 'iOS'
  } else if (ua.indexOf('Android') > -1) {
    const mm = ua.match(/Android [\d.]+; ([^;)]+)/); model = mm ? mm[1].trim() : 'Android Device'
    const vm = ua.match(/Android ([\d.]+)/); os = vm ? 'Android ' + vm[1] : 'Android'
  } else if (ua.indexOf('Windows') > -1) {
    model = 'Windows PC'; os = 'Windows 10/11'
  } else if (ua.indexOf('Macintosh') > -1) {
    model = 'MacBook'
    const mc = ua.match(/Mac OS X ([\d_]+)/); os = mc ? 'macOS ' + mc[1].replace(/_/g, '.') : 'macOS'
  } else if (ua.indexOf('Linux') > -1) {
    model = 'Linux PC'; os = 'Linux'
  }
  if (ua.includes('Edg/')) br = 'Edge'
  else if (ua.includes('OPR/') || ua.includes('Opera')) br = 'Opera'
  else if (ua.includes('Chrome/') && !ua.includes('Chromium')) br = 'Chrome'
  else if (ua.includes('Firefox/')) br = 'Firefox'
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) br = 'Safari'
  return { model, platform: br + ' · NanoGPT Node', os }
}

export default function Device() {
  const { user } = useAuth()
  const [device, setDevice] = useState<DeviceInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    var det = detectUA()
    supabase.from('devices').select('*').eq('user_id', user.id).maybeSingle().then(async function({ data }) {
      if (data) {
        var needs = (data.model==='iPhone'&&det.model!=='iPhone')||data.os==='NanoGPT OS'||data.os==='Unknown OS'
        if (needs) { await supabase.from('devices').update({ model: det.model, platform: det.platform, os: det.os }).eq('user_id', user.id); setDevice(Object.assign({}, data, det)) }
        else setDevice(data)
      } else {
        setDevice({ device_id: user.id.replace(/-/g,'').slice(0,32), model: det.model, platform: det.platform, os: det.os, ip: null })
      }
      setLoading(false)
    })
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
          <p className="text-white font-bold text-lg">{loading ? 'Detecting device…' : (device?.model ?? 'Computing Node')}</p>
          <p className="text-gray-400 text-xs mt-1">General Node Power Center</p>
        </div>

        {loading ? (
          <div className="card flex items-center justify-center py-10 gap-2">
            <Cpu size={18} className="text-brand-400 animate-spin" />
            <span className="text-gray-400 text-sm">Loading device info…</span>
          </div>
        ) : (
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
        )}

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
