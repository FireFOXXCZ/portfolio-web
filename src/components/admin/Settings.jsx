import { User, Bell, Database, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Settings() {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Nastavení systému</h2>
        <p className="text-slate-400 text-sm">Správa vašeho profilu a konfigurace aplikace FireFOXX.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karta Heslo / Zabezpečení (Místo biometriky) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col h-full"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Zabezpečení</h3>
              <p className="text-xs text-slate-500">Správa hesla</p>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 mb-8 flex-1 text-center flex flex-col justify-center">
            <p className="text-sm text-slate-400 italic">
              Změna hesla a dvoufázové ověření bude dostupné v administraci Supabase.
            </p>
          </div>

          <button 
            disabled
            className="flex items-center gap-3 px-6 py-4 bg-slate-800 text-slate-500 font-bold rounded-2xl cursor-not-allowed w-full justify-center"
          >
            Změnit heslo
          </button>
        </motion.div>

        {/* Správa Profilu */}
        <div className="bg-[#1e293b]/30 border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
              <User className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-500">Správa profilu</h3>
            <p className="text-sm text-slate-600 max-w-[200px]">Změna jména a kontaktních údajů admina.</p>
        </div>

        {/* Oznámení */}
        <div className="bg-[#1e293b]/30 border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
              <Bell className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-500">Oznámení</h3>
            <p className="text-sm text-slate-600">Nastavení systémových notifikací a reportů.</p>
        </div>

        {/* Systém */}
        <div className="bg-[#1e293b]/30 border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
              <Database className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-500">Systém</h3>
            <p className="text-sm text-slate-600">Logy aktivity a verze FireFOXX Core.</p>
        </div>
      </div>
    </div>
  )
}