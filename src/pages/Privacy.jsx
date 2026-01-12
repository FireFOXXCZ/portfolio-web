import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Shield, Lock, Eye, Database, Server } from 'lucide-react'

// PŘIJÍMÁ PROPS: t, lang, toggleLang
export default function Privacy({ t, lang, toggleLang }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  // Ochrana proti pádu, pokud t ještě není načteno
  if (!t) return null; 

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-500 selection:text-white ${
      isDarkMode ? 'bg-[#0f172a] text-slate-300' : 'bg-slate-50 text-slate-600'
    }`}>
      
      {/* Navbar nyní dostává vše potřebné */}
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        lang={lang} 
        toggleLang={toggleLang} 
        t={t.nav} 
      />
      
      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* Hlavička */}
        <div className="mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border transition-colors ${
                isDarkMode 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
                <Shield className="w-3 h-3" /> {t.privacy.badge}
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.privacy.title}
            </h1>
            <p className={`text-lg transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {t.privacy.subtitle}
                <br />
                <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>{t.privacy.effective_date}</strong>
            </p>
        </div>

        {/* Obsah */}
        <div className="space-y-12">

            {/* 1. Správce */}
            <section className={`border p-8 rounded-3xl transition-all duration-500 ${
                isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Lock className="w-6 h-6 text-blue-500" /> {t.privacy.section1_title}
                </h2>
                <p className="leading-relaxed">
                    {/* Renderování textu s HTML (pro tučné písmo) nebo rozdělení stringu */}
                    {t.privacy.section1_text.split('**')[0]} 
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{t.privacy.section1_text.split('**')[1]}</strong>
                    {t.privacy.section1_text.split('**')[2]}
                    {' '}<a href="mailto:info@firefoxx.online" className="text-blue-500 hover:underline font-medium">info@firefoxx.online</a>.
                </p>
            </section>

            {/* 2. Sběr dat */}
            <section>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Eye className="w-6 h-6 text-blue-500" /> {t.privacy.section2_title}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.privacy.form_title}</h3>
                        <p className="text-sm">
                            {t.privacy.form_text.split('**')[0]}
                            <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{t.privacy.form_text.split('**')[1]}</strong>
                            {t.privacy.form_text.split('**')[2]}
                        </p>
                    </div>
                    <div className={`p-6 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.privacy.reviews_title}</h3>
                        <p className="text-sm">
                            {t.privacy.reviews_text.split('**')[0]}
                            <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{t.privacy.reviews_text.split('**')[1]}</strong>
                            {t.privacy.reviews_text.split('**')[2]}
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Technologie */}
            <section>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Database className="w-6 h-6 text-blue-500" /> {t.privacy.section3_title}
                </h2>
                <p className="mb-6">{t.privacy.section3_intro}</p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{t.privacy.db_title}</strong>
                            <p className="text-sm mt-1">{t.privacy.db_text}</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{t.privacy.host_title}</strong>
                            <p className="text-sm mt-1">{t.privacy.host_text}</p>
                        </div>
                    </li>
                </ul>
            </section>

            {/* 4. Práva */}
            <section className={`border p-8 rounded-3xl transition-all ${
                isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
                <h2 className={`text-2xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.privacy.section4_title}</h2>
                <p className="leading-relaxed mb-4">
                    {t.privacy.section4_intro}
                </p>
                <ul className={`list-disc list-inside space-y-2 ml-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t.privacy.rights_list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <p className="mt-6">
                    {t.privacy.section4_outro} <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>info@firefoxx.online</strong>.
                </p>
            </section>

        </div>
      </main>

      {/* Footer nyní dostává data */}
      <Footer isDarkMode={isDarkMode} t={t.footer} />
    </div>
  )
}