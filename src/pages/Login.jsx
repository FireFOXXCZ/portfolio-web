import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { Lock, Loader2, ArrowLeft } from 'lucide-react' // Přidána ArrowLeft

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setErrorMsg("Špatné heslo nebo email!")
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white px-4 relative">
      
      {/* TLAČÍTKO ZPĚT NA WEB (Nové) */}
      <a 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition px-4 py-2 rounded-full hover:bg-white/5"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět na web
      </a>

      <div className="bg-[#1e293b] p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Dekorace */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        
        <div className="flex justify-center mb-8 relative z-10">
          <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Lock className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Vítej zpět</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Přihlaste se do administrace FireFOXX.</p>
        
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
              {errorMsg}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition text-white"
              placeholder="admin@firefoxx.dev"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Heslo</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Vstoupit do systému"}
          </button>
        </form>
      </div>
    </div>
  )
}