import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { ChevronLeft, ChevronRight, Sparkles, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// PŘIJÍMÁ PROPS: t (překlady), lang (aktuální jazyk)
export default function Services({ isDarkMode, t, lang }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()

  // --- KURZ EURA (upraveno na 24) ---
  const EXCHANGE_RATE = 24; 

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3 

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) throw error
      setProducts(data)
    } catch (error) {
      console.error("Chyba:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1) }

  return (
    <section id="sluzby" className="py-32 px-6 max-w-7xl mx-auto transition-colors duration-500">
        
        <div className="text-center mb-20">
           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border transition-colors ${
             isDarkMode 
             ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
             : 'bg-blue-50 text-blue-600 border-blue-200'
           }`}>
              <Sparkles className="w-3 h-3"/> {t?.title || 'Ceník & Balíčky'}
           </div>
           <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
             {lang === 'en' ? 'Invest in your ' : 'Investice do vaší '} 
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                {lang === 'en' ? 'future' : 'budoucnosti'}
             </span>
           </h2>
           <p className={`max-w-2xl mx-auto text-lg leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
             {t?.subtitle || 'Transparentní ceny. Žádné skryté poplatky.'}
           </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className={`h-[500px] rounded-3xl animate-pulse border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-200 border-slate-200'}`}></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProducts.map((product) => {
                
                /* --- LOGIKA TEXTŮ --- */
                const displayName = lang === 'en' ? (product.name_en || product.name) : product.name;
                const displayDesc = lang === 'en' ? (product.description_en || product.description) : product.description;
                const displayTags = lang === 'en' ? (product.tags_en && product.tags_en.length > 0 ? product.tags_en : product.tags) : product.tags;

                /* --- VÝPOČET CENY (PRO ROZSAHY A TEXT) --- */
                let displayPrice = product.price;

                if (lang === 'en') {
                    // Regex najde čísla v textu (např. "1 500" i "4 500" zvlášť)
                    const matches = String(product.price).match(/(\d[\d\s]*\d|\d+)/g);

                    if (matches && matches.length > 0) {
                        const eurValues = matches.map(match => {
                            // Odstraníme mezery ("1 500" -> 1500) a převedeme na číslo
                            const rawNum = parseInt(match.replace(/\s/g, ''), 10);
                            // Vydělíme kurzem a zaokrouhlíme nahoru
                            return Math.ceil(rawNum / EXCHANGE_RATE);
                        });

                        if (eurValues.length === 2) {
                            // Je to rozsah (např. 63 - 188)
                            displayPrice = `€${eurValues[0]} – €${eurValues[1]}`;
                        } else if (eurValues.length === 1) {
                            // Je to jedno číslo
                            displayPrice = `€${eurValues[0]}`;
                        }
                    }
                }
                // Pokud je jazyk CZ, zůstane původní text z databáze ("1 500 – 4 500 Kč")

                return (
                <div key={product.id} className={`group relative flex flex-col h-full border rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 overflow-hidden ${
                  isDarkMode 
                  ? 'bg-[#0f172a] border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.15)]' 
                  : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-400 hover:shadow-blue-200/50'
                }`}>
                  
                  <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 transition pointer-events-none ${isDarkMode ? 'bg-blue-600/5 group-hover:bg-blue-600/10' : 'bg-blue-400/10 group-hover:bg-blue-400/20'}`}></div>
                  
                  <div className="mb-6 relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                            isDarkMode 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : 'bg-blue-50 text-blue-600 border-blue-200'
                          }`}>
                            <Code2 className="w-5 h-5" />
                          </div>
                      </div>

                      <h3 className={`text-2xl font-bold mb-4 tracking-tight group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{displayName}</h3>
                      
                      <p className={`text-sm leading-relaxed mb-8 border-l-2 pl-4 transition-colors ${
                        isDarkMode ? 'text-slate-400 border-white/5' : 'text-slate-600 border-slate-200'
                      }`}>
                        {displayDesc || (lang === 'en' ? "Complete custom solution." : "Kompletní řešení na míru.")}
                      </p>

                      {displayTags && displayTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                              {displayTags.map((tag, i) => (
                                  <span key={i} className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                                    isDarkMode 
                                    ? 'bg-white/5 text-slate-400 border-white/10 group-hover:text-slate-200' 
                                    : 'bg-slate-100 text-slate-500 border-slate-200 group-hover:text-slate-800'
                                  }`}>
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      )}
                  </div>
                  
                  <div className={`mt-8 pt-8 border-t relative z-10 transition-colors ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                            {lang === 'en' ? 'Total Investment' : 'Celková investice'}
                        </p>
                        
                        {/* ZDE BLA ÚPRAVA VELIKOSTI PÍSMA */}
                        <div className="flex flex-row items-baseline gap-1 flex-nowrap overflow-hidden">
                            <span className={`text-xl md:text-2xl font-extrabold tracking-tight whitespace-nowrap drop-shadow-sm transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {displayPrice}
                            </span>
                            
                            {/* Zobrazíme "/ projekt" jen pokud text obsahuje nějaké číslo */}
                            {/\d/.test(product.price) && (
                                <span className={`text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {lang === 'en' ? ' / project' : ' / projekt'}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            navigate(`/?service=${product.id}#kontakt`)
                            setTimeout(() => {
                                const element = document.getElementById('kontakt');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
                    >
                      {t?.button || (lang === 'en' ? "I'm interested" : "Mám zájem")}
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
                )
              })}
            </div>

            <div className="flex justify-center items-center gap-6 mt-20">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1} 
                    className={`p-4 rounded-full border backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                      isDarkMode 
                      ? 'bg-white/5 text-white border-white/5 hover:bg-white/10' 
                      : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-md'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className={`font-mono text-sm tracking-widest transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang === 'en' ? 'PAGE' : 'STRANA'} <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentPage}</span> / {totalPages}
                </span>
                
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages} 
                    className={`p-4 rounded-full border backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                      isDarkMode 
                      ? 'bg-white/5 text-white border-white/5 hover:bg-white/10' 
                      : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-md'
                    }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
          </>
        )}
    </section>
  )
}