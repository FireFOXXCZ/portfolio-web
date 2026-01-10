import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { ChevronLeft, ChevronRight, Sparkles, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Services() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()

  // --- NASTAVENÍ STRÁNKOVÁNÍ ---
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

  // --- LOGIKA STRÁNKOVÁNÍ ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1) }

  return (
    <section id="sluzby" className="py-32 px-6 max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/20">
              <Sparkles className="w-3 h-3"/> Ceník & Balíčky
           </div>
           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
             Investice do vaší <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">budoucnosti</span>
           </h2>
           <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
             Transparentní ceny. Žádné skryté poplatky. Vyberte si řešení, které vás posune dál.
           </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-[500px] rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col h-full bg-[#0f172a] border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.15)] hover:-translate-y-2 overflow-hidden">
                  
                  {/* Dekorace na pozadí */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 transition group-hover:bg-blue-600/10 pointer-events-none"></div>
                  
                  {/* Hlavička karty */}
                  <div className="mb-6 relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <Code2 className="w-5 h-5" />
                          </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-400 transition">{product.name}</h3>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 border-l-2 border-white/5 pl-4">
                        {product.description || "Kompletní řešení na míru."}
                      </p>

                      {/* --- TAGY --- */}
                      {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                              {product.tags.map((tag, i) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10 group-hover:border-blue-500/30 group-hover:text-slate-200 transition-colors">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      )}
                  </div>
                  
                  {/* Cena a patička */}
                  <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Celková investice</p>
                        
                        {/* --- CENA (ZMENŠENO PÍSMO) --- */}
                        <div className="flex flex-row items-baseline gap-1.5 flex-nowrap overflow-hidden">
                            {/* Změna: text-2xl a na velkých monitorech xl:text-3xl */}
                            <span className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight whitespace-nowrap shadow-black drop-shadow-sm">
                                {product.price}
                            </span>
                            
                            {/\d/.test(product.price) && (
                                <span className="text-xs text-slate-500 font-medium whitespace-nowrap shrink-0">
                                    / projekt
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
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      Mám zájem
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* STRÁNKOVÁNÍ */}
            <div className="flex justify-center items-center gap-6 mt-20">
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1} 
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition text-white border border-white/5 backdrop-blur-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-slate-400 font-mono text-sm tracking-widest">
                    STRANA <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                </span>
                
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages} 
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition text-white border border-white/5 backdrop-blur-sm"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
          </>
        )}
    </section>
  )
}