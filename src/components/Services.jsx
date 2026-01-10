import { useEffect, useState } from 'react'
import { supabase } from '../supabase' // Pozor na ty dvě tečky (jdeme o složku výš)
import { Code2 } from 'lucide-react'

export default function Services() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <section id="sluzby" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ceník Služeb</h2>
            <p className="text-slate-400 max-w-md">Transparentní ceny. Data načítána živě z backendu.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500 uppercase">Backend Status</p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group p-8 rounded-2xl bg-[#1e293b]/50 border border-white/5 hover:border-blue-500/50 hover:bg-[#1e293b] transition duration-300 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition group-hover:bg-blue-500/20"></div>
                
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition">
                  <Code2 />
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Kompletní řešení včetně nasazení.
                </p>
                
                <div className="mt-auto border-t border-white/5 pt-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Cena</span>
                    <p className="text-2xl font-bold text-white">{product.price.toLocaleString()} Kč</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-blue-600 text-sm font-medium transition hover:shadow-lg hover:shadow-blue-500/20">
                    Vybrat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
  )
}