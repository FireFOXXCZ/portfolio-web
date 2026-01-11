import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, Briefcase } from 'lucide-react'

export default function GlobalAvailability() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Načtení dat při startu
  useEffect(() => {
    fetchEvents()
    
    // Interval pro aktualizaci "Teď" statusu každou minutu (kdyby se lámala hodina)
    const interval = setInterval(() => checkCurrentStatus(events), 60000)
    return () => clearInterval(interval)
  }, [currentDate])

  async function fetchEvents() {
    setLoading(true)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Načteme události pro aktuální měsíc (plus rezerva)
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', new Date(year, month - 1, 1).toISOString())
        .lte('end_time', new Date(year, month + 2, 1).toISOString())
    
    if (!error && data) {
        setEvents(data)
        checkCurrentStatus(data)
    }
    setLoading(false)
  }

  // Zjistí, co se děje PRÁVĚ TEĎ
  function checkCurrentStatus(data) {
      const now = new Date()
      const active = data.find(e => {
          const start = new Date(e.start_time)
          const end = new Date(e.end_time)
          return now >= start && now <= end
      })
      setCurrentEvent(active || null)
  }

  // --- HTML LOGIKA KALENDÁŘE ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
      return day === 0 ? 6 : day - 1
  }
  const monthNames = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"]

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-12 bg-white/5 rounded opacity-20"></div>)
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d)
        const isToday = new Date().toDateString() === dateObj.toDateString()
        
        const dayEvents = events.filter(e => {
            const start = new Date(e.start_time)
            return start.getDate() === d && start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()
        }).sort((a,b) => new Date(a.start_time) - new Date(b.start_time))

        days.push(
            <div key={d} className={`min-h-[3rem] p-1 border border-white/5 rounded-lg flex flex-col gap-1 relative overflow-hidden ${isToday ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#1e293b]/50'}`}>
                <span className={`text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>{d}</span>
                <div className="flex flex-col gap-0.5">
                    {dayEvents.map(ev => {
                        let colorClass = 'bg-slate-600';
                        if (ev.type === 'morning') colorClass = 'bg-amber-500/20 text-amber-300';
                        if (ev.type === 'night') colorClass = 'bg-blue-500/20 text-blue-300';
                        if (ev.type === 'off') colorClass = 'bg-green-500/20 text-green-300';
                        
                        return (
                            <div key={ev.id} className={`h-1.5 w-full rounded-full ${colorClass}`} title={`${ev.title} (${new Date(ev.start_time).getHours()}-${new Date(ev.end_time).getHours()})`}></div>
                        )
                    })}
                </div>
            </div>
        )
    }
    return days
  }

  // Barva a text pro Widget
  const getStatusColor = () => {
      if (!currentEvent) return 'bg-green-500 shadow-[0_0_10px_lime]' // Defaultně Volno, když nic není
      if (currentEvent.type === 'off') return 'bg-green-500 shadow-[0_0_10px_lime]'
      if (currentEvent.type === 'morning') return 'bg-amber-500 shadow-[0_0_10px_orange]'
      if (currentEvent.type === 'night') return 'bg-blue-500 shadow-[0_0_10px_blue]'
      return 'bg-slate-500'
  }

  const getStatusText = () => {
      if (!currentEvent) return 'Teď: Volno'
      return `Teď: ${currentEvent.title}`
  }

  return (
    <>
        {/* --- 1. PLOVOUCÍ WIDGET (vždy viditelný) --- */}
        <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <button 
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-3 pl-2 pr-5 py-2 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl hover:bg-[#1e293b] hover:border-indigo-500/30 transition-all duration-300 hover:scale-105"
            >
                <div className="relative">
                    <span className={`block w-3 h-3 rounded-full ${getStatusColor()}`}></span>
                    <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${getStatusColor()}`}></span>
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</p>
                    <p className="text-xs font-bold text-white whitespace-nowrap">{getStatusText()}</p>
                </div>
                {/* Tooltip hint */}
                <div className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                    Otevřít kalendář
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
            </button>
        </div>

        {/* --- 2. MODÁLNÍ OKNO S KALENDÁŘEM --- */}
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
                
                <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10 flex flex-col max-h-[85vh]">
                    
                    {/* Hlavička modalu */}
                    <div className="p-5 border-b border-white/10 bg-[#162032] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><CalendarIcon className="w-5 h-5"/></div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Můj Rozvrh</h3>
                                <p className="text-xs text-slate-400">Kdy pracuji a kdy mám volno</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 hover:text-white text-slate-400 rounded-full transition"><X className="w-5 h-5"/></button>
                    </div>

                    {/* Tělo kalendáře */}
                    <div className="p-5 overflow-y-auto custom-scrollbar bg-[#0f172a]">
                        
                        {/* Ovládání měsíce */}
                        <div className="flex items-center justify-between mb-4 bg-[#1e293b]/50 p-2 rounded-xl border border-white/5">
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><ChevronLeft className="w-5 h-5"/></button>
                            <span className="font-bold text-white capitalize">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><ChevronRight className="w-5 h-5"/></button>
                        </div>

                        {/* Vysvětlivky */}
                        <div className="flex gap-3 justify-center mb-4 text-[10px] uppercase font-bold text-slate-400">
                             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Ranní</div>
                             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Noční</div>
                             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Volno</div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-slate-600 uppercase">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {loading ? <div className="col-span-7 py-10 text-center text-slate-500 text-xs">Načítám...</div> : renderCalendarDays()}
                        </div>

                        {/* Detail vybraného dne (Dnes) */}
                        <div className="mt-6 p-4 bg-[#1e293b]/50 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-4 h-4 text-indigo-400"/>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Právě teď</span>
                            </div>
                            {currentEvent ? (
                                <div>
                                    <p className="text-white font-bold text-lg">{currentEvent.title}</p>
                                    <p className="text-sm text-slate-400">{new Date(currentEvent.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(currentEvent.end_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                    {currentEvent.description && <p className="text-xs text-slate-500 mt-2 italic border-t border-white/5 pt-2">"{currentEvent.description}"</p>}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-green-400 font-bold text-lg">Mám volno</p>
                                    <p className="text-sm text-slate-400">Napiš mi, jsem k dispozici.</p>
                                </div>
                            )}
                        </div>

                    </div>
                    
                    {/* Footer modalu */}
                    <div className="p-4 bg-[#162032] border-t border-white/10 text-center">
                        <a href="#contact" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-500/20">
                           <Briefcase className="w-4 h-4"/> Domluvit spolupráci
                        </a>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}