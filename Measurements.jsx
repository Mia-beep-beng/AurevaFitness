import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageContext.jsx'
import { useNavigate } from 'react-router-dom'

const FIELDS = [
  { key:'date_lbl', label:'DATE',    hint:'when measured' },
  { key:'weight',   label:'WEIGHT',        hint:'kg / lbs' },
  { key:'bodyfat',  label:'BODY FAT %',    hint:'optional' },
  { key:'bust',     label:'BUST / CHEST',  hint:'cm / in' },
  { key:'waist',    label:'WAIST',         hint:'cm / in' },
  { key:'hips',     label:'HIPS',          hint:'cm / in' },
  { key:'larm',     label:'LEFT ARM',      hint:'cm / in' },
  { key:'rarm',     label:'RIGHT ARM',     hint:'cm / in' },
  { key:'lthigh',   label:'LEFT THIGH',    hint:'cm / in' },
  { key:'rthigh',   label:'RIGHT THIGH',   hint:'cm / in' },
  { key:'calves',   label:'CALVES',        hint:'cm / in' },
  { key:'neck',     label:'NECK',          hint:'cm / in' },
]

const EMPTY = () => Object.fromEntries(FIELDS.map(f => [f.key, '']))
const STORAGE_KEY = 'aureva-measurements'

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#060606; }
  :root { --gold:#C9960C; --black:#060606; --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50); --w35:rgba(255,255,255,.35); --w08:rgba(255,255,255,.08); }

  .page { min-height:100vh; background:var(--black); font-family:'Montserrat',sans-serif; padding:40px 24px 80px; }
  .wrap { max-width:760px; margin:0 auto; }

  .back-btn { background:none; border:none; color:rgba(201,150,12,.6); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; padding:0; margin-bottom:28px; display:flex; align-items:center; gap:6px; transition:color .2s; }
  .back-btn:hover { color:var(--gold); }

  .page-eyebrow { font-size:9px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:8px; }
  .page-title   { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,6vw,52px); color:#fff; letter-spacing:3px; line-height:1; margin-bottom:6px; }
  .page-desc    { font-size:12px; color:var(--w50); line-height:1.7; margin-bottom:32px; }

  .gold-rule { height:1px; background:linear-gradient(to right,rgba(201,150,12,.5),transparent); margin-bottom:28px; }

  /* Tab switcher */
  .tabs { display:flex; gap:0; margin-bottom:32px; border:1px solid rgba(201,150,12,.2); }
  .tab { flex:1; padding:12px; background:none; border:none; font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; color:var(--w35); cursor:pointer; transition:all .2s; }
  .tab.active { background:rgba(201,150,12,.12); color:var(--gold); }

  /* Table */
  .meas-table { width:100%; border-collapse:collapse; margin-bottom:28px; }
  .meas-table th { font-size:8.5px; font-weight:700; color:var(--gold); letter-spacing:2.5px; text-align:left; padding:10px 12px; border-bottom:1px solid rgba(201,150,12,.2); }
  .meas-table th:not(:first-child) { text-align:center; }
  .meas-table tr:nth-child(even) td { background:rgba(255,255,255,.02); }
  .meas-table td { padding:8px 12px; border-bottom:1px solid rgba(255,255,255,.04); vertical-align:middle; }
  .field-label { font-size:11px; font-weight:700; color:#fff; letter-spacing:.5px; }
  .field-hint  { font-size:9px; color:var(--w35); margin-top:2px; }

  .m-input {
    width:100%; background:rgba(255,255,255,.05); border:1px solid rgba(201,150,12,.15);
    color:#fff; font-family:'Montserrat',sans-serif; font-size:12px;
    padding:8px 10px; text-align:center; outline:none; transition:border-color .2s;
  }
  .m-input:focus { border-color:rgba(201,150,12,.6); background:rgba(201,150,12,.04); }
  .m-input::placeholder { color:rgba(255,255,255,.15); }

  /* Change badge */
  .change { font-size:11px; font-weight:700; text-align:center; }
  .change.pos { color:#50C878; }
  .change.neg { color:#E050A0; }
  .change.neu { color:var(--w35); }

  /* Notes */
  .notes-section { margin-bottom:28px; }
  .notes-label { font-size:9px; font-weight:700; color:var(--gold); letter-spacing:3px; margin-bottom:10px; display:block; }
  .notes-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px; }
  .notes-col label { font-size:9px; font-weight:700; color:var(--w50); letter-spacing:2px; display:block; margin-bottom:6px; }
  .notes-input {
    width:100%; background:rgba(255,255,255,.05); border:1px solid rgba(201,150,12,.15);
    color:#fff; font-family:'Montserrat',sans-serif; font-size:12px;
    padding:10px 12px; outline:none; resize:vertical; min-height:60px;
    transition:border-color .2s;
  }
  .notes-input:focus { border-color:rgba(201,150,12,.5); }

  /* Actions */
  .actions { display:flex; gap:12px; flex-wrap:wrap; }
  .btn-save { flex:1; padding:14px; background:linear-gradient(90deg,#A67408,#F0C832 50%,#A67408); border:none; color:#040404; font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:3px; cursor:pointer; min-width:160px; }
  .btn-clear { padding:14px 20px; background:transparent; border:1px solid rgba(255,255,255,.15); color:var(--w35); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; transition:all .2s; }
  .btn-clear:hover { border-color:rgba(255,80,80,.4); color:rgba(255,80,80,.8); }

  .save-toast { margin-top:14px; font-size:11px; color:var(--gold); letter-spacing:2px; text-align:center; opacity:0; transition:opacity .3s; }
  .save-toast.show { opacity:1; }

  /* Progress section */
  .progress-title { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--gold); letter-spacing:3px; margin-bottom:16px; margin-top:32px; }
  .progress-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; margin-bottom:28px; }
  .prog-card { background:rgba(255,255,255,.04); border:1px solid rgba(201,150,12,.15); padding:14px; text-align:center; }
  .prog-label { font-size:8px; font-weight:700; color:var(--w35); letter-spacing:2px; margin-bottom:8px; }
  .prog-change { font-family:'Bebas Neue',sans-serif; font-size:28px; line-height:1; }
  .prog-change.pos { color:#50C878; }
  .prog-change.neg { color:#E050A0; }
  .prog-change.neu { color:var(--w35); }

  .footer-note { font-size:11px; color:var(--w35); font-style:italic; text-align:center; margin-top:8px; }

  @media(max-width:600px) {
    .notes-row { grid-template-columns:1fr; }
    .meas-table th:last-child, .meas-table td:last-child { display:none; }
  }
`

function calcChange(before, after) {
  const b = parseFloat(before), a = parseFloat(after)
  if (isNaN(b) || isNaN(a) || !before || !after) return null
  const diff = a - b
  return { diff: diff.toFixed(1), cls: diff < 0 ? 'neg' : diff > 0 ? 'pos' : 'neu' }
}

export default function Measurements() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [tab, setTab] = useState('both') // 'before' | 'after' | 'both'
  const [before, setBefore] = useState(EMPTY())
  const [after,  setAfter]  = useState(EMPTY())
  const [noteBefore, setNoteBefore] = useState('')
  const [noteAfter,  setNoteAfter]  = useState('')
  const [dateBefore, setDateBefore] = useState('')
  const [dateAfter,  setDateAfter]  = useState('')
  const [toastVisible, setToast] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved.before)     setBefore(saved.before)
      if (saved.after)      setAfter(saved.after)
      if (saved.noteBefore) setNoteBefore(saved.noteBefore)
      if (saved.noteAfter)  setNoteAfter(saved.noteAfter)
      if (saved.dateBefore) setDateBefore(saved.dateBefore)
      if (saved.dateAfter)  setDateAfter(saved.dateAfter)
    } catch {}
  }, [])

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ before, after, noteBefore, noteAfter, dateBefore, dateAfter }))
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const clearAll = () => {
    if (!confirm('Clear all measurements? This cannot be undone.')) return
    localStorage.removeItem(STORAGE_KEY)
    setBefore(EMPTY()); setAfter(EMPTY())
    setNoteBefore(''); setNoteAfter('')
    setDateBefore(''); setDateAfter('')
  }

  // Progress cards — only show fields that have both before & after
  const progress = FIELDS.filter(f => {
    const c = calcChange(before[f.key], after[f.key])
    return c !== null
  })

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;600;700;800&display=swap"/>
      <style>{css}</style>

      <div className="page">
        <div className="wrap">
          <button className="back-btn" onClick={() => navigate(-1)}>{t('back')}</button>

          <p className="page-eyebrow">{t('measurements_nav')}</p>
          <h1 className="page-title">{t('measurements')}</h1>
          <p className="page-desc">
            Fill in your measurements on <strong style={{color:'var(--gold)'}}>{t('before_day1')}</strong> &nbsp;→&nbsp; <strong style={{color:'var(--gold)'}}>{t('after_day28')}</strong>
          </p>
          <div className="gold-rule"/>

          {/* Tab switcher */}
          <div className="tabs">
            {[['both','BEFORE & AFTER'],['before','BEFORE ONLY'],['after','AFTER ONLY']].map(([v,l]) => (
              <button key={v} className={`tab${tab===v?' active':''}`} onClick={() => setTab(v)}>{l}</button>
            ))}
          </div>

          {/* Measurement table */}
          <table className="meas-table">
            <thead>
              <tr>
                <th>{t('meas_desc').split(' ').slice(0,1).join('')}</th>
                {(tab === 'before' || tab === 'both') && <th>{t('before_day1')}</th>}
                {(tab === 'after'  || tab === 'both') && <th>{t('after_day28')}</th>}
                {tab === 'both' && <th>{t('change')}</th>}
              </tr>
            </thead>
            <tbody>
              {/* Date row */}
              <tr>
                <td><div className="field-label">DATE</div><div className="field-hint">when measured</div></td>
                {(tab === 'before' || tab === 'both') && (
                  <td><input className="m-input" type="text" placeholder="e.g. June 1" value={dateBefore} onChange={e=>setDateBefore(e.target.value)}/></td>
                )}
                {(tab === 'after' || tab === 'both') && (
                  <td><input className="m-input" type="text" placeholder="e.g. June 28" value={dateAfter} onChange={e=>setDateAfter(e.target.value)}/></td>
                )}
                {tab === 'both' && <td/>}
              </tr>

              {FIELDS.map(f => {
                const ch = tab === 'both' ? calcChange(before[f.key], after[f.key]) : null
                return (
                  <tr key={f.key}>
                    <td>
                      <div className="field-label">{f.label}</div>
                      <div className="field-hint">{f.hint}</div>
                    </td>
                    {(tab === 'before' || tab === 'both') && (
                      <td>
                        <input className="m-input" type="number" step="0.1" placeholder="—"
                          value={before[f.key]} onChange={e => setBefore(p => ({...p, [f.key]: e.target.value}))}/>
                      </td>
                    )}
                    {(tab === 'after' || tab === 'both') && (
                      <td>
                        <input className="m-input" type="number" step="0.1" placeholder="—"
                          value={after[f.key]} onChange={e => setAfter(p => ({...p, [f.key]: e.target.value}))}/>
                      </td>
                    )}
                    {tab === 'both' && (
                      <td>
                        {ch
                          ? <div className={`change ${ch.cls}`}>{ch.diff > 0 ? '+' : ''}{ch.diff}</div>
                          : <div className="change neu">—</div>
                        }
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Notes */}
          <div className="notes-section">
            <span className="notes-label">{t('how_i_feel')}</span>
            <div className="notes-row">
              {(tab === 'before' || tab === 'both') && (
                <div className="notes-col">
                  <label>{t('before_day1')}:</label>
                  <textarea className="notes-input" placeholder="How do you feel starting out?" rows={3}
                    value={noteBefore} onChange={e=>setNoteBefore(e.target.value)}/>
                </div>
              )}
              {(tab === 'after' || tab === 'both') && (
                <div className="notes-col">
                  <label>{t('after_day28')}:</label>
                  <textarea className="notes-input" placeholder="How do you feel after 28 days?" rows={3}
                    value={noteAfter} onChange={e=>setNoteAfter(e.target.value)}/>
                </div>
              )}
            </div>
          </div>

          {/* Progress overview — only when both columns filled */}
          {tab === 'both' && progress.length > 0 && (
            <>
              <p className="progress-title">{t('progress_title')}</p>
              <div className="progress-grid">
                {progress.map(f => {
                  const ch = calcChange(before[f.key], after[f.key])
                  return (
                    <div className="prog-card" key={f.key}>
                      <div className="prog-label">{f.label}</div>
                      <div className={`prog-change ${ch.cls}`}>
                        {ch.diff > 0 ? '+' : ''}{ch.diff}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Save */}
          <div className="actions">
            <button className="btn-save" onClick={save}>{t('save_meas')}</button>
            <button className="btn-clear" onClick={clearAll}>{t('clear_all')}</button>
          </div>
          <div className={`save-toast${toastVisible?' show':''}`}>✓ {t('save_meas')}</div>
          <p className="footer-note" style={{marginTop:'20px'}}>
            Tip: Take photos on Day 1 and Day 28 in the same pose and lighting for the best comparison.
          </p>
        </div>
      </div>
    </>
  )
}
