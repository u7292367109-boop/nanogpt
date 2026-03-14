import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { LangCode } from '../lib/i18n'
import { t as translate } from '../lib/i18n'

interface LanguageContextType {
  lang: LangCode
  setLang: (code: LangCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(
    () => (localStorage.getItem('lang') as LangCode) ?? 'EN'
  )

  // Sync if localStorage changes from another tab
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'lang' && e.newValue) {
        setLangState(e.newValue as LangCode)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function setLang(code: LangCode) {
    localStorage.setItem('lang', code)
    setLangState(code)
  }

  function t(key: string): string {
    return translate(key, lang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
