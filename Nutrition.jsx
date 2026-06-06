import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#060606; }
  :root {
    --gold:#C9960C; --gold-hi:#F0C832; --black:#060606;
    --w70:rgba(255,255,255,.70); --w50:rgba(255,255,255,.50);
    --w35:rgba(255,255,255,.35); --w10:rgba(255,255,255,.10); --w05:rgba(255,255,255,.05);
  }
  .page { min-height:100vh; background:var(--black); font-family:'Montserrat',sans-serif; padding:0 0 80px; position:relative; overflow:hidden; }
  .glow { position:fixed; inset:0; pointer-events:none; background:radial-gradient(ellipse 70% 40% at 50% 10%,rgba(201,150,12,.06) 0%,transparent 60%); }
  .wrap { max-width:900px; margin:0 auto; padding:0 24px; position:relative; z-index:1; }

  /* Header */
  .n-header { display:flex; align-items:center; justify-content:space-between; padding:36px 0 0; margin-bottom:48px; flex-wrap:wrap; gap:16px; }
  .logo-row { display:flex; align-items:center; gap:12px; cursor:pointer; }
  .brand { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); letter-spacing:6px; }
  .sys   { font-size:8px; font-weight:600; color:var(--w35); letter-spacing:4px; display:block; }
  .back-btn { background:none; border:none; color:rgba(201,150,12,.6); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; letter-spacing:2px; cursor:pointer; display:flex; align-items:center; gap:6px; padding:0; transition:color .2s; }
  .back-btn:hover { color:var(--gold); }

  /* Tabs */
  .tabs { display:flex; gap:0; margin-bottom:48px; border-bottom:1px solid rgba(201,150,12,.15); }
  .tab { background:none; border:none; font-family:'Montserrat',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; color:var(--w35); padding:14px 28px; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .25s; }
  .tab.active { color:var(--gold); border-bottom-color:var(--gold); }
  .tab:hover { color:var(--gold); }

  /* Section title */
  .sec-eyebrow { font-size:10px; font-weight:700; color:var(--gold); letter-spacing:4px; margin-bottom:10px; }
  .sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,5vw,52px); color:#fff; letter-spacing:3px; margin-bottom:12px; line-height:1; }
  .sec-desc { font-size:13px; font-weight:300; color:var(--w50); line-height:1.75; margin-bottom:40px; max-width:620px; }
  .divider { width:100%; height:1px; background:linear-gradient(to right,transparent,rgba(201,150,12,.25),transparent); margin:40px 0; }

  /* ── MACROS CALCULATOR ── */
  .calc-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px; }
  .field { display:flex; flex-direction:column; gap:8px; }
  .f-label { font-size:9.5px; font-weight:700; color:var(--w35); letter-spacing:2.5px; text-transform:uppercase; }
  .f-row { display:flex; gap:8px; }
  .f-input { flex:1; background:var(--w05); border:1px solid rgba(201,150,12,.18); color:#fff; font-family:'Montserrat',sans-serif; font-size:14px; padding:12px 14px; outline:none; transition:border-color .25s; }
  .f-input:focus { border-color:rgba(201,150,12,.6); }
  .f-input::placeholder { color:rgba(255,255,255,.2); }
  .f-unit { background:rgba(201,150,12,.08); border:1px solid rgba(201,150,12,.18); color:var(--w50); font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; padding:12px 12px; white-space:nowrap; }
  .f-select { flex:1; background:var(--w05); border:1px solid rgba(201,150,12,.18); color:#fff; font-family:'Montserrat',sans-serif; font-size:13px; padding:12px 14px; outline:none; cursor:pointer; appearance:none; transition:border-color .25s; }
  .f-select:focus { border-color:rgba(201,150,12,.6); }
  .f-select option { background:#0e0e0e; }

  /* Goal buttons */
  .goal-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px; }
  .goal-btn { padding:16px 10px; border:1px solid rgba(201,150,12,.18); background:var(--w05); cursor:pointer; transition:all .25s; display:flex; flex-direction:column; align-items:center; gap:6px; }
  .goal-btn:hover { border-color:var(--gold); background:rgba(201,150,12,.05); }
  .goal-btn.active { border-color:var(--gold); background:rgba(201,150,12,.08); }
  .goal-icon { font-size:24px; }
  .goal-name { font-size:10px; font-weight:800; color:#fff; letter-spacing:2px; text-align:center; }
  .goal-desc { font-size:9.5px; color:var(--w35); text-align:center; }
  .goal-btn.active .goal-name { color:var(--gold); }

  /* Calculate button */
  .calc-cta { width:100%; background:linear-gradient(90deg,#A67408,#F0C832 48%,#A67408); background-size:220%; border:none; color:#040404; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:800; letter-spacing:4px; padding:17px; cursor:pointer; animation:shimmer 3.5s ease-in-out infinite; transition:transform .2s, box-shadow .3s; margin-bottom:40px; }
  .calc-cta:hover { animation:none; transform:translateY(-2px); box-shadow:0 10px 36px rgba(201,150,12,.3); }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }

  /* Results */
  .results { background:var(--w05); border:1px solid rgba(201,150,12,.2); padding:32px; position:relative; animation:upfade .6s ease forwards; }
  .results::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1.5px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  @keyframes upfade { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .res-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
  .res-cals { display:flex; flex-direction:column; }
  .res-cals-num { font-family:'Bebas Neue',sans-serif; font-size:64px; color:var(--gold); line-height:1; }
  .res-cals-lbl { font-size:10px; font-weight:700; color:var(--w35); letter-spacing:3px; }
  .res-goal-tag { background:rgba(201,150,12,.12); border:1px solid rgba(201,150,12,.25); padding:8px 18px; font-size:10px; font-weight:800; color:var(--gold); letter-spacing:3px; }
  .macros-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }
  .macro-card { background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.07); padding:20px; display:flex; flex-direction:column; gap:6px; }
  .macro-name { font-size:9px; font-weight:700; color:var(--w35); letter-spacing:3px; }
  .macro-g    { font-family:'Bebas Neue',sans-serif; font-size:40px; line-height:1; }
  .macro-g.p  { color:#F0C832; }
  .macro-g.c  { color:#e8a020; }
  .macro-g.f  { color:#c9960c; }
  .macro-kcal { font-size:10px; color:var(--w35); }
  .macro-bar-wrap { height:6px; background:rgba(255,255,255,.07); margin-top:6px; overflow:hidden; }
  .macro-bar { height:100%; transition:width 1s ease; }
  .macro-bar.p { background:#F0C832; }
  .macro-bar.c { background:#e8a020; }
  .macro-bar.f { background:#c9960c; }
  .res-note { font-size:11px; color:var(--w35); line-height:1.7; padding-top:20px; border-top:1px solid rgba(255,255,255,.07); }
  .res-note strong { color:var(--gold); }

  /* ── MEAL PLAN ── */
  .day-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:32px; }
  .day-tab { background:var(--w05); border:1px solid rgba(201,150,12,.15); color:var(--w35); font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; padding:8px 14px; cursor:pointer; transition:all .2s; }
  .day-tab.active { background:rgba(201,150,12,.1); border-color:var(--gold); color:var(--gold); }
  .meal-card { background:var(--w05); border:1px solid rgba(201,150,12,.12); padding:24px; margin-bottom:14px; position:relative; }
  .meal-card::before { content:''; position:absolute; left:0; top:12px; bottom:12px; width:3px; background:var(--gold); }
  .meal-time { font-size:9px; font-weight:700; color:var(--gold); letter-spacing:3px; margin-bottom:6px; }
  .meal-name { font-size:15px; font-weight:700; color:#fff; margin-bottom:8px; }
  .meal-items { list-style:none; display:flex; flex-direction:column; gap:4px; }
  .meal-items li { font-size:12px; color:var(--w50); display:flex; align-items:flex-start; gap:8px; }
  .meal-items li::before { content:'·'; color:var(--gold); flex-shrink:0; }
  .meal-macros { display:flex; gap:16px; margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,.06); }
  .mm { font-size:10px; color:var(--w35); }
  .mm strong { color:var(--gold); }

  /* Food Lists */
  .food-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:40px; }
  .food-cat { background:var(--w05); border:1px solid rgba(201,150,12,.12); padding:20px; }
  .food-cat-title { font-size:10px; font-weight:800; color:var(--gold); letter-spacing:3px; margin-bottom:14px; }
  .food-list { list-style:none; display:flex; flex-direction:column; gap:6px; }
  .food-list li { font-size:11px; color:var(--w50); display:flex; align-items:center; gap:8px; }
  .food-list li::before { content:'✓'; color:var(--gold); font-size:10px; flex-shrink:0; }

  /* Tips */
  .tips-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:40px; }
  .tip-card { background:var(--w05); border:1px solid rgba(201,150,12,.12); padding:20px; display:flex; gap:14px; align-items:flex-start; }
  .tip-icon { font-size:24px; flex-shrink:0; }
  .tip-title { font-size:11px; font-weight:700; color:#fff; letter-spacing:1px; margin-bottom:6px; }
  .tip-txt   { font-size:11px; color:var(--w35); line-height:1.7; }

  @media(max-width:680px) {
    .calc-grid { grid-template-columns:1fr; }
    .goal-row { grid-template-columns:1fr; }
    .macros-grid { grid-template-columns:1fr; }
    .food-grid { grid-template-columns:1fr; }
    .tips-grid { grid-template-columns:1fr; }
    .tabs { overflow-x:auto; }
  }
`

const ACTIVITY_LEVELS = [
  { val:'1.2',   label:'Sedentary — little or no exercise' },
  { val:'1.375', label:'Lightly Active — 1–3 days/week' },
  { val:'1.55',  label:'Moderately Active — 3–5 days/week' },
  { val:'1.725', label:'Very Active — 6–7 days/week' },
  { val:'1.9',   label:'Extra Active — physical job + daily training' },
]

const GOALS = [
  { key:'fat-loss',  icon:'🔥', name:'FAT LOSS',        desc:'Caloric deficit',  adj:-400 },
  { key:'maintain',  icon:'⚖',  name:'MAINTENANCE',     desc:'Stay the same',   adj:0 },
  { key:'muscle',    icon:'💪', name:'BUILD MUSCLE',    desc:'Caloric surplus',  adj:+300 },
]

const MEAL_PLAN = [
  {
    day:'DAY 1', label:'Monday',
    meals:[
      { time:'BREAKFAST — 7:00 AM', name:'Power Protein Bowl', items:['4 egg whites + 1 whole egg scrambled','½ cup oats with cinnamon','1 cup mixed berries','Black coffee or green tea'], p:35, c:48, f:9 },
      { time:'SNACK — 10:00 AM', name:'Apple & Almond Butter', items:['1 medium apple','2 tbsp natural almond butter','10 almonds'], p:6, c:28, f:12 },
      { time:'LUNCH — 1:00 PM', name:'Grilled Chicken Salad', items:['150g grilled chicken breast','2 cups mixed greens','½ cup cherry tomatoes','¼ avocado, sliced','2 tbsp olive oil & lemon dressing'], p:42, c:12, f:18 },
      { time:'SNACK — 3:30 PM', name:'Greek Yogurt & Honey', items:['200g plain Greek yogurt (2%)','1 tsp raw honey','¼ cup granola','Handful of walnuts'], p:20, c:32, f:10 },
      { time:'DINNER — 7:00 PM', name:'Salmon & Sweet Potato', items:['180g baked salmon fillet','1 medium sweet potato, roasted','1 cup steamed broccoli','1 tbsp grass-fed butter','Sea salt, pepper, lemon'], p:40, c:38, f:16 },
    ]
  },
  {
    day:'DAY 2', label:'Tuesday',
    meals:[
      { time:'BREAKFAST — 7:00 AM', name:'Protein Smoothie Bowl', items:['1 scoop vanilla whey protein','1 frozen banana','½ cup frozen mixed berries','¼ cup almond milk','Toppings: granola, chia seeds, sliced strawberries'], p:34, c:52, f:7 },
      { time:'SNACK — 10:00 AM', name:'Rice Cakes & Cottage Cheese', items:['2 rice cakes','½ cup cottage cheese','Sliced cucumber','Everything bagel seasoning'], p:18, c:22, f:4 },
      { time:'LUNCH — 1:00 PM', name:'Turkey & Quinoa Bowl', items:['150g ground turkey (lean), seasoned','¾ cup cooked quinoa','½ cup black beans','Salsa, lime, cilantro','Shredded romaine lettuce'], p:44, c:46, f:12 },
      { time:'SNACK — 3:30 PM', name:'Protein Bar + Fruit', items:['1 low-sugar protein bar (20g+ protein)','1 medium orange'], p:22, c:34, f:7 },
      { time:'DINNER — 7:00 PM', name:'Beef Stir Fry', items:['150g lean beef strips','1 cup mixed stir-fry vegetables','1 cup cooked brown rice','1 tbsp low-sodium soy sauce','Garlic, ginger, sesame oil'], p:38, c:52, f:14 },
    ]
  },
  {
    day:'DAY 3', label:'Wednesday',
    meals:[
      { time:'BREAKFAST — 7:00 AM', name:'Avocado Egg Toast', items:['2 whole eggs + 2 whites, poached','2 slices whole grain sourdough','½ avocado, smashed','Cherry tomatoes, red pepper flakes','Sea salt & black pepper'], p:30, c:38, f:18 },
      { time:'SNACK — 10:00 AM', name:'Protein Shake', items:['1.5 scoops whey protein','1 cup unsweetened almond milk','1 tbsp peanut butter','½ banana','Ice'], p:38, c:24, f:10 },
      { time:'LUNCH — 1:00 PM', name:'Tuna Wrap', items:['1 can wild tuna in water, drained','1 large whole wheat wrap','Dijon mustard, celery, red onion','Romaine lettuce, tomato slices','1 tbsp light mayo'], p:40, c:34, f:8 },
      { time:'SNACK — 3:30 PM', name:'Veggies & Hummus', items:['1 cup mixed raw vegetables (carrots, peppers, cucumber)','3 tbsp hummus','10 whole grain crackers'], p:8, c:28, f:8 },
      { time:'DINNER — 7:00 PM', name:'Baked Chicken & Veggies', items:['200g chicken breast, herb-marinated','1 cup roasted asparagus','1 cup roasted cherry tomatoes','½ cup wild rice','Olive oil, garlic, rosemary'], p:48, c:36, f:12 },
    ]
  },
  {
    day:'DAY 4', label:'Thursday',
    meals:[
      { time:'BREAKFAST — 7:00 AM', name:'Overnight Oats', items:['¾ cup rolled oats','1 cup almond milk','1 scoop protein powder','1 tbsp chia seeds','Top: banana slices, honey, almond butter'], p:32, c:58, f:11 },
      { time:'SNACK — 10:00 AM', name:'Hard Boiled Eggs & Fruit', items:['3 hard boiled eggs (2 yolks)','1 cup strawberries','Small handful of mixed nuts'], p:20, c:18, f:14 },
      { time:'LUNCH — 1:00 PM', name:'Shrimp & Veggie Bowl', items:['200g grilled shrimp','1 cup cooked farro or brown rice','Grilled zucchini, bell peppers, onion','Lemon herb sauce','Fresh parsley'], p:46, c:48, f:8 },
      { time:'SNACK — 3:30 PM', name:'Protein Pudding', items:['1 scoop chocolate protein powder','½ cup Greek yogurt','1 tbsp cocoa powder','Splash of almond milk, mix to pudding consistency'], p:32, c:12, f:4 },
      { time:'DINNER — 7:00 PM', name:'Pork Tenderloin & Greens', items:['180g pork tenderloin, seasoned & baked','1 cup sautéed kale with garlic','½ cup roasted butternut squash','1 tbsp olive oil'], p:42, c:24, f:14 },
    ]
  },
  {
    day:'DAY 5', label:'Friday',
    meals:[
      { time:'BREAKFAST — 7:00 AM', name:'Egg White Omelette', items:['5 egg whites + 1 whole egg','Spinach, mushrooms, bell peppers','1 oz low-fat feta cheese','1 slice whole grain toast','½ grapefruit'], p:36, c:28, f:8 },
      { time:'SNACK — 10:00 AM', name:'Cottage Cheese Bowl', items:['¾ cup low-fat cottage cheese','½ cup pineapple chunks','1 tbsp flaxseed','Cinnamon'], p:22, c:20, f:4 },
      { time:'LUNCH — 1:00 PM', name:'Chicken Caesar Salad', items:['150g grilled chicken breast','2 cups romaine lettuce','¼ cup parmesan (shaved)','Whole wheat croutons (small)','2 tbsp light Caesar dressing'], p:44, c:18, f:14 },
      { time:'SNACK — 3:30 PM', name:'Trail Mix + Protein Bar', items:['¼ cup homemade trail mix (nuts, seeds, dark choc chips)','1 small protein bar'], p:18, c:28, f:14 },
      { time:'DINNER — 7:00 PM', name:'Lean Burger Bowl', items:['150g extra lean ground beef patty','2 cups mixed salad greens','Tomato, onion, pickles, mustard','¼ avocado','Skip the bun — served over greens'], p:38, c:14, f:18 },
    ]
  },
  {
    day:'DAY 6', label:'Saturday',
    meals:[
      { time:'BREAKFAST — 8:00 AM', name:'High Protein Pancakes', items:['½ cup oat flour','1 scoop vanilla protein powder','2 eggs','½ cup almond milk','Top: fresh berries, sugar-free maple syrup'], p:38, c:42, f:10 },
      { time:'SNACK — 11:00 AM', name:'Nut Butter & Celery', items:['4 stalks celery','2 tbsp natural peanut butter','1 small apple'], p:8, c:22, f:12 },
      { time:'LUNCH — 2:00 PM', name:'Salmon Poke Bowl', items:['150g sushi-grade salmon, cubed','½ cup cooked edamame','1 cup sushi rice','Cucumber, shredded carrots, avocado','2 tbsp low-sodium soy sauce, sesame seeds'], p:42, c:54, f:18 },
      { time:'SNACK — 5:00 PM', name:'Protein Smoothie', items:['1 scoop protein powder','1 cup frozen mango','½ cup coconut water','Handful of spinach (you won\'t taste it!)'], p:28, c:32, f:3 },
      { time:'DINNER — 7:30 PM', name:'Grilled Steak & Salad', items:['180g sirloin steak, grilled','Large mixed green salad','Cherry tomatoes, cucumber, red onion','Balsamic vinaigrette (2 tbsp)','1 small baked potato'], p:44, c:38, f:16 },
    ]
  },
  {
    day:'DAY 7', label:'Sunday',
    meals:[
      { time:'BREAKFAST — 9:00 AM', name:'Veggie Scramble', items:['3 whole eggs + 2 whites','Spinach, tomatoes, mushrooms, onion','1 oz cheddar cheese','2 slices whole grain toast','Black coffee or herbal tea'], p:34, c:36, f:18 },
      { time:'SNACK — 12:00 PM', name:'Greek Yogurt Parfait', items:['200g plain Greek yogurt','½ cup blueberries & raspberries','2 tbsp granola','1 tsp honey','Handful of sliced almonds'], p:22, c:38, f:10 },
      { time:'LUNCH — 2:00 PM', name:'Meal Prep Bowl (Sunday Reset)', items:['150g rotisserie chicken breast','1 cup roasted sweet potato','1 cup roasted broccoli & cauliflower','2 tbsp tahini sauce','Lemon, garlic, herbs'], p:40, c:44, f:16 },
      { time:'SNACK — 4:30 PM', name:'Protein Cookie Dough', items:['½ cup chickpeas, drained (trust the process!)','1 tbsp peanut butter','1 scoop vanilla protein','1 tbsp dark chocolate chips','½ tsp vanilla extract'], p:24, c:28, f:10 },
      { time:'DINNER — 7:00 PM', name:'Chicken Thighs & Veggies', items:['200g boneless skinless chicken thighs','1 cup cooked lentils','Roasted Mediterranean vegetables','Olive oil, oregano, lemon','Optional: 1 small whole grain pita'], p:46, c:48, f:18 },
    ]
  },
]

const FOODS = {
  '🥩 PROTEINS': ['Chicken breast','Turkey breast','Lean beef (90%+)','Salmon & tuna','Shrimp & white fish','Egg whites & whole eggs','Greek yogurt (plain)','Cottage cheese','Whey/casein protein','Tempeh & tofu'],
  '🌾 CARBS': ['Sweet potato','Oats & oat flour','Brown & white rice','Quinoa','Whole grain bread','Lentils & chickpeas','Fruits (banana, berries)','Rice cakes','Farro & barley','Whole wheat pasta'],
  '🥑 HEALTHY FATS': ['Avocado & avocado oil','Olive oil (extra virgin)','Almonds, walnuts, cashews','Natural nut butters','Chia seeds & flaxseed','Dark chocolate (85%+)','Fatty fish (salmon)','Coconut oil (in moderation)','Hemp seeds','Grass-fed butter'],
  '🥦 VEGETABLES': ['Spinach & kale','Broccoli & cauliflower','Asparagus','Zucchini','Bell peppers','Cherry tomatoes','Cucumber','Mushrooms','Brussels sprouts','Celery & carrots'],
  '✅ LIMIT THESE': ['Processed sugar & candy','Refined white flour','Fast food & fried foods','Alcohol','Sugary drinks & juices','Chips & packaged snacks','Artificial sweeteners','Trans fats & margarine','Excess sodium (processed)','High-sugar condiments'],
  '💧 HYDRATION': ['Water — aim for 2–3L/day','Green tea (metabolism boost)','Black coffee (pre-workout)','Herbal teas','Coconut water (post-workout)','Electrolyte water (on training days)'],
}

const TIPS = [
  { icon:'⏰', title:'MEAL TIMING',     txt:'Eat within 1–2 hours of waking. Consume 20–40g protein post-workout. Don\'t go more than 4–5 hours without a meal during active days.' },
  { icon:'🍽', title:'PORTION CONTROL', txt:'Use your hand as a guide. Protein = palm. Carbs = cupped hand. Fats = thumb. Vegetables = unlimited. Eat slowly and stop at 80% full.' },
  { icon:'🧂', title:'MEAL PREP SUNDAY', txt:'Batch cook proteins, grains and vegetables on Sundays. Pre-portion snacks into containers. Pre-wash and chop vegetables. Prep sauces and dressings in advance.' },
  { icon:'💊', title:'SUPPLEMENTS',      txt:'Whey protein (convenient protein source). Creatine monohydrate (5g daily, performance & recovery). Omega-3 fish oil (inflammation & joint health). Vitamin D3 + Magnesium (recovery & sleep).' },
]

export default function Nutrition() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('calculator')
  const [weight, setWeight]     = useState('')
  const [height, setHeight]     = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [age, setAge]           = useState('')
  const [activity, setActivity] = useState('1.55')
  const [goal, setGoal]         = useState('fat-loss')
  const [unit, setUnit]         = useState('lbs')
  const [hUnit, setHUnit]       = useState('ft')
  const [results, setResults]   = useState(null)
  const [activeDay, setActiveDay] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, [])

  const calculate = () => {
    if (!weight || !height || !age) return
    const wKg  = unit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight)
    const hCm  = hUnit === 'ft'
      ? (parseFloat(height) * 30.48) + (parseFloat(heightIn || 0) * 2.54)
      : parseFloat(height)
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

  const day = MEAL_PLAN[activeDay]

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700;800&display=swap"/>
      <style>{css}</style>

      <div className="page">
        <div className="glow"/>
        <div className="wrap">
          {/* Header */}
          <div className="n-header">
            <div className="logo-row" onClick={() => navigate('/')}>
              <svg width="36" height="32" viewBox="0 0 44 40" fill="none">
                <polygon points="22,1 43,39 1,39" fill="#C9960C"/>
                <rect x="12" y="20" width="20" height="3.5" fill="#060606"/>
                <polygon points="22,24 30.5,39 13.5,39" fill="#060606"/>
              </svg>
              <div><span className="brand">AUREVA</span><span className="sys">TRAINING SYSTEM</span></div>
            </div>
            <button className="back-btn" onClick={() => navigate(-1)}>← BACK</button>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab${tab==='calculator'?' active':''}`} onClick={()=>setTab('calculator')}>MACROS CALCULATOR</button>
            <button className={`tab${tab==='mealplan'?' active':''}`}   onClick={()=>setTab('mealplan')}>28-DAY MEAL PLAN</button>
            <button className={`tab${tab==='foods'?' active':''}`}      onClick={()=>setTab('foods')}>FOOD GUIDE</button>
          </div>

          {/* ── MACROS CALCULATOR ── */}
          {tab === 'calculator' && (
            <div>
              <p className="sec-eyebrow">PERSONALIZED NUTRITION</p>
              <h1 className="sec-title">MACROS CALCULATOR</h1>
              <p className="sec-desc">Enter your details below to get your exact daily calorie and macro targets based on your goal. These numbers are your foundation — fuel your transformation with precision.</p>

              <div className="calc-grid">
                <div className="field">
                  <label className="f-label">BODY WEIGHT</label>
                  <div className="f-row">
                    <input className="f-input" type="number" placeholder={unit==='lbs'?'e.g. 145':'e.g. 65'} value={weight} onChange={e=>setWeight(e.target.value)}/>
                    <select className="f-select" style={{flex:'0 0 80px'}} value={unit} onChange={e=>setUnit(e.target.value)}>
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
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
                      <select className="f-select" style={{flex:'0 0 70px'}} value={hUnit} onChange={e=>setHUnit(e.target.value)}>
                        <option value="ft">ft/in</option>
                        <option value="cm">cm</option>
                      </select>
                    </div>
                  ) : (
                    <div className="f-row">
                      <input className="f-input" type="number" placeholder="e.g. 165" value={height} onChange={e=>setHeight(e.target.value)}/>
                      <select className="f-select" style={{flex:'0 0 70px'}} value={hUnit} onChange={e=>setHUnit(e.target.value)}>
                        <option value="ft">ft/in</option>
                        <option value="cm">cm</option>
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
                    <div className="res-cals">
                      <span className="res-cals-num">{results.calories}</span>
                      <span className="res-cals-lbl">CALORIES PER DAY</span>
                    </div>
                    <span className="res-goal-tag">{results.goal}</span>
                  </div>
                  <div className="macros-grid">
                    {[
                      {key:'p',label:'PROTEIN',  g:results.protein, kcal:results.protein*4,  pct:Math.round((results.protein*4/results.calories)*100)},
                      {key:'c',label:'CARBS',    g:results.carbs,   kcal:results.carbs*4,    pct:Math.round((results.carbs*4/results.calories)*100)},
                      {key:'f',label:'FAT',      g:results.fat,     kcal:results.fat*9,      pct:Math.round((results.fat*9/results.calories)*100)},
                    ].map(m => (
                      <div key={m.key} className="macro-card">
                        <span className="macro-name">{m.label}</span>
                        <span className={`macro-g ${m.key}`}>{m.g}<span style={{fontSize:'18px',fontFamily:'Montserrat',fontWeight:300}}>g</span></span>
                        <span className="macro-kcal">{m.kcal} kcal · {m.pct}%</span>
                        <div className="macro-bar-wrap"><div className={`macro-bar ${m.key}`} style={{width:`${m.pct}%`}}/></div>
                      </div>
                    ))}
                  </div>
                  <p className="res-note">
                    These targets are based on the <strong>Mifflin-St Jeor equation</strong> — one of the most accurate formulas for women. 
                    Adjust ±100 calories after 2 weeks based on your progress. <strong>Protein is non-negotiable</strong> — it protects muscle while you transform. 
                    Track for at least 4 weeks before making changes. <strong>Consistency beats perfection every time.</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── MEAL PLAN ── */}
          {tab === 'mealplan' && (
            <div>
              <p className="sec-eyebrow">28-DAY NUTRITION PLAN</p>
              <h1 className="sec-title">YOUR MEAL PLAN</h1>
              <p className="sec-desc">This 7-day rotation repeats across your 28-day program. Each day is designed to fuel your workouts, support recovery, and keep your metabolism working for you. Adjust portion sizes based on your macro targets from the calculator.</p>

              <div className="day-tabs">
                {MEAL_PLAN.map((d,i) => (
                  <button key={i} className={`day-tab${activeDay===i?' active':''}`} onClick={()=>setActiveDay(i)}>
                    {d.day}<br/><span style={{fontSize:'8px',letterSpacing:'1px'}}>{d.label}</span>
                  </button>
                ))}
              </div>

              {day.meals.map((m,i) => (
                <div key={i} className="meal-card">
                  <p className="meal-time">{m.time}</p>
                  <p className="meal-name">{m.name}</p>
                  <ul className="meal-items">{m.items.map((it,j) => <li key={j}>{it}</li>)}</ul>
                  <div className="meal-macros">
                    <span className="mm"><strong>P:</strong> {m.p}g</span>
                    <span className="mm"><strong>C:</strong> {m.c}g</span>
                    <span className="mm"><strong>F:</strong> {m.f}g</span>
                    <span className="mm"><strong>~{m.p*4 + m.c*4 + m.f*9} kcal</strong></span>
                  </div>
                </div>
              ))}

              <div className="divider"/>
              <p className="sec-eyebrow">MEAL PREP TIPS</p>
              <div className="tips-grid">
                {TIPS.map((t,i) => (
                  <div key={i} className="tip-card">
                    <span className="tip-icon">{t.icon}</span>
                    <div>
                      <p className="tip-title">{t.title}</p>
                      <p className="tip-txt">{t.txt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FOOD GUIDE ── */}
          {tab === 'foods' && (
            <div>
              <p className="sec-eyebrow">AUREVA NUTRITION GUIDE</p>
              <h1 className="sec-title">WHAT TO EAT</h1>
              <p className="sec-desc">Build your meals from this list. Prioritize whole, minimally processed foods. Quality matters as much as quantity — eat to fuel, not to fill.</p>
              <div className="food-grid">
                {Object.entries(FOODS).map(([cat, items]) => (
                  <div key={cat} className="food-cat">
                    <p className="food-cat-title">{cat}</p>
                    <ul className="food-list">{items.map((it,i) => <li key={i}>{it}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
