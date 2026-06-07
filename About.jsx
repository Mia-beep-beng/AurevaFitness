import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageContext.jsx'
import { useNavigate } from 'react-router-dom'

const css = `
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35);
  }
  .ab-page {
    min-height:100vh; background:var(--black);
    display:flex; flex-direction:column; align-items:center;
    font-family:'Montserrat',sans-serif;
    padding:52px 20px 60px; position:relative; overflow:hidden;
  }
  .ab-glow {
    position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 80% 50% at 70% 30%,rgba(201,150,12,.07) 0%,transparent 60%),
      radial-gradient(ellipse 50% 40% at 20% 70%,rgba(201,150,12,.04) 0%,transparent 55%);
  }
  .ab-content {
    width:100%; max-width:900px; position:relative; z-index:1;
    opacity:0; transform:translateY(20px);
    transition:opacity .8s ease,transform .8s ease;
  }
  .ab-content.in { opacity:1; transform:translateY(0); }

  /* Back */
  .ab-back {
    background:none; border:none; color:var(--w35);
    font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600;
    letter-spacing:2px; cursor:pointer; margin-bottom:32px; padding:0;
    display:flex; align-items:center; gap:6px; transition:color .2s;
  }
  .ab-back:hover { color:var(--gold); }

  /* Header */
  .ab-header { display:flex; align-items:center; gap:12px; margin-bottom:40px; }
  .ab-brand { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); letter-spacing:6px; }
  .ab-become { font-size:11px; font-weight:700; color:var(--w35); letter-spacing:3px; margin-left:auto; }

  /* Main layout */
  .ab-main { display:grid; grid-template-columns:1fr 1fr; gap:48px; margin-bottom:48px; }

  /* Left column */
  .ab-left {}
  .ab-welcome-label {
    font-size:10px; font-weight:700; color:var(--gold);
    letter-spacing:5px; margin-bottom:8px; display:block;
  }
  .ab-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(52px,6vw,76px);
    color:#fff; letter-spacing:3px; line-height:.9; margin-bottom:20px;
  }
  .ab-title span { display:block; }
  .ab-subtitle {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(16px,2vw,22px);
    color:var(--gold); letter-spacing:2px; margin-bottom:24px;
  }
  .ab-divider { height:1px; background:rgba(201,150,12,.2); margin:20px 0; }
  .ab-hi {
    font-family:'Great Vibes',cursive;
    font-size:clamp(36px,4vw,52px);
    color:var(--gold);
    text-shadow:0 0 40px rgba(201,150,12,.3);
    margin-bottom:20px; display:block;
  }
  .ab-body { font-size:13.5px; color:var(--w70); line-height:1.85; margin-bottom:16px; }
  .ab-body b { color:var(--gold); font-weight:700; }

  /* Builds list */
  .ab-builds-title {
    font-size:11px; font-weight:800; color:var(--gold);
    letter-spacing:3px; margin-bottom:16px; margin-top:28px;
  }
  .ab-builds { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
  .ab-build-row { display:flex; align-items:center; gap:12px; }
  .ab-build-icon {
    width:32px; height:32px; border-radius:50%;
    border:1.5px solid rgba(201,150,12,.4);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; flex-shrink:0;
  }
  .ab-build-name {
    font-size:12px; font-weight:800; color:#fff; letter-spacing:2px; margin-right:8px;
  }
  .ab-build-desc { font-size:12px; color:var(--w50); }

  .ab-cta-txt {
    font-size:clamp(14px,1.8vw,18px); color:#fff; line-height:1.5; margin-bottom:4px;
  }
  .ab-cta-txt b { color:var(--gold); }
  .ab-cta-txt em {
    font-family:'Great Vibes',cursive;
    font-size:clamp(18px,2.2vw,24px);
    font-style:normal; color:var(--gold);
  }

  /* Right column — photo */
  .ab-right { display:flex; flex-direction:column; align-items:center; justify-content:flex-start; }
  .ab-photo-wrap {
    width:100%; aspect-ratio:2/3; position:relative;
    overflow:hidden; margin-bottom:24px;

    /* REPLACE with your image:
       background-image: url('YOUR_PHOTO_URL');
       background-size: cover;
       background-position: center top; */
    background:
      radial-gradient(ellipse 60% 50% at 50% 40%,rgba(201,130,8,.2) 0%,transparent 65%),
      linear-gradient(160deg,#111008 0%,#1a1100 50%,#0a0a0a 100%);
  }
  .ab-photo-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(6,6,6,.2) 0%,transparent 30%,transparent 70%,rgba(6,6,6,.6) 100%);
  }
  .ab-photo-script {
    position:absolute; bottom:16px; left:0; right:0; text-align:center;
    font-family:'Great Vibes',cursive;
    font-size:36px; color:rgba(201,150,12,.6);
    text-shadow:0 0 40px rgba(201,150,12,.3);
  }

  .ab-signature-card {
    width:100%; border:1px solid rgba(201,150,12,.2);
    padding:20px; background:rgba(201,150,12,.04);
    text-align:center; position:relative;
  }
  .ab-signature-card::before {
    content:''; position:absolute; top:0; left:20px; right:20px; height:1.5px;
    background:linear-gradient(to right,transparent,var(--gold),transparent);
  }
  .ab-sig-name {
    font-family:'Great Vibes',cursive;
    font-size:36px; color:var(--gold);
    text-shadow:0 0 30px rgba(201,150,12,.3);
    margin-bottom:6px;
  }
  .ab-sig-role { font-size:10px; font-weight:700; color:var(--w50); letter-spacing:3px; }
  .ab-sig-title { font-size:9px; color:var(--w35); letter-spacing:2px; margin-top:2px; }

  /* Remember banner */
  .ab-remember {
    border:1px solid rgba(201,150,12,.2);
    padding:24px 32px; background:rgba(201,150,12,.03);
    margin-bottom:36px; position:relative;
  }
  .ab-remember::before {
    content:''; position:absolute; top:0; left:40px; right:40px; height:1.5px;
    background:linear-gradient(to right,transparent,var(--gold),transparent);
  }
  .ab-rem-icon { font-size:32px; margin-bottom:8px; }
  .ab-rem-txt {
    font-family:'Cinzel',serif;
    font-size:13px; font-weight:700; color:var(--w70);
    text-align:center; line-height:1.6; letter-spacing:1px;
  }
  .ab-rem-txt em {
    font-family:'Great Vibes',cursive;
    font-size:20px; font-style:normal; color:var(--gold);
  }

  /* Footer */
  .ab-footer {
    display:flex; flex-direction:column; align-items:center; gap:10px;
    padding-top:28px; border-top:1px solid rgba(201,150,12,.12);
  }
  .ab-footer-links { display:flex; gap:24px; align-items:center; }
  .ab-footer a {
    font-size:11px; font-weight:500; color:rgba(201,150,12,.65);
    text-decoration:none; letter-spacing:1px; transition:color .2s;
  }
  .ab-footer a:hover { color:var(--gold); }
  .ab-footer-copy { font-size:10px; color:rgba(255,255,255,.25); letter-spacing:1px; }

  @media(max-width:700px){
    .ab-main { grid-template-columns:1fr; }
    .ab-right { order:-1; }
    .ab-photo-wrap { aspect-ratio:3/4; }
  }
`

const BUILDS = [
  { icon:'💪', name:'STRENGTH',    desc:'A strong body.' },
  { icon:'🛡', name:'CONFIDENCE', desc:'A strong mind.' },
  { icon:'🎯', name:'CONSISTENCY',desc:'Stronger habits.' },
  { icon:'⭐', name:'DISCIPLINE', desc:'Daily commitment.' },
  { icon:'❤', name:'SELF-BELIEF',desc:'Unstoppable you.' },
  { icon:'🥗', name:'NUTRITION',   desc:'Free meal plan included.' },
]

export default function About() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  return (
    <>
      <style>{css}</style>
      <div className="ab-page">
        <div className="ab-glow"/>
        <div className={`ab-content${ready ? ' in' : ''}`}>

          <button className="ab-back" onClick={() => navigate(-1)}>{t('back')}</button>

          <div className="ab-header">
            <svg width="36" height="32" viewBox="0 0 44 40" fill="none">
              <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
              <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
              <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
            </svg>
            <span className="ab-brand">AUREVA</span>
            <span className="ab-become">BECOME HER.</span>
          </div>

          <div className="ab-main">
            {/* Left */}
            <div className="ab-left">
              <span className="ab-welcome-label">AUREVA TRAINING SYSTEM</span>
              <h1 className="ab-title">
                <span>{t('welcome_back').split(' ').slice(0,1)[0]}</span>
                <span style={{color:'var(--gold-hi)'}}>TO AUREVA</span>
              </h1>
              <div className="ab-divider"/>
              <span className="ab-hi">Hi, I'm Mia.</span>
              <p className="ab-body">
                Twenty-eight days from now, I want you to look back and be proud of one thing: <b>That you didn't quit.</b>
              </p>
              <p className="ab-body">
                Aureva wasn't built for perfect women. It was built for women who are ready <b>to become stronger, more confident, and more disciplined one day at a time.</b>
              </p>
              <p className="ab-body">
                This program isn't about punishment. It's about proving to yourself <b>what you're capable of.</b>
              </p>

              <p className="ab-builds-title">OVER THE NEXT 28 DAYS YOU'LL BUILD:</p>
              <div className="ab-builds">
                {BUILDS.map(b => (
                  <div key={b.name} className="ab-build-row">
                    <div className="ab-build-icon">{b.icon}</div>
                    <span className="ab-build-name">{b.name}</span>
                    <span className="ab-build-desc">{b.desc}</span>
                  </div>
                ))}
              </div>

              <p className="ab-cta-txt">You don't need to <b>be</b> perfect.</p>
              <p className="ab-cta-txt">You only need to <em>show up.</em></p>
            </div>

            {/* Right — photo + signature */}
            <div className="ab-right">
              <div className="ab-photo-wrap">
                <div className="ab-photo-overlay"/>
                <div className="ab-photo-script">{t('become_her')}</div>
              </div>
              <div className="ab-signature-card">
                <p className="ab-sig-name">Mia Trofin</p>
                <p className="ab-sig-role">FOUNDER</p>
                <p className="ab-sig-title">AUREVA TRAINING SYSTEM</p>
              </div>
            </div>
          </div>

          {/* Remember banner */}
          <div className="ab-remember" style={{textAlign:'center'}}>
            <div className="ab-rem-icon">⭐</div>
            <p className="ab-rem-txt">
              Small actions. Repeated daily.<br/>
              <em>Create extraordinary results.</em>
            </p>
          </div>

          <div className="ab-footer">
            <div className="ab-footer-links">
              <a href="https://www.instagram.com/AurevaFitness" target="_blank" rel="noreferrer">@AurevaFitness</a>
              <a href="/disclaimer" onClick={e=>{e.preventDefault();navigate('/disclaimer')}}>Disclaimer</a>
              <a href="/" onClick={e=>{e.preventDefault();navigate('/')}}>Log In</a>
            </div>
            <p className="ab-footer-copy">© 2026 Aureva Fitness · All Rights Reserved</p>
          </div>

        </div>
      </div>
    </>
  )
}
