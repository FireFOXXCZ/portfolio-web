import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export default function Calendar({ currentDate, setCurrentDate, calendarEvents, openAdd, openEdit }) {
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return day === 0 ? 6 : day - 1; 
  }
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  const monthNames = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

  for (let i = 0; i < firstDay; i++) { 
    days.push(<div key={`empty-${i}`} className="h-32 bg-[#0f172a]/30 border border-white/5 opacity-50"></div>); 
  }

  for (let d = 1; d <= daysInMonth; d++) {
      const now = new Date();
      const isToday = now.getDate() === d && now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear();
      
      const dayEvents = calendarEvents.filter(e => {
          const start = new Date(e.start_time);
          return start.getDate() === d && start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear();
      }).sort((a,b) => new Date(a.start_time) - new Date(b.start_time));

      days.push(
          <div key={d} onClick={() => openAdd(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))}
               className={`h-32 p-2 border border-white/5 relative group transition-colors hover:bg-white/5 flex flex-col gap-1 cursor-pointer ${isToday ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#1e293b]/40'}`}>
              <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400 group-hover:text-white'}`}>{d}</span>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {dayEvents.map(ev => {
                    let colorClass = ev.type === 'morning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : ev.type === 'night' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30';
                    
                    const timeStr = new Date(ev.start_time).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute:'2-digit'});

                    return (
                        <div 
                            key={ev.id} 
                            onClick={(e) => { 
                                e.stopPropagation(); // DŮLEŽITÉ: Zabrání spuštění openAdd na pozadí
                                openEdit(ev); // Předá kompletní objekt ze Supabase
                            }} 
                            className={`px-2 py-1 rounded-md text-[10px] font-bold border truncate flex justify-between items-center hover:scale-[1.02] transition ${colorClass}`}
                        >
                          <span>{ev.title || 'Směna'}</span>
                          <span className="opacity-60">{timeStr}</span>
                        </div>
                    )
                })}
              </div>
          </div>
      );
  }

  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-6 bg-[#1e293b]/50 p-4 rounded-2xl border border-white/5">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"><ChevronLeft/></button>
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"><ChevronRight/></button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => <div key={day} className="bg-[#0f172a] p-3 text-center text-xs font-bold text-slate-500 uppercase">{day}</div>)}
            {days}
        </div>
    </div>
  )
}