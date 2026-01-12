import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { translations } from './translations' // 1. Import překladů
import Home from './pages/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Privacy from './pages/Privacy'
import ProductLanding from './pages/demos/product_web/ProductLanding';

function App() {
  // Inicializace jazyka z localStorage nebo 'cz'
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'cz');
  
  // Aktuální balík textů
  const t = translations[lang];

  const toggleLang = () => {
    const newLang = lang === 'cz' ? 'en' : 'cz';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <Router>
      <Routes>
        {/* Home.jsx teď potřebuje vědět o jazyku */}
        <Route path="/" element={
          <Home 
            lang={lang} 
            toggleLang={toggleLang} 
            t={t} 
          />
        } />
        
        {/* Admin a Login necháme česky, tam t nepředáváme */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy lang={lang} toggleLang={toggleLang} t={t} />} />
       <Route path="/demos/product_web/" element={<ProductLanding />} />
      </Routes>
    </Router>
  )
}

export default App