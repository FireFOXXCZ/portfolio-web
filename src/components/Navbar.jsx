import { useState, useEffect } from 'react'
import { Terminal, Menu, X, ArrowRight, Lock, LayoutDashboard, MonitorPlay } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [user, setUser] = useState(null)
  const [hasDemos, setHasDemos] = useState(false) // Nový stav: Máme dema?
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 1. Kontrola uživatele
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    // 2. Kontrola, zda existují nějaká Live Demos
    const checkDemos = async () => {
      // Stáhneme pouze počet (count), ne data, abychom šetřili výkon
      const { count } = await supabase
        .from('live_demos')
        .select('*', { count: 'exact', head: true })
      
      // Pokud je počet větší než 0, tlačítko zobrazíme
      setHasDemos(count > 0)
    }

    checkUser()
    checkDemos()
  }, [])

  const scrollToSection = (sectionId) => {
    setIsOpen(false)
    if (location.pathname === '/') {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    } else {
        navigate(`/#${sectionId}`)
        // Zpoždění pro načtení, pokud jdeme z jiné stránky
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
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-auto max-w-5xl z-50">
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 shadow-2xl shadow-blue-900/10 flex justify-between items-center md:gap-8">
          
          {/* LOGO */}
          <button onClick={handleLogoClick} className="flex items-center gap-2 pl-2 group">
            <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition">
                <Terminal className="text-blue-500 w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">FireFOXX</span>
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {links.map((link, index) => (
              <button 
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="relative px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </button>
            ))}

            {/* ZOBRAZIT TLAČÍTKO JEN POKUD EXISTUJÍ DEMA */}
            {hasDemos && (
                <button 
                    onClick={() => scrollToSection('livedemos')}
                    className="relative px-4 py-2 ml-1 text-sm font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-2 hover:bg-indigo-600/20 rounded-full"
                >
                    <MonitorPlay className="w-4 h-4" />
                    <span>Live Demos</span>
                </button>
            )}
          </div>

          {/* PRAVÁ ČÁST */}
          <div className="flex items-center gap-3">
            <button onClick={() => scrollToSection('kontakt')} className="hidden md:flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition group">
              <span>Napsat mi</span>
              <span className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition">
                  <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            {user ? (
                <a href="/admin" className="p-2.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-full transition border border-green-500/20">
                    <LayoutDashboard className="w-4 h-4" />
                </a>
            ) : (
                <a href="/login" className="p-2.5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
                    <Lock className="w-4 h-4" />
                </a>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition">
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
              className="absolute top-full left-0 w-full bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:hidden flex flex-col gap-4 shadow-2xl overflow-hidden"
            >
              {links.map((link) => (
                 <button key={link.name} onClick={() => scrollToSection(link.id)} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition font-medium w-full text-left">
                    {link.name}
                 </button>
              ))}
              
              {/* ODKAZ NA LIVE DEMOS V MOBILNÍM MENU - JEN KDYŽ JSOU DEMA */}
              {hasDemos && (
                  <button 
                    onClick={() => scrollToSection('livedemos')} 
                    className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 text-indigo-300 hover:text-white transition font-bold w-full text-left border border-indigo-500/20"
                  >
                      <span className="flex items-center gap-2">
                        <MonitorPlay className="w-4 h-4"/> Live Demos
                      </span>
                      <ArrowRight className="w-4 h-4"/>
                  </button>
              )}

              <div className="h-px bg-white/10 my-2"></div>
              
              <button 
                onClick={() => scrollToSection('kontakt')} 
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
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