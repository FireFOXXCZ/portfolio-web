import { Zap, Layout, Code2, Database, Server, Palette, FileJson, Container, GitBranch, Cpu, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  // Rozšířený seznam technologií, aby bylo vidět, že děláš ve všem
  const technologies = [
    { icon: Code2, label: "React" },
    { icon: FileJson, label: "TypeScript" },
    { icon: Server, label: "Node.js" },
    { icon: Database, label: "Supabase" },
    { icon: Palette, label: "Tailwind" },
    { icon: Container, label: "Docker" },
    { icon: Globe, label: "Next.js" },
    { icon: GitBranch, label: "Git" },
  ]

  return (
    <>
      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        
        {/* Pozadí - mřížka a záře */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Animovaný štítek */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Open for work
          </motion.div>
          
          {/* Hlavní Nadpis */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.1] tracking-tight text-white"
          >
            Stavím digitální produkty <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              budoucnosti.
            </span>
          </motion.h1>
          
          {/* Podnadpis */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Full-stack vývojář. Nezáleží na technologii, ale na výsledku.
            Dokážu se přizpůsobit jakémukoliv stacku.
            <br className="hidden md:block" />
            <span className="text-slate-500 text-sm mt-2 block">
              (Tento web běží na moderním stacku: React, Tailwind a Supabase)
            </span>
          </motion.p>
          
          {/* Tlačítka */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
              onClick={() => scrollToSection('sluzby')} 
              className="group px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-black group-hover:text-orange-600 transition-colors" />
              Spolupracovat
            </button>

            <button 
              onClick={() => scrollToSection('portfolio')} 
              className="px-8 py-4 bg-[#1e293b]/50 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-xl font-bold transition flex items-center justify-center gap-2 text-white hover:bg-white/5"
            >
              <Layout className="w-5 h-5" />
              Moje práce
            </button>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack - Moderní Grid */}
      <section className="py-12 border-y border-white/5 bg-[#0f172a]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs md:text-sm text-slate-500 uppercase tracking-[0.2em] mb-10 font-bold">
            Technologie & Nástroje, které ovládám
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 md:gap-x-16 opacity-80">
              {technologies.map((tech, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center gap-3 group cursor-default"
                >
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition duration-300">
                    <tech.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition duration-300"/> 
                  </div>
                  <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-300 transition">{tech.label}</span>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}