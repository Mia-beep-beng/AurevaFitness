import { useState } from 'react'
import { useLanguage } from './LanguageContext.jsx'

const css = `
  .lang-wrap { position:relative; }
  .lang-btn {
    background:rgba(255,255,255,.06); border:1px solid rgba(201,150,12,.2);
    color:rgba(201,150,12,.8); font-family:'Montserrat',sans-serif;
    font-size:10px; font-weight:700; letter-spacing:1.5px;
    padding:6px 12px; cursor:pointer; display:flex; align-items:center; gap:6px;
    transition:all .2s; white-space:nowrap;
  }
  .lang-btn:hover { border-color:rgba(201,150,12,.5); color:#C9960C; }
  .lang-flag { font-size:14px; }
  .lang-dropdown {
    position:absolute; top:calc(100% + 6px); right:0;
    background:#0e0e0e; border:1px solid rgba(201,150,12,.25);
    min-width:140px; z-index:500;
    box-shadow:0 12px 40px rgba(0,0,0,.6);
  }
  .lang-option {
    display:flex; align-items:center; gap:10px;
    padding:10px 14px; cursor:pointer; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:600; color:rgba(255,255,255,.6);
    letter-spacing:1px; transition:all .15s; border:none; background:none;
    width:100%; text-align:left;
  }
  .lang-option:hover { background:rgba(201,150,12,.08); color:#C9960C; }
  .lang-option.active { color:#C9960C; background:rgba(201,150,12,.05); }
`

export default function LangSelector() {
  const { lang, setLang, LANGUAGES } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <>
      <style>{css}</style>
      <div className="lang-wrap">
        <button className="lang-btn" onClick={() => setOpen(v => !v)}>
          <span className="lang-flag">{current.flag}</span>
          {current.code}
          <span style={{opacity:.5,fontSize:'8px'}}>▼</span>
        </button>
        {open && (
          <div className="lang-dropdown" onMouseLeave={() => setOpen(false)}>
            {LANGUAGES.map(l => (
              <button key={l.code}
                className={`lang-option${l.code===lang?' active':''}`}
                onClick={() => { setLang(l.code); setOpen(false) }}>
                <span style={{fontSize:'16px'}}>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
