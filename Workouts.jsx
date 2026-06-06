import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WORKOUTS } from './workouts.js'
import { WORKOUT_IMAGES } from './workoutImages.js'

const TYPE_META = {
  LBS:  { label:'LOWER BODY STRENGTH',  color:'#C9960C', bg:'rgba(201,150,12,.12)',  icon:'🦵' },
  UBS:  { label:'UPPER BODY STRENGTH',  color:'#4A90E2', bg:'rgba(74,144,226,.12)',  icon:'💪' },
  PUSH: { label:'PUSH — CHEST & SHOULDERS', color:'#E07820', bg:'rgba(224,120,32,.12)', icon:'🔺' },
  PULL: { label:'PULL — BACK & BICEPS', color:'#20B8A0', bg:'rgba(32,184,160,.12)',  icon:'🔻' },
  GLU:  { label:'GLUTES & HAMSTRINGS',  color:'#E050A0', bg:'rgba(224,80,160,.12)', icon:'🍑' },
  COND: { label:'CONDITIONING & CORE',  color:'#E04040', bg:'rgba(224,64,64,.12)',   icon:'🔥' },
  REC:  { label:'RECOVERY & MOBILITY',  color:'#50C878', bg:'rgba(80,200,120,.12)',  icon:'🧘' },
}

const DAY_TYPES = ['LBS','UBS','PUSH','PULL','GLU','COND','REC']

function getType(dayNum) { return DAY_TYPES[(dayNum - 1) % 7] }

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#060606; }
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35); --w10:rgba(255,255,255,.10); --w05:rgba(255,255,255,.05);
  }
  .page { min-height:100vh; background:var(--black); font-family:'Montserrat',sans-serif; padding:0 0 80px; position:relative; }
  .glow { position:fixed; inset:0; pointer-events:none; background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,150,12,.05) 0%,transparent 60%); z-index:0; }
  .wrap { max-width:1000px; margin:0 auto; padding:0 20px; position:relative; z-index:1; }

  /* Header */
  .w-header { display:flex; align-items:center; justify-content:space-between; padding:32px 0 0; margin-bottom:32px; flex-wrap:wrap; gap:12px; }
  .logo-row { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .brand { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--gold); letter-spacing:6px; }
  .sys   { font-size:7.5px; font-weight:600; color:var(--w35); letter-spacing:4px; display:block; }
  .back-btn { background:none; border:none; color:rgba(201,150,12,.6); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; display:flex; align-items:center; gap:6px; padding:0; transition:color .2s; }
  .back-btn:hover { color:var(--gold); }

  /* Title */
  .sec-eye   { font-size:9.5px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:8px; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,5vw,48px); color:#fff; letter-spacing:3px; margin-bottom:10px; line-height:1; }
  .sec-desc  { font-size:13px; font-weight:300; color:var(--w50); line-height:1.75; margin-bottom:32px; max-width:640px; }

  /* Legend */
  .legend { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:36px; }
  .leg-item { display:flex; align-items:center; gap:6px; font-size:9.5px; font-weight:600; color:var(--w50); letter-spacing:1px; }
  .leg-dot  { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

  /* Week grid */
  .week-block { margin-bottom:32px; }
  .week-label { font-family:'Bebas Neue',sans-serif; font-size:13px; color:var(--w35); letter-spacing:5px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(201,150,12,.1); }
  .days-row   { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; }

  /* Day card */
  .day-card {
    background:var(--w05); border:1px solid rgba(201,150,12,.1);
    cursor:pointer; transition:all .25s; display:flex; flex-direction:column;
    position:relative; overflow:hidden;
  }
  .day-card:hover { border-color:var(--gold); transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,150,12,.12); }
  .day-card-top { height:4px; }
  .day-card-img { aspect-ratio:3/4; overflow:hidden; background:#0e0e0e; position:relative; }
  .day-card-img img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; transition:transform .35s; }
  .day-card:hover .day-card-img img { transform:scale(1.04); }
  .day-card-placeholder { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
  .ph-icon { font-size:22px; }
  .day-card-body { padding:10px 10px 12px; flex:1; display:flex; flex-direction:column; }
  .day-num  { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--gold); line-height:1; }
  .day-type { font-size:7px; font-weight:700; letter-spacing:2px; margin-bottom:6px; line-height:1.3; }
  .day-ex-preview { font-size:9.5px; color:var(--w35); line-height:1.55; margin-top:auto; }
  .day-badge { position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,.75); border:1px solid rgba(201,150,12,.3); padding:3px 6px; font-size:8px; font-weight:700; color:var(--gold); letter-spacing:1px; }

  /* ── MODAL ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.88); display:flex; align-items:flex-start; justify-content:center; z-index:200; padding:16px; overflow-y:auto; backdrop-filter:blur(6px); }
  .wk-modal { background:#0a0a0a; border:1px solid rgba(201,150,12,.22); width:100%; max-width:760px; margin:auto; position:relative; overflow:hidden; }

  /* Modal hero */
  .wk-hero { position:relative; overflow:hidden; }
  .wk-hero img { width:100%; display:block; max-height:420px; object-fit:cover; object-position:center top; }
  .wk-hero-fallback { height:200px; display:flex; align-items:center; justify-content:center; }
  .wk-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,.4) 50%, transparent 100%); }
  .wk-close { position:absolute; top:14px; right:14px; background:rgba(0,0,0,.9); border:1.5px solid var(--gold); color:var(--gold); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; padding:9px 16px; cursor:pointer; transition:all .2s; z-index:10; }
  .wk-close:hover { background:var(--gold); color:#060606; }
  .wk-hero-info { position:absolute; bottom:0; left:0; right:0; padding:20px 24px; }
  .wk-day-label { font-size:11px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:4px; }
  .wk-day-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(24px,4vw,36px); color:#fff; letter-spacing:2px; line-height:1; }
  .wk-day-goal  { font-size:11px; font-weight:300; color:var(--w50); margin-top:4px; font-style:italic; }

  /* Modal body */
  .wk-body { padding:24px; }
  .wk-section { margin-bottom:24px; }
  .wk-sec-title { font-size:9.5px; font-weight:800; color:var(--gold); letter-spacing:3px; margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid rgba(201,150,12,.15); }
  .ex-table { width:100%; border-collapse:collapse; }
  .ex-table th { font-size:8.5px; font-weight:700; color:var(--w35); letter-spacing:2px; text-align:left; padding:6px 10px; border-bottom:1px solid rgba(201,150,12,.12); }
  .ex-table th:not(:first-child) { text-align:center; }
  .ex-table td { font-size:12px; color:var(--w70); padding:9px 10px; border-bottom:1px solid rgba(255,255,255,.04); }
  .ex-table td:not(:first-child) { text-align:center; color:var(--w50); font-size:11px; }
  .ex-table tr:hover td { background:rgba(201,150,12,.03); }
  .ex-name { font-weight:600; color:#fff; }
  /* Warm-up list */
  .warmup-list { list-style:none; padding:0; margin:0; }
  .warmup-item { font-size:12px; color:var(--w70); padding:7px 0; border-bottom:1px solid rgba(255,255,255,.04); display:flex; align-items:center; gap:10px; }
  .warmup-item:last-child { border-bottom:none; }
  .warmup-dot { width:6px; height:6px; border-radius:50%; background:var(--gold); flex-shrink:0; }

  .info-2col { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .info-box { background:rgba(201,150,12,.05); border:1px solid rgba(201,150,12,.12); padding:14px; }
  .info-box-title { font-size:9px; font-weight:800; color:var(--gold); letter-spacing:2.5px; margin-bottom:6px; }
  .info-box-txt { font-size:12px; color:var(--w70); line-height:1.65; }
  .tempo-big { font-family:'Bebas Neue',sans-serif; font-size:36px; color:var(--gold); letter-spacing:6px; }

  @media(max-width:700px) {
    .days-row { grid-template-columns:repeat(4,1fr); }
    .info-2col { grid-template-columns:1fr; }
    .wk-body  { padding:16px; }
  }
  @media(max-width:420px) {
    .days-row { grid-template-columns:repeat(3,1fr); }
  }
`


function DayCard({ day, onClick }) {
  const t    = getType(day.day)
  const meta = TYPE_META[t]
  const top3 = day.exercises.slice(0,3).map(e => e.name)
  const imgSrc = WORKOUT_IMAGES[day.day]

  return (
    <div className="day-card" onClick={() => onClick(day)}>
      <div className="day-card-top" style={{ background: meta.color }}/>
      <div className="day-card-img" style={{ background: meta.bg }}>
        {imgSrc
          ? <img src={imgSrc} alt={`Day ${day.day}`}/>
          : <div className="day-card-placeholder">
              <span className="ph-icon">{meta.icon}</span>
            </div>
        }
        <div className="day-badge">{day.exercises.length} EXERCISES</div>
      </div>
      <div className="day-card-body">
        <div className="day-num">{day.day}</div>
        <div className="day-type" style={{ color: meta.color }}>{t}</div>
        <div className="day-ex-preview">{top3.join(' · ')}</div>
      </div>
    </div>
  )
}

function WorkoutModal({ day, onClose }) {
  const t    = getType(day.day)
  const meta = TYPE_META[t]
  const imgSrc = WORKOUT_IMAGES[day.day]

  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="wk-modal">

        {/* Hero */}
        <div className="wk-hero">
          {imgSrc
            ? <img src={imgSrc} alt={`Day ${day.day}`}/>
            : <div className="wk-hero-fallback" style={{ background: meta.bg }}>
                <span style={{fontSize:'64px'}}>{meta.icon}</span>
              </div>
          }
          <div className="wk-hero-overlay"/>
          <button className="wk-close" onClick={onClose}>✕ CLOSE</button>
          <div className="wk-hero-info">
            <p className="wk-day-label">DAY {day.day} · WEEK {Math.ceil(day.day/7)}</p>
            <p className="wk-day-title" style={{ color: meta.color }}>{day.focus}</p>
            <p className="wk-day-goal">Tempo: {day.tempo} · {meta.label}</p>
          </div>
        </div>

        {/* Body */}
        <div className="wk-body">

          {/* Warm-Up */}
          {day.warmup && (
            <div className="wk-section">
              <p className="wk-sec-title">⚡ WARM-UP — 5–10 MIN</p>
              <ul className="warmup-list">
                {day.warmup.map((item, i) => (
                  <li key={i} className="warmup-item">
                    <span className="warmup-dot"/>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main workout */}
          <div className="wk-section">
            <p className="wk-sec-title">🏋 MAIN WORKOUT</p>
            <table className="ex-table">
              <thead>
                <tr>
                  <th>#</th><th style={{textAlign:'left'}}>EXERCISE</th>
                  <th>SETS</th><th>REPS</th><th>REST</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <tr key={i}>
                    <td style={{color:'var(--w35)',fontSize:'11px'}}>{i+1}</td>
                    <td><span className="ex-name">{ex.name}</span></td>
                    <td>{ex.sets}</td>
                    <td>{ex.reps}</td>
                    <td>{ex.rest || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Core finisher */}
          <div className="wk-section">
            <p className="wk-sec-title">🔥 CORE FINISHER</p>
            <table className="ex-table">
              <thead>
                <tr><th style={{textAlign:'left'}}>EXERCISE</th><th>SETS</th><th>REPS / TIME</th></tr>
              </thead>
              <tbody>
                {day.core.map((ex, i) => (
                  <tr key={i}>
                    <td><span className="ex-name">{ex.name}</span></td>
                    <td>{ex.sets || '3'}</td>
                    <td>{ex.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info boxes */}
          <div className="info-2col">
            <div className="info-box">
              <p className="info-box-title">🏃 CARDIO FINISHER</p>
              <p className="info-box-txt">{day.cardio}</p>
            </div>
            <div className="info-box">
              <p className="info-box-title">⏱ TEMPO GUIDE</p>
              <p className="tempo-big">{day.tempo}</p>
              <p className="info-box-txt" style={{marginTop:'6px',fontSize:'11px'}}>
                Control the movement. Quality over speed.
              </p>
            </div>
          </div>

          {day.note && (
            <div style={{marginTop:'16px',background:'rgba(201,150,12,.08)',border:'1px solid rgba(201,150,12,.25)',padding:'16px',textAlign:'center'}}>
              <p style={{fontFamily:"'Great Vibes',cursive",fontSize:'22px',color:'var(--gold)'}}>{day.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const WEEKS = [[1,2,3,4,5,6,7],[8,9,10,11,12,13,14],[15,16,17,18,19,20,21],[22,23,24,25,26,27,28]]

export default function Workouts() {
  const navigate = useNavigate()
  const [activeDay, setActiveDay] = useState(null)

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Montserrat:wght@300;400;600;700;800&display=swap"/>
      <style>{css}</style>

      <div className="page">
        <div className="glow"/>
        <div className="wrap">

          {/* Header */}
          <div className="w-header">
            <div className="logo-row" onClick={() => navigate('/')}>
              <svg width="34" height="30" viewBox="0 0 44 40" fill="none">
                <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
                <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
              </svg>
              <div><span className="brand">AUREVA</span><span className="sys">TRAINING SYSTEM</span></div>
            </div>
            <button className="back-btn" onClick={() => navigate(-1)}>← BACK</button>
          </div>

          <p className="sec-eye">28-DAY PROGRAM</p>
          <h1 className="sec-title">YOUR WORKOUTS</h1>
          <p className="sec-desc">All 28 days of training — organized by week. Tap any day to see the full workout: exercises, sets, reps, rest times, core finisher, and cardio options.</p>

          {/* Legend */}
          <div className="legend">
            {Object.entries(TYPE_META).map(([k, v]) => (
              <div key={k} className="leg-item">
                <div className="leg-dot" style={{ background: v.color }}/>
                <span>{v.icon} {k} — {v.label}</span>
              </div>
            ))}
          </div>

          {/* 4 weeks */}
          {WEEKS.map((week, wi) => (
            <div key={wi} className="week-block">
              <p className="week-label">WEEK {wi + 1}</p>
              <div className="days-row">
                {week.map(d => {
                  const workout = WORKOUTS[d]
                  if (!workout) return null
                  return <DayCard key={d} day={workout} onClick={setActiveDay}/>
                })}
              </div>
            </div>
          ))}

        </div>
      </div>

      {activeDay && <WorkoutModal day={activeDay} onClose={() => setActiveDay(null)}/>}
    </>
  )
}
