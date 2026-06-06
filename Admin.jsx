import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WORKOUTS } from './workouts.js'

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
  .days-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; margin-bottom:36px; }
  .day-pill { background:var(--w05); border:1px solid rgba(201,150,12,.12); padding:10px 6px; text-align:center; cursor:pointer; transition:all .2s; }
  .day-pill:hover { border-color:var(--gold); background:rgba(201,150,12,.08); transform:translateY(-2px); }
  .day-num { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); line-height:1; }
  .day-lbl { font-size:7px; color:var(--w35); letter-spacing:1px; margin-top:3px; }
  .admin-footer { border-top:1px solid rgba(201,150,12,.1); padding-top:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  .admin-footer p { font-size:10px; color:rgba(255,255,255,.2); letter-spacing:1px; }

  /* ── Workout Modal ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.85); display:flex; align-items:flex-start; justify-content:center; z-index:100; padding:20px; overflow-y:auto; backdrop-filter:blur(4px); }
  .modal { background:#0a0a0a; border:1px solid rgba(201,150,12,.25); width:100%; max-width:680px; position:relative; margin:auto; }
  .modal::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1.5px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .modal-header { padding:28px 28px 20px; border-bottom:1px solid rgba(255,255,255,.07); display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
  .modal-day { font-family:'Bebas Neue',sans-serif; font-size:14px; color:var(--w35); letter-spacing:4px; margin-bottom:4px; }
  .modal-focus { font-family:'Bebas Neue',sans-serif; font-size:26px; color:var(--gold); letter-spacing:2px; line-height:1; }
  .modal-close { background:none; border:1px solid rgba(255,255,255,.15); color:var(--w35); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; padding:8px 14px; cursor:pointer; flex-shrink:0; transition:all .2s; }
  .modal-close:hover { border-color:var(--gold); color:var(--gold); }
  .modal-body { padding:24px 28px; }
  .modal-section { margin-bottom:24px; }
  .modal-sec-title { font-size:10px; font-weight:800; color:var(--gold); letter-spacing:3px; margin-bottom:12px; }
  .exercise-table { width:100%; border-collapse:collapse; }
  .exercise-table th { font-size:9px; font-weight:700; color:var(--w35); letter-spacing:2px; text-align:left; padding:6px 10px; border-bottom:1px solid rgba(201,150,12,.15); }
  .exercise-table th:not(:first-child) { text-align:center; }
  .exercise-table td { font-size:12px; color:var(--w70); padding:9px 10px; border-bottom:1px solid rgba(255,255,255,.05); }
  .exercise-table td:not(:first-child) { text-align:center; color:var(--w50); }
  .exercise-table tr:hover td { background:rgba(201,150,12,.04); }
  .ex-name { font-weight:600; color:#fff; }
  .info-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .info-box { background:rgba(201,150,12,.05); border:1px solid rgba(201,150,12,.15); padding:14px; }
  .info-box-title { font-size:9px; font-weight:800; color:var(--gold); letter-spacing:2.5px; margin-bottom:6px; }
  .info-box-txt { font-size:12px; color:var(--w70); line-height:1.6; }
  .modal-note { background:rgba(201,150,12,.08); border:1px solid rgba(201,150,12,.25); padding:14px; text-align:center; margin-top:16px; }
  .modal-note-txt { font-family:'Great Vibes',cursive; font-size:22px; color:var(--gold); }

  @media(max-width:700px) {
    .stats { grid-template-columns:repeat(2,1fr); }
    .pages-grid { grid-template-columns:1fr; }
    .days-grid { grid-template-columns:repeat(4,1fr); }
    .info-row { grid-template-columns:1fr; }
  }
`

const DAY_LABELS = ['LBS','UBS','PUSH','PULL','GLU','COND','REC']
const PAGES = [
  { icon:'🔐', name:'LOGIN PAGE',   desc:'User entry point',     to:'/' },
  { icon:'💳', name:'PRICING',      desc:'Plans & checkout',      to:'/pricing' },
  { icon:'👩', name:'ABOUT MIA',    desc:'Welcome & intro',       to:'/about' },
  { icon:'⚖',  name:'DISCLAIMER',  desc:'Health & legal',         to:'/disclaimer' },
  { icon:'🔗', name:'START / QR',   desc:'QR code hub',           to:'/start' },
  { icon:'📱', name:'APP PREVIEW',  desc:'Mobile app demo',        to:'/app-demo' },
  { icon:'🥗', name:'NUTRITION',    desc:'Macros calc + meal plan',  to:'/nutrition' },
]

export default function Admin() {
  const navigate = useNavigate()
  const [activeDay, setActiveDay] = useState(null)

  const w = activeDay ? WORKOUTS[activeDay] : null

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
              <p className="welcome">Welcome, Mia.</p>
              <button className="logout" onClick={() => navigate('/')}>LOG OUT</button>
            </div>
          </div>

          <div className="stats">
            {[{num:'28',lbl:'WORKOUT DAYS'},{num:'3',lbl:'PRICING PLANS'},{num:'6',lbl:'WEBSITE PAGES'},{num:'1',lbl:'MEAL PLAN'}].map(s => (
              <div key={s.lbl} className="stat-card">
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <p className="sec-title">WEBSITE PAGES</p>
          <div className="pages-grid">
            {PAGES.map(p => (
              <div key={p.name} className="page-card" onClick={() => navigate(p.to)}>
                <span className="pc-icon">{p.icon}</span>
                <div className="pc-info"><span className="pc-name">{p.name}</span><span className="pc-desc">{p.desc}</span></div>
                <span className="pc-arr">›</span>
              </div>
            ))}
          </div>

          <p className="sec-title">28-DAY PROGRAM — CLICK ANY DAY TO VIEW WORKOUT</p>
          <div className="days-grid">
            {Array.from({length:28},(_,i) => (
              <div key={i} className="day-pill" onClick={() => setActiveDay(i+1)}>
                <div className="day-num">{i+1}</div>
                <div className="day-lbl">{DAY_LABELS[i%7]}</div>
              </div>
            ))}
          </div>

          <p className="sec-title">QUICK ACTIONS</p>
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

      {/* ── Workout Modal ── */}
      {w && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setActiveDay(null) }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <p className="modal-day">DAY {w.day}</p>
                <p className="modal-focus">{w.focus}</p>
              </div>
              <button className="modal-close" onClick={() => setActiveDay(null)}>✕ CLOSE</button>
            </div>
            <div className="modal-body">

              {/* Exercises */}
              <div className="modal-section">
                <p className="modal-sec-title">MAIN WORKOUT</p>
                <table className="exercise-table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Rest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {w.exercises.map((ex,i) => (
                      <tr key={i}>
                        <td><span className="ex-name">{ex.name}</span></td>
                        <td>{ex.sets}</td>
                        <td>{ex.reps}</td>
                        <td>{ex.rest || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Core */}
              <div className="modal-section">
                <p className="modal-sec-title">CORE FINISHER</p>
                <table className="exercise-table">
                  <thead>
                    <tr><th>Exercise</th><th>Sets</th><th>Reps</th></tr>
                  </thead>
                  <tbody>
                    {w.core.map((ex,i) => (
                      <tr key={i}>
                        <td><span className="ex-name">{ex.name}</span></td>
                        <td>{ex.sets || '—'}</td>
                        <td>{ex.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Info boxes */}
              <div className="info-row">
                <div className="info-box">
                  <p className="info-box-title">CARDIO FINISHER</p>
                  <p className="info-box-txt">{w.cardio}</p>
                </div>
                <div className="info-box">
                  <p className="info-box-title">TEMPO GUIDE</p>
                  <p className="info-box-txt" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',color:'#C9960C',letterSpacing:'3px'}}>{w.tempo}</p>
                  <p className="info-box-txt" style={{marginTop:'6px'}}>Control the movement. Build the mind-muscle connection.</p>
                </div>
              </div>

              {w.note && (
                <div className="modal-note">
                  <p className="modal-note-txt">{w.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
