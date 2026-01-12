import { Send, Shield, MessageCircle } from 'lucide-react' 
import { Link } from 'react-router-dom'

// PŘIJÍMÁ PROP: t (překlady)
export default function Footer({ isDarkMode, t }) {
  return (
    <footer className={`py-20 border-t transition-colors duration-500 relative overflow-hidden ${
      isDarkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'
    }`}>
         {/* Efekt na pozadí */}
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ${
           isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/5'
         }`}></div>
         
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className={`text-3xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t?.title || 'Máte nápad na projekt?'}
            </h2>
            <p className={`mb-8 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t?.subtitle || 'Pojďme společně vytvořit něco, co bude mít dopad. Napište mi.'}
            </p>
            
            <a 
              href="mailto:info@firefoxx.online" 
              className={`inline-flex items-center gap-2 px-8 py-4 font-bold rounded-full hover:scale-105 transition shadow-lg ${
                isDarkMode 
                ? 'bg-white text-black shadow-white/10' 
                : 'bg-slate-900 text-white shadow-slate-900/20'
              }`}
            >
              <Send className="w-4 h-4" />
              info@firefoxx.online
            </a>
            
            <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs transition-colors ${
              isDarkMode ? 'border-white/5 text-slate-600' : 'border-slate-100 text-slate-400'
            }`}>
              <p>© {new Date().getFullYear()} FireFOXX Dev.</p>
              
              <div className="flex gap-6 mt-4 md:mt-0">
                <a 
                  href="https://discord.gg/Th5eYKQ8cx" 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`transition flex items-center gap-2 ${
                    isDarkMode ? 'hover:text-indigo-400 text-slate-500' : 'hover:text-indigo-600 text-slate-400'
                  }`}
                >
                    <MessageCircle className="w-4 h-4" /> Discord
                </a>

               <Link 
                to="/privacy" 
                onClick={() => window.scrollTo(0, 0)}
                className={`transition flex items-center gap-2 ${
                  isDarkMode ? 'hover:text-white text-slate-500' : 'hover:text-slate-900 text-slate-400'
                }`}
              >
                  <Shield className="w-4 h-4" /> {t?.privacy || 'Ochrana soukromí'}
              </Link>
              </div>
            </div>
         </div>
      </footer>
  )
}