import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Když uživatel přijde na hlavní stránku "/", ukaž mu Home */}
        <Route path="/" element={<Home />} />
        
        {/* Když přijde na "/login", ukaž mu Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Když přijde na "/admin", ukaž mu Admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App