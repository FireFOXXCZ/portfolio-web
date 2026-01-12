import { Zap, Layout, Code2, Database, Palette, Globe, Box, GitBranch, FileJson, Braces, Wrench, Server, Layers, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Hero({ isDarkMode, t }) {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  const techCategories = [
    {
      title: t.categories.frontend,
      icon: Layout,
      color: "from-blue-500/20",
      items: [
        { icon: Globe, label: "HTML5" },
        { icon: Palette, label: "CSS3" },
        { icon: Braces, label: "JavaScript" },
        { icon: Code2, label: "React 19" },
        { icon: Zap, label: "Tailwind 4" },
      ]
    },
    {
      title: t.categories.backend,
      icon: Server,
      color: "from-emerald-500/20",
      items: [
        { icon: Server, label: "PHP / Laravel" },
        { icon: Database, label: "SQL / Postgres" },
        { icon: Server, label: "Node.js" },
        { icon: Database, label: "Supabase" },
      ]
    },
    {
      title: t.categories.tools,
      icon: Wrench,
      color: "from-purple-500/20",
      items: [
        { icon: Box, label: "Docker" },
        { icon: GitBranch, label: "Git / GitHub" },
        { icon: Globe, label: "Next.js" },
        { icon: FileJson, label: "TypeScript" },
      ]
    }
  ]

  const mainStack = [
    { name: 'React 19', icon: Code2, color: 'text-blue-400', lightColor: 'text-blue-600', dotColor: 'bg-blue-400', bg: 'bg-blue-500/10', lightBg: 'bg-blue-50', border: 'border-blue-500/20', lightBorder: 'border-blue-200' },
    { name: 'Tailwind 4', icon: Palette, color: 'text-cyan-400', lightColor: 'text-cyan-600', dotColor: 'bg-cyan-400', bg: 'bg-cyan-500/10', lightBg: 'bg-cyan-50', border: 'border-cyan-500/20', lightBorder: 'border-cyan-200' },
    { name: 'Supabase', icon: Database, color: 'text-emerald-400', lightColor: 'text-emerald-600', dotColor: 'bg-emerald-400', bg: 'bg-emerald-500/10', lightBg: 'bg-emerald-50', border: 'border-emerald-500/20', lightBorder: 'border-emerald-200' },
  ]

  return (
    <>
      <section className="relative pt-48 pb-20 px-6 overflow-hidden transition-colors duration-500">
        <div className={`absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDarkMode ? 'opacity-100' : 'opacity-60'}`}></div>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/10'}`}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border ${isDarkMode ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : 'border-blue-200 bg-blue-50 text-blue-600'} text-xs font-bold uppercase tracking-widest`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
            </span>
            {t.badge}
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.1] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.title_top} <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{t.title_gradient}</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-6 mb-16">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
              <Cpu className="w-3 h-3" />
              <span>{t.engine}</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
              {mainStack.map((tech, i) => (
                <div key={tech.name} className="flex items-center gap-3 md:gap-6">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }} className={`group relative flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all ${isDarkMode ? `${tech.bg} ${tech.border}` : `${tech.lightBg} ${tech.lightBorder}`}`}>
                    <tech.icon className={`w-5 h-5 ${isDarkMode ? tech.color : tech.lightColor}`} />
                    <span className={`text-sm font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{tech.name}</span>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-white">
            <button onClick={() => scrollToSection('sluzby')} className={`group px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
              <Zap className="w-5 h-5 fill-current" /> {t.cta_primary}
            </button>
            <button onClick={() => scrollToSection('portfolio')} className={`px-8 py-4 backdrop-blur-md border rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-[#1e293b]/50 border-white/10 text-white hover:bg-white/5' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}>
              <Layout className="w-5 h-5" /> {t.cta_secondary}
            </button>
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className={`py-24 border-y ${isDarkMode ? 'border-white/5 bg-[#020617]' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg mb-4 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Layers className="w-3 h-3" /> 
              <span>{t.expertise_badge}</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.expertise_title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techCategories.map((category, catIndex) => (
              <motion.div key={catIndex} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: catIndex * 0.1 }} className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? `bg-gradient-to-b ${category.color} to-transparent border-white/5` : 'bg-white border-slate-200 shadow-xl'}`}>
                <div className="flex items-center gap-4 mb-10">
                   <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                      <category.icon className="w-6 h-6" />
                   </div>
                   <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{category.title}</h3>
                </div>

                <div className="flex flex-col gap-6">
                  {category.items.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center gap-4 cursor-default">
                      <div className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <tech.icon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{tech.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}