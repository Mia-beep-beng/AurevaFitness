import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WORKOUTS } from './workouts.js'
import { WORKOUT_IMAGES } from './workoutImages.js'
import { useLanguage } from './LanguageContext.jsx'

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
  .day-card-img img { width:100%; height:100%; object-fit:cover; object-position:left top; transition:transform .35s; }
  .day-card:hover .day-card-img img { transform:scale(1.04); }
  .day-card-placeholder { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
  .ph-icon { font-size:22px; }
  .day-card-body { padding:10px 10px 12px; flex:1; display:flex; flex-direction:column; }
  .day-num  { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--gold); line-height:1; }
  .day-type { font-size:7px; font-weight:700; letter-spacing:2px; margin-bottom:6px; line-height:1.3; }
  .day-ex-preview { font-size:9.5px; color:var(--w35); line-height:1.55; margin-top:auto; }
  .day-badge { position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,.75); border:1px solid rgba(201,150,12,.3); padding:3px 6px; font-size:8px; font-weight:700; color:var(--gold); letter-spacing:1px; }

  /* ── MODAL ── */
  /* Modal — image only, scrollable */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.9); display:flex; align-items:flex-start; justify-content:center; z-index:200; padding:16px; overflow-y:auto; backdrop-filter:blur(6px); }
  .wk-modal { width:min(640px,96vw); background:#060606; margin:auto; display:flex; flex-direction:column; }

  .wk-close-bar {
    position:sticky; top:0; z-index:10; background:rgba(6,6,6,.97);
    border-bottom:1px solid rgba(201,150,12,.2);
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 16px; gap:12px;
  }
  .wk-day-label    { font-size:10px; font-weight:700; color:var(--gold); letter-spacing:3px; }
  .wk-day-title-sm { font-size:11px; font-weight:700; color:#fff; letter-spacing:1px; }
  .wk-close {
    background:rgba(201,150,12,.12); border:1px solid rgba(201,150,12,.4);
    color:var(--gold); font-family:'Montserrat',sans-serif;
    font-size:10px; font-weight:800; letter-spacing:2px;
    padding:7px 14px; cursor:pointer; white-space:nowrap; flex-shrink:0;
    transition:background .2s;
  }
  .wk-close:hover { background:rgba(201,150,12,.22); }
  .wk-full-img { width:100%; height:auto; display:block; }
  .wk-hero-fallback { min-height:400px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; }

  /* Logger */
  .wk-log-btn {
    background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.2);
    color:var(--w70); font-family:'Montserrat',sans-serif;
    font-size:10px; font-weight:700; letter-spacing:1.5px;
    padding:7px 12px; cursor:pointer; transition:all .2s;
  }
  .wk-log-btn:hover { border-color:var(--gold); color:var(--gold); }
  .log-body { padding:20px; }
  .log-intro { font-size:11px; color:var(--w50); margin-bottom:20px; font-style:italic; }
  .log-exercise { margin-bottom:20px; border:1px solid rgba(201,150,12,.1); }
  .log-ex-name {
    background:rgba(201,150,12,.06); padding:10px 12px;
    font-size:12px; font-weight:700; color:#fff;
    display:flex; align-items:center; gap:10px; flex-wrap:wrap;
  }
  .log-ex-num { width:22px; height:22px; background:var(--gold); color:#060606; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; border-radius:50%; flex-shrink:0; }
  .log-ex-target { margin-left:auto; font-size:9.5px; color:var(--gold); font-weight:600; letter-spacing:.5px; }
  .log-sets-head { display:grid; grid-template-columns:40px 1fr 1fr; gap:8px; padding:6px 12px; background:rgba(0,0,0,.3); font-size:8px; font-weight:700; color:var(--w35); letter-spacing:1.5px; }
  .log-set-row { display:grid; grid-template-columns:40px 1fr 1fr; gap:8px; padding:6px 12px; align-items:center; border-top:1px solid rgba(255,255,255,.04); }
  .log-set-num { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--gold); text-align:center; }
  .log-input {
    background:rgba(255,255,255,.05); border:1px solid rgba(201,150,12,.15);
    color:#fff; font-family:'Montserrat',sans-serif; font-size:12px;
    padding:7px 10px; text-align:center; outline:none; transition:border-color .2s; width:100%;
  }
  .log-input:focus { border-color:rgba(201,150,12,.6); }
  .log-input::placeholder { color:rgba(255,255,255,.2); font-size:10px; }
  .log-save-btn {
    width:100%; margin-top:16px; padding:14px;
    background:linear-gradient(90deg,#A67408,#F0C832 50%,#A67408);
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:3px; cursor:pointer;
    transition:opacity .2s;
  }
  .log-save-btn:hover { opacity:.9; }

  @media(max-width:700px) { .days-row { grid-template-columns:repeat(4,1fr); } }
  @media(max-width:420px) { .days-row { grid-template-columns:repeat(3,1fr); } }
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
  const { t: tr } = useLanguage()
  const t      = getType(day.day)
  const meta   = TYPE_META[t]
  const imgSrc = WORKOUT_IMAGES[day.day]
  const [showLog, setShowLog] = useState(false)

  const logKey = `aureva-log-day${day.day}`
  const [log, setLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(logKey) || '{}') } catch { return {} }
  })
  const [saved, setSaved] = useState(false)

  const updateLog = (exIdx, setIdx, field, val) => {
    setLog(prev => {
      const next = {...prev}
      if (!next[exIdx]) next[exIdx] = {}
      if (!next[exIdx][setIdx]) next[exIdx][setIdx] = {}
      next[exIdx][setIdx][field] = val
      return next
    })
  }

  const saveLog = () => {
    const entry = { date: new Date().toISOString().slice(0,10), log }
    localStorage.setItem(logKey, JSON.stringify(entry))
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="wk-modal">

        {/* Sticky header */}
        <div className="wk-close-bar">
          <div>
            <span className="wk-day-label">{tr('day')} {day.day} · {tr('week')} {Math.ceil(day.day/7)}</span>
            <span className="wk-day-title-sm" style={{ color: meta.color }}>  {day.focus}</span>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button className="wk-log-btn" onClick={() => setShowLog(v => !v)}>
              {showLog ? tr('view_workout') : tr('log_workout')}
            </button>
            <button className="wk-close" onClick={onClose}>{tr('close')}</button>
          </div>
        </div>

        {/* INFOGRAPHIC view */}
        {!showLog && (
          imgSrc
            ? <img src={imgSrc} alt={`Day ${day.day}`} className="wk-full-img"/>
            : <div className="wk-hero-fallback" style={{ background: meta.bg, minHeight:'400px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                <span style={{fontSize:'72px'}}>{meta.icon}</span>
                <p style={{color:meta.color,fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',letterSpacing:'3px'}}>DAY {day.day} · {day.focus}</p>
              </div>
        )}

        {/* LOGGER view */}
        {showLog && (
          <div className="log-body">
            <p className="log-intro">{tr('log_intro')}</p>
            {day.exercises.map((ex, ei) => (
              <div key={ei} className="log-exercise">
                <div className="log-ex-name">
                  <span className="log-ex-num">{ei+1}</span>
                  {ex.name}
                  <span className="log-ex-target">{ex.sets} sets · {ex.reps} reps · {ex.rest}</span>
                </div>
                <div className="log-sets-head">
                  <span>SET</span><span>WEIGHT (kg/lbs)</span><span>REPS DONE</span>
                </div>
                {Array.from({length: Number(ex.sets) || 3}, (_,si) => (
                  <div key={si} className="log-set-row">
                    <span className="log-set-num">{si+1}</span>
                    <input className="log-input" type="number" placeholder="kg / lbs"
                      value={log[ei]?.[si]?.weight || ''}
                      onChange={e => updateLog(ei, si, 'weight', e.target.value)}/>
                    <input className="log-input" type="number" placeholder="reps"
                      value={log[ei]?.[si]?.reps || ''}
                      onChange={e => updateLog(ei, si, 'reps', e.target.value)}/>
                  </div>
                ))}
              </div>
            ))}
            <button className="log-save-btn" onClick={saveLog}>
              {saved ? tr('saved') : tr('save_log')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const WEEKS = [[1,2,3,4,5,6,7],[8,9,10,11,12,13,14],[15,16,17,18,19,20,21],[22,23,24,25,26,27,28]]

export default function Workouts() {
  const { t: tr } = useLanguage()
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
          <h1 className="sec-title">{tr('your_workouts')}</h1>
          <p className="sec-desc">{tr('workouts_desc')}</p>

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
              <p className="week-label">{tr('week')} {wi + 1}</p>
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
