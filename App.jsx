import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login.jsx'
import Pricing    from './pages/Pricing.jsx'
import AppDemo    from './pages/AppDemo.jsx'
import Disclaimer from './pages/Disclaimer.jsx'
import About      from './pages/About.jsx'
import Start      from './pages/Start.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Login />} />
        <Route path="/pricing"    element={<Pricing />} />
        <Route path="/app-demo"   element={<AppDemo />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/about"      element={<About />} />
        <Route path="/start"      element={<Start />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
