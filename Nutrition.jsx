import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RECIPES, CATEGORIES } from './recipes.js'
import { RECIPE_IMAGES } from './recipeImages.js'
import { useLanguage } from './LanguageContext.jsx'

const ACTIVITY_LEVELS = [
  { val:'1.2',   label:'Sedentary — little or no exercise' },
  { val:'1.375', label:'Lightly Active — 1–3 days/week' },
  { val:'1.55',  label:'Moderately Active — 3–5 days/week' },
  { val:'1.725', label:'Very Active — 6–7 days/week' },
  { val:'1.9',   label:'Extra Active — physical job + daily training' },
]
const GOALS = [
  { key:'fat-loss', icon:'🔥', name:'FAT LOSS',     desc:'Caloric deficit',  adj:-400 },
  { key:'maintain', icon:'⚖',  name:'MAINTENANCE',  desc:'Stay the same',    adj:0    },
  { key:'muscle',   icon:'💪', name:'BUILD MUSCLE', desc:'Caloric surplus',   adj:+300 },
]

const CAT_COLORS = {
  breakfast:'rgba(201,130,8,.25)',
  bowls:'rgba(20,140,80,.2)',
  fish:'rgba(20,100,180,.2)',
  stirfry:'rgba(180,60,20,.2)',
  plates:'rgba(140,20,140,.2)',
  wraps:'rgba(180,130,0,.2)',
}

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#060606; }
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35); --w10:rgba(255,255,255,.10); --w05:rgba(255,255,255,.05);
  }
  .page { min-height:100vh; background:var(--black); font-family:'Montserrat',sans-serif; position:relative; overflow-x:hidden; }
  .glow { position:fixed; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,150,12,.05) 0%,transparent 60%); z-index:0; }
  .wrap { max-width:1000px; margin:0 auto; padding:0 20px 80px; position:relative; z-index:1; }

  /* Header */
  .n-header { display:flex; align-items:center; justify-content:space-between; padding:32px 0 0; margin-bottom:32px; flex-wrap:wrap; gap:12px; }
  .logo-row { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .brand { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--gold); letter-spacing:6px; }
  .sys   { font-size:7.5px; font-weight:600; color:var(--w35); letter-spacing:4px; display:block; }
  .back-btn { background:none; border:none; color:rgba(201,150,12,.6); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; display:flex; align-items:center; gap:6px; padding:0; transition:color .2s; }
  .back-btn:hover { color:var(--gold); }

  /* Main tabs */
  .tabs { display:flex; gap:0; border-bottom:1px solid rgba(201,150,12,.15); margin-bottom:40px; overflow-x:auto; }
  .tab { background:none; border:none; font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2.5px; color:var(--w35); padding:13px 20px; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .2s; white-space:nowrap; }
  .tab.active { color:var(--gold); border-bottom-color:var(--gold); }
  .tab:hover { color:rgba(201,150,12,.7); }

  /* Section */
  .sec-eye   { font-size:9.5px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:8px; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,5vw,48px); color:#fff; letter-spacing:3px; margin-bottom:10px; line-height:1; }
  .sec-desc  { font-size:13px; font-weight:300; color:var(--w50); line-height:1.75; margin-bottom:32px; max-width:640px; }
  .divider   { width:100%; height:1px; background:linear-gradient(to right,transparent,rgba(201,150,12,.2),transparent); margin:36px 0; }

  /* ── RECIPE GRID ── */
  .cat-filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:32px; }
  .cat-btn { background:var(--w05); border:1px solid rgba(201,150,12,.15); color:var(--w35); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; padding:8px 14px; cursor:pointer; transition:all .2s; white-space:nowrap; }
  .cat-btn:hover { border-color:rgba(201,150,12,.4); color:rgba(201,150,12,.8); }
  .cat-btn.active { background:rgba(201,150,12,.1); border-color:var(--gold); color:var(--gold); }

  .recipe-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .recipe-card { background:var(--w05); border:1px solid rgba(201,150,12,.12); cursor:pointer; transition:all .3s; overflow:hidden; display:flex; flex-direction:column; }
  .recipe-card:hover { border-color:var(--gold); transform:translateY(-3px); box-shadow:0 12px 40px rgba(201,150,12,.12); }
  .recipe-img-wrap { position:relative; aspect-ratio:4/3; overflow:hidden; background:#0e0e0e; }
  .recipe-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .recipe-card:hover .recipe-img { transform:scale(1.05); }
  .recipe-img-placeholder { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; }
  .ph-icon { font-size:40px; }
  .ph-txt  { font-size:9px; font-weight:600; color:var(--w35); letter-spacing:2px; }
  .protein-badge { position:absolute; bottom:10px; right:10px; background:rgba(6,6,6,.85); border:1px solid var(--gold); padding:6px 10px; display:flex; flex-direction:column; align-items:center; }
  .pb-num { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); line-height:1; }
  .pb-lbl { font-size:7px; font-weight:700; color:rgba(201,150,12,.7); letter-spacing:1.5px; }
  .recipe-info { padding:14px; flex:1; display:flex; flex-direction:column; }
  .recipe-num  { font-size:8.5px; font-weight:700; color:var(--gold); letter-spacing:2.5px; margin-bottom:4px; }
  .recipe-name { font-family:'Bebas Neue',sans-serif; font-size:16px; color:#fff; letter-spacing:1.5px; line-height:1.15; margin-bottom:10px; }
  .recipe-macros { display:flex; gap:10px; }
  .rm { font-size:9.5px; color:var(--w35); }
  .rm strong { color:var(--gold); font-size:10px; }

  /* ── RECIPE MODAL ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.88); display:flex; align-items:flex-start; justify-content:center; z-index:200; padding:20px; overflow-y:auto; backdrop-filter:blur(6px); }
  .recipe-modal { background:#0a0a0a; border:1px solid rgba(201,150,12,.22); width:100%; max-width:720px; position:relative; margin:auto; overflow:hidden; }
  .rm-hero { position:relative; aspect-ratio:16/6; overflow:hidden; background:#111; }
  .rm-hero img { width:100%; height:100%; object-fit:cover; object-position:center 22%; display:block; }
  .rm-hero-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:64px; }
  .rm-hero-overlay {
    position:absolute; inset:0;
    background:
      linear-gradient(to right, rgba(6,6,6,.95) 0%, rgba(6,6,6,.5) 22%, transparent 40%),
      linear-gradient(to left,  rgba(6,6,6,.95) 0%, rgba(6,6,6,.5) 22%, transparent 40%),
      linear-gradient(to bottom, rgba(6,6,6,.7) 0%, transparent 30%),
      linear-gradient(to top,   rgba(6,6,6,1)   0%, rgba(6,6,6,.5) 45%, transparent 75%);
  }
  .rm-hero-info { position:absolute; bottom:0; left:0; right:0; padding:24px 28px; }
  .rm-num   { font-size:9px; font-weight:700; color:var(--gold); letter-spacing:3px; }
  .rm-name  { font-family:'Bebas Neue',sans-serif; font-size:clamp(22px,4vw,34px); color:#fff; letter-spacing:2px; line-height:1; margin-bottom:4px; }
  .rm-tag   { font-size:11px; font-weight:300; color:var(--w50); font-style:italic; }
  .rm-close { position:absolute; top:14px; right:14px; background:rgba(0,0,0,.9); border:1.5px solid var(--gold); color:var(--gold); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; padding:9px 16px; cursor:pointer; transition:all .2s; z-index:10; }
  .rm-close:hover { background:var(--gold); color:#060606; }
  .rm-protein-badge { position:absolute; top:14px; left:14px; background:rgba(0,0,0,.9); border:1.5px solid var(--gold); padding:8px 12px; text-align:center; }
  .rm-pb-num { font-family:'Bebas Neue',sans-serif; font-size:32px; color:var(--gold); line-height:1; }
  .rm-pb-lbl { font-size:8px; font-weight:700; color:rgba(201,150,12,.7); letter-spacing:2px; }

  .rm-body { padding:24px 28px; }
  .rm-macros-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:28px; }
  .rm-macro { background:rgba(201,150,12,.05); border:1px solid rgba(201,150,12,.1); padding:12px; text-align:center; }
  .rm-macro-num { font-family:'Bebas Neue',sans-serif; font-size:26px; color:var(--gold); line-height:1; }
  .rm-macro-lbl { font-size:8.5px; font-weight:600; color:var(--w35); letter-spacing:1.5px; margin-top:2px; }
  .rm-section { margin-bottom:22px; }
  .rm-sec-title { font-size:9.5px; font-weight:800; color:var(--gold); letter-spacing:3px; margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid rgba(201,150,12,.15); }
  .rm-list { list-style:none; display:flex; flex-direction:column; gap:7px; }
  .rm-list li { font-size:12px; color:var(--w70); display:flex; align-items:flex-start; gap:8px; }
  .rm-list li::before { content:'✓'; color:var(--gold); font-size:10px; flex-shrink:0; margin-top:1px; }
  .rm-steps { list-style:none; display:flex; flex-direction:column; gap:10px; }
  .rm-steps li { font-size:12px; color:var(--w70); display:flex; align-items:flex-start; gap:12px; }
  .rm-step-num { background:rgba(201,150,12,.15); color:var(--gold); font-family:'Bebas Neue',sans-serif; font-size:14px; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .rm-pro-tip { background:rgba(201,150,12,.07); border:1px solid rgba(201,150,12,.2); border-left:3px solid var(--gold); padding:12px 16px; margin-bottom:20px; }
  .rm-pro-tip-label { font-size:8.5px; font-weight:800; color:var(--gold); letter-spacing:2.5px; margin-bottom:4px; }
  .rm-pro-tip-txt { font-size:12px; color:var(--w70); line-height:1.6; }
  .goals-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .goal-card { padding:14px; border:1px solid rgba(201,150,12,.1); }
  .goal-card.fl { background:rgba(255,80,30,.06); border-color:rgba(255,80,30,.2); }
  .goal-card.re { background:rgba(20,140,255,.06); border-color:rgba(20,140,255,.2); }
  .goal-card.mu { background:rgba(20,180,80,.06); border-color:rgba(20,180,80,.2); }
  .goal-icon-title { display:flex; align-items:center; gap:6px; font-size:9px; font-weight:800; letter-spacing:2px; margin-bottom:8px; }
  .gc-fl { color:rgba(255,120,60,.9); } .gc-re { color:rgba(60,140,255,.9); } .gc-mu { color:rgba(60,200,100,.9); }
  .goal-changes { list-style:none; display:flex; flex-direction:column; gap:5px; margin-bottom:10px; }
  .goal-changes li { font-size:10.5px; color:var(--w50); }
  .goal-stats { display:flex; gap:10px; padding-top:8px; border-top:1px solid rgba(255,255,255,.07); }
  .gs { font-size:10px; color:var(--w35); }
  .gs strong { color:#fff; }

  /* ── MACROS CALCULATOR ── */
  .calc-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:24px; }
  .field { display:flex; flex-direction:column; gap:7px; }
  .f-label { font-size:9px; font-weight:700; color:var(--w35); letter-spacing:2.5px; }
  .f-row { display:flex; gap:7px; }
  .f-input { flex:1; background:var(--w05); border:1px solid rgba(201,150,12,.18); color:#fff; font-family:'Montserrat',sans-serif; font-size:14px; padding:12px 14px; outline:none; transition:border-color .25s; }
  .f-input:focus { border-color:rgba(201,150,12,.6); }
  .f-input::placeholder { color:rgba(255,255,255,.2); }
  .f-unit { background:rgba(201,150,12,.06); border:1px solid rgba(201,150,12,.18); color:var(--w50); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; padding:12px 10px; white-space:nowrap; }
  .f-select { flex:1; background:var(--w05); border:1px solid rgba(201,150,12,.18); color:#fff; font-family:'Montserrat',sans-serif; font-size:13px; padding:12px 14px; outline:none; cursor:pointer; transition:border-color .25s; }
  .f-select:focus { border-color:rgba(201,150,12,.6); }
  .f-select option { background:#0e0e0e; }
  .goal-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:28px; }
  .goal-btn { padding:16px 10px; border:1px solid rgba(201,150,12,.18); background:var(--w05); cursor:pointer; transition:all .25s; display:flex; flex-direction:column; align-items:center; gap:5px; }
  .goal-btn:hover { border-color:var(--gold); background:rgba(201,150,12,.05); }
  .goal-btn.active { border-color:var(--gold); background:rgba(201,150,12,.08); }
  .goal-icon { font-size:24px; }
  .goal-name { font-size:10px; font-weight:800; color:#fff; letter-spacing:2px; text-align:center; }
  .goal-desc { font-size:9.5px; color:var(--w35); text-align:center; }
  .goal-btn.active .goal-name { color:var(--gold); }
  .calc-cta { width:100%; background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%; border:none; color:#040404; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:800; letter-spacing:4px; padding:17px; cursor:pointer; animation:shimmer 3.5s ease-in-out infinite; transition:transform .2s, box-shadow .3s; margin-bottom:36px; }
  .calc-cta:hover { animation:none; transform:translateY(-2px); box-shadow:0 10px 36px rgba(201,150,12,.3); }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .results { background:var(--w05); border:1px solid rgba(201,150,12,.2); padding:28px; position:relative; animation:upfade .6s ease forwards; }
  .results::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1.5px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  @keyframes upfade { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
  .res-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .res-cals-num { font-family:'Bebas Neue',sans-serif; font-size:60px; color:var(--gold); line-height:1; }
  .res-cals-lbl { font-size:10px; font-weight:700; color:var(--w35); letter-spacing:3px; }
  .res-goal-tag { background:rgba(201,150,12,.12); border:1px solid rgba(201,150,12,.25); padding:8px 16px; font-size:10px; font-weight:800; color:var(--gold); letter-spacing:3px; }
  .macros-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
  .macro-card { background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.06); padding:18px; display:flex; flex-direction:column; gap:5px; }
  .macro-name { font-size:9px; font-weight:700; color:var(--w35); letter-spacing:3px; }
  .macro-g { font-family:'Bebas Neue',sans-serif; font-size:38px; line-height:1; }
  .macro-g.p { color:#F0C832; } .macro-g.c { color:#e8a020; } .macro-g.f { color:#c9960c; }
  .macro-kcal { font-size:10px; color:var(--w35); }
  .macro-bar-wrap { height:5px; background:rgba(255,255,255,.07); overflow:hidden; margin-top:4px; }
  .macro-bar { height:100%; transition:width 1s ease; }
  .macro-bar.p { background:#F0C832; } .macro-bar.c { background:#e8a020; } .macro-bar.f { background:#c9960c; }
  .res-note { font-size:11px; color:var(--w35); line-height:1.7; padding-top:18px; border-top:1px solid rgba(255,255,255,.06); }
  .res-note strong { color:var(--gold); }

  @media(max-width:680px) {
    .recipe-grid { grid-template-columns:repeat(2,1fr); }
    .rm-macros-row { grid-template-columns:repeat(2,1fr); }
    .goals-grid { grid-template-columns:1fr; }
    .calc-grid { grid-template-columns:1fr; }
    .goal-row { grid-template-columns:1fr; }
    .macros-grid { grid-template-columns:1fr; }
    .rm-body { padding:18px 16px; }
  }
  @media(max-width:420px) {
    .recipe-grid { grid-template-columns:1fr; }
  }
`

function RecipeCard({ recipe, onClick }) {
  const catEmojis = { breakfast:'🌅', bowls:'🥣', fish:'🐟', stirfry:'🥘', plates:'💪', wraps:'🌯' }
  const imgSrc = RECIPE_IMAGES[recipe.id]
  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-img-wrap" style={{ background: CAT_COLORS[recipe.category] || '#111' }}>
        {imgSrc
          ? <img className="recipe-img" src={imgSrc} alt={recipe.name}/>
          : <div className="recipe-img-placeholder">
              <span className="ph-icon">{catEmojis[recipe.category] || '🍽'}</span>
              <span className="ph-txt">AUREVA APPROVED</span>
            </div>
        }
        <div className="protein-badge">
          <span className="pb-num">{recipe.protein}g</span>
          <span className="pb-lbl">PROTEIN</span>
        </div>
      </div>
      <div className="recipe-info">
        <p className="recipe-num">{recipe.num}</p>
        <p className="recipe-name">{recipe.name}</p>
        <div className="recipe-macros">
          <span className="rm"><strong>{recipe.cal}</strong> cal</span>
          <span className="rm"><strong>{recipe.protein}P</strong></span>
          <span className="rm"><strong>{recipe.carbs}C</strong></span>
          <span className="rm"><strong>{recipe.fat}F</strong></span>
        </div>
      </div>
    </div>
  )
}

function RecipeModal({ recipe, onClose }) {
  const catEmojis = { breakfast:'🌅', bowls:'🥣', fish:'🐟', stirfry:'🥘', plates:'💪', wraps:'🌯' }
  const imgSrc = RECIPE_IMAGES[recipe.id]
  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div className="recipe-modal">
        <div className="rm-hero">
          {imgSrc
            ? <img src={imgSrc} alt={recipe.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            : <div className="rm-hero-fallback" style={{ background: CAT_COLORS[recipe.category] || '#111' }}>
                <span>{catEmojis[recipe.category] || '🍽'}</span>
              </div>
          }
          <div className="rm-hero-overlay"/>
          <div className="rm-protein-badge"><span className="rm-pb-num">{recipe.protein}g</span><span className="rm-pb-lbl">PROTEIN</span></div>
          <button className="rm-close" onClick={onClose}>✕ CLOSE</button>
          <div className="rm-hero-info">
            <p className="rm-num">{recipe.num}</p>
            <p className="rm-name">{recipe.name}</p>
            <p className="rm-tag">{recipe.tag}</p>
          </div>
        </div>
        <div className="rm-body">
          <div className="rm-macros-row">
            {[{v:recipe.cal,l:'CALORIES'},{v:recipe.protein+'g',l:'PROTEIN'},{v:recipe.carbs+'g',l:'CARBS'},{v:recipe.fat+'g',l:'FAT'}].map(m => (
              <div key={m.l} className="rm-macro">
                <div className="rm-macro-num">{m.v}</div>
                <div className="rm-macro-lbl">{m.l}</div>
              </div>
            ))}
          </div>
          <div className="rm-section">
            <p className="rm-sec-title">INGREDIENTS</p>
            <ul className="rm-list">{recipe.ingredients.map((i,n) => <li key={n}>{i}</li>)}</ul>
          </div>
          <div className="rm-section">
            <p className="rm-sec-title">HOW TO MAKE IT</p>
            <ol className="rm-steps">{recipe.steps.map((s,n) => (
              <li key={n}><span className="rm-step-num">{n+1}</span><span>{s}</span></li>
            ))}</ol>
          </div>
          {recipe.proTip && (
            <div className="rm-pro-tip">
              <p className="rm-pro-tip-label">⭐ PRO TIP</p>
              <p className="rm-pro-tip-txt">{recipe.proTip}</p>
            </div>
          )}
          <div className="rm-section">
            <p className="rm-sec-title">SWAP IDEAS</p>
            <ul className="rm-list">{recipe.swaps.map((s,n) => <li key={n}>{s}</li>)}</ul>
          </div>
          <div className="rm-section">
            <p className="rm-sec-title">MAKE IT FIT YOUR GOALS</p>
            <div className="goals-grid">
              <div className="goal-card fl">
                <div className="goal-icon-title gc-fl"><span>🔥</span><span>FAT LOSS</span></div>
                <ul className="goal-changes">{recipe.goals.fatLoss.changes.map((c,n) => <li key={n}>• {c}</li>)}</ul>
                <div className="goal-stats">
                  <span className="gs"><strong>{recipe.goals.fatLoss.cal}</strong> cal</span>
                  <span className="gs"><strong>{recipe.goals.fatLoss.protein}g</strong> protein</span>
                </div>
              </div>
              <div className="goal-card re">
                <div className="goal-icon-title gc-re"><span>⚖</span><span>RECOMP</span></div>
                <ul className="goal-changes">{recipe.goals.recomp.changes.map((c,n) => <li key={n}>• {c}</li>)}</ul>
                <div className="goal-stats">
                  <span className="gs"><strong>{recipe.goals.recomp.cal}</strong> cal</span>
                  <span className="gs"><strong>{recipe.goals.recomp.protein}g</strong> protein</span>
                </div>
              </div>
              <div className="goal-card mu">
                <div className="goal-icon-title gc-mu"><span>💪</span><span>MUSCLE GAIN</span></div>
                <ul className="goal-changes">{recipe.goals.muscle.changes.map((c,n) => <li key={n}>• {c}</li>)}</ul>
                <div className="goal-stats">
                  <span className="gs"><strong>{recipe.goals.muscle.cal}</strong> cal</span>
                  <span className="gs"><strong>{recipe.goals.muscle.protein}g</strong> protein</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Nutrition() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [tab, setTab] = useState('recipes')
  const [cat, setCat] = useState('all')
  const [activeRecipe, setActiveRecipe] = useState(null)
  // Calculator state
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [age, setAge]         = useState('')
  const [activity, setActivity] = useState('1.55')
  const [goal, setGoal]         = useState('fat-loss')
  const [unit, setUnit]         = useState('lbs')
  const [hUnit, setHUnit]       = useState('ft')
  const [results, setResults]   = useState(null)

  const filtered = cat === 'all' ? RECIPES : RECIPES.filter(r => r.category === cat)

  const calculate = () => {
    if (!weight || !height || !age) return
    const wKg = unit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight)
    const hCm = hUnit === 'ft' ? (parseFloat(height) * 30.48) + (parseFloat(heightIn || 0) * 2.54) : parseFloat(height)
    const ageN = parseFloat(age)
    const bmr  = (10 * wKg) + (6.25 * hCm) - (5 * ageN) - 161
    const tdee = bmr * parseFloat(activity)
    const selectedGoal = GOALS.find(g => g.key === goal)
    const calories = Math.round(tdee + selectedGoal.adj)
    const protein  = Math.round(wKg * 2.0)
    const fat      = Math.round((calories * 0.25) / 9)
    const carbs    = Math.round((calories - (protein * 4) - (fat * 9)) / 4)
    setResults({ calories, protein, carbs, fat, goal: selectedGoal.name })
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;800&display=swap"/>
      <style>{css}</style>

      <div className="page">
        <div className="glow"/>
        <div className="wrap">
          <div className="n-header">
            <div className="logo-row" onClick={() => navigate('/')}>
              <svg width="34" height="30" viewBox="0 0 44 40" fill="none">
                <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
                <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
              </svg>
              <div><span className="brand">AUREVA</span><span className="sys">TRAINING SYSTEM</span></div>
            </div>
            <button className="back-btn" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>

          <div className="tabs">
            <button className={`tab${tab==='recipes'?' active':''}`}     onClick={()=>setTab('recipes')}>🍽 RECIPES</button>
            <button className={`tab${tab==='calculator'?' active':''}`}  onClick={()=>setTab('calculator')}>📊 MACROS CALCULATOR</button>
          </div>

          {/* ── RECIPES ── */}
          {tab === 'recipes' && (
            <>
              <p className="sec-eye">AUREVA NUTRITION</p>
              <h1 className="sec-title">YOUR RECIPE BOOK</h1>
              <p className="sec-desc">23 Aureva-approved recipes — each with exact macros, ingredients, step-by-step instructions, swap ideas, and adjustments for Fat Loss, Recomp, or Muscle Gain. Tap any recipe to see the full details.</p>

              <div className="cat-filters">
                {CATEGORIES.map(c => (
                  <button key={c.key} className={`cat-btn${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              <div className="recipe-grid">
                {filtered.map(r => <RecipeCard key={r.id} recipe={r} onClick={setActiveRecipe}/>)}
              </div>

              <div className="divider"/>
              <p style={{textAlign:'center',fontSize:'11px',color:'var(--w35)',letterSpacing:'2px',lineHeight:1.8}}>
                📸 TO ADD YOUR FOOD PHOTOS: Upload your recipe images to GitHub named <strong style={{color:'var(--gold)'}}>r1.png</strong> through <strong style={{color:'var(--gold)'}}>r23.png</strong>.<br/>They will automatically appear on each recipe card.
              </p>
            </>
          )}

          {/* ── CALCULATOR ── */}
          {tab === 'calculator' && (
            <>
              <p className="sec-eye">PERSONALIZED NUTRITION</p>
              <h1 className="sec-title">MACROS CALCULATOR</h1>
              <p className="sec-desc">Enter your details to get your exact daily calorie and macro targets. Based on the Aureva method: Goal Weight × 0.8–1.0g = Protein. Goal Weight × 0.3g = Fat. Remaining calories = Carbs.</p>

              <div className="calc-grid">
                <div className="field">
                  <label className="f-label">BODY WEIGHT</label>
                  <div className="f-row">
                    <input className="f-input" type="number" placeholder={unit==='lbs'?'e.g. 145':'e.g. 65'} value={weight} onChange={e=>setWeight(e.target.value)}/>
                    <select className="f-select" style={{flex:'0 0 76px'}} value={unit} onChange={e=>setUnit(e.target.value)}>
                      <option value="lbs">lbs</option><option value="kg">kg</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="f-label">AGE</label>
                  <div className="f-row">
                    <input className="f-input" type="number" placeholder="e.g. 26" value={age} onChange={e=>setAge(e.target.value)}/>
                    <span className="f-unit">years</span>
                  </div>
                </div>
                <div className="field">
                  <label className="f-label">HEIGHT</label>
                  {hUnit === 'ft' ? (
                    <div className="f-row">
                      <input className="f-input" type="number" placeholder="ft" value={height} onChange={e=>setHeight(e.target.value)} style={{flex:'0 0 70px'}}/>
                      <input className="f-input" type="number" placeholder="in" value={heightIn} onChange={e=>setHeightIn(e.target.value)} style={{flex:'0 0 70px'}}/>
                      <select className="f-select" style={{flex:'0 0 76px'}} value={hUnit} onChange={e=>{setHUnit(e.target.value);setHeight('');setHeightIn('');}}>
                        <option value="ft">ft/in</option><option value="cm">cm</option>
                      </select>
                    </div>
                  ) : (
                    <div className="f-row">
                      <input className="f-input" type="number" placeholder="e.g. 165" value={height} onChange={e=>setHeight(e.target.value)}/>
                      <select className="f-select" style={{flex:'0 0 76px'}} value={hUnit} onChange={e=>{setHUnit(e.target.value);setHeight('');setHeightIn('');}}>
                        <option value="ft">ft/in</option><option value="cm">cm</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label className="f-label">ACTIVITY LEVEL</label>
                  <select className="f-select" value={activity} onChange={e=>setActivity(e.target.value)}>
                    {ACTIVITY_LEVELS.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
                  </select>
                </div>
              </div>

              <p className="f-label" style={{marginBottom:'12px'}}>YOUR GOAL</p>
              <div className="goal-row">
                {GOALS.map(g => (
                  <button key={g.key} className={`goal-btn${goal===g.key?' active':''}`} onClick={()=>setGoal(g.key)}>
                    <span className="goal-icon">{g.icon}</span>
                    <span className="goal-name">{g.name}</span>
                    <span className="goal-desc">{g.desc}</span>
                  </button>
                ))}
              </div>

              <button className="calc-cta" onClick={calculate}>CALCULATE MY MACROS →</button>

              {results && (
                <div className="results">
                  <div className="res-header">
                    <div>
                      <div className="res-cals-num">{results.calories}</div>
                      <div className="res-cals-lbl">CALORIES PER DAY</div>
                    </div>
                    <span className="res-goal-tag">{results.goal}</span>
                  </div>
                  <div className="macros-grid">
                    {[
                      {k:'p',l:'PROTEIN', g:results.protein, kcal:results.protein*4, pct:Math.round((results.protein*4/results.calories)*100)},
                      {k:'c',l:'CARBS',   g:results.carbs,   kcal:results.carbs*4,   pct:Math.round((results.carbs*4/results.calories)*100)},
                      {k:'f',l:'FAT',     g:results.fat,     kcal:results.fat*9,     pct:Math.round((results.fat*9/results.calories)*100)},
                    ].map(m => (
                      <div key={m.k} className="macro-card">
                        <span className="macro-name">{m.l}</span>
                        <span className={`macro-g ${m.k}`}>{m.g}<span style={{fontSize:'16px',fontFamily:'Montserrat',fontWeight:300}}>g</span></span>
                        <span className="macro-kcal">{m.kcal} kcal · {m.pct}%</span>
                        <div className="macro-bar-wrap"><div className={`macro-bar ${m.k}`} style={{width:`${m.pct}%`}}/></div>
                      </div>
                    ))}
                  </div>
                  <p className="res-note">
                    Based on the <strong>Aureva Method</strong>: Goal Weight × 0.8–1.0 = Protein (g) | Goal Weight × 0.3 = Fat (g) | Remaining calories = Carbs.<br/>
                    Track for at least 2–4 weeks before adjusting. <strong>Protein is non-negotiable.</strong> Consistency creates results.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {activeRecipe && <RecipeModal recipe={activeRecipe} onClose={() => setActiveRecipe(null)}/>}
    </>
  )
}
