import { createContext, useContext, useState, useEffect } from 'react'
import { getT, LANGUAGES } from './i18n.js'

const LangCtx = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('aureva-lang') || 'EN'
  })

  useEffect(() => {
    localStorage.setItem('aureva-lang', lang)
  }, [lang])

  const t = (key) => getT(lang)[key] || getT('EN')[key] || key

  return (
    <LangCtx.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LangCtx.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
