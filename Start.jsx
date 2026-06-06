import { useEffect, useState } from "react";

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#060606; }
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w40:rgba(255,255,255,.40); --w10:rgba(255,255,255,.10);
  }
  .page {
    min-height:100vh; background:var(--black);
    display:flex; flex-direction:column; align-items:center;
    font-family:'Montserrat',sans-serif; padding:52px 24px 60px;
    position:relative; overflow:hidden;
  }
  .glow {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 50% at 50% 20%,rgba(201,150,12,.07) 0%,transparent 60%);
  }
  .wrap {
    width:100%; max-width:420px; display:flex; flex-direction:column; align-items:center;
    position:relative; z-index:1; opacity:0; transform:translateY(20px);
    transition:opacity .8s ease, transform .8s ease;
  }
  .wrap.in { opacity:1; transform:translateY(0); }
  .logo { display:flex; flex-direction:column; align-items:center; gap:10px; margin-bottom:8px; }
  .logo-row { display:flex; align-items:center; gap:12px; }
  .brand { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--gold); letter-spacing:8px; }
  .sys   { font-size:9px; font-weight:600; color:var(--w40); letter-spacing:5px; }
  .script {
    font-family:'Great Vibes',cursive; font-size:48px; color:#fff;
    text-shadow:0 0 50px rgba(201,150,12,.35); margin-bottom:4px;
  }
  .tagline { font-size:10px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:36px; }
  .divider { width:100%; height:1px; background:linear-gradient(to right,transparent,rgba(201,150,12,.3),transparent); margin-bottom:36px; }
  .links { width:100%; display:flex; flex-direction:column; gap:12px; margin-bottom:36px; }
  .link-btn {
    display:flex; align-items:center; gap:16px; width:100%; padding:16px 20px;
    background:rgba(255,255,255,.04); border:1px solid rgba(201,150,12,.18);
    text-decoration:none; color:#fff; transition:all .25s; cursor:pointer;
    position:relative; overflow:hidden;
  }
  .link-btn::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    background:var(--gold); transform:scaleY(0); transition:transform .25s; transform-origin:center;
  }
  .link-btn:hover { border-color:var(--gold); background:rgba(201,150,12,.06); }
  .link-btn:hover::before { transform:scaleY(1); }
  .link-btn.primary {
    background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%;
    border:none; animation:shimmer 3.5s ease-in-out infinite;
  }
  .link-btn.primary .link-label { color:#040404; }
  .link-btn.primary .link-desc  { color:rgba(4,4,4,.65); }
  .link-btn.primary:hover { animation:none; background-position:100%; }
  .link-btn.primary::before { display:none; }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .link-icon  { font-size:22px; width:32px; text-align:center; flex-shrink:0; }
  .link-text  { display:flex; flex-direction:column; gap:2px; flex:1; }
  .link-label { font-size:12px; font-weight:700; letter-spacing:1.5px; }
  .link-desc  { font-size:10px; color:var(--w40); letter-spacing:.5px; }
  .link-arr   { font-size:14px; color:var(--gold); opacity:.6; }
  .footer { display:flex; flex-direction:column; align-items:center; gap:8px; }
  .footer-copy { font-size:10px; color:rgba(255,255,255,.2); letter-spacing:1px; text-align:center; }
  .footer-ig   { font-size:11px; color:rgba(201,150,12,.55); letter-spacing:1px; }
`;

const LINKS = [
  { icon:"💳", label:"GET THE PROGRAM",    desc:"Start your 28-day transformation",  href:"https://www.aurevatrainingsystem.com/pricing", primary:true },
  { icon:"🌐", label:"VISIT WEBSITE",      desc:"aurevatrainingsystem.com",           href:"https://www.aurevatrainingsystem.com" },
  { icon:"📱", label:"DOWNLOAD iOS APP",   desc:"Available on the App Store",         href:"https://apps.apple.com" },
  { icon:"🤖", label:"DOWNLOAD ANDROID",   desc:"Available on Google Play",           href:"https://play.google.com" },
  { icon:"📸", label:"@AUREVAFITNESS",     desc:"Follow us on Instagram",             href:"https://www.instagram.com/AurevaFitness" },
  { icon:"📘", label:"FACEBOOK",           desc:"Aureva Training System",             href:"https://www.facebook.com/AurevaTrainingSystem" },
  { icon:"👩", label:"ABOUT MIA",          desc:"Hi, I'm Mia — meet your coach",     href:"https://www.aurevatrainingsystem.com/about" },
];

export default function Start() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800&display=swap"/>
      <style>{css}</style>
      <div className="page">
        <div className="glow"/>
        <div className={`wrap${ready ? " in" : ""}`}>
          <div className="logo">
            <div className="logo-row">
              <svg width="36" height="32" viewBox="0 0 44 40" fill="none">
                <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
                <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
              </svg>
              <span className="brand">AUREVA</span>
            </div>
            <span className="sys">TRAINING SYSTEM</span>
          </div>
          <p className="script">Become Her.</p>
          <p className="tagline">DISCIPLINE · STRENGTH · CONFIDENCE</p>
          <div className="divider"/>
          <div className="links">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                className={`link-btn${l.primary ? " primary" : ""}`}>
                <span className="link-icon">{l.icon}</span>
                <div className="link-text">
                  <span className="link-label">{l.label}</span>
                  <span className="link-desc">{l.desc}</span>
                </div>
                <span className="link-arr">›</span>
              </a>
            ))}
          </div>
          <div className="footer">
            <p className="footer-ig">📸 @AurevaFitness</p>
            <p className="footer-copy">© 2026 Aureva Fitness · All Rights Reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}
