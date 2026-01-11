import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { MonitorPlay, ExternalLink, Loader2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LiveDemos() {
  const [demos, setDemos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDemos = async () => {
      // Stáhneme data z nové tabulky live_demos
      const { data, error } = await supabase
        .from('live_demos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setDemos(data || [])
      setLoading(false)
    }

    fetchDemos()
  }, [])

  // Pokud nejsou žádná dema, sekci vůbec nezobrazujeme
  if (!loading && demos.length === 0) return null

  return (
    <section id="livedemos" className="py-20 relative overflow-hidden">
      {/* Pozadí - jemný gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Demos</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Ukázky živých projektů a aplikací, které si můžete ihned vyzkoušet.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin"/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {demos.map((demo, index) => (
              <motion.div 
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#1e293b]/40 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition duration-300">
                        <MonitorPlay className="w-6 h-6" />
                    </div>
                    <a 
                        href={demo.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 text-slate-500 hover:text-white transition"
                        title="Otevřít v novém okně"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                    {demo.description}
                </p>

                <a 
                    href={demo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                    Spustit Demo <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}