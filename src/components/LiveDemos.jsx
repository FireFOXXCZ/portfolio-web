import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { MonitorPlay, ExternalLink, Loader2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

// PŘIJÍMÁ PROPS: t (překlady), lang (aktuální jazyk)
export default function LiveDemos({ isDarkMode, t, lang }) {
  const [demos, setDemos] = useState([])
  const [loading, setLoading] = useState(true)
  
  // STAV PRO STRÁNKOVÁNÍ
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3

  useEffect(() => {
    const fetchDemos = async () => {
      const { data, error } = await supabase
        .from('live_demos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setDemos(data || [])
      setLoading(false)
    }

    fetchDemos()
  }, [])

  // Výpočet položek pro aktuální stránku
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentDemos = demos.slice(indexOfFirstItem, indexOfLastItem)
  
  // Spočítáme celkový počet stránek
  const totalPages = Math.max(1, Math.ceil(demos.length / ITEMS_PER_PAGE))

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1) }

  if (!loading && demos.length === 0) return null

  return (
    <section id="demos" className="py-20 relative overflow-hidden transition-colors duration-500">
      {/* Pozadí záře */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className={`absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] transition-opacity duration-500 ${isDarkMode ? 'bg-indigo-600/10 opacity-30' : 'bg-indigo-400/5 opacity-20'}`}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 tracking-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t?.title?.split(' ')[0] || 'Live'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">{t?.title?.split(' ')[1] || 'Demos'}</span>
          </h2>
          <p className={`max-w-2xl mx-auto transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t?.subtitle || 'Ukázky živých projektů a aplikací, které si můžete ihned vyzkoušet.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin"/></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {currentDemos.map((demo, index) => {
                    let finalUrl = demo.url;
                    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                    if (isLocalhost && finalUrl.endsWith('/') && !finalUrl.includes('index.html')) {
                        finalUrl += 'index.html';
                    }

                    /* --- LOGIKA PŘEPÍNÁNÍ JAZYKA --- */
                    const displayTitle = lang === 'en' ? (demo.title_en || demo.title) : demo.title;
                    const displayDesc = lang === 'en' ? (demo.description_en || demo.description) : demo.description;

                    return (
                        <motion.div 
                            key={demo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative border backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
                                isDarkMode 
                                ? 'bg-[#1e293b]/40 border-white/5 hover:border-indigo-500/30 shadow-2xl shadow-black/20' 
                                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-300'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl transition duration-300 ${
                                    isDarkMode 
                                    ? 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white' 
                                    : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                                }`}>
                                    <MonitorPlay className="w-6 h-6" />
                                </div>
                                <a 
                                    href={finalUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`p-2 transition ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-indigo-600'}`}
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{displayTitle}</h3>
                            <p className={`text-sm leading-relaxed mb-6 flex-1 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {displayDesc}
                            </p>

                            <a 
                                href={finalUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-all ${
                                    isDarkMode 
                                    ? 'bg-white/5 hover:bg-indigo-600 text-white' 
                                    : 'bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700'
                                }`}
                            >
                                {t?.view_live || 'Spustit Demo'} <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    )
                })}
            </div>

            {/* OVLÁDÁNÍ STRÁNKOVÁNÍ */}
            <div className="flex justify-center items-center gap-4 mt-12">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className={`p-3 rounded-full border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                        isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-md'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className={`px-4 py-2 rounded-xl border shadow-inner transition-colors ${
                    isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-slate-100 border-slate-200'
                }`}>
                    <span className={`text-sm font-mono font-bold transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {currentPage} <span className={isDarkMode ? 'text-slate-600' : 'text-slate-400'}>/</span> {totalPages}
                    </span>
                </div>

                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className={`p-3 rounded-full border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                        isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-md'
                    }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}