import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Send, CheckCircle2, Loader2, Mail, MapPin, Briefcase, AlertCircle, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Contact({ isDarkMode, t, lang }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', serviceId: '' })
  const [services, setServices] = useState([])
  const [status, setStatus] = useState('idle')
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const location = useLocation()

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  useEffect(() => {
    async function fetchServices() {
        // UPRAVENO: Přidáno 'name_en' do výběru sloupců
        const { data } = await supabase.from('products').select('id, name, name_en')
        if (data) {
            setServices(data)
            const params = new URLSearchParams(location.search)
            const preselectedId = params.get('service')
            if (preselectedId) {
                setFormData(prev => ({ ...prev, serviceId: preselectedId }))
            }
        }
    }
    fetchServices()
  }, [location])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    const messageData = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      service_id: formData.serviceId || null,
      folder_id: 1, 
      is_read: false
    }

    const { error } = await supabase.from('messages').insert([messageData])

    if (error) {
      showToast(t.toast_error, 'error')
      setStatus('error')
    } else {
      setStatus('success')
      showToast(t.toast_success, 'success')
      setFormData({ name: '', email: '', message: '', serviceId: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="kontakt" className={`py-20 px-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] -z-10 transition-colors duration-700 ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/5'}`}></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400' : 'text-slate-900'}`}>
            {t.title}
          </h2>
          <p className={`transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 ${isDarkMode ? 'bg-[#1e293b]/30 border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
              <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.info_title}
              </h3>
              <p className={`text-sm mb-6 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.info_subtitle}
              </p>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Mail className="w-5 h-5"/></div>
                  <span className="font-medium">info@firefoxx.online</span>
                </div>
                <div className={`flex items-center gap-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}><MapPin className="w-5 h-5"/></div>
                  <span className="font-medium">{t.location}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`space-y-4 p-8 rounded-3xl border backdrop-blur-md shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-[#1e293b]/30 border-white/5' : 'bg-white border-slate-200'}`}>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">{t.label_service}</label>
              <div className="relative">
                  <Briefcase className="absolute left-4 top-4 w-5 h-5 text-slate-400 pointer-events-none transition-colors"/>
                  <select 
                    value={formData.serviceId}
                    onChange={e => setFormData({...formData, serviceId: e.target.value})}
                    className={`w-full border rounded-xl py-4 pl-12 pr-4 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/50 border-white/10 text-white hover:bg-[#0f172a]/70' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'}`}
                  >
                    <option value="">{t.option_default}</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {/* UPRAVENO: Dynamický výběr jazyka pro název služby */}
                            {lang === 'en' ? (service.name_en || service.name) : service.name}
                        </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">{t.label_name}</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className={`w-full border rounded-xl p-4 focus:border-blue-500 focus:outline-none transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/50 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                placeholder={t.placeholder_name}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">{t.label_email}</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`w-full border rounded-xl p-4 focus:border-blue-500 focus:outline-none transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/50 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                placeholder={t.placeholder_email}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">{t.label_message}</label>
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className={`w-full border rounded-xl p-4 focus:border-blue-500 focus:outline-none h-32 resize-none transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/50 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                placeholder={t.placeholder_message}
              />
            </div>

            <button 
              disabled={status === 'loading' || status === 'success'}
              className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                status === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white'
              }`}
            >
              {status === 'loading' && <Loader2 className="animate-spin w-5 h-5" />}
              {status === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {status === 'idle' && <Send className="w-5 h-5" />}
              {status === 'loading' ? t.btn_loading : (status === 'success' ? t.btn_success : t.btn_idle)}
            </button>
          </form>
        </div>
      </div>

      {/* --- NOTIFIKACE (TOAST) --- */}
      <AnimatePresence>
        {toast.show && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl backdrop-blur-xl border transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/95 border-slate-200'}`}
                style={{ 
                    boxShadow: toast.type === 'success' ? '0 10px 40px -10px rgba(34, 197, 94, 0.3)' : '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
                }}
            >
                <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6"/> : <AlertCircle className="w-6 h-6"/>}
                </div>
                
                <div className="pr-4">
                    <h4 className={`font-bold text-sm transition-colors ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {toast.type === 'success' ? t.toast_title_success : t.toast_title_error}
                    </h4>
                    <p className={`text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{toast.message}</p>
                </div>

                <button onClick={() => setToast({ ...toast, show: false })} className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-black/5 text-slate-400 hover:text-slate-700'}`}>
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}