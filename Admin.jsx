import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageContext.jsx'
import { useNavigate } from 'react-router-dom'

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#060606; }
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35); --w10:rgba(255,255,255,.10); --w05:rgba(255,255,255,.05);
  }
  .page { min-height:100vh; background:var(--black); font-family:'Montserrat',sans-serif; padding:40px 32px 60px; }
  .glow { position:fixed; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,150,12,.06) 0%,transparent 60%); }
  .wrap { max-width:960px; margin:0 auto; position:relative; z-index:1; }
  .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:28px; border-bottom:1px solid rgba(201,150,12,.15); margin-bottom:36px; flex-wrap:wrap; gap:16px; }
  .logo-row { display:flex; align-items:center; gap:12px; }
  .brand { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); letter-spacing:6px; }
  .sys   { font-size:8px; font-weight:600; color:var(--w35); letter-spacing:4px; display:block; }
  .badge { background:rgba(201,150,12,.12); border:1px solid rgba(201,150,12,.3); color:var(--gold); font-size:9px; font-weight:800; letter-spacing:3px; padding:5px 14px; }
  .welcome { font-family:'Great Vibes',cursive; font-size:36px; color:var(--gold); text-shadow:0 0 30px rgba(201,150,12,.3); }
  .logout { background:none; border:1px solid rgba(255,255,255,.1); color:var(--w35); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:600; letter-spacing:2px; padding:8px 16px; cursor:pointer; transition:all .2s; }
  .logout:hover { border-color:rgba(201,150,12,.3); color:var(--gold); }
  .client-view-btn { background:rgba(201,150,12,.12); border:1px solid rgba(201,150,12,.4); color:var(--gold); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; padding:8px 16px; cursor:pointer; transition:all .2s; }
  .client-view-btn:hover { background:rgba(201,150,12,.22); }
  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:36px; }
  .stat-card { background:var(--w05); border:1px solid rgba(201,150,12,.12); padding:20px; position:relative; overflow:hidden; }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .stat-num { font-family:'Bebas Neue',sans-serif; font-size:42px; color:var(--gold); line-height:1; }
  .stat-lbl { font-size:9.5px; font-weight:600; color:var(--w35); letter-spacing:2px; margin-top:4px; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--w50); letter-spacing:4px; margin-bottom:16px; margin-top:32px; }
  .pages-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:36px; }
  .page-card { background:var(--w05); border:1px solid rgba(201,150,12,.12); padding:20px; text-decoration:none; cursor:pointer; transition:all .25s; display:flex; align-items:center; gap:14px; position:relative; overflow:hidden; }
  .page-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--gold); transform:scaleY(0); transition:transform .25s; }
  .page-card:hover { border-color:var(--gold); background:rgba(201,150,12,.05); }
  .page-card:hover::before { transform:scaleY(1); }
  .pc-icon { font-size:24px; flex-shrink:0; }
  .pc-info { display:flex; flex-direction:column; gap:3px; flex:1; }
  .pc-name { font-size:11px; font-weight:700; color:#fff; letter-spacing:1.5px; }
  .pc-desc { font-size:10px; color:var(--w35); }
  .pc-arr  { font-size:14px; color:var(--gold); opacity:.5; margin-left:auto; }
  .admin-footer { border-top:1px solid rgba(201,150,12,.1); padding-top:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  .admin-footer p { font-size:10px; color:rgba(255,255,255,.2); letter-spacing:1px; }

  @media(max-width:700px) {
    .stats { grid-template-columns:repeat(2,1fr); }
    .pages-grid { grid-template-columns:1fr; }
  }
`

const PAGES = [
  { icon:'🔐', name:'LOGIN PAGE',   desc:'User entry point',     to:'/' },
  { icon:'💳', name:'PRICING',      desc:'Plans & checkout',      to:'/pricing' },
  { icon:'👩', name:'ABOUT MIA',    desc:'Welcome & intro',       to:'/about' },
  { icon:'⚖',  name:'DISCLAIMER',  desc:'Health & legal',         to:'/disclaimer' },
  { icon:'🔗', name:'START / QR',   desc:'QR code hub',           to:'/start' },
  { icon:'📱', name:'APP PREVIEW',  desc:'Mobile app demo',        to:'/app-demo' },
  { icon:'🥗', name:'NUTRITION',    desc:'Macros calc + meal plan',  to:'/nutrition' },
  { icon:'🏋', name:'WORKOUTS',     desc:'All 28 training days',      to:'/workouts' },
]

export default function Admin() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Montserrat:wght@300;400;600;700;800&display=swap"/>
      <style>{css}</style>

      <div className="page">
        <div className="glow"/>
        <div className="wrap">

          <div className="header">
            <div style={{display:'flex',alignItems:'center',gap:'20px',flexWrap:'wrap'}}>
              <div className="logo-row">
                <svg width="36" height="32" viewBox="0 0 44 40" fill="none">
                  <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                  <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
                  <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
                </svg>
                <div><span className="brand">AUREVA</span><span className="sys">TRAINING SYSTEM</span></div>
              </div>
              <span className="badge">ADMIN</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
              <p className="welcome">{t('admin_welcome')}.</p>
              <button className="logout" onClick={() => { localStorage.removeItem('aureva-is-admin'); navigate('/') }}>{t('logout')}</button>
            </div>
          </div>

          <div className="stats">
            {[{num:'28',lbl:t('workouts_nav')},{num:'3',lbl:t('pricing_nav')},{num:'8',lbl:t('website_pages')},{num:'1',lbl:t('nutrition_nav')}].map(s => (
              <div key={s.lbl} className="stat-card">
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* ── CLIENT VIEW BANNER ── */}
          <div style={{background:'rgba(201,150,12,.07)',border:'1px solid rgba(201,150,12,.35)',padding:'18px 22px',marginBottom:'28px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:'9px',fontWeight:800,color:'rgba(201,150,12,.7)',letterSpacing:'3px',marginBottom:'4px'}}>ADMIN TOOL</p>
              <p style={{fontSize:'13px',fontWeight:600,color:'#fff'}}>{t('client_view_desc')}</p>
            </div>
            <button className="client-view-btn" onClick={() => navigate('/workouts')}>{t('client_view')}</button>
          </div>

          <p className="sec-title">{t('website_pages')}</p>
          <div className="pages-grid">
            {PAGES.map(p => (
              <div key={p.name} className="page-card" onClick={() => navigate(p.to)}>
                <span className="pc-icon">{p.icon}</span>
                <div className="pc-info"><span className="pc-name">{p.name}</span><span className="pc-desc">{p.desc}</span></div>
                <span className="pc-arr">›</span>
              </div>
            ))}
          </div>

          <p className="sec-title">{t('quick_actions')}</p>
          <div className="pages-grid" style={{marginBottom:'48px'}}>
            {[
              {icon:'📸',name:'INSTAGRAM',  desc:'@AurevaFitness',           href:'https://www.instagram.com/AurevaFitness'},
              {icon:'📘',name:'FACEBOOK',   desc:'Aureva Training System',    href:'https://www.facebook.com/AurevaTrainingSystem'},
              {icon:'💰',name:'STRIPE',     desc:'Manage payments',           href:'https://dashboard.stripe.com'},
            ].map(p => (
              <a key={p.name} className="page-card" href={p.href} target="_blank" rel="noreferrer">
                <span className="pc-icon">{p.icon}</span>
                <div className="pc-info"><span className="pc-name">{p.name}</span><span className="pc-desc">{p.desc}</span></div>
                <span className="pc-arr">↗</span>
              </a>
            ))}
          </div>

          <div className="admin-footer">
            <p>Aureva Training System · Admin Panel</p>
            <p>© 2026 Aureva Fitness · mtrofin@icloud.com</p>
          </div>
        </div>
      </div>

    </>
  )
}
