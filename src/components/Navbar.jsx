import { useState, useEffect } from 'react'
import { Terminal, Menu, X, ArrowRight, Lock, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useNavigate, useLocation } from 'react-router-dom' // Přidáno

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [user, setUser] = useState(null)
  
  const navigate = useNavigate() // Pro přepínání stránek
  const location = useLocation() // Abychom věděli, kde jsme

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  // Funkce pro hladké scrollování bez # v URL
  const scrollToSection = (sectionId) => {
    setIsOpen(false) // Zavřít mobilní menu
    
    // Pokud jsme na hlavní stránce, jen sjedeme dolů
    if (location.pathname === '/') {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    } else {
        // Pokud jsme jinde (Admin/Login), musíme jít na hlavní stránku
        navigate(`/#${sectionId}`)
    }
  }

  const links = [
    { name: 'Služby', id: 'sluzby' },
    { name: 'Projekty', id: 'portfolio' },
    { name: 'Tech Stack', id: 'tech' },
  ]

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-auto max-w-5xl z-50">
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 shadow-2xl shadow-blue-900/10 flex justify-between items-center md:gap-8">
          
          {/* LOGO - kliknutí scrolluje nahoru */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 pl-2 group">
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
                onClick={() => scrollToSection(link.id)} // Použijeme naši funkci místo href
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
              
              <div className="h-px bg-white/10 my-2"></div>

              {user ? (
                  <a href="/admin" className="flex items-center justify-center gap-2 w-full py-3 bg-green-600/20 text-green-400 border border-green-500/20 font-bold rounded-xl">
                      <LayoutDashboard className="w-4 h-4" /> Správa Webu
                  </a>
              ) : (
                  <a href="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/10">
                      <Lock className="w-4 h-4" /> Přihlášení
                  </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}