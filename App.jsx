import { useState, useEffect } from "react";
import {
  Home, Dumbbell, Utensils, TrendingUp, User,
  ChevronRight, CheckCircle, Play, Search, Bell,
  Settings, Camera, Award, Flame, Clock, Star,
  Lock, Mail, Eye, EyeOff, Calendar, Target,
  Zap, Heart, Droplet, BarChart2, X, Check
} from "lucide-react";

// ═══════════════════════════════════
// THEME
// ═══════════════════════════════════
const G  = "#D4A843";
const GL = "#F0CC6A";
const GD = "#A07820";
const BG = "#080808";
const C1 = "#131313";
const C2 = "#1C1C1C";
const BD = "#2A2A2A";
const TX = "#F0EAD6";
const DM = "#808080";
const RE = "#E05555";
const GR = "#4CAF50";
const BL = "#5B8DD9";
const PU = "#8B5BD9";

const GRAD  = `linear-gradient(135deg, ${GD}, ${G}, ${GL})`;
const GSHDW = `0 4px 24px rgba(212,168,67,0.35)`;
const CSHDW = "0 4px 20px rgba(0,0,0,0.5)";

const TC = { "Full Body":G, Cardio:"#E07855", "Upper Body":BL, "Lower Body":PU, Core:GR, Recovery:"#4ECDC4", Mixed:"#E0B855", Rest:"#555" };
const DC = { Easy:GR, Medium:G, Hard:RE };

// ═══════════════════════════════════
// DATA
// ═══════════════════════════════════
const W28 = [
  {d:1,  name:"Full Body Activation",   type:"Full Body",   dur:35, ex:6,  done:true},
  {d:2,  name:"Cardio Blast",           type:"Cardio",      dur:25, ex:4,  done:true},
  {d:3,  name:"Upper Body Power",       type:"Upper Body",  dur:40, ex:7,  done:true},
  {d:4,  name:"Rest Day",               type:"Rest",        dur:0,  ex:0,  done:true},
  {d:5,  name:"Lower Body Burn",        type:"Lower Body",  dur:45, ex:8,  done:true},
  {d:6,  name:"Core & Stability",       type:"Core",        dur:30, ex:6,  done:true},
  {d:7,  name:"Active Recovery",        type:"Recovery",    dur:20, ex:3,  done:true},
  {d:8,  name:"Push Day",               type:"Upper Body",  dur:45, ex:7,  done:true},
  {d:9,  name:"Pull Day",               type:"Upper Body",  dur:45, ex:7,  done:true},
  {d:10, name:"Leg Day",                type:"Lower Body",  dur:50, ex:8,  done:true},
  {d:11, name:"HIIT Cardio",            type:"Cardio",      dur:25, ex:6,  done:false},
  {d:12, name:"Rest Day",               type:"Rest",        dur:0,  ex:0,  done:false},
  {d:13, name:"Full Body Circuit",      type:"Full Body",   dur:40, ex:8,  done:false},
  {d:14, name:"Yoga & Stretch",         type:"Recovery",    dur:30, ex:5,  done:false},
  {d:15, name:"Chest & Triceps",        type:"Upper Body",  dur:45, ex:7,  done:false},
  {d:16, name:"Back & Biceps",          type:"Upper Body",  dur:45, ex:7,  done:false},
  {d:17, name:"Glutes & Hamstrings",    type:"Lower Body",  dur:45, ex:8,  done:false},
  {d:18, name:"Cardio + Core",          type:"Mixed",       dur:35, ex:6,  done:false},
  {d:19, name:"Rest Day",               type:"Rest",        dur:0,  ex:0,  done:false},
  {d:20, name:"Shoulder & Arms",        type:"Upper Body",  dur:40, ex:7,  done:false},
  {d:21, name:"Quad Focus",             type:"Lower Body",  dur:45, ex:7,  done:false},
  {d:22, name:"HIIT + Abs",             type:"Mixed",       dur:30, ex:6,  done:false},
  {d:23, name:"Full Body Strength",     type:"Full Body",   dur:55, ex:9,  done:false},
  {d:24, name:"Rest Day",               type:"Rest",        dur:0,  ex:0,  done:false},
  {d:25, name:"Upper Body Finisher",    type:"Upper Body",  dur:50, ex:8,  done:false},
  {d:26, name:"Leg Day Elite",          type:"Lower Body",  dur:55, ex:9,  done:false},
  {d:27, name:"Total Body Cardio",      type:"Cardio",      dur:40, ex:7,  done:false},
  {d:28, name:"Final Challenge 🏆",     type:"Full Body",   dur:60, ex:10, done:false},
];

const EXLIB = [
  {id:1,  name:"Barbell Back Squat",    cat:"Lower Body", muscle:"Quads, Glutes",     sets:"4×8",   diff:"Hard",   eq:"Barbell"},
  {id:2,  name:"Romanian Deadlift",     cat:"Lower Body", muscle:"Hamstrings, Glutes", sets:"3×12",  diff:"Medium", eq:"Barbell"},
  {id:3,  name:"Walking Lunges",        cat:"Lower Body", muscle:"Quads, Glutes",     sets:"3×10e", diff:"Easy",   eq:"Bodyweight"},
  {id:4,  name:"Hip Thrust",            cat:"Lower Body", muscle:"Glutes",            sets:"4×12",  diff:"Medium", eq:"Barbell"},
  {id:5,  name:"Calf Raises",           cat:"Lower Body", muscle:"Calves",            sets:"4×20",  diff:"Easy",   eq:"Machine"},
  {id:6,  name:"Bench Press",           cat:"Upper Body", muscle:"Chest, Triceps",    sets:"4×8",   diff:"Hard",   eq:"Barbell"},
  {id:7,  name:"Pull-Ups",              cat:"Upper Body", muscle:"Back, Biceps",      sets:"4×8",   diff:"Hard",   eq:"Bar"},
  {id:8,  name:"Shoulder Press",        cat:"Upper Body", muscle:"Shoulders",         sets:"3×12",  diff:"Medium", eq:"Dumbbells"},
  {id:9,  name:"Bent Over Row",         cat:"Upper Body", muscle:"Back, Biceps",      sets:"4×10",  diff:"Medium", eq:"Barbell"},
  {id:10, name:"Tricep Dips",           cat:"Upper Body", muscle:"Triceps",           sets:"3×12",  diff:"Medium", eq:"Bench"},
  {id:11, name:"Bicep Curls",           cat:"Upper Body", muscle:"Biceps",            sets:"3×15",  diff:"Easy",   eq:"Dumbbells"},
  {id:12, name:"Lateral Raises",        cat:"Upper Body", muscle:"Shoulders",         sets:"3×15",  diff:"Easy",   eq:"Dumbbells"},
  {id:13, name:"Plank",                 cat:"Core",       muscle:"Full Core",         sets:"3×60s", diff:"Medium", eq:"Bodyweight"},
  {id:14, name:"Russian Twists",        cat:"Core",       muscle:"Obliques",          sets:"3×20",  diff:"Easy",   eq:"Bodyweight"},
  {id:15, name:"Hanging Leg Raises",    cat:"Core",       muscle:"Lower Abs",         sets:"3×12",  diff:"Hard",   eq:"Bar"},
  {id:16, name:"Bicycle Crunches",      cat:"Core",       muscle:"Abs, Obliques",     sets:"3×20",  diff:"Easy",   eq:"Bodyweight"},
  {id:17, name:"Sprint Intervals",      cat:"Cardio",     muscle:"Full Body",         sets:"8×30s", diff:"Hard",   eq:"Treadmill"},
  {id:18, name:"Jump Rope",             cat:"Cardio",     muscle:"Full Body",         sets:"5×3min",diff:"Medium", eq:"Jump Rope"},
  {id:19, name:"Burpees",               cat:"Cardio",     muscle:"Full Body",         sets:"4×10",  diff:"Hard",   eq:"Bodyweight"},
  {id:20, name:"Rowing Machine",        cat:"Cardio",     muscle:"Full Body",         sets:"3×5min",diff:"Medium", eq:"Machine"},
];

const MEALS = [
  {time:"7:00 AM",  name:"Protein Oats & Banana",   cal:420, p:32, c:48, f:9},
  {time:"10:30 AM", name:"Greek Yogurt & Berries",   cal:180, p:18, c:20, f:3},
  {time:"1:00 PM",  name:"Grilled Chicken Bowl",     cal:550, p:48, c:45, f:15},
  {time:"4:00 PM",  name:"Protein Shake",            cal:200, p:30, c:10, f:3},
  {time:"7:00 PM",  name:"Salmon & Sweet Potato",    cal:620, p:45, c:55, f:18},
];
const WEIGHTS = [68.2,67.8,67.5,67.1,66.8,66.5,66.3,66.0,65.8,65.6];

// ═══════════════════════════════════
// TINY HELPERS
// ═══════════════════════════════════
const Ring = ({ size=80, stroke=6, pct=0, color=G }) => {
  const r = (size-stroke)/2, circ = 2*Math.PI*r, off = circ*(1-pct/100);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C2} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1s ease"}}/>
    </svg>
  );
};

const Pill = ({ label, color }) => (
  <span style={{background:`${color}22`,color,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>{label}</span>
);

const SecTitle = ({ children }) => (
  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,
    letterSpacing:1,textTransform:"uppercase",color:TX,marginBottom:12}}>{children}</div>
);

const IconBtn = ({ icon, onClick }) => (
  <button onClick={onClick} style={{width:40,height:40,borderRadius:12,background:C1,
    border:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"center",
    color:DM,cursor:"pointer"}}>
    {icon}
  </button>
);

const MacroBar = ({ label, val, max, color, unit }) => (
  <div style={{flex:1}}>
    <div style={{fontSize:10,color:DM,marginBottom:3}}>{label}</div>
    <div style={{height:5,background:C2,borderRadius:3,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(val/max*100,100)}%`,background:color,borderRadius:3,transition:"width 1s ease"}}/>
    </div>
    <div style={{fontSize:10,color,marginTop:2,fontWeight:700}}>{val}{unit}</div>
  </div>
);

const InField = ({ icon, placeholder, value, onChange, type="text", right=null }) => (
  <div style={{display:"flex",alignItems:"center",gap:12,background:C2,
    border:`1px solid ${BD}`,borderRadius:12,padding:"13px 16px",position:"relative"}}>
    <span style={{color:G,flexShrink:0}}>{icon}</span>
    <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
      style={{flex:1,background:"none",border:"none",outline:"none",color:TX,fontSize:14,
        fontFamily:"'Rubik',sans-serif"}}/>
    {right}
  </div>
);

// ═══════════════════════════════════
// HEADER GRADIENT
// ═══════════════════════════════════
const HDR = ({ title, sub, children }) => (
  <div style={{padding:"52px 24px 20px",background:`linear-gradient(180deg,#1a1200 0%,${BG} 100%)`}}>
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:800,
      letterSpacing:2,textTransform:"uppercase",background:GRAD,
      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{title}</div>
    {sub && <div style={{color:DM,fontSize:13,marginTop:4}}>{sub}</div>}
    {children}
  </div>
);

// ═══════════════════════════════════
// SCREENS
// ═══════════════════════════════════

// ── LOGIN ──
function LoginScreen({ onLogin }) {
  const [mode,setMode]   = useState("login");
  const [email,setEmail] = useState("");
  const [pw,setPw]       = useState("");
  const [name,setName]   = useState("");
  const [show,setShow]   = useState(false);

  const go = () => {
    if (mode==="login" && email && pw) onLogin({name:email.split("@")[0], email, curDay:11});
    if (mode==="register" && name && email && pw) onLogin({name, email, curDay:1});
  };

  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at top,#1a1200 0%,${BG} 60%)`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>

      {/* Logo */}
      <div style={{marginBottom:40,textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:46,fontWeight:900,
          letterSpacing:10,background:GRAD,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AUREVA</div>
        <div style={{color:G,fontSize:11,letterSpacing:7,opacity:0.7,marginBottom:12}}>TRAINING SYSTEM</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{height:1,flex:1,background:G,opacity:0.3}}/>
          <div style={{width:6,height:6,background:G,transform:"rotate(45deg)",opacity:0.6}}/>
          <div style={{height:1,flex:1,background:G,opacity:0.3}}/>
        </div>
      </div>

      {/* Card */}
      <div style={{width:"100%",maxWidth:400,background:C1,borderRadius:20,padding:"28px 24px",
        border:`1px solid ${BD}`,boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>

        {/* Toggle */}
        <div style={{display:"flex",background:C2,borderRadius:12,padding:4,marginBottom:24}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{
              flex:1,padding:"10px 0",borderRadius:10,border:"none",
              background:mode===m ? GRAD : "transparent",
              color:mode===m ? "#000" : DM,fontWeight:700,fontSize:13,
              letterSpacing:1,textTransform:"uppercase",cursor:"pointer",
              fontFamily:"'Rubik',sans-serif"}}>
              {m==="login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {mode==="register" && <InField icon={<User size={16}/>} placeholder="Full Name" value={name} onChange={setName}/>}
          <InField icon={<Mail size={16}/>} placeholder="Email Address" value={email} onChange={setEmail} type="email"/>
          <InField icon={<Lock size={16}/>} placeholder="Password" value={pw} onChange={setPw}
            type={show ? "text":"password"}
            right={<button onClick={()=>setShow(!show)} style={{background:"none",border:"none",color:DM,cursor:"pointer",padding:0}}>
              {show ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>}/>
        </div>

        {mode==="login" && <div style={{textAlign:"right",marginTop:8}}>
          <span style={{color:G,fontSize:12,cursor:"pointer"}}>Forgot password?</span>
        </div>}

        <button onClick={go} style={{width:"100%",marginTop:20,padding:"15px 0",borderRadius:14,border:"none",
          background:GRAD,color:"#000",fontWeight:800,fontSize:15,letterSpacing:2,textTransform:"uppercase",
          cursor:"pointer",boxShadow:GSHDW,fontFamily:"'Barlow Condensed',sans-serif"}}>
          {mode==="login" ? "Start Training" : "Join Aureva"}
        </button>

        <div style={{textAlign:"center",marginTop:16,color:DM,fontSize:12}}>
          {mode==="login" ? "No account? " : "Already a member? "}
          <span onClick={()=>setMode(mode==="login"?"register":"login")}
            style={{color:G,cursor:"pointer",fontWeight:600}}>
            {mode==="login" ? "Sign Up Free" : "Sign In"}
          </span>
        </div>
      </div>
      <div style={{marginTop:20,color:DM,fontSize:11,textAlign:"center"}}>By continuing you agree to Aureva's Terms &amp; Privacy</div>
    </div>
  );
}

// ── HOME ──
function HomeScreen({ user, onNav }) {
  const today  = W28[user.curDay-1];
  const done   = W28.filter(w=>w.done).length;
  const streak = 10;
  const pct    = Math.round(done/28*100);

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:"52px 24px 20px",background:`linear-gradient(180deg,#1a1200 0%,${BG} 100%)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{color:DM,fontSize:13,marginBottom:4}}>Good morning,</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,
              letterSpacing:1,background:GRAD,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {user.name.charAt(0).toUpperCase()+user.name.slice(1)} 💪
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <IconBtn icon={<Bell size={18}/>}/>
            <IconBtn icon={<Settings size={18}/>} onClick={()=>onNav("profile")}/>
          </div>
        </div>
        {/* Quick stats */}
        <div style={{display:"flex",gap:10,marginTop:20}}>
          {[
            {label:"Day Streak", val:streak, icon:<Flame size={16} color="#E07855"/>},
            {label:"Completed",  val:`${done}/28`, icon:<CheckCircle size={16} color={G}/>},
            {label:"This Week",  val:"4 / 5", icon:<Calendar size={16} color={BL}/>},
          ].map(s=>(
            <div key={s.label} style={{flex:1,background:C1,borderRadius:14,padding:"12px 8px",
              border:`1px solid ${BD}`,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{s.icon}</div>
              <div style={{fontWeight:700,fontSize:16,color:TX}}>{s.val}</div>
              <div style={{color:DM,fontSize:10}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 24px"}}>
        {/* Today */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <SecTitle>Today's Workout</SecTitle>
          <span style={{color:DM,fontSize:12}}>Day {user.curDay}</span>
        </div>
        <div onClick={()=>onNav("workout")} style={{background:C1,borderRadius:20,padding:20,
          border:`1px solid ${BD}`,boxShadow:CSHDW,cursor:"pointer",marginBottom:20,
          position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:GRAD}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,
                letterSpacing:1,color:TX,textTransform:"uppercase"}}>{today.name}</div>
              <div style={{marginTop:4}}><Pill label={today.type} color={TC[today.type]||G}/></div>
            </div>
            <div style={{background:GRAD,borderRadius:"50%",width:44,height:44,display:"flex",
              alignItems:"center",justifyContent:"center",boxShadow:GSHDW,flexShrink:0}}>
              <Play size={18} color="#000" fill="#000"/>
            </div>
          </div>
          <div style={{display:"flex",gap:16}}>
            {[{i:<Clock size={13}/>,v:`${today.dur} min`},{i:<Dumbbell size={13}/>,v:`${today.ex} exercises`},{i:<Zap size={13}/>,v:"Moderate"}].map(x=>(
              <div key={x.v} style={{display:"flex",alignItems:"center",gap:4,color:DM,fontSize:12}}>
                <span style={{color:G}}>{x.i}</span>{x.v}
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <SecTitle>28-Day Progress</SecTitle>
        <div style={{background:C1,borderRadius:20,padding:20,border:`1px solid ${BD}`,
          marginBottom:20,display:"flex",alignItems:"center",gap:20}}>
          <div style={{position:"relative",flexShrink:0}}>
            <Ring size={80} pct={pct}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:800,color:G}}>{pct}%</div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:700,color:TX}}>{done} of 28 Days</div>
            <div style={{color:DM,fontSize:13,marginTop:2}}>You're on Day {user.curDay} — keep it up!</div>
            <div style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:8}}>
              {W28.slice(0,14).map(w=>(
                <div key={w.d} style={{width:14,height:14,borderRadius:3,
                  background:w.d===user.curDay ? G : w.done ? G+"88" : BD,
                  border:w.d===user.curDay ? `2px solid ${GL}` : "none"}}/>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <SecTitle>Quick Access</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {label:"Exercise Library",  icon:<Dumbbell size={22}/>,  screen:"exercise", color:BL},
            {label:"Meal Plans",        icon:<Utensils size={22}/>, screen:"nutrition", color:GR},
            {label:"My Progress",       icon:<TrendingUp size={22}/>,screen:"progress",  color:G},
            {label:"My Profile",        icon:<User size={22}/>,      screen:"profile",   color:"#E07855"},
          ].map(q=>(
            <div key={q.label} onClick={()=>onNav(q.screen)} style={{background:C1,borderRadius:16,
              padding:16,border:`1px solid ${BD}`,cursor:"pointer"}}>
              <div style={{color:q.color,marginBottom:8}}>{q.icon}</div>
              <div style={{fontSize:13,fontWeight:600,color:TX}}>{q.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── WORKOUT 28-DAY ──
function WorkoutScreen({ user }) {
  const [week, setWeek] = useState(Math.floor((user.curDay-1)/7));
  const slice = W28.slice(week*7, week*7+7);

  return (
    <div style={{paddingBottom:80}}>
      <HDR title="28-Day Program" sub="Aureva Training System"/>
      <div style={{padding:"0 24px"}}>
        {/* Week tabs */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {[0,1,2,3].map(w=>(
            <button key={w} onClick={()=>setWeek(w)} style={{
              flex:1,padding:"10px 0",borderRadius:12,cursor:"pointer",fontWeight:700,
              fontFamily:"'Rubik',sans-serif",fontSize:13,
              border:`1px solid ${week===w ? G : BD}`,
              background:week===w ? `${G}22` : C1,
              color:week===w ? G : DM}}>W{w+1}</button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {slice.map(w=>{
            const cur = w.d===user.curDay, past = w.d<user.curDay;
            return (
              <div key={w.d} style={{background:C1,borderRadius:16,padding:16,cursor:"pointer",
                border:`1px solid ${cur ? G : BD}`,boxShadow:cur?GSHDW:"none",
                opacity:w.type==="Rest"?0.6:1}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                    background:cur?GRAD:past?`${G}33`:C2,
                    border:`1px solid ${cur?G:BD}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,
                    color:cur?"#000":past?G:DM}}>
                    {past ? <CheckCircle size={18} color={G}/> : w.d}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:TX,marginBottom:4}}>{w.name}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <Pill label={w.type} color={TC[w.type]||G}/>
                      {w.dur>0 && <span style={{color:DM,fontSize:11,display:"flex",alignItems:"center",gap:3}}>
                        <Clock size={10}/> {w.dur}m
                      </span>}
                    </div>
                  </div>
                  {cur && <div style={{background:GRAD,borderRadius:10,padding:"6px 12px",
                    fontSize:11,fontWeight:700,color:"#000",letterSpacing:1,flexShrink:0}}>TODAY</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── EXERCISES ──
function ExerciseScreen() {
  const [cat,setCat]     = useState("All");
  const [query,setQuery] = useState("");
  const cats = ["All","Lower Body","Upper Body","Core","Cardio"];
  const list = EXLIB.filter(e=>(cat==="All"||e.cat===cat)&&e.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{paddingBottom:80}}>
      <HDR title="Exercise Library">
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:14,background:C1,
          border:`1px solid ${BD}`,borderRadius:12,padding:"11px 14px"}}>
          <Search size={15} color={DM}/>
          <input placeholder="Search exercises…" value={query} onChange={e=>setQuery(e.target.value)}
            style={{flex:1,background:"none",border:"none",outline:"none",color:TX,fontSize:14,
              fontFamily:"'Rubik',sans-serif"}}/>
        </div>
      </HDR>
      <div style={{padding:"0 24px"}}>
        {/* Category pills */}
        <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{
              padding:"8px 16px",borderRadius:20,whiteSpace:"nowrap",fontSize:12,
              fontWeight:600,cursor:"pointer",fontFamily:"'Rubik',sans-serif",
              border:`1px solid ${cat===c?G:BD}`,
              background:cat===c?`${G}22`:C1,
              color:cat===c?G:DM}}>{c}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {list.map(ex=>(
            <div key={ex.id} style={{background:C1,borderRadius:16,padding:16,border:`1px solid ${BD}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:TX,marginBottom:4}}>{ex.name}</div>
                  <div style={{color:DM,fontSize:12,marginBottom:8}}>{ex.muscle}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <Pill label={ex.sets} color={BL}/>
                    <Pill label={ex.eq} color={DM}/>
                  </div>
                </div>
                <Pill label={ex.diff} color={DC[ex.diff]||G}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NUTRITION ──
function NutritionScreen() {
  const [water, setWater] = useState(5);
  const totCal = MEALS.reduce((s,m)=>s+m.cal,0);
  const totP   = MEALS.reduce((s,m)=>s+m.p,0);
  const totC   = MEALS.reduce((s,m)=>s+m.c,0);
  const totF   = MEALS.reduce((s,m)=>s+m.f,0);
  const GOAL   = 2000;

  return (
    <div style={{paddingBottom:80}}>
      <HDR title="Nutrition" sub="Monday — Meal Plan"/>
      <div style={{padding:"0 24px"}}>

        {/* Calories + macros */}
        <div style={{background:C1,borderRadius:20,padding:20,border:`1px solid ${BD}`,
          marginBottom:16,display:"flex",alignItems:"center",gap:20}}>
          <div style={{position:"relative",flexShrink:0}}>
            <Ring size={80} pct={Math.round(totCal/GOAL*100)}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:800,color:G}}>{Math.round(totCal/GOAL*100)}%</div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:TX}}>
              {totCal} <span style={{fontSize:13,color:DM,fontFamily:"'Rubik',sans-serif",fontWeight:400}}>/ {GOAL} kcal</span>
            </div>
            <div style={{display:"flex",gap:10,marginTop:10}}>
              <MacroBar label="Protein" val={totP} max={170} color={BL} unit="g"/>
              <MacroBar label="Carbs"   val={totC} max={220} color={G}  unit="g"/>
              <MacroBar label="Fat"     val={totF} max={70}  color={RE} unit="g"/>
            </div>
          </div>
        </div>

        {/* Water */}
        <div style={{background:C1,borderRadius:20,padding:16,border:`1px solid ${BD}`,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Droplet size={18} color={BL}/>
              <span style={{fontWeight:700,fontSize:14,color:TX}}>Water Intake</span>
            </div>
            <span style={{color:DM,fontSize:12}}>{water} / 8 glasses</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            {Array.from({length:8}).map((_,i)=>(
              <button key={i} onClick={()=>setWater(i<water?i:i+1)} style={{
                flex:1,height:32,borderRadius:8,border:"none",cursor:"pointer",
                background:i<water ? BL : C2,transition:"all 0.2s"}}/>
            ))}
          </div>
        </div>

        {/* Meals */}
        <SecTitle>Today's Meals</SecTitle>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {MEALS.map((m,i)=>(
            <div key={i} style={{background:C1,borderRadius:16,padding:16,border:`1px solid ${BD}`,
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600,fontSize:14,color:TX}}>{m.name}</div>
                <div style={{color:DM,fontSize:12,marginTop:2}}>{m.time} · P:{m.p}g C:{m.c}g F:{m.f}g</div>
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:G,flexShrink:0}}>
                {m.cal}<span style={{fontSize:10,color:DM,fontFamily:"'Rubik',sans-serif",fontWeight:400}}> kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROGRESS ──
function ProgressScreen() {
  const minW = Math.min(...WEIGHTS), maxW = Math.max(...WEIGHTS);
  const badges = [
    {name:"First Workout",  done:true},
    {name:"7 Day Streak",   done:true},
    {name:"10 Workouts",    done:true},
    {name:"28 Days",        done:false},
    {name:"Goal Weight",    done:false},
  ];
  const pts = WEIGHTS.map((w,i)=>`${i*28},${75-((w-minW)/(maxW-minW+.01))*60}`).join(" ");
  const fillPts = `0,75 ${pts} ${(WEIGHTS.length-1)*28},75`;

  return (
    <div style={{paddingBottom:80}}>
      <HDR title="My Progress"/>
      <div style={{padding:"0 24px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {label:"Workouts Done",   val:10,     icon:<Dumbbell size={18}/>,  color:G},
            {label:"Calories Burned", val:"3,840", icon:<Flame size={18}/>,    color:"#E07855"},
            {label:"Total Minutes",   val:342,    icon:<Clock size={18}/>,     color:BL},
            {label:"Streak Days",     val:10,     icon:<Zap size={18}/>,       color:GR},
          ].map(s=>(
            <div key={s.label} style={{background:C1,borderRadius:16,padding:16,border:`1px solid ${BD}`}}>
              <div style={{color:s.color,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:800,color:TX}}>{s.val}</div>
              <div style={{fontSize:11,color:DM}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weight chart */}
        <SecTitle>Weight Trend (kg)</SecTitle>
        <div style={{background:C1,borderRadius:20,padding:20,border:`1px solid ${BD}`,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:DM}}>Last 10 days</span>
            <span style={{fontSize:14,fontWeight:700,color:GR}}>▼ 2.6 kg 🎉</span>
          </div>
          <svg width="100%" height={80} viewBox={`0 0 ${(WEIGHTS.length-1)*28+10} 80`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={G} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={G} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon points={fillPts} fill="url(#wg)"/>
            <polyline points={pts} fill="none" stroke={G} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
            {WEIGHTS.map((w,i)=>(
              <circle key={i} cx={i*28} cy={75-((w-minW)/(maxW-minW+.01))*60} r={3.5} fill={G}/>
            ))}
          </svg>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{fontSize:10,color:DM}}>Day 1 · {WEIGHTS[0]}kg</span>
            <span style={{fontSize:10,color:DM}}>Day 10 · {WEIGHTS[WEIGHTS.length-1]}kg</span>
          </div>
        </div>

        {/* Progress photos */}
        <SecTitle>Progress Photos</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {["Week 1","Week 2","Week 3"].map(wk=>(
            <div key={wk} style={{background:C2,borderRadius:12,aspectRatio:"3/4",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              border:`1px dashed ${BD}`,gap:6,cursor:"pointer"}}>
              <Camera size={18} color={DM}/>
              <div style={{fontSize:10,color:DM}}>{wk}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <SecTitle>Achievements</SecTitle>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
          {badges.map(b=>(
            <div key={b.name} style={{display:"flex",alignItems:"center",gap:6,
              background:b.done?`${G}22`:C1,border:`1px solid ${b.done?G:BD}`,
              borderRadius:20,padding:"6px 12px",opacity:b.done?1:0.45}}>
              <Award size={12} color={b.done?G:DM}/>
              <span style={{fontSize:11,color:b.done?G:DM,fontWeight:600}}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROFILE ──
function ProfileScreen({ user, onLogout }) {
  const [notif, setNotif] = useState(true);
  const items = [
    {label:"Personal Info",      icon:<User size={16}/>,     color:G},
    {label:"Workout Settings",   icon:<Dumbbell size={16}/>, color:BL},
    {label:"Goal Settings",      icon:<Target size={16}/>,   color:"#E07855"},
    {label:"Notifications",      icon:<Bell size={16}/>,     color:PU, toggle:true, on:notif, fn:()=>setNotif(!notif)},
    {label:"Dark Mode",          icon:<Star size={16}/>,     color:DM, toggle:true, on:true, fn:()=>{}},
  ];

  return (
    <div style={{paddingBottom:80}}>
      <div style={{padding:"52px 24px 32px",background:`linear-gradient(180deg,#1a1200 0%,${BG} 100%)`,textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:GRAD,margin:"0 auto 12px",
          display:"flex",alignItems:"center",justifyContent:"center",boxShadow:GSHDW,
          fontSize:30,fontWeight:800,color:"#000",fontFamily:"'Barlow Condensed',sans-serif"}}>
          {user.name[0].toUpperCase()}
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,
          letterSpacing:1,background:GRAD,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {user.name.charAt(0).toUpperCase()+user.name.slice(1)}
        </div>
        <div style={{color:DM,fontSize:12,marginTop:4}}>{user.email}</div>
        <div style={{marginTop:12}}>
          <span style={{background:`${G}22`,color:G,borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:700}}>
            🏆 Day {user.curDay} · Aureva Member
          </span>
        </div>
      </div>
      <div style={{padding:"0 24px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {items.map(it=>(
            <div key={it.label} onClick={it.toggle?it.fn:undefined} style={{
              background:C1,borderRadius:14,padding:"15px 16px",border:`1px solid ${BD}`,
              display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <div style={{color:it.color}}>{it.icon}</div>
              <span style={{flex:1,fontSize:14,fontWeight:500,color:TX}}>{it.label}</span>
              {it.toggle
                ? <div style={{width:44,height:24,borderRadius:12,background:it.on?`${G}44`:C2,
                    border:`1px solid ${it.on?G:BD}`,display:"flex",alignItems:"center",
                    padding:"0 3px",justifyContent:it.on?"flex-end":"flex-start",transition:"all 0.2s"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:it.on?G:DM,transition:"all 0.2s"}}/>
                  </div>
                : <ChevronRight size={16} color={DM}/>
              }
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{width:"100%",padding:"15px 0",borderRadius:14,
          border:`1px solid ${RE}`,background:`${RE}22`,color:RE,fontWeight:700,
          fontSize:14,cursor:"pointer",fontFamily:"'Rubik',sans-serif",letterSpacing:1}}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ──
function BottomNav({ active, onNav }) {
  const tabs = [
    {id:"home",      icon:<Home size={20}/>,      label:"Home"},
    {id:"workout",   icon:<Calendar size={20}/>,  label:"Program"},
    {id:"exercise",  icon:<Dumbbell size={20}/>,  label:"Exercises"},
    {id:"nutrition", icon:<Utensils size={20}/>,  label:"Nutrition"},
    {id:"progress",  icon:<TrendingUp size={20}/>,label:"Progress"},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,background:"#0D0D0D",borderTop:`1px solid ${BD}`,
      display:"flex",padding:"8px 0 16px",zIndex:100}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onNav(t.id)} style={{
          flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
          background:"none",border:"none",cursor:"pointer",
          color:active===t.id ? G : DM,transition:"color 0.2s"}}>
          {t.icon}
          <span style={{fontSize:9,fontWeight:active===t.id?700:400,letterSpacing:0.5}}>{t.label}</span>
          {active===t.id && <div style={{width:16,height:2,background:G,borderRadius:1,marginTop:-2}}/>}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════
// APP
// ═══════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login");
  const [user,   setUser]   = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Rubik:wght@300;400;500;600;700&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{background:BG,minHeight:"100vh",maxWidth:430,margin:"0 auto",
      fontFamily:"'Rubik',sans-serif",color:TX,position:"relative",overflowX:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:0}
        input::placeholder{color:#555}
        button:active{transform:scale(0.97)}
      `}</style>

      {screen==="login"
        ? <LoginScreen onLogin={u=>{setUser(u);setScreen("home");}}/>
        : <>
          {screen==="home"      && <HomeScreen      user={user} onNav={setScreen}/>}
          {screen==="workout"   && <WorkoutScreen   user={user} onNav={setScreen}/>}
          {screen==="exercise"  && <ExerciseScreen/>}
          {screen==="nutrition" && <NutritionScreen/>}
          {screen==="progress"  && <ProgressScreen/>}
          {screen==="profile"   && <ProfileScreen user={user} onLogout={()=>{setUser(null);setScreen("login");}}/>}
          <BottomNav active={screen} onNav={setScreen}/>
        </>
      }
    </div>
  );
}
