import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Privacy from './pages/Privacy' // 1. IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. NOVÁ CESTA */}
        <Route path="/privacy" element={<Privacy />} />
        
      </Routes>
    </Router>
  )
}

export default App