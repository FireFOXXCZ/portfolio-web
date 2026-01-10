import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Code2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Services() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()
  const location = useLocation()

  // --- NASTAVENÍ STRÁNKOVÁNÍ ---
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*').order('price', { ascending: true })
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
    <section id="sluzby" className="py-32 px-6 max-w-6xl mx-auto">
        
        {/* Čistší a modernější hlavička */}
        <div className="text-center mb-20">
           <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
             Ceník Služeb
           </h2>
           <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             Transparentní ceny bez skrytých poplatků. Vyberte si balíček, který nejlépe odpovídá vašim potřebám, nebo mi napište o individuální nabídku.
           </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {/* GRID SLUŽEB */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
              {currentProducts.map((product) => (
                <div key={product.id} className="group p-8 rounded-3xl bg-[#1e293b]/40 border border-white/5 hover:border-blue-500/50 hover:bg-[#1e293b]/60 transition duration-300 relative overflow-hidden flex flex-col h-full shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1">
                  
                  {/* Efekt na pozadí */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-blue-500/20"></div>
                  
                  {/* Ikona */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition border border-blue-500/10">
                    <Code2 className="w-7 h-7" />
                  </div>

                  {/* Název a Popis */}
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed flex-1">
                    {product.description || "Kompletní řešení na míru včetně nasazení a základní podpory."}
                  </p>
                  
                  {/* Cena a Tlačítko */}
                  <div className="mt-auto border-t border-white/5 pt-8">
                    <div className="flex items-end gap-1 mb-6">
                        <span className="text-3xl font-bold text-white">{product.price.toLocaleString()} Kč</span>
                        <span className="text-slate-500 text-sm mb-1">/ projekt</span>
                    </div>
                    
                    {/* --- ZMĚNA ZDE --- */}
                    <button 
                        onClick={() => {
                            // 1. Přejdeme na hlavní stránku s parametrem ?service=ID a kotvou #kontakt
                            navigate(`/?service=${product.id}#kontakt`)
                            
                            // 2. Ruční scroll (pojistka, kdyby router ignoroval hash)
                            setTimeout(() => {
                                const element = document.getElementById('kontakt');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group/btn"
                    >
                      Mám zájem
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* STRÁNKOVÁNÍ */}
            <div className="flex justify-center items-center gap-6 mt-16">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white border border-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-slate-400 font-mono text-sm tracking-widest">
                STRANA <span className="text-white font-bold">{currentPage}</span> / {totalPages}
              </span>

              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white border border-white/5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </section>
  )
}