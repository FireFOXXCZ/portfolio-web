import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Footer from '../components/Footer'
import Portfolio from '../components/Portfolio'
import Contact from '../components/Contact' // Přidán import

function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Contact /> {/* Vloženo před patičku */}
      <Footer />

    </div>
  )
}

export default Home