import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: ((Math.sin(i * 2.399) + 1) / 2) * 100,
  top:  ((Math.cos(i * 1.618) + 1) / 2) * 100,
  size: ((Math.sin(i * 3.141) + 1) / 2) * 2.2 + 0.4,
  dur:  16 + (i % 10) * 1.8,
  delay:(i % 15) * 1.2,
  opacity: 0.04 + (i % 5) * 0.025,
}))

const PLANS = [
  {
    id: 'monthly',
    name: 'MONTHLY',
    price: '$9.99',
    period: '/month',
    sub: 'Cancel anytime',
    perMonth: null,
    badge: null,
    featured: false,
    features: [
      'Full 28-day program access',
      'All workout days (Days 1–28)',
      'Progress & habit tracking',
      'Transformation journal',
      '28-Day Nutrition Meal Plan — FREE 🥗',
      'Cancel anytime',
    ],
  },
  {
    id: 'quarterly',
    name: '3 MONTHS',
    price: '$25.99',
    period: '/3 months',
    sub: '$8.66/mo · Save 13%',
    perMonth: '$8.66/mo',
    badge: 'MOST POPULAR',
    featured: true,
    features: [
      'Full 28-day program access',
      'All workout days (Days 1–28)',
      'Progress & habit tracking',
      'Transformation journal',
      '28-Day Nutrition Meal Plan — FREE 🥗',
      'Complete the full 3-month cycle',
    ],
  },
  {
    id: 'annual',
    name: '1 YEAR',
    price: '$99.99',
    period: '/year',
    sub: '$8.33/mo · Save 17%',
    perMonth: '$8.33/mo',
    badge: 'BEST VALUE',
    featured: false,
    features: [
      'Full 28-day program access',
      'All workout days (Days 1–28)',
      'Progress & habit tracking',
      'Transformation journal',
      '28-Day Nutrition Meal Plan — FREE 🥗',
      'Certificate of completion',
    ],
  },
]

const css = `
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w60:rgba(255,255,255,.60); --w40:rgba(255,255,255,.40);
    --w20:rgba(255,255,255,.20); --w05:rgba(255,255,255,.05); --w03:rgba(255,255,255,.03);
  }
  .pg-page {
    min-height:100vh; background:var(--black);
    display:flex; flex-direction:column; align-items:center;
    font-family:'Montserrat',sans-serif; padding:0 20px 70px;
    position:relative; overflow:hidden;
  }
  .pg-glow {
    position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 70% 50% at 50% 25%,rgba(201,150,12,.065) 0%,transparent 60%),
      radial-gradient(ellipse 40% 40% at 15% 80%,rgba(201,150,12,.04) 0%,transparent 55%),
      radial-gradient(ellipse 40% 40% at 85% 70%,rgba(201,150,12,.04) 0%,transparent 55%);
  }
  .pg-particles { position:absolute; inset:0; pointer-events:none; z-index:0; }
  .pg-p {
    position:absolute; border-radius:50%; background:var(--gold-hi);
    animation:pgdrift linear infinite;
  }
  @keyframes pgdrift {
    0%{transform:translate(0,0);opacity:0;} 12%{opacity:1;}
    88%{opacity:.3;} 100%{transform:translate(12px,-80px);opacity:0;}
  }
  .pg-content {
    width:100%; max-width:960px;
    display:flex; flex-direction:column; align-items:center;
    position:relative; z-index:1;
    opacity:0; transform:translateY(22px);
    transition:opacity .8s ease, transform .8s ease;
  }
  .pg-content.in { opacity:1; transform:translateY(0); }
  .pg-logo { display:flex; align-items:center; gap:12px; padding:40px 0 44px; }
  .pg-logo-txt { display:flex; flex-direction:column; }
  .pg-brand { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); letter-spacing:6px; line-height:1; }
  .pg-sub   { font-size:7.5px; font-weight:600; color:var(--w40); letter-spacing:4px; }
  .pg-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,6vw,64px); color:#fff; letter-spacing:4px; text-align:center; margin-bottom:12px; }
  .pg-desc  { font-size:13px; font-weight:300; color:var(--w60); text-align:center; margin-bottom:52px; }
  .plans-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; width:100%; margin-bottom:36px; align-items:start; }
  .plan-card {
    position:relative; background:var(--w03); border:1px solid rgba(201,150,12,.15);
    padding:36px 28px 28px; cursor:pointer;
    transition:all .3s cubic-bezier(.16,1,.3,1);
    display:flex; flex-direction:column;
  }
  .plan-card:hover { border-color:rgba(201,150,12,.32); background:rgba(201,150,12,.03); }
  .plan-card.feat {
    transform:translateY(-10px); border-color:var(--gold);
    background:rgba(201,150,12,.05);
    box-shadow:0 20px 60px rgba(201,150,12,.12),0 0 0 1px rgba(201,150,12,.2);
  }
  .plan-card.sel { border-color:var(--gold); background:rgba(201,150,12,.07); box-shadow:0 0 40px rgba(201,150,12,.14); }
  .plan-card.feat.sel { box-shadow:0 20px 60px rgba(201,150,12,.22),0 0 0 1px rgba(201,150,12,.5); }
  .plan-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:transparent; transition:background .3s;
  }
  .plan-card.feat::before, .plan-card.sel::before {
    background:linear-gradient(to right,transparent,var(--gold),transparent);
  }
  .plan-badge {
    position:absolute; top:-14px; left:50%; transform:translateX(-50%);
    background:var(--gold); color:#060606;
    font-size:8.5px; font-weight:800; letter-spacing:3px; padding:4px 14px; white-space:nowrap;
  }
  .plan-name { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--w40); letter-spacing:4px; margin-bottom:20px; transition:color .25s; }
  .plan-card.sel .plan-name, .plan-card.feat .plan-name { color:var(--gold); }
  .plan-price { font-family:'Bebas Neue',sans-serif; font-size:54px; color:#fff; line-height:1; margin-bottom:4px; }
  .plan-card.feat .plan-price { color:var(--gold-hi); }
  .plan-price span { font-family:'Montserrat',sans-serif; font-size:14px; font-weight:400; color:var(--w60); vertical-align:middle; margin-left:2px; }
  .plan-sub { font-size:11px; font-weight:500; color:rgba(201,150,12,.8); letter-spacing:.5px; margin-bottom:24px; }
  .plan-sub.plain { color:var(--w40); }
  .plan-div { height:1px; background:rgba(255,255,255,.07); margin-bottom:20px; }
  .plan-feats { list-style:none; display:flex; flex-direction:column; gap:10px; flex:1; }
  .plan-feats li { font-size:12px; color:var(--w60); display:flex; align-items:flex-start; gap:10px; }
  .plan-feats li::before { content:'✓'; color:var(--gold); font-size:11px; font-weight:700; flex-shrink:0; margin-top:1px; }
  .plan-sel-row { display:flex; align-items:center; gap:8px; margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,255,255,.07); }
  .radio { width:16px; height:16px; border-radius:50%; border:1.5px solid rgba(201,150,12,.35); transition:all .25s; flex-shrink:0; }
  .plan-card.sel .radio { background:var(--gold); border-color:var(--gold); box-shadow:0 0 8px rgba(201,150,12,.45); }
  .sel-txt { font-size:10.5px; font-weight:700; color:var(--w40); letter-spacing:1.5px; transition:color .25s; }
  .plan-card.sel .sel-txt { color:var(--gold); }
  .trust { display:flex; align-items:center; gap:8px; font-size:11px; color:var(--w40); font-weight:500; letter-spacing:.4px; margin-bottom:32px; }
  .tdot { width:3px; height:3px; border-radius:50%; background:rgba(201,150,12,.35); }
  .pg-cta {
    min-width:380px;
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:12px; font-weight:800; letter-spacing:4px; padding:18px 48px;
    animation:pgShimmer 3.5s ease-in-out infinite;
    transition:transform .2s, box-shadow .3s;
    display:flex; align-items:center; justify-content:center; gap:10px;
  }
  @keyframes pgShimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .pg-cta:hover { animation:none; background-position:100%; transform:translateY(-2px); box-shadow:0 10px 36px rgba(201,150,12,.3); }
  .pg-arr { transition:transform .3s; font-size:16px; }
  .pg-cta:hover .pg-arr { transform:translateX(5px); }

  /* Payment step */
  .pay-wrap {
    width:100%; max-width:520px; display:flex; flex-direction:column; align-items:center;
    position:relative; z-index:1;
    opacity:0; transform:translateY(20px);
    transition:opacity .75s ease, transform .75s ease;
  }
  .pay-wrap.in { opacity:1; transform:translateY(0); }

  .pg-back { background:none; border:none; color:rgba(201,150,12,.6); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; display:flex; align-items:center; gap:6px; padding:0; margin-bottom:16px; align-self:flex-start; transition:color .2s; }
  .pg-back:hover { color:var(--gold); }
  .back-btn {
    align-self:flex-start; background:none; border:none; color:var(--w40);
    font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px;
    display:flex; align-items:center; gap:6px; margin-bottom:28px; padding:0;
    transition:color .2s;
  }
  .back-btn:hover { color:var(--gold); }
  .pay-card {
    width:100%; background:var(--w05); border:1px solid rgba(201,150,12,.14);
    padding:44px 40px; position:relative;
  }
  .pay-card::before {
    content:''; position:absolute; top:0; left:28px; right:28px; height:1.5px;
    background:linear-gradient(to right,transparent,var(--gold),transparent);
  }
  .plan-summary {
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(201,150,12,.06); border:1px solid rgba(201,150,12,.2);
    padding:14px 18px; margin-bottom:32px;
  }
  .ps-left { display:flex; flex-direction:column; gap:3px; }
  .ps-name { font-size:10px; font-weight:700; color:var(--gold); letter-spacing:2.5px; }
  .ps-desc { font-size:11px; color:var(--w60); }
  .ps-price { font-family:'Bebas Neue',sans-serif; font-size:30px; color:var(--gold); }
  .pay-title { font-family:'Cinzel',serif; font-size:16px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:28px; }
  .pay-field { margin-bottom:18px; }
  .pay-label { display:block; font-size:9px; font-weight:700; color:var(--w40); letter-spacing:2px; text-transform:uppercase; margin-bottom:7px; }
  .pay-input {
    width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(201,150,12,.18);
    color:#fff; font-family:'Montserrat',sans-serif; font-size:14px; padding:13px 16px;
    outline:none; border-radius:0; transition:border-color .25s, background .25s;
  }
  .pay-input:hover { border-color:rgba(201,150,12,.32); }
  .pay-input:focus { border-color:rgba(201,150,12,.65); background:rgba(201,150,12,.04); }
  .pay-input::placeholder { color:rgba(255,255,255,.18); }
  .pay-err { border-color:rgba(255,80,80,.6) !important; }
  .field-err { display:block; font-size:10px; color:rgba(255,100,100,.9); margin-top:5px; letter-spacing:.5px; }
  .pay-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .pay-cta {
    width:100%; margin-top:24px;
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:3.5px; padding:17px;
    animation:pgShimmer 3.5s ease-in-out infinite;
    transition:transform .2s, box-shadow .3s;
    display:flex; align-items:center; justify-content:center; gap:10px;
  }
  .pay-cta:hover { animation:none; transform:translateY(-2px); box-shadow:0 10px 36px rgba(201,150,12,.28); }
  .pay-cta:disabled { opacity:.65; cursor:not-allowed; animation:none; transform:none; }
  .secure-note { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:16px; font-size:11px; color:var(--w40); }

  /* Done step */
  .done-wrap {
    display:flex; flex-direction:column; align-items:center; text-align:center;
    padding:64px 20px; position:relative; z-index:1;
    animation:pgup .9s ease forwards;
  }
  .done-ring {
    width:76px; height:76px; border-radius:50%; border:2px solid var(--gold);
    display:flex; align-items:center; justify-content:center;
    font-size:30px; color:var(--gold); margin-bottom:32px;
    animation:ringpulse 2.5s ease-in-out infinite;
  }
  @keyframes ringpulse { 0%,100%{box-shadow:0 0 20px rgba(201,150,12,.2);} 50%{box-shadow:0 0 52px rgba(201,150,12,.45);} }
  .done-title { font-family:'Bebas Neue',sans-serif; font-size:52px; color:var(--gold); letter-spacing:4px; margin-bottom:10px; }
  .done-script { font-family:'Great Vibes',cursive; font-size:44px; color:#fff; margin-bottom:24px; text-shadow:0 0 60px rgba(201,150,12,.3); }
  .done-txt { font-size:14px; font-weight:300; color:var(--w60); line-height:1.85; max-width:380px; margin-bottom:44px; }
  .done-cta {
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:3.5px; padding:17px 52px;
    transition:transform .2s, box-shadow .3s;
  }
  .done-cta:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(201,150,12,.3); }
  @keyframes pgup { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }

  /* Footer */
  .pg-footer {
    width:100%; max-width:960px; position:relative; z-index:1;
    display:flex; flex-direction:column; align-items:center; gap:10px;
    padding-top:40px; border-top:1px solid rgba(201,150,12,.1); margin-top:20px;
  }
  .pg-footer-links { display:flex; gap:24px; align-items:center; }
  .pg-footer a {
    font-size:11px; font-weight:500; color:rgba(201,150,12,.65);
    text-decoration:none; letter-spacing:1px; transition:color .2s;
  }
  .pg-footer a:hover { color:var(--gold); }
  .pg-footer-copy { font-size:10px; color:rgba(255,255,255,.25); letter-spacing:1px; }


  .meal-banner {
    width:100%; display:flex; align-items:center; justify-content:center; gap:14px;
    background:rgba(201,150,12,0.08); border:1px solid rgba(201,150,12,0.35);
    padding:14px 28px; margin-bottom:36px;
  }
  .meal-banner-txt { font-size:11px; font-weight:800; color:var(--gold); letter-spacing:3px; text-align:center; }
  .meal-banner-icon { font-size:20px; }
  @media (max-width:740px) {
    .plans-grid { grid-template-columns:1fr; }
    .plan-card.feat { transform:none; }
    .pg-cta { min-width:unset; width:100%; }
    .pay-row { grid-template-columns:1fr; }
    .pay-card { padding:36px 24px; }
  }
`

const AurevaLogo = () => (
  <div className="pg-logo">
    <svg width="40" height="36" viewBox="0 0 44 40" fill="none">
      <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
      <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
      <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
    </svg>
    <div className="pg-logo-txt">
      <span className="pg-brand">AUREVA</span>
      <span className="pg-sub">TRAINING SYSTEM</span>
    </div>
  </div>
)

const Bg = ({ particles }) => (
  <>
    <div className="pg-glow"/>
    <div className="pg-particles">
      {particles.map(p => (
        <div key={p.id} className="pg-p" style={{
          left:`${p.left}%`, top:`${p.top}%`,
          width:`${p.size}px`, height:`${p.size}px`,
          opacity:p.opacity,
          animationDuration:`${p.dur}s`,
          animationDelay:`${p.delay}s`,
        }}/>
      ))}
    </div>
  </>
)

export default function Pricing() {
  const navigate   = useNavigate()
  const [selected, setSelected] = useState('annual')
  const [step,     setStep]     = useState('plans')
  const [ready,    setReady]    = useState(false)
  const [name,     setName]     = useState('')
  const [card,     setCard]     = useState('')
  const [expiry,   setExpiry]   = useState('')
  const [cvv,      setCvv]      = useState('')
  const [processing, setProc]  = useState(false)
  const [errors,   setErrors]  = useState({})

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const formatCard  = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry= v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=2?d.slice(0,2)+'/'+d.slice(2):d }

  const plan = PLANS.find(p => p.id === selected)

  const validatePayment = () => {
    const e = {}
    if (!name.trim())                             e.name   = 'Please enter the cardholder name.'
    if (card.replace(/\s/g,'').length < 16)       e.card   = 'Please enter a valid 16-digit card number.'
    if (!/^\d{2}\/\d{2}$/.test(expiry))          e.expiry = 'Please enter expiry as MM/YY.'
    else {
      const [mm, yy] = expiry.split('/').map(Number)
      const now = new Date(); const cy = now.getFullYear()%100; const cm = now.getMonth()+1
      if (mm < 1 || mm > 12)                     e.expiry = 'Invalid month.'
      else if (yy < cy || (yy === cy && mm < cm)) e.expiry = 'This card has expired.'
    }
    if (cvv.length < 3)                           e.cvv    = 'Please enter a valid CVV.'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const cl   = ready ? ' in' : ''

  if (step === 'plans') return (
    <>
      <style>{css}</style>
      <div className="pg-page">
        <Bg particles={PARTICLES}/>
        <div className={`pg-content${cl}`}>
          <button className="pg-back" onClick={() => navigate(-1)}>← BACK</button>
          <AurevaLogo/>
          <h1 className="pg-title">CHOOSE YOUR PLAN</h1>
          <p className="pg-desc">Discipline builds results. Pick your commitment.</p>

          <div className="meal-banner">
            <span className="meal-banner-icon">🥗</span>
            <span className="meal-banner-txt">FREE 28-DAY NUTRITION MEAL PLAN INCLUDED WITH EVERY PLAN</span>
            <span className="meal-banner-icon">🥗</span>
          </div>

          <div className="plans-grid">
            {PLANS.map(p => (
              <div key={p.id}
                className={`plan-card${p.featured?' feat':''}${selected===p.id?' sel':''}`}
                onClick={() => setSelected(p.id)}>
                {p.badge && <div className="plan-badge">{p.badge}</div>}
                <p className="plan-name">{p.name}</p>
                <div className="plan-price">{p.price}<span>{p.period}</span></div>
                <p className={`plan-sub${!p.perMonth?' plain':''}`}>{p.sub}</p>
                <div className="plan-div"/>
                <ul className="plan-feats">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
                <div className="plan-sel-row">
                  <div className="radio"/>
                  <span className="sel-txt">{selected===p.id?'SELECTED':'SELECT PLAN'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="trust">
            <span>🔒 Secure Payment</span><span className="tdot"/>
            <span>Cancel Anytime</span><span className="tdot"/>
            <span>Instant Access</span>
          </div>

          <button className="pg-cta" onClick={() => setStep('payment')}>
            <span>CONTINUE WITH {plan.name}</span><span className="pg-arr">→</span>
          </button>

          <div className="pg-footer">
            <div className="pg-footer-links">
              <a href="https://www.instagram.com/AurevaFitness" target="_blank" rel="noreferrer">
                📸 @AurevaFitness
              </a>
              <a href="https://www.facebook.com/AurevaTrainingSystem" target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href="/" onClick={e=>{e.preventDefault();navigate('/')}}>Log In</a>
            </div>
            <p className="pg-footer-copy">© 2025 Aureva Training System · All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  )

  if (step === 'payment') return (
    <>
      <style>{css}</style>
      <div className="pg-page">
        <Bg particles={PARTICLES}/>
        <div className={`pay-wrap${cl}`}>
          <AurevaLogo/>
          <button className="back-btn" onClick={() => setStep('plans')}>← BACK TO PLANS</button>
          <div className="pay-card">
            <div className="plan-summary">
              <div className="ps-left">
                <span className="ps-name">AUREVA {plan.name}</span>
                <span className="ps-desc">{plan.sub}</span>
              </div>
              <span className="ps-price">{plan.price}</span>
            </div>
            <h2 className="pay-title">PAYMENT DETAILS</h2>
            <div className="pay-field">
              <label className="pay-label">Cardholder Name</label>
              <input className={`pay-input${errors.name?' pay-err':''}`} type="text" value={name}
                onChange={e=>{setName(e.target.value);setErrors(p=>({...p,name:''}))}} placeholder="Jane Smith"/>
              {errors.name && <span className="field-err">⚠ {errors.name}</span>}
            </div>
            <div className="pay-field">
              <label className="pay-label">Card Number</label>
              <input className={`pay-input${errors.card?' pay-err':''}`} type="text" value={card}
                onChange={e=>{setCard(formatCard(e.target.value));setErrors(p=>({...p,card:''}))}}
                placeholder="1234 5678 9012 3456" maxLength={19}/>
              {errors.card && <span className="field-err">⚠ {errors.card}</span>}
            </div>
            <div className="pay-row">
              <div className="pay-field">
                <label className="pay-label">Expiry</label>
                <input className={`pay-input${errors.expiry?' pay-err':''}`} type="text" value={expiry}
                  onChange={e=>{setExpiry(formatExpiry(e.target.value));setErrors(p=>({...p,expiry:''}))}}
                  placeholder="MM/YY" maxLength={5}/>
                {errors.expiry && <span className="field-err">⚠ {errors.expiry}</span>}
              </div>
              <div className="pay-field">
                <label className="pay-label">CVV</label>
                <input className={`pay-input${errors.cvv?' pay-err':''}`} type="text" value={cvv}
                  onChange={e=>{setCvv(e.target.value.replace(/\D/g,'').slice(0,4));setErrors(p=>({...p,cvv:''}))}}
                  placeholder="•••" maxLength={4}/>
                {errors.cvv && <span className="field-err">⚠ {errors.cvv}</span>}
              </div>
            </div>
            <button className="pay-cta"
              onClick={() => { if (validatePayment()) { setProc(true); setTimeout(()=>setStep('done'),2200) } }}
              disabled={processing}>
              {processing ? 'PROCESSING...' : `COMPLETE PURCHASE · ${plan.price}`}
            </button>
            <div className="secure-note">🔒 256-bit SSL encryption · Powered by Stripe</div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="pg-page">
        <Bg particles={PARTICLES}/>
        <div className="done-wrap">
          <div className="done-ring">✓</div>
          <h1 className="done-title">WELCOME TO AUREVA</h1>
          <p className="done-script">Her journey begins.</p>
          <p className="done-txt">
            Your subscription is active. You now have full access<br/>
            to the 28-Day Aureva Training System.<br/>
            Day 1 is ready. Your transformation starts now.
          </p>
          <button className="done-cta" onClick={() => navigate('/')}>START DAY 1 →</button>
        </div>
      </div>
    </>
  )
}
