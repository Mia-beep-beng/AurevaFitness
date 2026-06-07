import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from './LanguageContext.jsx'

const css = `
  .af-wrap { position:fixed; bottom:20px; left:16px; z-index:8000; display:flex; flex-direction:column; align-items:flex-start; gap:8px; }

  .af-btn {
    display:flex; align-items:center; gap:8px;
    background:rgba(6,6,6,.92); border:1px solid rgba(201,150,12,.45);
    color:rgba(201,150,12,.9); font-family:'Montserrat',sans-serif;
    font-size:10px; font-weight:700; letter-spacing:2px;
    padding:8px 14px; cursor:pointer;
    box-shadow:0 4px 24px rgba(0,0,0,.6);
    transition:all .2s;
  }
  .af-btn:hover { border-color:rgba(201,150,12,.8); color:#C9960C; background:rgba(6,6,6,1); }
  .af-icon { font-size:13px; }

  .af-menu {
    background:rgba(10,10,10,.97); border:1px solid rgba(201,150,12,.3);
    box-shadow:0 8px 32px rgba(0,0,0,.8); min-width:200px;
    overflow:hidden;
  }
  .af-menu-title { font-size:8px; font-weight:800; color:rgba(201,150,12,.5); letter-spacing:3px; padding:10px 14px 6px; border-bottom:1px solid rgba(201,150,12,.1); }
  .af-menu-item {
    display:flex; align-items:center; gap:10px; width:100%;
    padding:10px 14px; background:none; border:none; border-bottom:1px solid rgba(255,255,255,.04);
    color:rgba(255,255,255,.7); font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:600; cursor:pointer; text-align:left;
    transition:all .15s;
  }
  .af-menu-item:hover { background:rgba(201,150,12,.08); color:#C9960C; }
  .af-menu-item:last-child { border-bottom:none; }
  .af-sep { height:1px; background:rgba(201,150,12,.12); margin:4px 0; }
`

const CLIENT_PAGES = [
  { icon:'🏋', label:'Workouts',    to:'/workouts' },
  { icon:'🥗', label:'Nutrition',   to:'/nutrition' },
  { icon:'📏', label:'Measurements',to:'/measurements' },
  { icon:'💳', label:'Pricing',     to:'/pricing' },
  { icon:'👩', label:'About Mia',   to:'/about' },
  { icon:'🔗', label:'Start / QR',  to:'/start' },
  { icon:'⚖',  label:'Disclaimer',  to:'/disclaimer' },
  { icon:'📱', label:'App Preview', to:'/app-demo' },
]

export default function AdminFloater() {
  const isAdmin = localStorage.getItem('aureva-is-admin') === 'true'
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // Don't show on admin or login pages
  if (!isAdmin || pathname === '/admin' || pathname === '/') return null

  return (
    <>
      <style>{css}</style>
      <div className="af-wrap">
        {open && (
          <div className="af-menu">
            <div className="af-menu-title">CLIENT VIEW</div>
            {CLIENT_PAGES.map(p => (
              <button key={p.to} className="af-menu-item"
                onClick={() => { navigate(p.to); setOpen(false) }}>
                <span>{p.icon}</span>{p.label}
              </button>
            ))}
            <div className="af-sep"/>
            <button className="af-menu-item" style={{color:'rgba(201,150,12,.8)'}}
              onClick={() => { navigate('/admin'); setOpen(false) }}>
              <span>⚙</span> Back to Admin
            </button>
          </div>
        )}
        <button className="af-btn" onClick={() => setOpen(v => !v)}>
          <span className="af-icon">⚙</span>
          {open ? 'CLOSE' : 'ADMIN'}
        </button>
      </div>
    </>
  )
}
