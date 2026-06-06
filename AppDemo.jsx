import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: ((Math.sin(i * 2.399) + 1) / 2) * 100,
  top:  ((Math.cos(i * 1.618) + 1) / 2) * 100,
  size: ((Math.sin(i * 3.141) + 1) / 2) * 2.2 + 0.4,
  dur:  14 + (i % 10) * 1.8,
  delay:(i % 15) * 1.1,
  opacity: 0.04 + (i % 5) * 0.025,
}))

const ONBOARDING = [
  {
    icon:(
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="36" width="60" height="8" rx="4" fill="#C9960C" opacity=".9"/>
        <rect x="4"  y="28" width="14" height="24" rx="7" fill="#C9960C"/>
        <rect x="62" y="28" width="14" height="24" rx="7" fill="#C9960C"/>
        <circle cx="27" cy="40" r="8" fill="#060606" stroke="#C9960C" strokeWidth="2"/>
        <circle cx="53" cy="40" r="8" fill="#060606" stroke="#C9960C" strokeWidth="2"/>
        <circle cx="27" cy="40" r="3" fill="#C9960C"/>
        <circle cx="53" cy="40" r="3" fill="#C9960C"/>
      </svg>
    ),
    title:'28 Days.\nOne Goal.',
    desc:'A complete strength and conditioning program built for women who want real results.',
  },
  {
    icon:(
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="12" y="56" width="8"  height="16" rx="2" fill="#C9960C" opacity=".4"/>
        <rect x="24" y="44" width="8"  height="28" rx="2" fill="#C9960C" opacity=".6"/>
        <rect x="36" y="34" width="8"  height="38" rx="2" fill="#C9960C" opacity=".8"/>
        <rect x="48" y="22" width="8"  height="50" rx="2" fill="#C9960C"/>
        <rect x="60" y="12" width="8"  height="60" rx="2" fill="#F0C832"/>
      </svg>
    ),
    title:'Track Every\nRep. Every Day.',
    desc:'Log your workouts, monitor your progress, and watch yourself get stronger week by week.',
  },
  {
    icon:(
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <polygon points="40,8 50,30 74,33 57,50 61,74 40,62 19,74 23,50 6,33 30,30"
          fill="none" stroke="#C9960C" strokeWidth="2.5"/>
        <polygon points="40,18 47,34 65,37 52,49 55,67 40,59 25,67 28,49 15,37 33,34"
          fill="#C9960C" opacity=".12"/>
        <text x="40" y="46" textAnchor="middle" fontFamily="sans-serif"
          fontSize="18" fontWeight="800" fill="#C9960C">HER.</text>
      </svg>
    ),
    title:'Become the\nBest Version\nof You.',
    desc:'Strength. Confidence. Discipline. Built one day at a time.',
  },
]

const MINI_PLANS = [
  { id:'monthly',   name:'MONTHLY',  price:'$9.99',  mo:'/mo' },
  { id:'quarterly', name:'3 MONTHS', price:'$25.99', mo:'$8.66/mo' },
  { id:'annual',    name:'YEARLY',   price:'$99.99', mo:'$8.33/mo' },
]

const css = `
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w30:rgba(255,255,255,.30); --w10:rgba(255,255,255,.10); --w05:rgba(255,255,255,.05);
  }
  .app-outer {
    min-height:100vh; background:#0e0e0e;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:24px; font-family:'Montserrat',sans-serif;
    position:relative; overflow:hidden;
  }
  .app-bg {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,150,12,.06) 0%,transparent 65%);
  }
  .app-particles { position:absolute; inset:0; pointer-events:none; z-index:0; }
  .app-p {
    position:absolute; border-radius:50%; background:var(--gold-hi);
    animation:apdrift linear infinite;
  }
  @keyframes apdrift {
    0%{transform:translate(0,0);opacity:0;} 12%{opacity:1;}
    88%{opacity:.3;} 100%{transform:translate(12px,-70px);opacity:0;}
  }
  .phone {
    width:375px; height:812px; background:#0a0a0a;
    border-radius:50px; border:2px solid rgba(201,150,12,.22);
    overflow:hidden; position:relative; z-index:1;
    box-shadow:0 0 0 8px #111, 0 40px 120px rgba(0,0,0,.85), 0 0 80px rgba(201,150,12,.07);
    display:flex; flex-direction:column;
  }
  .notch {
    position:absolute; top:0; left:50%; transform:translateX(-50%);
    width:120px; height:32px; background:#111; border-radius:0 0 20px 20px; z-index:10;
  }
  .status {
    height:44px; display:flex; align-items:flex-end; justify-content:space-between;
    padding:0 28px 6px; font-size:12px; font-weight:700; color:var(--w70);
    flex-shrink:0; position:relative; z-index:5;
  }
  .status-r { display:flex; gap:5px; align-items:center; font-size:11px; }
  .home-bar {
    position:absolute; bottom:10px; left:50%; transform:translateX(-50%);
    width:130px; height:5px; border-radius:3px; background:rgba(255,255,255,.22); z-index:10;
  }
  .screen { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative; }
  .screen-in { animation:scIn .4s ease forwards; }
  @keyframes scIn { from{opacity:0;transform:translateX(30px);} to{opacity:1;transform:translateX(0);} }

  /* Splash */
  .splash {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    background:radial-gradient(ellipse 70% 60% at 50% 48%,rgba(201,150,12,.1) 0%,transparent 65%),#0a0a0a;
  }
  .sp-logo { display:flex; flex-direction:column; align-items:center; gap:14px; animation:spIn .8s ease .2s both; }
  .sp-brand { font-family:'Bebas Neue',sans-serif; font-size:40px; color:var(--gold); letter-spacing:10px; }
  .sp-sub   { font-size:9px; font-weight:600; color:var(--w30); letter-spacing:5px; }
  .sp-script { font-family:'Great Vibes',cursive; font-size:52px; color:#fff; margin-top:8px; text-shadow:0 0 50px rgba(201,150,12,.3); animation:spIn .9s ease .6s both; }
  .sp-bar-wrap { width:120px; height:2px; background:rgba(255,255,255,.1); margin-top:52px; border-radius:1px; overflow:hidden; animation:spIn .5s ease 1s both; }
  .sp-bar { height:100%; background:var(--gold); animation:spFill 1.8s ease 1.2s forwards; width:0; }
  @keyframes spFill { to{width:100%;} }
  @keyframes spIn { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }

  /* Onboarding */
  .ob { flex:1; display:flex; flex-direction:column; padding:20px 32px 32px; background:#0a0a0a; }
  .ob-top { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .ob-icon { margin-bottom:36px; }
  .ob-title { font-family:'Bebas Neue',sans-serif; font-size:36px; color:#fff; letter-spacing:2px; text-align:center; line-height:1.05; white-space:pre-line; margin-bottom:16px; }
  .ob-desc  { font-size:13px; font-weight:300; color:var(--w50); text-align:center; line-height:1.75; max-width:280px; }
  .ob-dots  { display:flex; gap:7px; justify-content:center; margin:28px 0; }
  .dot  { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,.18); transition:all .3s; }
  .dot.on { background:var(--gold); width:20px; border-radius:4px; }
  .ob-next {
    width:100%; padding:16px;
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:4px;
    animation:apShimmer 3.5s ease-in-out infinite; transition:transform .2s;
  }
  @keyframes apShimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .ob-skip { background:none; border:none; color:var(--w30); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; padding:14px; width:100%; text-align:center; }

  /* Trial */
  .trial { flex:1; display:flex; flex-direction:column; padding:28px 28px 36px; background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(201,150,12,.08) 0%,transparent 55%),#0a0a0a; overflow-y:auto; }
  .tr-logo { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
  .tr-brand { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--gold); letter-spacing:5px; }
  .tr-hero  { text-align:center; margin-bottom:24px; }
  .tr-tag   { display:inline-block; background:rgba(201,150,12,.15); border:1px solid rgba(201,150,12,.3); color:var(--gold); font-size:9.5px; font-weight:700; letter-spacing:3px; padding:5px 14px; margin-bottom:14px; }
  .tr-h1    { font-family:'Bebas Neue',sans-serif; font-size:44px; color:#fff; letter-spacing:2px; line-height:.95; margin-bottom:6px; }
  .tr-gold  { font-family:'Great Vibes',cursive; font-size:40px; color:var(--gold); text-shadow:0 0 40px rgba(201,150,12,.3); }
  .tr-sub   { font-size:12px; font-weight:300; color:var(--w50); margin-top:8px; }
  .tr-perks { list-style:none; display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
  .tr-perks li { display:flex; align-items:center; gap:10px; font-size:13px; color:var(--w70); }
  .perk-chk { width:20px; height:20px; border-radius:50%; background:rgba(201,150,12,.15); border:1px solid rgba(201,150,12,.4); display:flex; align-items:center; justify-content:center; color:var(--gold); font-size:10px; font-weight:700; flex-shrink:0; }
  .tr-plans { display:flex; gap:8px; margin-bottom:20px; }
  .tp { flex:1; padding:12px 8px; background:var(--w05); border:1px solid rgba(201,150,12,.14); cursor:pointer; transition:all .25s; text-align:center; }
  .tp.sel { border-color:var(--gold); background:rgba(201,150,12,.07); }
  .tp-name  { font-size:9px; font-weight:700; color:var(--w50); letter-spacing:2px; margin-bottom:4px; }
  .tp.sel .tp-name { color:var(--gold); }
  .tp-price { font-family:'Bebas Neue',sans-serif; font-size:20px; color:#fff; }
  .tp.sel .tp-price { color:var(--gold-hi); }
  .tp-mo { font-size:9px; color:var(--w30); }
  .tr-cta {
    width:100%; padding:16px;
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:3.5px; margin-bottom:10px;
    animation:apShimmer 3.5s ease-in-out infinite;
  }
  .tr-note  { font-size:10.5px; color:var(--w30); text-align:center; line-height:1.6; }
  .tr-login { background:none; border:none; color:var(--gold); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:1px; width:100%; padding:10px; margin-top:4px; }

  /* App Login */
  .al { flex:1; display:flex; flex-direction:column; padding:28px 28px 36px; background:#0a0a0a; overflow-y:auto; }
  .al-top { display:flex; align-items:center; gap:10px; margin-bottom:28px; }
  .al-brand { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--gold); letter-spacing:5px; }
  .al-title { font-family:'Cinzel',serif; font-size:22px; font-weight:700; color:#fff; letter-spacing:3px; margin-bottom:6px; }
  .al-sub   { font-size:12px; color:var(--w50); margin-bottom:28px; }
  .al-field { margin-bottom:16px; }
  .al-label { display:block; font-size:9px; font-weight:700; color:var(--w30); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
  .al-input {
    width:100%; background:var(--w05); border:1px solid rgba(201,150,12,.18);
    color:#fff; font-family:'Montserrat',sans-serif; font-size:14px; padding:13px 16px;
    outline:none; border-radius:0; transition:border-color .25s;
  }
  .al-input:focus { border-color:rgba(201,150,12,.6); }
  .al-input::placeholder { color:rgba(255,255,255,.18); }
  .al-forgot { background:none; border:none; color:rgba(201,150,12,.65); font-family:'Montserrat',sans-serif; font-size:10.5px; font-weight:500; display:block; margin:0 0 20px auto; padding:0; }
  .al-cta {
    width:100%; padding:16px;
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:3.5px; margin-bottom:20px;
    animation:apShimmer 3.5s ease-in-out infinite;
  }
  .al-or { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .al-line { flex:1; height:1px; background:rgba(255,255,255,.07); }
  .al-or-txt { font-size:9px; font-weight:700; color:var(--w30); letter-spacing:2.5px; }
  .al-trial { width:100%; padding:14px; background:transparent; border:1px solid rgba(201,150,12,.3); color:rgba(201,150,12,.8); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2.5px; transition:all .25s; }
  .al-trial:hover { background:rgba(201,150,12,.07); border-color:var(--gold); }

  /* Nav pills */
  .screen-nav { display:flex; gap:8px; justify-content:center; margin-top:20px; flex-wrap:wrap; position:relative; z-index:1; }
  .nav-pill { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.45); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:600; letter-spacing:1.5px; padding:7px 16px; transition:all .2s; }
  .nav-pill.on, .nav-pill:hover { background:rgba(201,150,12,.12); border-color:rgba(201,150,12,.4); color:var(--gold); }

  /* Instagram link */
  .ig-note { margin-top:16px; font-size:11px; color:rgba(201,150,12,.6); letter-spacing:1px; text-align:center; position:relative; z-index:1; }
  .ig-note a { color:var(--gold); text-decoration:none; }
  .ig-note a:hover { text-decoration:underline; }
`

export default function AppDemo() {
  const navigate = useNavigate()
  const [screen,  setScreen]  = useState('splash')
  const [obIdx,   setObIdx]   = useState(0)
  const [planSel, setPlanSel] = useState('monthly')
  const [email,   setEmail]   = useState('')
  const [pw,      setPw]      = useState('')

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('onboard'), 3200)
      return () => clearTimeout(t)
    }
  }, [screen])

  const nextOb = () => obIdx < ONBOARDING.length - 1 ? setObIdx(obIdx + 1) : setScreen('trial')
  const ob = ONBOARDING[obIdx]
  const plan = MINI_PLANS.find(p => p.id === planSel)

  const StatusBar = () => (
    <div className="status">
      <span>9:41</span>
      <div className="status-r"><span>●●●</span><span>WiFi</span><span>🔋</span></div>
    </div>
  )

  return (
    <>
      <style>{css}</style>
      <div className="app-outer">
        <div className="app-bg"/>
        <div className="app-particles">
          {PARTICLES.map(p => (
            <div key={p.id} className="app-p" style={{
              left:`${p.left}%`, top:`${p.top}%`,
              width:`${p.size}px`, height:`${p.size}px`,
              opacity:p.opacity,
              animationDuration:`${p.dur}s`,
              animationDelay:`${p.delay}s`,
            }}/>
          ))}
        </div>

        <div className="phone">
          <div className="notch"/>
          <StatusBar/>

          {screen === 'splash' && (
            <div className="screen splash">
              <div className="sp-logo">
                <svg width="54" height="48" viewBox="0 0 44 40" fill="none">
                  <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                  <rect x="12" y="20" width="20" height="3.5" fill="#0a0a0a"/>
                  <polygon points="22,24 30.5,39 13.5,39" fill="#0a0a0a"/>
                </svg>
                <span className="sp-brand">AUREVA</span>
                <span className="sp-sub">TRAINING SYSTEM</span>
              </div>
              <p className="sp-script">Become Her.</p>
              <div className="sp-bar-wrap"><div className="sp-bar"/></div>
            </div>
          )}

          {screen === 'onboard' && (
            <div className="screen ob screen-in">
              <div className="ob-top">
                <div className="ob-icon">{ob.icon}</div>
                <h2 className="ob-title">{ob.title}</h2>
                <p className="ob-desc">{ob.desc}</p>
              </div>
              <div className="ob-dots">
                {ONBOARDING.map((_,i) => <div key={i} className={`dot${i===obIdx?' on':''}`}/>)}
              </div>
              <button className="ob-next" onClick={nextOb}>
                {obIdx < ONBOARDING.length-1 ? 'CONTINUE →' : 'GET STARTED →'}
              </button>
              <button className="ob-skip" onClick={() => setScreen('trial')}>Skip</button>
            </div>
          )}

          {screen === 'trial' && (
            <div className="screen trial screen-in">
              <div className="tr-logo">
                <svg width="28" height="26" viewBox="0 0 44 40" fill="none">
                  <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                  <rect x="12" y="20" width="20" height="3.5" fill="#0a0a0a"/>
                  <polygon points="22,24 30.5,39 13.5,39" fill="#0a0a0a"/>
                </svg>
                <span className="tr-brand">AUREVA</span>
              </div>
              <div className="tr-hero">
                <div className="tr-tag">LIMITED OFFER</div>
                <h1 className="tr-h1">3 DAYS</h1>
                <p className="tr-gold">Free Trial</p>
                <p className="tr-sub">No commitment. Cancel anytime.</p>
              </div>
              <ul className="tr-perks">
                {['Full 28-day program — all workout days','Progress tracking & habit journal','Transformation photo tools','Certificate of completion'].map(t => (
                  <li key={t}><div className="perk-chk">✓</div>{t}</li>
                ))}
              </ul>
              <div className="tr-plans">
                {MINI_PLANS.map(p => (
                  <div key={p.id} className={`tp${planSel===p.id?' sel':''}`} onClick={() => setPlanSel(p.id)}>
                    <p className="tp-name">{p.name}</p>
                    <p className="tp-price">{p.price}</p>
                    <p className="tp-mo">{p.mo}</p>
                  </div>
                ))}
              </div>
              <button className="tr-cta" onClick={() => setScreen('login')}>
                START FREE TRIAL →
              </button>
              <p className="tr-note">3 days free, then {plan.price}{plan.mo}. Cancel before trial ends and pay nothing.</p>
              <button className="tr-login" onClick={() => setScreen('login')}>
                Already have an account? Log in
              </button>
            </div>
          )}

          {screen === 'login' && (
            <div className="screen al screen-in">
              <div className="al-top">
                <svg width="28" height="26" viewBox="0 0 44 40" fill="none">
                  <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                  <rect x="12" y="20" width="20" height="3.5" fill="#0a0a0a"/>
                  <polygon points="22,24 30.5,39 13.5,39" fill="#0a0a0a"/>
                </svg>
                <span className="al-brand">AUREVA</span>
              </div>
              <h2 className="al-title">WELCOME BACK</h2>
              <p className="al-sub">Continue your transformation</p>
              <div className="al-field">
                <label className="al-label">Email</label>
                <input className="al-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
              </div>
              <div className="al-field">
                <label className="al-label">Password</label>
                <input className="al-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"/>
              </div>
              <button className="al-forgot">Forgot password?</button>
              <button className="al-cta">LOG IN →</button>
              <div className="al-or"><span className="al-line"/><span className="al-or-txt">NEW USER?</span><span className="al-line"/></div>
              <button className="al-trial" onClick={() => setScreen('trial')}>
                START YOUR 3-DAY FREE TRIAL
              </button>
            </div>
          )}

          <div className="home-bar"/>
        </div>

        <div className="screen-nav">
          {[{id:'splash',label:'Splash'},{id:'onboard',label:'Onboard'},{id:'trial',label:'Trial'},{id:'login',label:'Login'}].map(s => (
            <button key={s.id} className={`nav-pill${screen===s.id?' on':''}`}
              onClick={() => { if(s.id==='onboard') setObIdx(0); setScreen(s.id); }}>
              {s.label}
            </button>
          ))}
        </div>

        <p className="ig-note">
          Follow us on Instagram: <a href="https://www.instagram.com/AurevaFitness" target="_blank" rel="noreferrer">@AurevaFitness</a>
        </p>
      </div>
    </>
  )
}
