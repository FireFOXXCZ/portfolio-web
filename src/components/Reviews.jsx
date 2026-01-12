import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Star, Quote, ChevronLeft, ChevronRight, User, Briefcase, Send, Loader2, PlusCircle, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// PŘIJÍMÁ PROP: t (překlady)
export default function Reviews({ isDarkMode, t }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  
  // --- STRÁNKOVÁNÍ ---
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3

  // --- FORMULÁŘ ---
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', role: '', text: '', stars: 5 })

  // --- NOTIFIKACE (TOAST) ---
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    fetchReviews()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false }) 
      
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
        
        // POUŽITÍ PŘEKLADU PRO TOAST
        showToast(t?.toast_success || 'Děkuji!', 'success')
        
        await fetchReviews()
        setFormData({ name: '', role: '', text: '', stars: 5 })
        setShowForm(false)
        setCurrentPage(1)
    } catch (error) {
        console.error(error)
        showToast(t?.toast_error || 'Chyba', 'error')
    } finally {
        setSubmitting(false)
    }
  }

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE) || 1

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1) }

  return (
    <section id="recenze" className={`py-24 px-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 transition-colors ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400' : 'text-slate-900'}`}>
            {t?.title || 'Co říkají klienti'}
          </h2>
          <p className={`max-w-xl mx-auto mb-8 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t?.subtitle || 'Reálné zkušenosti.'}
          </p>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-full font-bold transition flex items-center gap-2 mx-auto shadow-lg active:scale-95 ${
              showForm 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
             {showForm 
                ? <><X className="w-5 h-5" /> {t?.btn_close || 'Zavřít'}</> 
                : <><PlusCircle className="w-5 h-5"/> {t?.btn_add || 'Přidat recenzi'}</>
             }
          </button>
        </div>

        <AnimatePresence>
            {showForm && (
                <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`max-w-2xl mx-auto mb-16 border p-8 rounded-3xl overflow-hidden transition-colors ${
                      isDarkMode ? 'bg-[#1e293b]/50 border-blue-500/20' : 'bg-white border-slate-200 shadow-xl'
                    }`}
                    onSubmit={handleSubmit}
                >
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {t?.form_title} <Star className="w-5 h-5 text-yellow-500 fill-yellow-500"/>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t?.label_name} *</label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500"/>
                                <input required type="text" placeholder={t?.placeholder_name} 
                                    className={`w-full border rounded-xl py-3 pl-10 pr-4 outline-none transition-all ${
                                      isDarkMode ? 'bg-[#0f172a] border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                                    }`} 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t?.label_role}</label>
                            <div className="relative mt-1">
                                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500"/>
                                <input type="text" placeholder={t?.placeholder_role} 
                                    className={`w-full border rounded-xl py-3 pl-10 pr-4 outline-none transition-all ${
                                      isDarkMode ? 'bg-[#0f172a] border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                                    }`} 
                                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t?.label_rating}</label>
                        <div className="flex gap-2 mt-2">
                            {[1,2,3,4,5].map(star => (
                                <button key={star} type="button" onClick={() => setFormData({...formData, stars: star})} className="focus:outline-none transition transform hover:scale-110">
                                    <Star className={`w-8 h-8 ${star <= formData.stars ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t?.label_text} *</label>
                        <textarea required placeholder={t?.placeholder_text} 
                            className={`w-full mt-1 border rounded-xl p-4 outline-none h-32 resize-none transition-all ${
                              isDarkMode ? 'bg-[#0f172a] border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                            }`}
                            value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                        />
                    </div>

                    <button disabled={submitting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50">
                        {submitting ? <Loader2 className="animate-spin w-5 h-5"/> : <Send className="w-5 h-5"/>}
                        {submitting ? t?.btn_sending : t?.btn_send}
                    </button>
                </motion.form>
            )}
        </AnimatePresence>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className={`h-64 rounded-3xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}></div>)}
             </div>
        ) : reviews.length === 0 ? (
            <div className={`text-center py-10 border border-dashed rounded-3xl transition-colors ${isDarkMode ? 'text-slate-500 border-white/10' : 'text-slate-400 border-slate-300'}`}>
                {t?.empty_state}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
              {currentReviews.map((review, index) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`border p-8 rounded-3xl relative flex flex-col group transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-[#1e293b]/40 border-white/5 hover:border-blue-500/30' 
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-lg shadow-slate-200/50'
                  }`}
                >
                  <Quote className={`absolute top-6 right-6 w-10 h-10 transition-colors ${isDarkMode ? 'text-white/5 group-hover:text-blue-500/10' : 'text-slate-100 group-hover:text-blue-50'}`} />
                  
                  <div className="flex gap-1 mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.stars ? 'fill-yellow-500 text-yellow-500' : (isDarkMode ? 'text-slate-700' : 'text-slate-200')}`} />
                    ))}
                  </div>

                  <p className={`leading-relaxed mb-6 relative z-10 flex-1 italic transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{review.text}"
                  </p>

                  <div className={`flex items-center gap-4 mt-auto border-t pt-4 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border transition-colors ${
                      isDarkMode ? 'bg-gradient-to-br from-slate-700 to-slate-900 border-white/10' : 'bg-blue-600 border-blue-400'
                    }`}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                      <p className={`text-xs transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        {review.role || (t?.role_default || 'Klient')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
        )}

        {/* --- STRÁNKOVÁNÍ --- */}
        <div className="flex justify-center items-center gap-4 mt-12">
            <button onClick={prevPage} disabled={currentPage === 1} 
              className={`p-3 rounded-full border transition-all disabled:opacity-30 ${
                isDarkMode 
                  ? 'bg-white/5 text-white border-white/5 hover:bg-white/10' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-md'
              }`}>
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className={`font-mono text-sm transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{currentPage}</span> / {totalPages}
            </span>

            <button onClick={nextPage} disabled={currentPage === totalPages} 
              className={`p-3 rounded-full border transition-all disabled:opacity-30 ${
                isDarkMode 
                  ? 'bg-white/5 text-white border-white/5 hover:bg-white/10' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-md'
              }`}>
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>

      </div>

      <AnimatePresence>
        {toast.show && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl backdrop-blur-xl border ${
                  isDarkMode ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/95 border-slate-200'
                }`}
                style={{ 
                    boxShadow: toast.type === 'success' ? '0 10px 40px -10px rgba(34, 197, 94, 0.3)' : '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
                    borderColor: toast.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'
                }}
            >
                <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6"/> : <AlertCircle className="w-6 h-6"/>}
                </div>
                
                <div className="pr-4">
                    <h4 className={`font-bold text-sm ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {toast.type === 'success' ? (lang === 'en' ? 'Success' : 'Odesláno') : (lang === 'en' ? 'Error' : 'Chyba')}
                    </h4>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{toast.message}</p>
                </div>

                <button onClick={() => setToast({ ...toast, show: false })} className="p-1 hover:bg-black/5 rounded-full transition text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}