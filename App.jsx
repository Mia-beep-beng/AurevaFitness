import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './LanguageContext.jsx'
import LangSelector    from './LangSelector.jsx'
import AdminFloater    from './AdminFloater.jsx'
import Login        from './Login.jsx'
import Pricing      from './Pricing.jsx'
import AppDemo      from './AppDemo.jsx'
import Disclaimer   from './Disclaimer.jsx'
import About        from './About.jsx'
import Start        from './Start.jsx'
import Admin        from './Admin.jsx'
import Nutrition    from './Nutrition.jsx'
import Workouts     from './Workouts.jsx'
import Measurements from './Measurements.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        {/* Global language selector — fixed top-right on every page */}
        <div style={{ position:'fixed', top:'12px', right:'14px', zIndex:9999 }}>
          <LangSelector />
        </div>

        {/* Admin floater — shows on client pages when logged in as admin */}
        <AdminFloater />

        <Routes>
          <Route path="/"              element={<Login />} />
          <Route path="/pricing"       element={<Pricing />} />
          <Route path="/app-demo"      element={<AppDemo />} />
          <Route path="/disclaimer"    element={<Disclaimer />} />
          <Route path="/about"         element={<About />} />
          <Route path="/start"         element={<Start />} />
          <Route path="/admin"         element={<Admin />} />
          <Route path="/nutrition"     element={<Nutrition />} />
          <Route path="/workouts"      element={<Workouts />} />
          <Route path="/measurements"  element={<Measurements />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
