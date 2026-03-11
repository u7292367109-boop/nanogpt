import { ChevronLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const LANGUAGES = [
  { code: 'EN', name: 'English', native: 'English' },
  { code: 'PT', name: 'Portuguese', native: 'Português' },
  { code: 'ES', name: 'Spanish', native: 'Español' },
  { code: 'ZH', name: 'Chinese', native: '中文' },
  { code: 'AR', name: 'Arabic', native: 'العربية' },
  { code: 'FR', name: 'French', native: 'Français' },
  { code: 'DE', name: 'German', native: 'Deutsch' },
  { code: 'RU', name: 'Russian', native: 'Русский' },
  { code: 'JA', name: 'Japanese', native: '日本語' },
  { code: 'KO', name: 'Korean', native: '한국어' },
]

export default function Language() {
  const [selected, setSelected] = useState('EN')

  return (
    <div className="page-container">
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
        <Link to={-1 as never} className="text-gray-400"><ChevronLeft size={22} /></Link>
        <h1 className="text-white font-semibold">Language</h1>
      </header>

      <div className="px-4 pt-4">
        <div className="card p-0 overflow-hidden">
          {LANGUAGES.map(({ code, name, native }) => (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className="menu-item w-full text-left"
            >
              <div>
                <p className="text-white text-sm font-medium">{native}</p>
                <p className="text-gray-500 text-xs">{name}</p>
              </div>
              {selected === code && <Check size={16} className="text-indigo-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
