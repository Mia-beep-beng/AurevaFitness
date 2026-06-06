import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: ((Math.sin(i * 2.399) + 1) / 2) * 100,
  top:  ((Math.cos(i * 1.618) + 1) / 2) * 100,
  size: ((Math.sin(i * 3.141) + 1) / 2) * 2.2 + 0.4,
  dur:  15 + (i % 10) * 1.9,
  delay:(i % 16) * 1.1,
  opacity: 0.04 + (i % 5) * 0.025,
}))

const css = `
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35); --w04:rgba(255,255,255,.04);
  }
  .page {
    height:100vh; background:var(--black);
    display:flex; overflow:hidden;
    font-family:'Montserrat',sans-serif;
  }

  /* ══ PHOTO PANEL ══
     Replace background with your image:
     background:
       linear-gradient(to right, rgba(6,6,6,0) 0%, rgba(6,6,6,.65) 72%, #060606 100%),
       url('YOUR_PHOTO_URL') center / cover no-repeat;
  ══════════════════ */
  .photo-col {
    flex:1.05; position:relative; overflow:hidden;
    background:
      linear-gradient(to right, rgba(6,6,6,0) 0%, rgba(6,6,6,.68) 74%, #060606 100%),
      radial-gradient(ellipse 60% 55% at 50% 45%, rgba(201,130,8,.22) 0%, rgba(160,90,4,.10) 40%, transparent 70%),
      linear-gradient(160deg, #0d0a02 0%, #1a1100 45%, #060606 100%);
  }
  .photo-col::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 50% 40% at 48% 42%, rgba(220,140,10,.18) 0%, transparent 60%),
      radial-gradient(ellipse 70% 25% at 50% 100%, rgba(6,6,6,.85) 0%, transparent 80%);
  }
  .photo-col::after {
    content:''; position:absolute; right:0; top:5%; height:90%; width:1px;
    background:linear-gradient(to bottom, transparent, rgba(201,150,12,.22) 30%, rgba(201,150,12,.22) 70%, transparent);
  }
  .photo-script {
    position:absolute; bottom:13%; left:0; right:0; text-align:center;
    font-family:'Great Vibes',cursive;
    font-size:clamp(52px,5.5vw,76px); color:rgba(201,150,12,.55);
    pointer-events:none; z-index:2;
    text-shadow:0 0 60px rgba(201,150,12,.3);
  }
  .particles { position:absolute; inset:0; pointer-events:none; z-index:1; }
  .p {
    position:absolute; border-radius:50%; background:var(--gold-hi);
    animation:pdrift linear infinite;
  }
  @keyframes pdrift {
    0%{transform:translate(0,0);opacity:0;} 12%{opacity:1;}
    88%{opacity:.3;} 100%{transform:translate(14px,-85px);opacity:0;}
  }

  /* ══ LOGIN COLUMN ══ */
  .login-col {
    flex:1; display:flex; flex-direction:column; justify-content:space-between;
    padding:48px 56px; position:relative; z-index:2;
    opacity:0; transform:translateX(36px);
    transition:opacity .9s cubic-bezier(.16,1,.3,1) .15s, transform .9s cubic-bezier(.16,1,.3,1) .15s;
  }
  .login-col.in { opacity:1; transform:translateX(0); }
  .logo { display:flex; align-items:center; gap:12px; }
  .logo-txt { display:flex; flex-direction:column; }
  .l-brand { font-family:'Bebas Neue',sans-serif; font-size:24px; color:var(--gold); letter-spacing:7px; line-height:1; }
  .l-sub { font-size:8px; font-weight:600; color:var(--w35); letter-spacing:5px; }
  .welcome-block { margin-bottom:28px; }
  .eyebrow { font-size:10px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:14px; display:block; opacity:0; animation:upfade .7s ease .5s forwards; }
  .welcome-title { font-family:'Cinzel',serif; font-size:clamp(24px,2.8vw,34px); font-weight:700; color:#fff; letter-spacing:3px; margin-bottom:10px; opacity:0; animation:upfade .7s ease .7s forwards; }
  .welcome-desc { font-size:13px; font-weight:300; color:var(--w50); line-height:1.7; opacity:0; animation:upfade .7s ease .85s forwards; }

  .form { display:flex; flex-direction:column; flex:1; justify-content:center; }
  .field { margin-bottom:18px; }
  .f-label { display:block; font-size:9.5px; font-weight:700; color:var(--w35); letter-spacing:2.5px; text-transform:uppercase; margin-bottom:8px; }
  .f-wrap { position:relative; }
  .f-input {
    width:100%; background:var(--w04); border:1px solid rgba(201,150,12,.18);
    color:#fff; font-family:'Montserrat',sans-serif;
    font-size:13.5px; padding:13px 16px; outline:none; border-radius:0;
    transition:border-color .25s, background .25s;
  }
  .f-input:hover { border-color:rgba(201,150,12,.3); }
  .f-input:focus { border-color:rgba(201,150,12,.65); background:rgba(201,150,12,.04); }
  .f-input::placeholder { color:rgba(255,255,255,.18); }
  .f-input.with-t { padding-right:62px; }
  .f-input.error-field { border-color:rgba(255,80,80,.5); }
  .f-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--gold); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }

  /* Error & success messages */
  .error-msg {
    background:rgba(255,80,80,.08); border:1px solid rgba(255,80,80,.3);
    color:rgba(255,120,120,.9); font-size:11px; font-weight:500;
    padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px;
  }
  .success-msg {
    background:rgba(201,150,12,.08); border:1px solid rgba(201,150,12,.3);
    color:var(--gold); font-size:11px; font-weight:500;
    padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px;
  }

  .forgot-row { display:flex; justify-content:flex-end; margin:-4px 0 24px; }
  .forgot { background:none; border:none; color:rgba(201,150,12,.65); font-family:'Montserrat',sans-serif; font-size:10.5px; font-weight:500; cursor:pointer; padding:0; transition:color .2s; }
  .forgot:hover { color:var(--gold); }

  /* CTA */
  .cta {
    width:100%; background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; color:#040404; font-family:'Montserrat',sans-serif;
    font-size:11px; font-weight:800; letter-spacing:4px; padding:16px;
    display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:24px;
    animation:goldShimmer 3.5s ease-in-out infinite;
    transition:transform .2s, box-shadow .3s; cursor:pointer;
  }
  .cta:disabled { opacity:.6; cursor:not-allowed; animation:none; }
  .cta:not(:disabled):hover { animation:none; background-position:100%; transform:translateY(-2px); box-shadow:0 10px 36px rgba(201,150,12,.3); }
  @keyframes goldShimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .spinner { width:14px; height:14px; border:2px solid rgba(4,4,4,.3); border-top-color:#040404; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  .or { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
  .or-line { flex:1; height:1px; background:rgba(255,255,255,.07); }
  .or-txt { font-size:9px; font-weight:700; color:var(--w35); letter-spacing:3px; white-space:nowrap; }
  .join { width:100%; background:transparent; border:1px solid rgba(201,150,12,.3); color:rgba(201,150,12,.8); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:3px; padding:14px; cursor:pointer; transition:all .3s; margin-bottom:20px; }
  .join:hover { background:rgba(201,150,12,.07); border-color:var(--gold); color:var(--gold); }
  .social-proof { font-size:11px; color:var(--w35); text-align:center; }
  .tagline { font-size:9.5px; font-weight:700; color:var(--w35); letter-spacing:5px; opacity:0; animation:upfade .7s ease 1.2s forwards; }

  /* Footer links */
  .footer-links { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-top:16px; }
  .footer-links a { font-size:10px; color:rgba(201,150,12,.55); text-decoration:none; letter-spacing:1px; }
  .footer-links a:hover { color:var(--gold); }
  .footer-copy { font-size:9px; color:rgba(255,255,255,.2); text-align:center; letter-spacing:1px; margin-top:8px; }

  /* Forgot password modal */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); display:flex; align-items:center; justify-content:center; z-index:100; backdrop-filter:blur(4px); }
  .modal { background:#0e0e0e; border:1px solid rgba(201,150,12,.25); padding:40px 36px; max-width:380px; width:90%; position:relative; }
  .modal::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1.5px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .modal-title { font-family:'Cinzel',serif; font-size:16px; font-weight:700; color:var(--gold); letter-spacing:3px; margin-bottom:12px; }
  .modal-desc { font-size:13px; color:var(--w50); line-height:1.7; margin-bottom:24px; }
  .modal-input { width:100%; background:var(--w04); border:1px solid rgba(201,150,12,.2); color:#fff; font-family:'Montserrat',sans-serif; font-size:13.5px; padding:13px 16px; outline:none; border-radius:0; margin-bottom:16px; transition:border-color .25s; }
  .modal-input:focus { border-color:rgba(201,150,12,.6); }
  .modal-input::placeholder { color:rgba(255,255,255,.18); }
  .modal-cta { width:100%; background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); border:none; color:#040404; font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:3px; padding:14px; cursor:pointer; margin-bottom:12px; }
  .modal-close { background:none; border:none; color:var(--w35); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; width:100%; padding:8px; }
  .modal-sent { text-align:center; }
  .modal-sent-icon { font-size:48px; margin-bottom:16px; }
  .modal-sent-title { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--gold); letter-spacing:3px; margin-bottom:8px; }
  .modal-sent-txt { font-size:12px; color:var(--w50); line-height:1.7; margin-bottom:20px; }

  @keyframes upfade { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  @media(max-width:780px) {
    .page { flex-direction:column; height:auto; min-height:100vh; }
    .photo-col { flex:none; height:260px; }
    .photo-col::after { display:none; }
    .login-col { flex:none; padding:36px 28px 48px; }
  }
`

export default function Login() {
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [pw,       setPw]       = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [ready,    setReady]    = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent,  setForgotSent]  = useState(false)

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  const handleLogin = () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!pw.trim())    { setError('Please enter your password.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }

    setLoading(true)

    // ── ADMIN CHECK ──────────────────────────────────────────────────────────
    // Admin credentials are stored securely in Vercel environment variables.
    // Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in Vercel → Settings → Environment Variables
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
    const adminPass  = import.meta.env.VITE_ADMIN_PASSWORD || ''

    if (email.trim().toLowerCase() === adminEmail.toLowerCase() && pw === adminPass) {
      setTimeout(() => { navigate('/admin') }, 600)
      return
    }

    // ── REGULAR USER — Connect your backend here (Supabase / Firebase) ──────
    // Example with Supabase:
    // const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    // if (error) { setError(error.message); setLoading(false); return }
    // navigate('/dashboard')
    setTimeout(() => {
      setLoading(false)
      setError('Incorrect email or password. Please try again.')
    }, 1500)
  }

  const handleForgot = () => {
    setError('')
    const resetEmail = forgotEmail || email
    if (!resetEmail.trim()) { setError('Please enter your email address first.'); return }
    setShowForgot(true)
    setForgotEmail(resetEmail)
  }

  const handleSendReset = () => {
    if (!forgotEmail.trim()) return
    // ── Connect your backend here ──
    // Example with Supabase:
    // await supabase.auth.resetPasswordForEmail(forgotEmail)
    setForgotSent(true)
  }

  const cl = ready ? ' in' : ''

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700;800&family=Cinzel:wght@400;700&display=swap"/>
      <style>{css}</style>

      <div className="page">
        {/* Photo panel */}
        <div className="photo-col">
          <div className="particles">
            {PARTICLES.map(p => (
              <div key={p.id} className="p" style={{ left:`${p.left}%`, top:`${p.top}%`, width:`${p.size}px`, height:`${p.size}px`, opacity:p.opacity, animationDuration:`${p.dur}s`, animationDelay:`${p.delay}s` }}/>
            ))}
          </div>
          <div className="photo-script">Become Her.</div>
        </div>

        {/* Login column */}
        <div className={`login-col${cl}`}>
          <div className="logo">
            <svg width="42" height="38" viewBox="0 0 44 40" fill="none">
              <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
              <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
              <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
            </svg>
            <div className="logo-txt">
              <span className="l-brand">AUREVA</span>
              <span className="l-sub">TRAINING SYSTEM</span>
            </div>
          </div>

          <div className="welcome-block">
            <span className="eyebrow">28-DAY TRANSFORMATION PROGRAM</span>
            <h1 className="welcome-title">WELCOME BACK</h1>
            <p className="welcome-desc">Your next workout is waiting.<br/>Continue where you left off.</p>
          </div>

          <div className="form">
            {error && <div className="error-msg">⚠ {error}</div>}

            <div className="field">
              <label className="f-label">Email Address</label>
              <input className={`f-input${error && !email ? ' error-field' : ''}`}
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="you@example.com"/>
            </div>

            <div className="field">
              <label className="f-label">Password</label>
              <div className="f-wrap">
                <input className={`f-input with-t${error && !pw ? ' error-field' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={e => { setPw(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"/>
                <button className="f-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="forgot-row">
              <button className="forgot" onClick={handleForgot}>Forgot password?</button>
            </div>

            <button className="cta" onClick={handleLogin} disabled={loading}>
              {loading ? <><div className="spinner"/><span>SIGNING IN...</span></> : <span>START TRAINING →</span>}
            </button>

            <div className="or">
              <span className="or-line"/><span className="or-txt">NEW TO AUREVA?</span><span className="or-line"/>
            </div>

            <button className="join" onClick={() => navigate('/pricing')}>
              BEGIN YOUR TRANSFORMATION
            </button>
            <p className="social-proof">28-day program · Free meal plan · @AurevaFitness</p>
          </div>

          <div>
            <p className="tagline">DISCIPLINE · STRENGTH · CONFIDENCE</p>
            <div className="footer-links">
              <a href="/about">About</a>
              <a href="/disclaimer">Disclaimer</a>
              <a href="https://www.instagram.com/AurevaFitness" target="_blank" rel="noreferrer">@AurevaFitness</a>
            </div>
            <p className="footer-copy">© 2026 Aureva Fitness · All Rights Reserved</p>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget){setShowForgot(false);setForgotSent(false)} }}>
          <div className="modal">
            {!forgotSent ? (
              <>
                <h2 className="modal-title">RESET PASSWORD</h2>
                <p className="modal-desc">Enter your email address and we'll send you a link to reset your password.</p>
                <input className="modal-input" type="email" value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"/>
                <button className="modal-cta" onClick={handleSendReset}>SEND RESET LINK</button>
                <button className="modal-close" onClick={() => { setShowForgot(false); setForgotSent(false) }}>Cancel</button>
              </>
            ) : (
              <div className="modal-sent">
                <div className="modal-sent-icon">✉️</div>
                <p className="modal-sent-title">CHECK YOUR EMAIL</p>
                <p className="modal-sent-txt">
                  If an account exists for <strong style={{color:'#C9960C'}}>{forgotEmail}</strong>,<br/>
                  you'll receive a password reset link shortly.
                </p>
                <button className="modal-cta" onClick={() => { setShowForgot(false); setForgotSent(false) }}>BACK TO LOGIN</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
