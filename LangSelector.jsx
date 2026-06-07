import { useState, useRef, useEffect } from 'react'
import { useLanguage } from './LanguageContext.jsx'

const css = `
  .lang-wrap { position:relative; }
  .lang-btn {
    background:rgba(255,255,255,.06); border:1px solid rgba(201,150,12,.25);
    color:rgba(201,150,12,.9); font-family:'Montserrat',sans-serif;
    font-size:10px; font-weight:700; letter-spacing:1.5px;
    padding:6px 12px; cursor:pointer; display:flex; align-items:center; gap:6px;
    transition:all .2s; white-space:nowrap;
  }
  .lang-btn:hover { border-color:rgba(201,150,12,.6); }
  .lang-dropdown {
    position:absolute; top:calc(100% + 6px); right:0;
    background:#0e0e0e; border:1px solid rgba(201,150,12,.3);
    width:200px; z-index:9999;
    box-shadow:0 16px 48px rgba(0,0,0,.8);
  }
  .lang-search {
    width:100%; background:rgba(255,255,255,.05); border:none; border-bottom:1px solid rgba(201,150,12,.15);
    color:#fff; font-family:'Montserrat',sans-serif; font-size:11px;
    padding:10px 12px; outline:none;
  }
  .lang-search::placeholder { color:rgba(255,255,255,.25); }
  .lang-list { max-height:260px; overflow-y:auto; }
  .lang-list::-webkit-scrollbar { width:3px; }
  .lang-list::-webkit-scrollbar-thumb { background:rgba(201,150,12,.3); }
  .lang-option {
    display:flex; align-items:center; gap:10px;
    padding:9px 12px; cursor:pointer; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:500; color:rgba(255,255,255,.65);
    transition:all .15s; border:none; background:none;
    width:100%; text-align:left;
  }
  .lang-option:hover { background:rgba(201,150,12,.1); color:#C9960C; }
  .lang-option.active { color:#C9960C; background:rgba(201,150,12,.06); font-weight:700; }
  .lang-flag { font-size:15px; flex-shrink:0; }
`

export default function LangSelector() {
  const { lang, setLang, LANGUAGES } = useLanguage()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  const filtered = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <style>{css}</style>
      <div className="lang-wrap" ref={ref}>
        <button className="lang-btn" onClick={() => { setOpen(v => !v); setSearch('') }}>
          <span className="lang-flag">{current.flag}</span>
          {current.code}
          <span style={{opacity:.4, fontSize:'7px'}}>▼</span>
        </button>

        {open && (
          <div className="lang-dropdown">
            <input
              className="lang-search"
              placeholder="Search language..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <div className="lang-list">
              {filtered.map(l => (
                <button key={l.code}
                  className={`lang-option${l.code === lang ? ' active' : ''}`}
                  onClick={() => { setLang(l.code); setOpen(false); setSearch('') }}>
                  <span className="lang-flag">{l.flag}</span>
                  {l.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <div style={{padding:'12px',color:'rgba(255,255,255,.3)',fontSize:'11px',textAlign:'center'}}>
                  No results
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
