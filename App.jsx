import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login      from './Login.jsx'
import Pricing    from './Pricing.jsx'
import AppDemo    from './AppDemo.jsx'
import Disclaimer from './Disclaimer.jsx'
import About      from './About.jsx'
import Start      from './Start.jsx'
import Admin      from './Admin.jsx'

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
        <Route path="/admin"      element={<Admin />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
