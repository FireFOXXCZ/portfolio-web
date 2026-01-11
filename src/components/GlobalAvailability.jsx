import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, Briefcase } from 'lucide-react'

export default function GlobalAvailability({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(() => checkCurrentStatus(events), 60000)
    return () => clearInterval(interval)
  }, [currentDate])

  async function fetchEvents() {
    setLoading(true)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
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

  function checkCurrentStatus(data) {
      const now = new Date()
      const active = data.find(e => {
          const start = new Date(e.start_time)
          const end = new Date(e.end_time)
          return now >= start && now <= end
      })
      setCurrentEvent(active || null)
  }

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
        days.push(<div key={`empty-${i}`} className={`h-12 rounded opacity-20 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}></div>)
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d)
        const isToday = new Date().toDateString() === dateObj.toDateString()
        
        const dayEvents = events.filter(e => {
            const start = new Date(e.start_time)
            return start.getDate() === d && start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear()
        }).sort((a,b) => new Date(a.start_time) - new Date(b.start_time))

        days.push(
            <div key={d} className={`min-h-[3rem] p-1 border rounded-lg flex flex-col gap-1 relative overflow-hidden transition-colors duration-500 ${
                isToday 
                ? (isDarkMode ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-indigo-50 border-indigo-400') 
                : (isDarkMode ? 'bg-[#1e293b]/50 border-white/5' : 'bg-slate-50 border-slate-200')
            }`}>
                <span className={`text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-indigo-500 text-white' : 'text-slate-500'
                }`}>{d}</span>
                <div className="flex flex-col gap-0.5">
                    {dayEvents.map(ev => {
                        let colorClass = isDarkMode ? 'bg-slate-600' : 'bg-slate-300';
                        if (ev.type === 'morning') colorClass = isDarkMode ? 'bg-amber-500/40 text-amber-300' : 'bg-amber-100 text-amber-700 border border-amber-200';
                        if (ev.type === 'night') colorClass = isDarkMode ? 'bg-blue-500/40 text-blue-300' : 'bg-blue-100 text-blue-700 border border-blue-200';
                        if (ev.type === 'off') colorClass = isDarkMode ? 'bg-green-500/40 text-green-300' : 'bg-green-100 text-green-700 border border-green-200';
                        
                        return (
                            <div key={ev.id} className={`h-1.5 w-full rounded-full ${colorClass}`} title={`${ev.title}`}></div>
                        )
                    })}
                </div>
            </div>
        )
    }
    return days
  }

  const getStatusColor = () => {
      if (!currentEvent || currentEvent.type === 'off') return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]'
      if (currentEvent.type === 'morning') return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
      if (currentEvent.type === 'night') return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
      return 'bg-slate-500'
  }

  const getStatusText = () => {
      if (!currentEvent) return 'Teď: Volno'
      return `Teď: ${currentEvent.title}`
  }

  return (
    <>
        {/* --- 1. WIDGET --- */}
        <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <button 
                onClick={() => setIsOpen(true)}
                className={`group flex items-center gap-3 pl-2 pr-5 py-2 backdrop-blur-xl border rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                    ? 'bg-[#0f172a]/80 border-white/10 hover:bg-[#1e293b] hover:border-indigo-500/30' 
                    : 'bg-white/90 border-slate-200 hover:bg-slate-50 hover:border-indigo-400 text-slate-900'
                }`}
            >
                <div className="relative">
                    <span className={`block w-3 h-3 rounded-full ${getStatusColor()}`}></span>
                    <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${getStatusColor()}`}></span>
                </div>
                <div className="text-left">
                    <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</p>
                    <p className={`text-xs font-bold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{getStatusText()}</p>
                </div>
            </button>
        </div>

        {/* --- 2. MODAL --- */}
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                
                <div className={`border rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] ${
                    isDarkMode ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                    
                    <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#162032] border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><CalendarIcon className="w-5 h-5"/></div>
                            <div>
                                <h3 className="text-lg font-bold">Můj Rozvrh</h3>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kdy pracuji a kdy mám volno</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className={`p-2 rounded-full transition ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}><X className="w-5 h-5"/></button>
                    </div>

                    <div className="p-5 overflow-y-auto custom-scrollbar">
                        <div className={`flex items-center justify-between mb-4 p-2 rounded-xl border ${isDarkMode ? 'bg-[#1e293b]/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-5 h-5"/></button>
                            <span className="font-bold capitalize">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white/10 rounded-lg"><ChevronRight className="w-5 h-5"/></button>
                        </div>

                        <div className="flex gap-3 justify-center mb-4 text-[10px] uppercase font-bold text-slate-500">
                             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Ranní</div>
                             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Noční</div>
                             <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Volno</div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-1 font-bold text-[10px] text-slate-400 text-center uppercase">
                            {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {loading ? <div className="col-span-7 py-10 text-center text-slate-500 text-xs">Načítám...</div> : renderCalendarDays()}
                        </div>

                        <div className={`mt-6 p-4 rounded-xl border ${isDarkMode ? 'bg-[#1e293b]/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-4 h-4 text-indigo-500"/>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Právě teď</span>
                            </div>
                            {currentEvent ? (
                                <div>
                                    <p className="font-bold text-lg">{currentEvent.title}</p>
                                    <p className="text-sm text-slate-500">{new Date(currentEvent.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(currentEvent.end_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                </div>
                            ) : (
                                <p className="text-green-600 font-bold text-lg">Mám volno</p>
                            )}
                        </div>
                    </div>
                    
                    <div className={`p-4 border-t ${isDarkMode ? 'bg-[#162032] border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                        <button onClick={() => {
                            setIsOpen(false);
                            const el = document.getElementById('kontakt');
                            if(el) el.scrollIntoView({behavior: 'smooth'});
                        }} className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-lg">
                           <Briefcase className="w-4 h-4"/> Domluvit spolupráci
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}