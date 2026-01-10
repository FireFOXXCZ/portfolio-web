import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Send, CheckCircle2, Loader2, Mail, MapPin, Briefcase } from 'lucide-react'
import { useLocation } from 'react-router-dom' // Pro čtení URL parametrů

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', serviceId: '' })
  const [services, setServices] = useState([]) // Seznam služeb z DB
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  
  const location = useLocation()

  // 1. Načtení služeb z databáze a kontrola URL
  useEffect(() => {
    async function fetchServices() {
        // Načteme služby (potřebujeme ID a název)
        const { data } = await supabase.from('products').select('id, name')
        if (data) {
            setServices(data)
            
            // Zkontrolujeme URL, jestli jsme nepřišli z tlačítka "Mám zájem"
            // Hledáme parametr ?service=ID
            const params = new URLSearchParams(location.search)
            const preselectedId = params.get('service')
            
            if (preselectedId) {
                // Pokud ID existuje v URL, nastavíme ho do formuláře
                setFormData(prev => ({ ...prev, serviceId: preselectedId }))
            }
        }
    }
    fetchServices()
  }, [location])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    // Data pro odeslání
    const messageData = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      service_id: formData.serviceId || null, // Uložíme ID vybrané služby (nebo null)
      folder_id: 1, // Inbox (natvrdo ID 1, ujisti se, že složka s ID 1 existuje v tabulce 'folders')
      is_read: false
    }

    const { error } = await supabase
      .from('messages')
      .insert([messageData])

    if (error) {
      console.error('Chyba při odesílání:', error)
      alert('Chyba: ' + error.message)
      setStatus('error')
    } else {
      setStatus('success')
      // Vyčistíme formulář
      setFormData({ name: '', email: '', message: '', serviceId: '' })
      
      // Reset tlačítka po 3 sekundách
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="kontakt" className="py-20 px-6 relative overflow-hidden">
      
      {/* Dekorace na pozadí */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Napište mi
          </h2>
          <p className="text-slate-400">Máte nápad na projekt? Pojďme ho probrat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Levá strana: Info */}
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

          {/* Pravá strana: Formulář */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
            
            {/* Výběr služby (NOVÉ) */}
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
                  {/* Šipka dolů pro select */}
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
    </section>
  )
}