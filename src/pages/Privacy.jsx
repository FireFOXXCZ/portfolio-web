import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Shield, Lock, Eye, Database, Server } from 'lucide-react'

export default function Privacy() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Synchronizace s localStorage (stejně jako na Home)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-500 selection:text-white ${
      isDarkMode ? 'bg-[#0f172a] text-slate-300' : 'bg-slate-50 text-slate-600'
    }`}>
      {/* Předáme téma do Navbaru */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* Hlavička */}
        <div className="mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border transition-colors ${
                isDarkMode 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
                <Shield className="w-3 h-3" /> GDPR & Soukromí
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Zásady ochrany osobních údajů
            </h1>
            <p className={`text-lg transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Vaše soukromí beru vážně. Zde se dozvíte, jaká data sbírám, proč to dělám a jak jsou chráněna.
                <br />
                <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>Platnost od: 1. 1. 2026</strong>
            </p>
        </div>

        {/* Obsah */}
        <div className="space-y-12">

            {/* 1. Kdo zpracovává data */}
            <section className={`border p-8 rounded-3xl transition-all duration-500 ${
                isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Lock className="w-6 h-6 text-blue-500" /> 1. Správce údajů
                </h2>
                <p className="leading-relaxed">
                    Správcem vašich osobních údajů je <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>FireFOXX Dev</strong> (fyzická osoba). 
                    Pokud máte jakékoliv dotazy ohledně zpracování dat, můžete mě kontaktovat na e-mailu: <a href="mailto:info@firefoxx.online" className="text-blue-500 hover:underline font-medium">info@firefoxx.online</a>.
                </p>
            </section>

            {/* 2. Jaká data sbíráme */}
            <section>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Eye className="w-6 h-6 text-blue-500" /> 2. Jaká data sbírám a proč
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Kontaktní formulář</h3>
                        <p className="text-sm">
                            Když mi napíšete přes web, ukládám vaše <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>jméno, e-mail a text zprávy</strong>. 
                            Důvodem je, abych vám mohl odpovědět na vaši poptávku.
                        </p>
                    </div>
                    <div className={`p-6 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recenze</h3>
                        <p className="text-sm">
                            Pokud dobrovolně přidáte recenzi, zveřejňuji vaše <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>jméno, roli/firmu a text hodnocení</strong>. 
                            Tyto údaje slouží k prezentaci mé práce na webu.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Technologie */}
            <section>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Database className="w-6 h-6 text-blue-500" /> 3. Kde data ukládám
                </h2>
                <p className="mb-6">
                    Pro chod webu využívám ověřené světové poskytovatele, kteří splňují přísné bezpečnostní standardy:
                </p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>Supabase (Databáze):</strong>
                            <p className="text-sm mt-1">Zde jsou bezpečně uloženy texty zpráv a recenze. Data jsou šifrována.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                            <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>Vercel (Hosting):</strong>
                            <p className="text-sm mt-1">Poskytovatel prostoru pro web. Může sbírat anonymizované technické logy (IP adresy) pro zajištění bezpečnosti webu.</p>
                        </div>
                    </li>
                </ul>
            </section>

            {/* 4. Práva */}
            <section className={`border p-8 rounded-3xl transition-all ${
                isDarkMode ? 'bg-[#1e293b]/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
                <h2 className={`text-2xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4. Vaše práva</h2>
                <p className="leading-relaxed mb-4">
                    Podle nařízení GDPR máte právo kdykoliv požádat o:
                </p>
                <ul className={`list-disc list-inside space-y-2 ml-4 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>Výpis dat, která o vás eviduji.</li>
                    <li>Opravu nepřesných údajů.</li>
                    <li>Kompletní smazání vašich údajů (právo být zapomenut).</li>
                </ul>
                <p className="mt-6">
                    Pro uplatnění těchto práv stačí napsat na <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>info@firefoxx.online</strong>.
                </p>
            </section>

        </div>
      </main>

      {/* Předáme téma do Footeru */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}