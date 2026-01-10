import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Shield, Lock, Eye, Database, Server } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* Hlavička */}
        <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                <Shield className="w-3 h-3" /> GDPR & Soukromí
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Zásady ochrany osobních údajů</h1>
            <p className="text-lg text-slate-400">
                Vaše soukromí beru vážně. Zde se dozvíte, jaká data sbírám, proč to dělám a jak jsou chráněna.
                <br />
                <strong>Platnost od: 1. 1. 2026</strong>
            </p>
        </div>

        {/* Obsah */}
        <div className="space-y-12">

            {/* 1. Kdo zpracovává data */}
            <section className="bg-[#1e293b]/40 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-blue-500" /> 1. Správce údajů
                </h2>
                <p className="leading-relaxed">
                    Správcem vašich osobních údajů je <strong>FireFOXX Dev</strong> (fyzická osoba). 
                    Pokud máte jakékoliv dotazy ohledně zpracování dat, můžete mě kontaktovat na e-mailu: <a href="mailto:info@firefoxx.online" className="text-blue-400 hover:underline">info@firefoxx.online</a>.
                </p>
            </section>

            {/* 2. Jaká data sbíráme */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Eye className="w-6 h-6 text-blue-500" /> 2. Jaká data sbírám a proč
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#1e293b]/40 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-2">Kontaktní formulář</h3>
                        <p className="text-sm">
                            Když mi napíšete přes web, ukládám vaše <strong>jméno, e-mail a text zprávy</strong>. 
                            Důvodem je, abych vám mohl odpovědět na vaši poptávku.
                        </p>
                    </div>
                    <div className="bg-[#1e293b]/40 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-2">Recenze</h3>
                        <p className="text-sm">
                            Pokud dobrovolně přidáte recenzi, zveřejňuji vaše <strong>jméno, roli/firmu a text hodnocení</strong>. 
                            Tyto údaje slouží k prezentaci mé práce na webu.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Technologie */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Database className="w-6 h-6 text-blue-500" /> 3. Kde data ukládám (Třetí strany)
                </h2>
                <p className="mb-6">
                    Pro chod webu využívám ověřené světové poskytovatele, kteří splňují přísné bezpečnostní standardy:
                </p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-slate-500 mt-1" />
                        <div>
                            <strong className="text-white">Supabase (Databáze):</strong>
                            <p className="text-sm mt-1">Zde jsou bezpečně uloženy texty zpráv a recenze. Data jsou šifrována.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-slate-500 mt-1" />
                        <div>
                            <strong className="text-white">Vercel (Hosting):</strong>
                            <p className="text-sm mt-1">Poskytovatel prostoru pro web. Může sbírat anonymizované technické logy (IP adresy) pro zajištění bezpečnosti webu.</p>
                        </div>
                    </li>
                </ul>
            </section>

            {/* 4. Práva */}
            <section className="bg-[#1e293b]/40 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-4">4. Vaše práva</h2>
                <p className="leading-relaxed mb-4">
                    Podle nařízení GDPR máte právo kdykoliv požádat o:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                    <li>Výpis dat, která o vás eviduji.</li>
                    <li>Opravu nepřesných údajů.</li>
                    <li>Kompletní smazání vašich údajů (právo být zapomenut).</li>
                </ul>
                <p className="mt-6">
                    Pro uplatnění těchto práv stačí napsat na <strong className="text-white">info@firefoxx.online</strong>.
                </p>
            </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}