import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Send, CheckCircle2, Loader2, Mail, MapPin, Briefcase, AlertCircle, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', serviceId: '' })
  const [services, setServices] = useState([])
  const [status, setStatus] = useState('idle')
  
  // --- NOTIFIKACE (TOAST) ---
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const location = useLocation()

  // Helper pro zobrazení notifikace
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  useEffect(() => {
    async function fetchServices() {
        const { data } = await supabase.from('products').select('id, name')
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

    const { error } = await supabase
      .from('messages')
      .insert([messageData])

    if (error) {
      console.error('Chyba při odesílání:', error)
      showToast('Odeslání se nezdařilo. Zkuste to prosím později.', 'error') // TOAST ERROR
      setStatus('error')
    } else {
      setStatus('success')
      showToast('Zpráva úspěšně odeslána! Ozvu se vám co nejdříve.', 'success') // TOAST SUCCESS
      
      setFormData({ name: '', email: '', message: '', serviceId: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="kontakt" className="py-20 px-6 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Napište mi
          </h2>
          <p className="text-slate-400">Máte nápad na projekt? Pojďme ho probrat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <div className="bg-[#1e293b]/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2">Kontaktní údaje</h3>
              <p className="text-slate-400 text-sm mb-6">Jsem k dispozici pro nové projekty.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-blue-500/10 rounded-full text-blue-400"><Mail className="w-5 h-5"/></div>
                  <span>info@firefoxx.online</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><MapPin className="w-5 h-5"/></div>
                  <span>Česká republika (Remote)</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">Služba (Nepovinné)</label>
              <div className="relative">
                  <Briefcase className="absolute left-4 top-4 w-5 h-5 text-slate-500 pointer-events-none"/>
                  <select 
                    value={formData.serviceId}
                    onChange={e => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-blue-500 focus:outline-none text-white appearance-none cursor-pointer hover:bg-[#0f172a]/70 transition"
                  >
                    <option value="">Nevybráno / Obecný dotaz</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">Jméno</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:outline-none text-white transition placeholder:text-slate-600"
                placeholder="Jan Novák"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:outline-none text-white transition placeholder:text-slate-600"
                placeholder="jan@firma.cz"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 pl-1">Zpráva</label>
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl p-4 focus:border-blue-500 focus:outline-none text-white transition h-32 resize-none placeholder:text-slate-600"
                placeholder="O co se jedná..."
              />
            </div>

            <button 
              disabled={status === 'loading' || status === 'success'}
              className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                status === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white'
              }`}
            >
              {status === 'loading' && <Loader2 className="animate-spin w-5 h-5" />}
              {status === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {status === 'idle' && <Send className="w-5 h-5" />}
              
              {status === 'loading' ? 'Odesílám...' : (status === 'success' ? 'Odesláno!' : 'Odeslat zprávu')}
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
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl backdrop-blur-xl border border-white/10 bg-[#0f172a]/90"
                style={{ 
                    boxShadow: toast.type === 'success' ? '0 10px 40px -10px rgba(34, 197, 94, 0.3)' : '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
                    borderColor: toast.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                }}
            >
                <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6"/> : <AlertCircle className="w-6 h-6"/>}
                </div>
                
                <div className="pr-4">
                    <h4 className={`font-bold text-sm ${toast.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {toast.type === 'success' ? 'Odesláno' : 'Chyba'}
                    </h4>
                    <p className="text-slate-300 text-xs font-medium">{toast.message}</p>
                </div>

                <button onClick={() => setToast({ ...toast, show: false })} className="p-1 hover:bg-white/10 rounded-full transition text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}