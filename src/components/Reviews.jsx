import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Star, Quote, ChevronLeft, ChevronRight, User, Briefcase, Send, Loader2, PlusCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  
  // --- STRÁNKOVÁNÍ ---
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3

  // --- FORMULÁŘ ---
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', role: '', text: '', stars: 5 })

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false }) // Nejnovější nahoře
      
      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error("Chyba při načítání:", error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    try {
        const { error } = await supabase.from('reviews').insert([formData])
        if (error) throw error
        
        // Reset a obnovení
        await fetchReviews()
        setFormData({ name: '', role: '', text: '', stars: 5 })
        setShowForm(false)
        setCurrentPage(1) // Skočit na první stránku, kde je nová recenze
    } catch (error) {
        alert("Chyba při odesílání: " + error.message)
    } finally {
        setSubmitting(false)
    }
  }

  // --- LOGIKA STRÁNKOVÁNÍ ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE) || 1

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1) }

  return (
    <section id="recenze" className="py-24 px-6 relative overflow-hidden bg-[#0f172a]">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Nadpis + Tlačítko přidat */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Co říkají klienti
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Reálné zkušenosti lidí, se kterými jsem spolupracoval.
          </p>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-full font-bold transition flex items-center gap-2 mx-auto ${showForm ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'}`}
          >
             {showForm ? <><XIcon /> Zavřít formulář</> : <><PlusCircle className="w-5 h-5"/> Přidat recenzi</>}
          </button>
        </div>

        {/* --- FORMULÁŘ --- */}
        <AnimatePresence>
            {showForm && (
                <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="max-w-2xl mx-auto mb-16 bg-[#1e293b]/50 border border-blue-500/20 p-8 rounded-3xl overflow-hidden"
                    onSubmit={handleSubmit}
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">Napsat hodnocení <Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/></h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Jméno *</label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500"/>
                                <input required type="text" placeholder="Jan Novák" className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Role / Firma</label>
                            <div className="relative mt-1">
                                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500"/>
                                <input type="text" placeholder="CEO, Firma s.r.o." className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none" 
                                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hodnocení</label>
                        <div className="flex gap-2 mt-2">
                            {[1,2,3,4,5].map(star => (
                                <button key={star} type="button" onClick={() => setFormData({...formData, stars: star})} className="focus:outline-none transition transform hover:scale-110">
                                    <Star className={`w-8 h-8 ${star <= formData.stars ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Recenze *</label>
                        <textarea required placeholder="Jak se vám spolupracovalo..." className="w-full mt-1 bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-32 resize-none"
                            value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                        />
                    </div>

                    <button disabled={submitting} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50">
                        {submitting ? <Loader2 className="animate-spin w-5 h-5"/> : <Send className="w-5 h-5"/>}
                        {submitting ? 'Odesílám...' : 'Odeslat recenzi'}
                    </button>
                </motion.form>
            )}
        </AnimatePresence>

        {/* --- VÝPIS RECENZÍ --- */}
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>)}
             </div>
        ) : reviews.length === 0 ? (
            <div className="text-center text-slate-500 py-10 border border-dashed border-white/10 rounded-3xl">
                Zatím žádné recenze. Buďte první!
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
              {currentReviews.map((review, index) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl relative flex flex-col group hover:border-blue-500/30 transition-colors"
                >
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 rotate-12 group-hover:text-blue-500/10 transition" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.stars ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} />
                    ))}
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-6 relative z-10 flex-1 italic">
                    "{review.text}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold border border-white/10">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{review.name}</h4>
                      {review.role && <p className="text-slate-500 text-xs">{review.role}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
        )}

        {/* --- STRÁNKOVÁNÍ --- */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
                <button onClick={prevPage} disabled={currentPage === 1} className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white border border-white/5">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-slate-400 font-mono text-sm">
                    {currentPage} / {totalPages}
                </span>

                <button onClick={nextPage} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white border border-white/5">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}

      </div>
    </section>
  )
}

// Pomocná komponenta pro ikonu Křížku (pokud ji nemáš importovanou jinde, tady je inline pro jistotu)
function XIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
}