import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { ExternalLink, X, ChevronLeft, ChevronRight, Maximize2, Layers, ZoomIn, ZoomOut } from 'lucide-react'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Lightbox stavy
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  // NOVÉ: Stav pro zoom
  const [isZoomed, setIsZoomed] = useState(false)

  // --- NASTAVENÍ STRÁNKOVÁNÍ ---
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 2

  useEffect(() => {
    getProjects()
  }, [])

  // Ovládání klávesnicí
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (!lightboxOpen) return
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowRight') nextImage(e)
        if (e.key === 'ArrowLeft') prevImage(e)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxIndex])

  async function getProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true }) // Od nejstaršího
      
      if (error) throw error
      setProjects(data)
    } catch (error) {
      console.error("Chyba:", error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- LOGIKA STRÁNKOVÁNÍ ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem)
  
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE) || 1

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1) }

  // --- LIGHTBOX LOGIKA ---
  const openLightbox = (images, index = 0) => {
    if (!images || images.length === 0) return
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
    setIsZoomed(false) // Reset zoomu při otevření
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setIsZoomed(false)
  }

  const nextImage = (e) => {
    e?.stopPropagation()
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
    setIsZoomed(false) // Reset zoomu při změně obrázku
  }

  const prevImage = (e) => {
    e?.stopPropagation()
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
    setIsZoomed(false) // Reset zoomu při změně obrázku
  }

  const toggleZoom = (e) => {
    e?.stopPropagation()
    setIsZoomed(!isZoomed)
  }

  return (
    <section id="portfolio" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/5 relative">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">Vybrané projekty</h2>
      
      {loading ? (
        <p className="text-slate-500">Načítám projekty...</p>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
            {currentProjects.map((project) => {
                let gallery = []
                if (project.images && project.images.length > 0) {
                    gallery = project.images
                } else if (project.image_url) {
                    gallery = [project.image_url]
                }
                const thumb = gallery.length > 0 ? gallery[0] : "https://placehold.co/800x600/1e293b/FFF?text=No+Image"

                return (
                <div key={project.id} className="rounded-2xl overflow-hidden border border-white/10 group bg-[#1e293b]/30 hover:border-blue-500/30 transition duration-500 flex flex-col h-full">
                    
                    {/* OBRÁZEK (Klikatelný) */}
                    <div 
                        className="h-64 bg-slate-800 relative overflow-hidden cursor-pointer group/img"
                        onClick={() => openLightbox(gallery)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60 z-10 transition group-hover/img:opacity-40"></div>
                        
                        <img 
                        src={thumb} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                        />

                        {/* Ikonka zvětšení */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition duration-300 z-20">
                            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm border border-white/10">
                                <Maximize2 className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* BADGE: Počet fotek */}
                        {gallery.length > 1 && (
                            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white shadow-lg">
                                <Layers className="w-3 h-3 text-blue-400" />
                                +{gallery.length - 1} další
                            </div>
                        )}
                    </div>

                    {/* Texty */}
                    <div className="p-8 relative z-20 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3 flex-1">
                        {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        {project.tags && project.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-500/5 text-blue-400 border border-blue-500/10">
                            {tag}
                            </span>
                        ))}
                        </div>

                        {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-400 transition">
                            Zobrazit web <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )
            })}
            </div>

            {/* STRÁNKOVÁNÍ */}
            <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-white/5">
                <button onClick={prevPage} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-slate-400 font-mono text-sm">Strana <span className="text-white font-bold">{currentPage}</span> z {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </>
      )}

      {/* --- LIGHTBOX (S Zoomem) --- */}
      {lightboxOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200" onClick={closeLightbox}>
              
              {/* OVLÁDACÍ PRVKY NAHOŘE */}
              <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
                  {/* Tlačítko ZOOM */}
                  <button 
                    onClick={toggleZoom} 
                    className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                    title={isZoomed ? "Oddálit" : "Přiblížit"}
                  >
                      {isZoomed ? <ZoomOut className="w-8 h-8"/> : <ZoomIn className="w-8 h-8"/>}
                  </button>

                  {/* Tlačítko ZAVŘÍT */}
                  <button 
                    onClick={closeLightbox} 
                    className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                  >
                      <X className="w-10 h-10"/>
                  </button>
              </div>

              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  
                  {/* Šipky (skryjí se, když je přiblíženo, aby nezavazely) */}
                  {!isZoomed && lightboxImages.length > 1 && (
                      <button onClick={prevImage} className="absolute left-4 sm:left-10 p-3 bg-black/50 hover:bg-blue-600 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-40 group border border-white/10">
                          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition"/>
                      </button>
                  )}

                  {/* HLAVNÍ OBRÁZEK S LOGIKOU ZOOMU */}
                  <div 
                    className={`transition-transform duration-300 ease-out flex items-center justify-center ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    onClick={toggleZoom}
                    style={{ 
                        transform: isZoomed ? 'scale(1.8)' : 'scale(1)', // Zoom faktor 1.8x
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                  >
                      <img 
                        src={lightboxImages[lightboxIndex]} 
                        className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl" 
                        alt="Gallery" 
                      />
                  </div>

                  {!isZoomed && lightboxImages.length > 1 && (
                      <button onClick={nextImage} className="absolute right-4 sm:right-10 p-3 bg-black/50 hover:bg-blue-600 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-40 group border border-white/10">
                          <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition"/>
                      </button>
                  )}

                  {/* Počítadlo (skryté při zoomu) */}
                  {!isZoomed && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-medium backdrop-blur-sm border border-white/10">
                          {lightboxIndex + 1} / {lightboxImages.length}
                      </div>
                  )}
              </div>
          </div>
      )}
    </section>
  )
}