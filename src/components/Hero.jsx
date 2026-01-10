import { Zap, Layout, Code2, Database, ShieldCheck, Server } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <>
      <header className="pt-48 pb-32 px-6 text-center max-w-5xl mx-auto relative">
        
        {/* Animovaný štítek */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Open for work
        </motion.div>
        
        {/* Nadpis */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }} // Zpoždění 0.1s
          className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight"
        >
          Stavím digitální produkty <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">budoucnosti.</span>
        </motion.h1>
        
        {/* Podnadpis */}
       <motion.p 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
       >
         Full-stack vývojář se zaměřením na rychlost, bezpečnost a škálovatelnost.
         Přetvářím nápady v moderní webové aplikace pomocí <strong>Reactu a cloudových technologií.</strong>
       </motion.p>
        
        {/* Tlačítka */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a href="sluzby" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Spolupracovat
          </a>
          <a href="#portfolio" className="px-8 py-4 bg-[#1e293b] hover:bg-[#283548] border border-white/10 rounded-xl font-bold transition flex items-center justify-center gap-2">
            <Layout className="w-5 h-5" />
            Moje práce
          </a>
        </motion.div>
      </header>

      {/* Tech Stack - Postupné objevování ikon */}
      <section id="tech" className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-8">Používané technologie</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             {[
               { icon: Code2, label: "React", color: "text-blue-400" },
               { icon: Database, label: "Supabase", color: "text-green-400" },
               { icon: ShieldCheck, label: "Retool", color: "text-purple-400" },
               { icon: Server, label: "Node.js", color: "text-orange-400" }
             ].map((tech, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, scale: 0.5 }}
                 whileInView={{ opacity: 1, scale: 1 }} // Animuje se až když na to scroluješ
                 transition={{ delay: index * 0.1 }}
                 className="flex items-center gap-2 text-xl font-bold"
               >
                 <tech.icon className={tech.color}/> {tech.label}
               </motion.div>
             ))}
          </div>
        </div>
      </section>
    </>
  )
}