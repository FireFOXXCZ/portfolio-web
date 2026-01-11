import { useState, useEffect } from 'react'
import { Terminal, Menu, X, ArrowRight, Lock, LayoutDashboard, MonitorPlay, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ isDarkMode, toggleTheme }) {
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

  const handleLogoClick = () => {
    if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        navigate('/')
    }
  }

  const links = [
    { name: 'Služby', id: 'sluzby' },
    { name: 'Projekty', id: 'portfolio' },
    { name: 'Recenze', id: 'recenze' },
  ]

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-auto max-w-5xl z-50 transition-all duration-500">
        <div className={`${isDarkMode ? 'bg-[#0f172a]/60 border-white/10' : 'bg-white/70 border-slate-200'} backdrop-blur-xl border rounded-full px-4 py-2.5 shadow-2xl flex justify-between items-center md:gap-6`}>
          
          {/* LOGO */}
          <button onClick={handleLogoClick} className="flex items-center gap-2 pl-2 group">
            <div className={`p-1.5 rounded-lg transition ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-600/10'}`}>
                <Terminal className={`${isDarkMode ? 'text-blue-500' : 'text-blue-600'} w-5 h-5`} />
            </div>
            <span className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>FireFOXX</span>
          </button>

          {/* DESKTOP MENU */}
          <div className={`hidden md:flex items-center gap-1 p-1 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
            {links.map((link, index) => (
              <button 
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-5 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-white shadow-sm'}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </button>
            ))}

            {hasDemos && (
                <button 
                    onClick={() => scrollToSection('livedemos')}
                    className="relative px-4 py-2 ml-1 text-sm font-bold text-indigo-500 hover:opacity-80 transition-colors flex items-center gap-2 rounded-full"
                >
                    <MonitorPlay className="w-4 h-4" />
                    <span>Demos</span>
                </button>
            )}
          </div>

          {/* PRAVÁ ČÁST (Theme Toggle + Auth) */}
          <div className="flex items-center gap-2">
            
            {/* MODERN THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 border ${isDarkMode ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-yellow-400/10' : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-indigo-50'}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: 10, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -10, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button onClick={() => scrollToSection('kontakt')} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition group shadow-lg shadow-blue-600/20">
              <span>Kontakt</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </button>

            <div className="w-px h-6 bg-slate-500/20 mx-1 hidden md:block"></div>

            {user ? (
                <a href="/admin" className={`p-2.5 rounded-full transition border ${isDarkMode ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                </a>
            ) : (
                <a href="/login" className={`p-2.5 rounded-full transition ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    <Lock className="w-4 h-4" />
                </a>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2.5 rounded-full transition border ${isDarkMode ? 'text-slate-300 border-white/10 hover:bg-white/10' : 'text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILNÍ MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 10 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`absolute top-full left-0 w-full border rounded-3xl p-6 md:hidden flex flex-col gap-4 shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/90 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'} backdrop-blur-xl`}
            >
              {links.map((link) => (
                 <button key={link.name} onClick={() => scrollToSection(link.id)} className={`flex items-center justify-between p-4 rounded-xl transition font-medium w-full text-left ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    {link.name}
                 </button>
              ))}
              <div className="h-px bg-slate-500/10 my-1"></div>
              <button 
                onClick={() => scrollToSection('kontakt')} 
                className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white font-bold rounded-2xl transition shadow-xl"
              >
                <span>Napsat mi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}