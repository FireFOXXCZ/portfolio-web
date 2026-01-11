import { Menu, Search, RefreshCw, CheckCheck, Plus } from 'lucide-react'

export default function Header({ setIsSidebarOpen, activeTab, folders, activeFolderId, searchTerm, setSearchTerm, currentFolderUnread, totalItems, calendarCount, filterStatus, setFilterStatus, setRefreshTrigger, markAllAsRead, openAdd, loading }) {
  const getTitle = () => {
    if (activeTab === 'messages') return folders.find(f => f.id === activeFolderId)?.name || 'Zprávy';
    if (activeTab === 'services') return 'Ceník Služeb';
    if (activeTab === 'reviews') return 'Recenze';
    if (activeTab === 'calendar') return 'Pracovní Kalendář';
    if (activeTab === 'demos') return 'Live Demos';
    return 'Portfolio Projektů';
  }
  const statusColor = currentFolderUnread > 0 ? 'bg-red-500' : 'bg-green-500';

  return (
    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 md:mb-12 gap-6 bg-[#020617]/50 backdrop-blur-sm sticky top-0 z-30 py-4 -mx-4 px-4 md:-mx-12 md:px-12 border-b border-white/5">
        <div className="flex-1 w-full xl:w-auto">
            <div className="flex items-center gap-4 mb-4 xl:mb-2">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 bg-white/5 rounded-lg text-slate-300 md:hidden"><Menu className="w-6 h-6" /></button>
                <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">{getTitle()}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-medium uppercase tracking-wide ml-1">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <span className={`rounded-full h-2.5 w-2.5 ${activeTab === 'calendar' ? 'bg-blue-500' : statusColor}`}></span>
                    <span>{activeTab === 'messages' ? `${currentFolderUnread} Nepřečtených` : activeTab === 'calendar' ? `${calendarCount} událostí` : `${totalItems} záznamů`}</span>
                </div>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeTab !== 'calendar' && (
              <div className="relative group flex-1 xl:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input type="text" placeholder="Hledat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#1e293b]/50 border border-white/10 text-white text-sm rounded-xl pl-10 p-3.5 outline-none focus:border-indigo-500 transition-all"/>
              </div>
            )}
            <div className="flex gap-3">
                <button onClick={() => setRefreshTrigger(p => p + 1)} className="p-3.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl border border-white/10 group"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/></button>
                {['projects', 'services', 'calendar', 'demos'].includes(activeTab) && (
                  <button onClick={() => openAdd()} className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"><Plus className="w-5 h-5" /> Vytvořit</button>
                )}
            </div>
        </div>
    </header>
  )
}