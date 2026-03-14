import { ChevronLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LanguageContext'
import type { LangCode } from '../lib/i18n'

const LANGUAGES: { code: LangCode; name: string; native: string }[] = [
  { code: 'EN', name: 'English',    native: 'English'   },
  { code: 'PT', name: 'Portuguese', native: 'Português' },
  { code: 'ES', name: 'Spanish',    native: 'Español'   },
  { code: 'ZH', name: 'Chinese',    native: '中文'      },
  { code: 'AR', name: 'Arabic',     native: 'العربية'   },
  { code: 'FR', name: 'French',     native: 'Français'  },
  { code: 'DE', name: 'German',     native: 'Deutsch'   },
  { code: 'RU', name: 'Russian',    native: 'Русский'   },
  { code: 'JA', name: 'Japanese',   native: '日本語'    },
  { code: 'KO', name: 'Korean',     native: '한국어'    },
]

export default function Language() {
  const { user } = useAuth()
  const { lang, setLang, t } = useLang()

  async function handleSelect(code: LangCode) {
    setLang(code)          // updates context + localStorage immediately
    if (user) {
      await supabase.from('profiles').update({ language: code }).eq('id', user.id)
    }
  }

  return (
    <div className="page-container">
      <header className="flex items-center justify-between px-4 py-3 bg-surface-card border-b border-surface-border sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to={-1 as never} className="text-gray-400"><ChevronLeft size={22} /></Link>
          <h1 className="text-white font-semibold">{t('language')}</h1>
        </div>
        <span className="text-brand-400 text-xs font-bold">
          {LANGUAGES.find(l => l.code === lang)?.native ?? 'EN'}
        </span>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        <div className="card p-0 overflow-hidden">
          {LANGUAGES.map(({ code, name, native }) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className="menu-item w-full text-left px-4"
            >
              <div>
                <p className="text-white text-sm font-medium">{native}</p>
                <p className="text-gray-500 text-xs">{name}</p>
              </div>
              {lang === code && <Check size={16} className="text-brand-400" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
