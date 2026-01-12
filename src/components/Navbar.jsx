import { useState, useEffect } from 'react'
import { Terminal, Menu, X, ArrowRight, Lock, LayoutDashboard, MonitorPlay, Sun, Moon, Languages } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ isDarkMode, toggleTheme, lang, toggleLang, t }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [user, setUser] = useState(null)
  const [hasDemos, setHasDemos] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    const checkDemos = async () => {
      const { count } = await supabase.from('live_demos').select('*', { count: 'exact', head: true })
      setHasDemos(count > 0)
    }
    checkUser()
    checkDemos()
  }, [])

  // Funkce pro scrollování na sekce
  const scrollToSection = (sectionId) => {
    setIsOpen(false)
    if (location.pathname === '/') {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
    } else {
        navigate(`/#${sectionId}`)
        setTimeout(() => {
            const element = document.getElementById(sectionId)
            if (element) element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }
  }

  // Funkce pro kliknutí na logo (Scroll nahoru)
  const handleLogoClick = () => {
      if (location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
          navigate('/')
      }
  }

  // --- SESTAVENÍ ODKAZŮ ---
  const links = [
    { name: t.services, id: 'sluzby', type: 'standard' },
    { name: t.projects, id: 'portfolio', type: 'standard' },
    // Zde vložíme speciální odkaz, pokud existují dema
    ...(hasDemos ? [{ 
        name: (lang === 'cz' ? 'Živé Ukázky' : 'Live Demos'), 
        id: 'demos', 
        type: 'special' 
    }] : []),
    { name: t.reviews, id: 'recenze', type: 'standard' },
  ]

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-auto max-w-6xl z-50 transition-all duration-500">
      <div className={`${isDarkMode ? 'bg-[#0f172a]/60 border-white/10' : 'bg-white/70 border-slate-200'} backdrop-blur-xl border rounded-full px-4 py-2.5 shadow-2xl flex justify-between items-center md:gap-4`}>
        
        {/* LOGO */}
        <button onClick={handleLogoClick} className="flex items-center gap-2 pl-2 group">
          <div className={`p-1.5 rounded-lg transition ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-600/10'}`}>
              <Terminal className={`${isDarkMode ? 'text-blue-500' : 'text-blue-600'} w-5 h-5`} />
          </div>
          <span className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            FireFOXX<span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>.Dev</span>
          </span>
        </button>

        {/* DESKTOP MENU */}
        <div className={`hidden md:flex items-center gap-1 p-1 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          {links.map((link, index) => {
            
            // POKUD JE TO SPECIÁLNÍ "DEMO" ODKAZ (FIALOVÝ STYL)
            if (link.type === 'special') {
                return (
                    <button 
                        key={link.id}
                        onClick={() => scrollToSection(link.id)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all border font-bold text-xs uppercase tracking-wide whitespace-nowrap ml-1 mr-1 ${
                            isDarkMode 
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]' 
                            : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 shadow-sm'
                        }`}
                    >
                        <MonitorPlay className="w-3.5 h-3.5" />
                        <span>{link.name}</span>
                    </button>
                )
            }

            // STANDARDNÍ ODKAZY
            return (
                <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-5 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                >
                {hoveredIndex === index && (
                    <motion.div layoutId="navbar-hover" className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-white shadow-sm'}`} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10">{link.name}</span>
                </button>
            )
          })}
        </div>

        {/* PRAVÁ ČÁST - PŘEPÍNAČE */}
        <div className="flex items-center gap-2">
          
          <button 
            onClick={toggleLang}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border font-bold text-[10px] uppercase tracking-tighter ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-blue-600 hover:bg-slate-200'}`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'cz' ? 'EN' : 'CZ'}</span>
          </button>

          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-yellow-400' : 'bg-slate-100 border-slate-200 text-indigo-600'}`}
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* TLAČÍTKO "NAPSAT MI" - ZDE JE OPRAVA (whitespace-nowrap a px-6) */}
          <button onClick={() => scrollToSection('kontakt')} className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition shadow-lg shadow-blue-600/20 whitespace-nowrap">
            <span>{lang === 'cz' ? 'Napsat mi' : 'Contact Me'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* UŽIVATEL: LOGIN vs ADMIN */}
          {user ? (
              <a href="/admin" title="Admin Dashboard" className={`p-2.5 rounded-full transition border ${isDarkMode ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white'}`}>
                  <LayoutDashboard className="w-4 h-4" />
              </a>
          ) : (
              <a href="/login" title="Přihlášení" className={`p-2.5 rounded-full transition border ${isDarkMode ? 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-900'}`}>
                  <Lock className="w-4 h-4" />
              </a>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2.5 rounded-full transition border ${isDarkMode ? 'text-slate-300 border-white/10' : 'text-slate-600 border-slate-200'}`}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className={`absolute top-full left-0 w-full border rounded-3xl p-6 md:hidden flex flex-col gap-2 shadow-2xl ${isDarkMode ? 'bg-[#1e293b]/90 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'} backdrop-blur-xl`}>
            {links.map((link) => (
               <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)} 
                className={`p-4 rounded-xl font-medium w-full text-left transition-colors flex items-center gap-3
                    ${link.type === 'special' 
                        ? (isDarkMode ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600 border border-purple-200')
                        : 'hover:bg-white/5'
                    }
                `}
               >
                 {link.type === 'special' && <MonitorPlay className="w-5 h-5" />}
                 {link.name}
               </button>
            ))}

            <button onClick={() => scrollToSection('kontakt')} className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl">{t.contact}</button>
            
            {!user && (
                <a href="/login" className="flex items-center justify-center gap-2 w-full py-3 mt-2 border rounded-2xl font-bold text-sm opacity-70 hover:opacity-100 transition">
                    <Lock className="w-4 h-4" /> Přihlášení
                </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}