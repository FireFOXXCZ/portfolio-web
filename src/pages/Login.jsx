import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setErrorMsg("Neplatné údaje nebo přístup zamítnut.")
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-4 font-sans relative overflow-hidden">
      
      {/* --- DYNAMICKÉ POZADÍ --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] bg-blue-600/20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-indigo-600/10"></div>
      </div>

      {/* --- TLAČÍTKO ZPĚT --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link 
          to="/" 
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-white backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Zpět na web</span>
        </Link>
      </motion.div>

      {/* --- LOGIN KARTA --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md p-1 bg-[#0f172a]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="p-8 md:p-10 rounded-[2.3rem] bg-gradient-to-b from-white/[0.03] to-transparent">
          
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative p-5 rounded-2xl bg-[#020617] border border-blue-500/30 text-blue-400">
                <ShieldCheck className="w-10 h-10" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-center mb-2 tracking-tighter">FIREFOXX <span className="text-blue-500">CORE</span></h2>
          <p className="text-center mb-10 text-slate-500 font-medium text-sm">Zabezpečený přístup do administrační vrstvy</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl text-xs text-center font-bold bg-red-500/10 text-red-400 border border-red-500/20"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Identita</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-white/5 bg-[#020617]/50 rounded-2xl p-4 pl-14 text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
                  placeholder="admin@firefoxx.dev"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Přístupový klíč</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-white/5 bg-[#020617]/50 rounded-2xl p-4 pl-14 pr-14 text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading} 
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Autorizovat vstup"}
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-white/5 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
                Secure Gateway 2.0
              </span>
          </div>
        </div>
      </motion.div>

      {/* --- DEKORATIVNÍ TEXT NA POZADÍ --- */}
      <div className="absolute bottom-10 right-10 opacity-[0.02] select-none pointer-events-none hidden lg:block">
        <h1 className="text-[12rem] font-black leading-none">ADMIN</h1>
      </div>
    </div>
  )
}