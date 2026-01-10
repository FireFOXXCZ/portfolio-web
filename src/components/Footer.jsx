import { Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="kontakt" className="py-20 mt-20 border-t border-white/10 bg-[#0f172a] relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-6">Máte nápad na projekt?</h2>
            <p className="text-slate-400 mb-8">Pojďme společně vytvořit něco, co bude mít dopad. Napište mi.</p>
            <a href="mailto:info@firefoxx.dev" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Send className="w-4 h-4" />
              info@firefoxx.online
            </a>
            
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
              <p>© 2026 FireFOXX Dev.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition">GitHub</a>
              </div>
            </div>
         </div>
      </footer>
  )
}