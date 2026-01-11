import { LogOut, FolderKanban, ShoppingBag, MonitorPlay, Calendar as CalendarIcon, Star, FolderPlus, Home, X, Inbox, Archive, Clock, CheckSquare, Tag, Mail, Bell, Folder, Trash2, GripVertical, Pencil } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar({ 
    isOpen, setIsOpen, activeTab, setActiveTab, folders, activeFolderId, setActiveFolderId, unreadCounts, 
    pendingReviewsCount, onLogout, setIsFolderModalOpen, onDropOnFolder, onDeleteFolder, onEditFolder,
    draggedFolderId, setDraggedFolderId, onFolderReorder 
}) {
  const [dragOverId, setDragOverId] = useState(null);
  const [reorderTargetId, setReorderTargetId] = useState(null);

  const getFolderIcon = (icon) => {
    const icons = { inbox: Inbox, check: CheckSquare, archive: Archive, clock: Clock, star: Star, tag: Tag, mail: Mail, bell: Bell };
    const Icon = icons[icon] || Folder;
    return <Icon className="w-4 h-4"/>
  }

  return (
    <>
      {isOpen && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)}></div>)}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/95 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col shadow-[5px_0_30px_rgba(0,0,0,0.3)] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
         <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white md:hidden"><X className="w-6 h-6"/></button>
         
         <div className="mb-12 pl-2">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg text-white font-bold">F</div>
                <h1 className="font-bold text-xl tracking-tight text-white">FireFOXX</h1>
            </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            <button onClick={() => { setActiveTab('projects'); setIsOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all group ${activeTab === 'projects' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><FolderKanban className="w-5 h-5" /> Projekty</button>
            <button onClick={() => { setActiveTab('services'); setIsOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all group ${activeTab === 'services' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><ShoppingBag className="w-5 h-5" /> Ceník Služeb</button>
            <button onClick={() => { setActiveTab('demos'); setIsOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all group ${activeTab === 'demos' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><MonitorPlay className="w-5 h-5" /> Live Demos</button>
            <button onClick={() => { setActiveTab('calendar'); setIsOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all group ${activeTab === 'calendar' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><CalendarIcon className="w-5 h-5" /> Kalendář</button>
            <button onClick={() => { setActiveTab('reviews'); setIsOpen(false) }} className={`flex items-center justify-between w-full p-3.5 rounded-xl font-medium transition-all group border ${activeTab === 'reviews' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'}`}>
                <div className="flex items-center gap-3"><Star className="w-5 h-5" /> Recenze</div>
                {pendingReviewsCount > 0 && (<span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold rounded-lg">{pendingReviewsCount}</span>)}
            </button>

            <div className="flex items-center justify-between px-3 mt-8 mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zprávy</p>
                <button onClick={() => setIsFolderModalOpen()} className="text-slate-500 hover:text-indigo-400 transition"><FolderPlus className="w-4 h-4"/></button>
            </div>

            <div className="space-y-1.5">
              {folders.map(folder => (
                  <div 
                    key={folder.id} 
                    draggable
                    onDragStart={(e) => {
                        setDraggedFolderId(folder.id);
                        e.dataTransfer.setData("drag-type", "folder");
                        e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => { 
                        e.preventDefault(); 
                        setDragOverId(folder.id); 
                        if (draggedFolderId && draggedFolderId !== folder.id) setReorderTargetId(folder.id);
                    }} 
                    onDragLeave={() => { setDragOverId(null); setReorderTargetId(null); }}
                    onDrop={(e) => { 
                        const dragType = e.dataTransfer.getData("drag-type");
                        if (dragType === "folder") onFolderReorder(draggedFolderId, folder.id);
                        else onDropOnFolder(e, folder.id); 
                        setDragOverId(null); setReorderTargetId(null); setDraggedFolderId(null);
                    }} 
                    className={`relative rounded-xl transition-all duration-300 ${
                        dragOverId === folder.id ? 'scale-105 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-transparent'
                    } ${reorderTargetId === folder.id ? 'border-t-2 border-indigo-500 mt-2' : ''}`}
                  >
                    <button onClick={() => { setActiveTab('messages'); setActiveFolderId(folder.id); setIsOpen(false) }} 
                        className={`flex items-center justify-between w-full p-3.5 rounded-xl font-medium transition-all group border ${activeTab === 'messages' && activeFolderId === folder.id ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}>
                        <div className="flex items-center gap-3">
                            <GripVertical className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
                            <div className={`transition-transform duration-300 ${dragOverId === folder.id ? 'scale-125 text-indigo-400' : ''}`}>
                                {getFolderIcon(folder.icon)}
                            </div>
                            <span className="truncate max-w-[100px] text-left">{folder.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {unreadCounts[folder.id] > 0 && (<span className="min-w-[20px] h-5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg flex items-center justify-center px-1">{unreadCounts[folder.id]}</span>)}
                            {!['inbox', 'archive'].includes(folder.icon) && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Pencil onClick={(e) => { e.stopPropagation(); onEditFolder(folder); }} className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-400" />
                                    <Trash2 onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder); }} className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" />
                                </div>
                            )}
                        </div>
                    </button>
                  </div>
              ))}
            </div>
            <div className="h-px bg-white/5 my-8"></div>
            <a href="/" className="flex items-center gap-3 w-full p-3.5 rounded-xl font-medium text-slate-400 hover:text-white transition group border border-transparent"><Home className="w-5 h-5 group-hover:text-green-400 transition-colors" /> Zpět na web</a>
        </nav>
        <button onClick={onLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 mt-auto p-4 hover:bg-red-500/5 rounded-xl transition group border border-transparent hover:border-red-500/10"><LogOut className="w-5 h-5 group-hover:-translate-x-1 transition" /> <span className="font-medium">Odhlásit se</span></button>
      </aside>
    </>
  )
}