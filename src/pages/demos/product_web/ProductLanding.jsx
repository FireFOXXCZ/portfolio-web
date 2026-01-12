import React, { useState } from 'react';

const ProductLanding = () => {
  // --- STAV APLIKACE ---
  const [activeImage, setActiveImage] = useState('blue');
  const [isDark, setIsDark] = useState(false); 
  const [lang, setLang] = useState('cz');

  // --- SLOVNÍK TEXTŮ ---
  const t = {
    cz: {
      nav: { features: "Funkce", specs: "Specifikace", reviews: "Recenze", buy: "Koupit za 5 990 Kč" },
      hero: {
        subtitle: "Nová Edice 2026",
        title1: "Zvuk, který",
        title2: "vás pohltí.",
        desc: "Aktivní potlačení hluku, 40 hodin výdrž a design, který nebudete chtít sundat z uší.",
        ctaPrimary: "Přidat do košíku",
        ctaSecondary: "Zjistit více",
        model: "SoundFlow Air"
      },
      features: {
        batteryTitle: "40h Baterie",
        batteryDesc: "Nabíjejte jednou týdně. A když spěcháte? 5 minut nabíjení = 2 hodiny poslechu.",
        ancTitle: "Smart ANC",
        ancDesc: "Sluchátka poznají, kdy na vás někdo mluví, a automaticky ztlumí hudbu.",
        waterTitle: "Voděodolné",
        waterDesc: "IPX4 certifikace znamená, že déšť ani pot při běhání nejsou problém."
      },
      footer: {
        rights: "© 2026 SoundFlow. Všechna práva vyhrazena.",
        created: "Vytvořil"
      }
    },
    en: {
      nav: { features: "Features", specs: "Specs", reviews: "Reviews", buy: "Buy for $249" },
      hero: {
        subtitle: "New Edition 2026",
        title1: "Sound that",
        title2: "surrounds you.",
        desc: "Active Noise Cancelling, 40-hour battery life, and a design you won't want to take off.",
        ctaPrimary: "Add to Cart",
        ctaSecondary: "Learn More",
        model: "SoundFlow Air"
      },
      features: {
        batteryTitle: "40h Battery",
        batteryDesc: "Charge once a week. In a rush? 5 minutes of charging = 2 hours of listening.",
        ancTitle: "Smart ANC",
        ancDesc: "Headphones detect when someone speaks to you and automatically lower the volume.",
        waterTitle: "Waterproof",
        waterDesc: "IPX4 certification means rain or sweat during a run are no problem."
      },
      footer: {
        rights: "© 2026 SoundFlow. All rights reserved.",
        created: "Created by"
      }
    }
  };

  const text = t[lang];

  return (
    // Celý obsah je obalený divem, který kontroluje 'dark' třídu
    <div className={isDark ? 'dark' : ''}>
      <div className="font-sans text-slate-900 bg-white dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-500 ease-in-out flex flex-col">
        
        {/* --- NAVBAR --- */}
        <nav className="fixed w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">S</div>
                <span className="font-bold text-xl tracking-tight dark:text-white">SoundFlow</span>
              </div>

              <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{text.nav.features}</a>
                <a href="#specs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{text.nav.specs}</a>
                <a href="#reviews" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">{text.nav.reviews}</a>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLang(lang === 'cz' ? 'en' : 'cz')}
                  className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition uppercase border border-slate-200 dark:border-slate-700 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {lang}
                </button>

                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  {isDark ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  )}
                </button>

                <button className="hidden sm:block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition transform hover:scale-105 shadow-lg dark:shadow-white/10">
                  {text.nav.buy}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* --- MAIN OBSAH (zbytek se roztáhne díky flex-grow) --- */}
        <main className="flex-grow">
          {/* --- HERO SEKCE --- */}
          <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left z-10">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-sm uppercase mb-2 block animate-pulse">
                {text.hero.subtitle}
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                {text.hero.title1} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  {text.hero.title2}
                </span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto md:mx-0">
                {text.hero.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
                  {text.hero.ctaPrimary}
                </button>
                <button className="px-8 py-4 rounded-full font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition bg-transparent">
                  {text.hero.ctaSecondary}
                </button>
              </div>
            </div>

            <div className="md:w-1/2 relative flex justify-center">
              <div className={`absolute inset-0 rounded-full filter blur-[80px] opacity-60 w-3/4 h-3/4 mx-auto mt-12 transition-colors duration-700
                ${activeImage === 'blue' ? 'bg-blue-500/40' : 
                  activeImage === 'black' ? 'bg-slate-600/40' : 
                  'bg-yellow-200/40'}
              `}></div>
              
              <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center transform rotate-3 hover:rotate-0 transition duration-500">
                <span className="text-8xl mb-4 drop-shadow-lg filter">🎧</span>
                <p className="text-slate-900 dark:text-white font-bold text-xl tracking-widest">{text.hero.model}</p>
                <div className="mt-8 flex gap-4 justify-center bg-white dark:bg-slate-950 p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                  <div onClick={() => setActiveImage('blue')} className={`w-6 h-6 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 dark:ring-offset-slate-900 transition ${activeImage === 'blue' ? 'ring-blue-500 scale-110' : 'ring-transparent hover:scale-105'}`}></div>
                  <div onClick={() => setActiveImage('black')} className={`w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-400 cursor-pointer ring-2 ring-offset-2 dark:ring-offset-slate-900 transition ${activeImage === 'black' ? 'ring-slate-800 dark:ring-slate-400 scale-110' : 'ring-transparent hover:scale-105'}`}></div>
                  <div onClick={() => setActiveImage('white')} className={`w-6 h-6 rounded-full bg-slate-200 cursor-pointer ring-2 ring-offset-2 dark:ring-offset-slate-900 transition ${activeImage === 'white' ? 'ring-slate-300 scale-110' : 'ring-transparent hover:scale-105'}`}></div>
                </div>
              </div>
            </div>
          </section>

          {/* --- FEATURES GRID --- */}
          <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition duration-300 group">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-2xl mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">🔋</div>
                  <h3 className="font-bold text-xl mb-3 dark:text-white">{text.features.batteryTitle}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{text.features.batteryDesc}</p>
                </div>
                <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition duration-300 group">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-2xl mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">🔇</div>
                  <h3 className="font-bold text-xl mb-3 dark:text-white">{text.features.ancTitle}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{text.features.ancDesc}</p>
                </div>
                <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition duration-300 group">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-2xl mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition">🌧️</div>
                  <h3 className="font-bold text-xl mb-3 dark:text-white">{text.features.waterTitle}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{text.features.waterDesc}</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* --- FOOTER S ODKAZEM --- */}
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-8 text-center transition-colors duration-500">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>{text.footer.rights}</span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span>
              {text.footer.created}{' '}
              <a 
                href="https://firefoxx.online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                FireFOXX Dev
              </a>
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ProductLanding;