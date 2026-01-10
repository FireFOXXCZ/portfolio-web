import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Code2, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-[500px] rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col h-full bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] hover:-translate-y-2 overflow-hidden">
                  
                  {/* Dekorace na pozadí */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-blue-500/10"></div>
                  
                  {/* Hlavička karty */}
                  <div className="mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-6 text-blue-400 border border-white/5 group-hover:scale-110 transition duration-300 shadow-inner">
                        <Code2 className="w-6 h-6" />
                      </div>
                      
                      {/* Vykreslení TAGŮ (pokud existují) */}
                      {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                              {product.tags.map((tag, i) => (
                                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      )}

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition">{product.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {product.description || "Kompletní řešení na míru."}
                      </p>
                  </div>
                  
                  {/* Cena a patička */}
                  <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cena balíčku</p>
                        <div className="flex items-baseline gap-2 flex-wrap">
                            {/* Změna: whitespace-nowrap zabrání rozlomení ceny */}
                            <span className="text-3xl font-bold text-white whitespace-nowrap">{product.price}</span>
                            {/* Zobrazíme text za cenou jen pokud to dává smysl */}
                            {/\d/.test(product.price) && <span className="text-sm text-slate-500 font-medium">/ projekt</span>}
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
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      Mám zájem
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* STRÁNKOVÁNÍ */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-16">
                    <button onClick={prevPage} disabled={currentPage === 1} className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white border border-white/5 backdrop-blur-sm"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-slate-400 font-mono text-sm tracking-widest">STRANA <span className="text-white font-bold">{currentPage}</span> / {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white border border-white/5 backdrop-blur-sm"><ChevronRight className="w-5 h-5" /></button>
                </div>
            )}
          </>
        )}
    </section>
  )
}