import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const css = `
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35); --w10:rgba(255,255,255,.10);
  }
  .dis-page {
    min-height:100vh; background:var(--black);
    display:flex; flex-direction:column; align-items:center;
    font-family:'Montserrat',sans-serif;
    padding:52px 20px 60px; position:relative; overflow:hidden;
  }
  .dis-glow {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 60% 40% at 50% 20%,rgba(201,150,12,.06) 0%,transparent 60%);
  }
  .dis-content { width:100%; max-width:700px; position:relative; z-index:1;
    opacity:0; transform:translateY(20px);
    transition:opacity .8s ease,transform .8s ease; }
  .dis-content.in { opacity:1; transform:translateY(0); }

  /* Logo row */
  .dis-logo { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:32px; }
  .dis-brand { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); letter-spacing:6px; }
  .dis-sub   { font-size:8px; font-weight:600; color:var(--w35); letter-spacing:4px; }

  /* Title */
  .dis-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(56px,10vw,88px); color:var(--gold);
    text-align:center; letter-spacing:4px; line-height:.9;
    margin-bottom:8px;
    text-shadow:0 0 40px rgba(201,150,12,.25);
  }
  .dis-subtitle {
    font-size:11px; font-weight:700; color:var(--w50);
    text-align:center; letter-spacing:6px; margin-bottom:32px;
  }
  .dis-top-line {
    width:100%; height:1px;
    background:linear-gradient(to right,transparent,var(--gold),transparent);
    margin-bottom:36px;
  }

  /* Points */
  .dis-points { display:flex; flex-direction:column; gap:0; margin-bottom:36px; }
  .dis-point {
    display:flex; align-items:flex-start; gap:16px;
    padding:18px 0; border-bottom:1px solid rgba(201,150,12,.12);
  }
  .dis-icon {
    width:40px; height:40px; border-radius:50%;
    border:1.5px solid rgba(201,150,12,.5);
    display:flex; align-items:center; justify-content:center;
    color:var(--gold); font-size:16px; flex-shrink:0; margin-top:2px;
  }
  .dis-point-txt { font-size:13px; color:var(--w70); line-height:1.75; }
  .dis-point-txt b { color:var(--gold); font-weight:700; }

  /* Remember */
  .dis-remember {
    border:1px solid rgba(201,150,12,.2);
    padding:28px 32px; margin-bottom:32px;
    background:rgba(201,150,12,.03);
    position:relative;
  }
  .dis-remember::before {
    content:''; position:absolute; top:0; left:40px; right:40px; height:1.5px;
    background:linear-gradient(to right,transparent,var(--gold),transparent);
  }
  .dis-rem-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:18px; color:var(--gold); letter-spacing:8px;
    text-align:center; margin-bottom:24px;
  }
  .dis-rem-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .dis-rem-item { text-align:center; }
  .dis-rem-icon { font-size:24px; margin-bottom:8px; }
  .dis-rem-lbl {
    font-family:'Bebas Neue',sans-serif;
    font-size:16px; color:var(--gold); letter-spacing:3px;
    display:block; margin-bottom:2px;
  }
  .dis-rem-sub { font-size:10px; color:var(--w50); letter-spacing:2px; }

  /* Quote */
  .dis-quote {
    border:1px solid rgba(201,150,12,.2);
    padding:20px 32px; text-align:center;
    background:rgba(201,150,12,.03);
    margin-bottom:36px;
  }
  .dis-quote-txt {
    font-family:'Great Vibes',cursive;
    font-size:28px; color:var(--gold);
    text-shadow:0 0 30px rgba(201,150,12,.3);
  }

  /* Footer */
  .dis-footer {
    display:flex; flex-direction:column; align-items:center; gap:12px;
    padding-top:28px;
    border-top:1px solid rgba(201,150,12,.12);
  }
  .dis-footer-links { display:flex; gap:24px; align-items:center; }
  .dis-footer a {
    font-size:11px; font-weight:500; color:rgba(201,150,12,.65);
    text-decoration:none; letter-spacing:1px; transition:color .2s;
  }
  .dis-footer a:hover { color:var(--gold); }
  .dis-footer-copy { font-size:10px; color:rgba(255,255,255,.25); letter-spacing:1px; }

  /* Back btn */
  .dis-back {
    align-self:flex-start; background:none; border:none; color:var(--w35);
    font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600;
    letter-spacing:2px; cursor:pointer; margin-bottom:32px; padding:0;
    display:flex; align-items:center; gap:6px; transition:color .2s;
  }
  .dis-back:hover { color:var(--gold); }

  @media(max-width:600px){
    .dis-rem-grid { grid-template-columns:1fr; gap:16px; }
    .dis-title { font-size:clamp(44px,12vw,72px); }
  }
`

const POINTS = [
  {
    icon: '✚',
    text: `Before beginning the Aureva Training System, <b>consult your physician or a qualified healthcare professional</b>, especially if you are pregnant, nursing, taking medication, have a medical condition, or have any concerns regarding your ability to participate in physical activity.`,
  },
  {
    icon: '📖',
    text: `The exercises, workouts, nutritional suggestions, and educational content provided within this program are intended for <b>informational and educational purposes only</b> and should not be considered medical advice.`,
  },
  {
    icon: '⚠',
    text: `Participation in any exercise program involves <b>inherent risks</b>, including but not limited to muscle strains, sprains, injuries, illness, or other health complications. By participating in this program, you acknowledge and accept these risks.`,
  },
  {
    icon: '🛡',
    text: `Aureva Training System and its creator, Mia Trofin, are <b>not responsible</b> for any injuries, damages, losses, or health complications that may occur as a result of using this program.`,
  },
  {
    icon: '📈',
    text: `<b>Results vary</b> from person to person and depend on many factors, including consistency, effort, nutrition, recovery, age, genetics, lifestyle, and overall health status. <b>No specific results are guaranteed.</b>`,
  },
  {
    icon: '👤',
    text: `By participating in this program, you agree that you are <b>solely responsible</b> for your health, safety, and fitness decisions.`,
  },
]

export default function Disclaimer() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  return (
    <>
      <style>{css}</style>
      <div className="dis-page">
        <div className="dis-glow"/>
        <div className={`dis-content${ready ? ' in' : ''}`}>

          <button className="dis-back" onClick={() => navigate(-1)}>← Back</button>

          <div className="dis-logo">
            <svg width="36" height="32" viewBox="0 0 44 40" fill="none">
              <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
              <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
              <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
            </svg>
            <div style={{display:'flex',flexDirection:'column'}}>
              <span className="dis-brand">AUREVA</span>
              <span className="dis-sub">TRAINING SYSTEM</span>
            </div>
          </div>

          <h1 className="dis-title">DISCLAIMER</h1>
          <p className="dis-subtitle">IMPORTANT HEALTH & FITNESS DISCLAIMER</p>
          <div className="dis-top-line"/>

          <div className="dis-points">
            {POINTS.map((p, i) => (
              <div key={i} className="dis-point">
                <div className="dis-icon">{p.icon}</div>
                <p className="dis-point-txt" dangerouslySetInnerHTML={{ __html: p.text }}/>
              </div>
            ))}
          </div>

          <div className="dis-remember">
            <p className="dis-rem-title">— REMEMBER —</p>
            <div className="dis-rem-grid">
              {[
                { icon:'🏋', lbl:'PROGRESS',    sub:'OVER PERFECTION.' },
                { icon:'🎯', lbl:'CONSISTENCY', sub:'OVER MOTIVATION.' },
                { icon:'❤', lbl:'HEALTH',      sub:'BEFORE EVERYTHING.' },
              ].map(r => (
                <div key={r.lbl} className="dis-rem-item">
                  <div className="dis-rem-icon">{r.icon}</div>
                  <span className="dis-rem-lbl">{r.lbl}</span>
                  <span className="dis-rem-sub">{r.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dis-quote">
            <p className="dis-quote-txt">Your health is your greatest asset.<br/>Train smart. Train safely.</p>
          </div>

          <div className="dis-footer">
            <div className="dis-footer-links">
              <a href="https://www.instagram.com/AurevaFitness" target="_blank" rel="noreferrer">@AurevaFitness</a>
              <a href="https://www.aurevatrainingsystem.com">aurevatrainingsystem.com</a>
              <a href="/" onClick={e=>{e.preventDefault();navigate('/')}}>Log In</a>
            </div>
            <p className="dis-footer-copy">© 2026 Aureva Fitness · All Rights Reserved</p>
          </div>

        </div>
      </div>
    </>
  )
}
