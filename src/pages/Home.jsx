import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Footer from '../components/Footer'
import Portfolio from '../components/Portfolio'
import Contact from '../components/Contact'
import Reviews from '../components/Reviews'
import GlobalAvailability from '../components/GlobalAvailability' 
import LiveDemos from '../components/LiveDemos'

// Přidány props: lang, toggleLang, t
function Home({ lang, toggleLang, t }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-[#0f172a]' : 'light bg-slate-50'} min-h-screen font-sans transition-colors duration-500 overflow-x-hidden relative`}>
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-400/10'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-400/10'}`}></div>
      </div>

      {/* Navbar potřebuje vše pro přepínač jazyků */}
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        lang={lang} 
        toggleLang={toggleLang} 
        t={t.nav} 
      />
      
      <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors duration-500`}>
        {/* Hero potřebuje své překlady */}
        <Hero isDarkMode={isDarkMode} t={t.hero} />
        
        {/* Tady budeš postupně přidávat t.services, t.portfolio atd. */}
        <Services isDarkMode={isDarkMode} t={t.services} lang={lang} />
        <Portfolio isDarkMode={isDarkMode} t={t.projects} lang={lang} />
        <LiveDemos isDarkMode={isDarkMode} t={t.demos} lang={lang} />
        <Reviews isDarkMode={isDarkMode} t={t.reviews} />
        <Contact isDarkMode={isDarkMode} t={t.contact} lang={lang} />
        <Footer isDarkMode={isDarkMode} t={t.footer} />
      </div>

      <GlobalAvailability isDarkMode={isDarkMode} lang={lang} />
    </div>
  )
}

export default Home