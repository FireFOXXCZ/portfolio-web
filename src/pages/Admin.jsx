import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { LogOut, FolderKanban, ShoppingBag, Trash2, Plus, Loader2, Pencil, Home, X, AlertTriangle, Save, Search, Upload, ChevronLeft, ChevronRight, AtSign, Folder, FolderPlus, Inbox, Archive, Clock, CheckSquare, GripVertical, CheckCircle2, Eye, CheckCheck, RefreshCw, Star, ThumbsUp, ThumbsDown, Menu, Briefcase, ArrowUp, Calendar as CalendarIcon, Clock as ClockIcon, MonitorPlay, ExternalLink } from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()
   
  // --- STAVY ---
  const [activeTab, setActiveTab] = useState('projects') 
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
   
  // REALTIME TRIGGER
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // FILTROVÁNÍ A STRÁNKOVÁNÍ
  const [filterStatus, setFilterStatus] = useState('all') 
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const ITEMS_PER_PAGE = activeTab === 'services' ? 10 : 5 

  // POČÍTADLA & UI
  const [unreadCounts, setUnreadCounts] = useState({})      
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0) 
   
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Folders
  const [folders, setFolders] = useState([])
  const [activeFolderId, setActiveFolderId] = useState(null)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
   
  // Drag & Drop
  const [draggedMessage, setDraggedMessage] = useState(null)
  const [dragOverFolderId, setDragOverFolderId] = useState(null) 
  const [allowDrag, setAllowDrag] = useState(false) 

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [itemToDelete, setItemToDelete] = useState(null)

  // --- KALENDÁŘ STAVY ---
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarEvents, setCalendarEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  // Form Data
  const initialFormState = { id: null, title: '', price: '', description: '', images: [], tags: [], start_time: '', end_time: '', type: 'morning', url: '' }
  const [formData, setFormData] = useState(initialFormState)
  const [tagInput, setTagInput] = useState('') 
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const currentFolderUnread = activeTab === 'messages' ? (unreadCounts[activeFolderId] || 0) : 0;
  const statusColor = currentFolderUnread > 0 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500 shadow-[0_0_10px_lime]';

  // --- INIT & REALTIME ---
  useEffect(() => {
    if (window.$crisp) { window.$crisp.push(['do', 'chat:hide']); }

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      await fetchFolders()
      await fetchUnreadCounts()
    }
    init()

    const channel = supabase
      .channel('global-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          fetchUnreadCounts()
          if (activeTab === 'messages') setRefreshTrigger(prev => prev + 1)
          if (payload.eventType === 'INSERT') showToast('Nová zpráva!')
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
          fetchUnreadCounts()
          if (activeTab === 'reviews') setRefreshTrigger(prev => prev + 1)
          if (payload.eventType === 'INSERT') showToast('Nová recenze ke schválení!')
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, (payload) => {
         if (activeTab === 'calendar') setRefreshTrigger(prev => prev + 1)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_demos' }, (payload) => {
         if (activeTab === 'demos') setRefreshTrigger(prev => prev + 1)
      })
      .subscribe()

    return () => { 
        supabase.removeChannel(channel)
        if (window.$crisp) { window.$crisp.push(['do', 'chat:show']); }
    }
  }, [activeTab])

  // --- FETCH DATA ---
  useEffect(() => {
      if (activeTab === 'messages' && !activeFolderId) return 
      
      const isBackgroundRefresh = refreshTrigger > 0;
      
      if (activeTab === 'calendar') {
        fetchCalendarEvents()
      } else {
        fetchData(!isBackgroundRefresh) 
      }
      fetchUnreadCounts()

  }, [activeTab, activeFolderId, refreshTrigger, filterStatus, currentPage, searchTerm, currentDate]) 

  useEffect(() => { setCurrentPage(1) }, [activeFolderId, filterStatus, activeTab])

  // --- DATA OPERATIONS ---
  async function fetchCalendarEvents() {
    setLoading(true)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', new Date(year, month - 1, 20).toISOString()) 
        .lte('end_time', new Date(year, month + 2, 10).toISOString())
    
    if (!error) {
        setCalendarEvents(data || [])
    }
    setLoading(false)
  }

  async function fetchUnreadCounts() {
      // 1. Zprávy
      const { data: msgData } = await supabase.from('messages').select('folder_id').eq('is_read', false)
      if (msgData) {
          const counts = {}
          msgData.forEach(msg => { if (msg.folder_id) counts[msg.folder_id] = (counts[msg.folder_id] || 0) + 1 })
          setUnreadCounts(counts)
      }
      // 2. Recenze
      const { count: reviewCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false)
      setPendingReviewsCount(reviewCount || 0)
  }

  async function fetchFolders() {
      const { data } = await supabase.from('folders').select('*').order('id', { ascending: true })
      if (data && data.length > 0) {
          setFolders(data)
          if (!activeFolderId) setActiveFolderId(data[0].id)
      }
  }

  async function fetchData(showLoading = true) {
    if (showLoading) setLoading(true)
    
    let query;

    if (activeTab === 'messages') {
        if (!activeFolderId) { setLoading(false); return }
        
        query = supabase.from('messages')
            .select('*, products(name)', { count: 'exact' })
            .eq('folder_id', activeFolderId)

        if (filterStatus === 'unread') query = query.eq('is_read', false)
        if (filterStatus === 'read') query = query.eq('is_read', true)
        if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`)
        query = query.order('created_at', { ascending: false })

    } else if (activeTab === 'reviews') {
        query = supabase.from('reviews').select('*', { count: 'exact' })
        if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`)
        query = query.order('is_approved', { ascending: true }).order('created_at', { ascending: false })

    } else if (activeTab === 'demos') {
        // --- LIVE DEMOS ---
        query = supabase.from('live_demos').select('*', { count: 'exact' })
        if (searchTerm) query = query.ilike('title', `%${searchTerm}%`)
        query = query.order('created_at', { ascending: false })

    } else {
        // --- PROJEKTY A SLUŽBY ---
        const table = activeTab === 'services' ? 'products' : 'projects'
        query = supabase.from(table).select('*', { count: 'exact' })

        // Řazení
        if (activeTab === 'services') {
            query = query.order('price', { ascending: true })
        } else {
            query = query.order('created_at', { ascending: false })
        }

        if (searchTerm) {
            if (activeTab === 'services') query = query.ilike('name', `%${searchTerm}%`)
            else query = query.ilike('title', `%${searchTerm}%`)
        }
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (!error) {
        setItems(data || [])
        setTotalItems(count || 0)
    }
    setLoading(false)
  }

  // --- ACTIONS ---
  async function handleLogout() {
      await supabase.auth.signOut()
      navigate('/login')
  }

  async function markAllAsRead() {
      if (activeTab !== 'messages' || currentFolderUnread === 0) return;
      const { error } = await supabase.from('messages').update({ is_read: true }).eq('folder_id', activeFolderId).eq('is_read', false)
      if (!error) {
          setRefreshTrigger(prev => prev + 1)
          fetchUnreadCounts()
          showToast("Vše přečteno")
      }
  }

  async function markAsRead(id) {
      setItems(items.map(item => item.id === id ? { ...item, is_read: true } : item))
      await supabase.from('messages').update({ is_read: true }).eq('id', id)
      setRefreshTrigger(prev => prev + 1)
      fetchUnreadCounts()
  }

  async function toggleReviewStatus(review) {
      const newStatus = !review.is_approved
      setItems(items.map(item => item.id === review.id ? { ...item, is_approved: newStatus } : item))
      const { error } = await supabase.from('reviews').update({ is_approved: newStatus }).eq('id', review.id)
      if (!error) {
          showToast(newStatus ? "Recenze schválena" : "Recenze skryta")
          setRefreshTrigger(p => p + 1)
      } else {
          showToast("Chyba při změně stavu", 'error')
          setRefreshTrigger(p => p + 1)
      }
  }

  // --- MAZÁNÍ ---
  async function executeDel() {
      if (!itemToDelete) return;
      
      let table = 'messages';
      if (activeTab === 'projects') table = 'projects';
      if (activeTab === 'services') table = 'products';
      if (activeTab === 'reviews') table = 'reviews';
      if (activeTab === 'calendar') table = 'calendar_events'; 
      if (activeTab === 'demos') table = 'live_demos';

      const { error } = await supabase.from(table).delete().eq('id', itemToDelete.id)
      
      if (error) {
          console.error("Chyba při mazání:", error)
          showToast("Chyba: " + error.message, 'error')
      } else {
          if (activeTab === 'calendar') {
             setCalendarEvents(prev => prev.filter(e => e.id !== itemToDelete.id))
          } else {
             setItems(prev => prev.filter(item => item.id !== itemToDelete.id))
          }
          showToast("Položka smazána", 'success')
          setRefreshTrigger(prev => prev + 1)
          fetchUnreadCounts()
      }
      
      setIsDeleteOpen(false)
      setItemToDelete(null)
  }

  const confirmDel = (item) => { setItemToDelete(item); setIsDeleteOpen(true) }

  // --- UI HELPERS ---
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1) }
  const prevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1) }

  // --- ZBYTEK FUNKCÍ ---
  async function createFolder(e) { e.preventDefault(); if (!newFolderName.trim()) return; const { error } = await supabase.from('folders').insert([{ name: newFolderName, icon: 'folder' }]); if (!error) { setNewFolderName(''); setIsFolderModalOpen(false); fetchFolders() } }
  const handleDragStart = (e, message) => { if (!allowDrag) { e.preventDefault(); return }; setDraggedMessage(message); e.dataTransfer.effectAllowed = "move"; const ghost = document.createElement('div'); ghost.style.display = 'none'; document.body.appendChild(ghost); e.dataTransfer.setDragImage(ghost, 0, 0) }
  const handleDragOverFolder = (e, folderId) => { e.preventDefault(); setDragOverFolderId(folderId) }
  const handleDragLeaveFolder = (e) => { setDragOverFolderId(null) }
  const handleDropOnFolder = async (e, targetFolderId) => { e.preventDefault(); setDragOverFolderId(null); if (!draggedMessage) return; setItems(items.filter(item => item.id !== draggedMessage.id)); await supabase.from('messages').update({ folder_id: targetFolderId }).eq('id', draggedMessage.id); fetchUnreadCounts(); setDraggedMessage(null); setRefreshTrigger(prev => prev + 1) }
  
  const showToast = (msg, type = 'success') => { setToast({ show: true, message: msg, type }); setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000) }
  
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); showToast(`Zkopírováno: ${text}`) }
  
  async function uploadFilesToSupabase(files) { if (!files?.length) return; setIsUploading(true); const newUrls = []; try { for (const file of files) { if (!file.type.startsWith('image/')) continue; const fileExt = file.name.split('.').pop(); const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`; const filePath = `${fileName}`; await supabase.storage.from('portfolio').upload(filePath, file); const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath); newUrls.push(data.publicUrl) } setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] })) } catch (e) { alert(e.message) } finally { setIsUploading(false); setIsDragging(false) } }
  const handleFileInputChange = (e) => uploadFilesToSupabase(Array.from(e.target.files))
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files.length > 0) uploadFilesToSupabase(Array.from(e.dataTransfer.files)) }
  const removeImage = (index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  const removeTag = (tagToRemove) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  const getFolderIcon = (icon) => { const icons = { inbox: Inbox, check: CheckSquare, archive: Archive, clock: Clock }; const Icon = icons[icon] || Folder; return <Icon className="w-4 h-4"/> }
  
  // --- OPRAVA DATA ---
  const toLocalISOString = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  const openAdd = (dateOverride = null) => { 
      const now = new Date();
      // Default na zítra 6:00 - 18:00
      let startBase = new Date(now); startBase.setDate(now.getDate() + 1);
      let endBase = new Date(now); endBase.setDate(now.getDate() + 1);

      // POKUD JE PŘEDÁNO DATUM Z KLIKNUTÍ (dateOverride), POUŽIJEME HO
      const targetDate = dateOverride || (activeTab === 'calendar' ? selectedDate : null);

      if (activeTab === 'calendar' && targetDate) {
         startBase = new Date(targetDate);
         endBase = new Date(targetDate);
      }
      
      startBase.setHours(6, 0, 0, 0);
      endBase.setHours(18, 0, 0, 0);

      // Použijeme toLocalISOString místo toISOString
      setFormData({ 
          ...initialFormState, 
          start_time: toLocalISOString(startBase),
          end_time: toLocalISOString(endBase),
          type: 'morning'
      }); 
      setTagInput(''); 
      setIsEditing(false); 
      setIsFormOpen(true) 
  }

  const openEdit = (item) => { 
      setIsEditing(true); 
      setTagInput(''); 
      setIsFormOpen(true); 
      
      if (activeTab === 'calendar') {
          const start = item.start_time ? toLocalISOString(new Date(item.start_time)) : '';
          const end = item.end_time ? toLocalISOString(new Date(item.end_time)) : '';
          setFormData({
              id: item.id,
              title: item.title,
              description: item.description,
              start_time: start,
              end_time: end,
              type: item.type,
              images: [], tags: []
          })
      } else if (activeTab === 'demos') {
          // Editace Live Demos
          setFormData({
              id: item.id,
              title: item.title,
              url: item.url,
              description: item.description,
              images: [], tags: []
          })
      } else {
        const images = item.images?.length ? item.images : (item.image_url ? [item.image_url] : []); 
        setFormData({ id: item.id, title: item.name || item.title, price: item.price, description: item.description, images, tags: item.tags || [] }) 
      }
  }
  
  const handleSave = async (e) => { 
      e.preventDefault(); 
      setIsSubmitting(true); 
      let table = activeTab === 'services' ? 'products' : 'projects'; 
      if (activeTab === 'calendar') table = 'calendar_events';
      if (activeTab === 'demos') table = 'live_demos';

      let payload = {};
      
      if (activeTab === 'services') {
          payload = { name: formData.title, price: formData.price, description: formData.description, tags: formData.tags }
      } else if (activeTab === 'projects') {
          payload = { title: formData.title, description: formData.description, images: formData.images, image_url: formData.images[0]||null, tags: formData.tags }; 
      } else if (activeTab === 'calendar') {
          payload = { 
              title: formData.title, 
              start_time: new Date(formData.start_time).toISOString(),
              end_time: new Date(formData.end_time).toISOString(),
              type: formData.type,
              description: formData.description 
          }
      } else if (activeTab === 'demos') {
          // --- AUTO-FIX URL PRO LIVE DEMOS ---
          let cleanUrl = formData.url.trim();
          
          // Pokud uživatel zadal cestu s index.html/php, automaticky ji vyčistíme
          if (cleanUrl.endsWith('index.html')) {
              cleanUrl = cleanUrl.replace('index.html', '');
          } else if (cleanUrl.endsWith('index.php')) {
              cleanUrl = cleanUrl.replace('index.php', '');
          }

          // Pokud to není soubor a chybí lomítko na konci, přidáme ho (pro hezčí URL)
          if (!cleanUrl.endsWith('/') && !cleanUrl.endsWith('.html') && !cleanUrl.endsWith('.php')) {
              cleanUrl += '/';
          }
          
          payload = { title: formData.title, url: cleanUrl, description: formData.description }
      }
      
      const q = isEditing ? supabase.from(table).update(payload).eq('id', formData.id) : supabase.from(table).insert([payload]); 
      const { error } = await q; 
      if (!error) { 
          if (activeTab === 'calendar') fetchCalendarEvents();
          else fetchData(); 
          setIsFormOpen(false); 
          setRefreshTrigger(prev => prev + 1) 
      } else { 
          showToast(error.message, 'error')
      } 
      setIsSubmitting(false) 
  }
  
  const openLightbox = (images, index = 0) => { if (images?.length) { setLightboxImages(images); setLightboxIndex(index); setLightboxOpen(true) } }
  const nextImage = (e) => { e?.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % lightboxImages.length) }
  const prevImage = (e) => { e?.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length) }

  // --- KALENDÁŘ HELPERY ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
      const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return day === 0 ? 6 : day - 1; // 0 je neděle, chci 0 = pondělí
  }
  
  const renderCalendar = () => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];
      const monthNames = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

      // Prázdné buňky
      for (let i = 0; i < firstDay; i++) {
          days.push(<div key={`empty-${i}`} className="h-32 bg-[#0f172a]/30 border border-white/5 opacity-50"></div>);
      }

      // Dny v měsíci
      for (let d = 1; d <= daysInMonth; d++) {
          const now = new Date();
          const isToday = now.getDate() === d && now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear();
          
          const dayEvents = calendarEvents.filter(e => {
              const start = new Date(e.start_time);
              return start.getDate() === d && start.getMonth() === currentDate.getMonth() && start.getFullYear() === currentDate.getFullYear();
          }).sort((a,b) => new Date(a.start_time) - new Date(b.start_time));

          days.push(
              <div key={d} 
                   onClick={() => { 
                       const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                       setSelectedDate(clickedDate); 
                       openAdd(clickedDate); 
                    }}
                   className={`h-32 p-2 border border-white/5 relative group transition-colors hover:bg-white/5 flex flex-col gap-1 overflow-hidden cursor-pointer ${isToday ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#1e293b]/40'}`}>
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400 group-hover:text-white'}`}>{d}</span>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                    {dayEvents.map(ev => {
                        let colorClass = 'bg-slate-600';
                        if (ev.type === 'morning') colorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30'; 
                        if (ev.type === 'night') colorClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30'; 
                        if (ev.type === 'off') colorClass = 'bg-green-500/20 text-green-300 border-green-500/30'; 

                        const timeStr = new Date(ev.start_time).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute:'2-digit'});
                        
                        return (
                            <div key={ev.id} 
                                 onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                                 className={`px-2 py-1 rounded-md text-[10px] font-bold border truncate flex items-center justify-between hover:scale-[1.02] transition ${colorClass}`}>
                                <span>{ev.title || (ev.type === 'morning' ? 'Ranní' : ev.type === 'night' ? 'Noční' : 'Volno')}</span>
                                <span className="opacity-70">{timeStr}</span>
                            </div>
                        )
                    })}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><Plus className="w-4 h-4 text-slate-400 hover:text-white"/></div>
              </div>
          );
      }

      return (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
               {/* Ovládání měsíce */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#1e293b]/50 p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
                 <div className="flex w-full sm:w-auto justify-between sm:justify-start items-center gap-4 order-2 sm:order-1">
                     <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"><ChevronLeft className="w-6 h-6"/></button>
                     <h2 className="text-xl font-bold text-white uppercase tracking-widest sm:hidden">{monthNames[currentDate.getMonth()]} <span className="text-indigo-500">{currentDate.getFullYear()}</span></h2>
                     <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"><ChevronRight className="w-6 h-6"/></button>
                 </div>
                 <h2 className="text-xl font-bold text-white uppercase tracking-widest hidden sm:block order-1 sm:order-2">{monthNames[currentDate.getMonth()]} <span className="text-indigo-500">{currentDate.getFullYear()}</span></h2>
              </div>

              {/* Grid Dnů */}
              <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="min-w-[800px]">
                      <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                          {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
                              <div key={day} className="bg-[#0f172a] p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
                          ))}
                          {days}
                      </div>
                  </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 sm:hidden text-center flex items-center justify-center gap-1"><ArrowUp className="w-3 h-3 rotate-90"/> Posouváním do stran zobrazíte celý kalendář</p>
          </div>
      )
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans selection:bg-indigo-500 selection:text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] opacity-50"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] opacity-50"></div>
      </div>

      {isSidebarOpen && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>)}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/95 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col shadow-[5px_0_30px_rgba(0,0,0,0.3)] overflow-y-auto custom-scrollbar transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
         <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white md:hidden"><X className="w-6 h-6"/></button>
         <div className="mb-12 pl-2 flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-lg ring-1 ring-white/20">F</div>
                <h1 className="font-bold text-xl tracking-tight text-white">FireFOXX</h1>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-bold pl-12 mt-[-10px]">Admin Suite</p>
        </div>
        <nav className="flex-1 space-y-2">
            <button onClick={() => { setActiveTab('projects'); setSearchTerm(''); setIsSidebarOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all duration-300 group ${activeTab === 'projects' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}><FolderKanban className="w-5 h-5" /> <span className="tracking-wide">Projekty</span></button>
            <button onClick={() => { setActiveTab('services'); setSearchTerm(''); setIsSidebarOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all duration-300 group ${activeTab === 'services' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}><ShoppingBag className="w-5 h-5" /> <span className="tracking-wide">Ceník Služeb</span></button>
            
            {/* NOVÁ SEKCE PRO LIVE DEMOS */}
            <button onClick={() => { setActiveTab('demos'); setSearchTerm(''); setIsSidebarOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all duration-300 group ${activeTab === 'demos' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}><MonitorPlay className="w-5 h-5" /> <span className="tracking-wide">Live Demos</span></button>

            <button onClick={() => { setActiveTab('calendar'); setSearchTerm(''); setIsSidebarOpen(false) }} className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-medium transition-all duration-300 group ${activeTab === 'calendar' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}><CalendarIcon className="w-5 h-5" /> <span className="tracking-wide">Kalendář (Práce)</span></button>

            <button onClick={() => { setActiveTab('reviews'); setSearchTerm(''); setIsSidebarOpen(false) }} className={`flex items-center justify-between w-full p-3.5 rounded-xl font-medium transition-all duration-300 group border ${activeTab === 'reviews' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'}`}>
                <div className="flex items-center gap-3"><Star className="w-5 h-5" /> <span className="tracking-wide">Recenze</span></div>
                {pendingReviewsCount > 0 && (<span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.2)]">{pendingReviewsCount}</span>)}
            </button>
            <div className="flex items-center justify-between px-3 mt-8 mb-4"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pošta & Složky</p><button onClick={() => setIsFolderModalOpen(true)} className="text-slate-500 hover:text-indigo-400 transition" title="Nová složka"><FolderPlus className="w-4 h-4"/></button></div>
            <div className="space-y-1">
              {folders.map(folder => (
                  <button key={folder.id} onClick={() => { setActiveTab('messages'); setActiveFolderId(folder.id); setSearchTerm(''); setIsSidebarOpen(false) }} 
                    onDragOver={(e) => handleDragOverFolder(e, folder.id)} onDragLeave={handleDragLeaveFolder} onDrop={(e) => handleDropOnFolder(e, folder.id)}
                    className={`flex items-center justify-between w-full p-3.5 rounded-xl font-medium transition-all duration-300 group border relative ${activeTab === 'messages' && activeFolderId === folder.id ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' : (dragOverFolderId === folder.id ? 'bg-blue-500/20 border-blue-500 scale-105' : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent')}`}>
                    <div className="flex items-center gap-3 relative z-10">{getFolderIcon(folder.icon)}<span>{folder.name}</span></div>
                    {unreadCounts[folder.id] > 0 && (<div className="relative z-10"><div className="absolute inset-0 bg-red-500 blur-md opacity-20 rounded-full"></div><span className="relative flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.2)] backdrop-blur-md">{unreadCounts[folder.id]}</span></div>)}
                  </button>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>
            <a href="/" className="flex items-center gap-3 w-full p-3.5 rounded-xl font-medium text-slate-400 hover:bg-white/5 hover:text-white transition group border border-transparent"><Home className="w-5 h-5 group-hover:text-green-400 transition-colors" /> Zpět na web</a>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 mt-auto p-4 hover:bg-red-500/5 rounded-xl transition group border border-transparent hover:border-red-500/10"><LogOut className="w-5 h-5 group-hover:-translate-x-1 transition" /> <span className="font-medium">Odhlásit se</span></button>
      </aside>

      <main className="flex-1 md:ml-72 p-4 md:p-12 relative z-10 transition-all duration-300">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 md:mb-12 gap-6 bg-[#020617]/50 backdrop-blur-sm sticky top-0 z-30 py-4 -mx-4 px-4 md:-mx-12 md:px-12 border-b border-white/5">
            <div className="flex-1 w-full xl:w-auto">
                <div className="flex items-center gap-4 mb-4 xl:mb-2">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 bg-white/5 rounded-lg text-slate-300 hover:text-white md:hidden"><Menu className="w-6 h-6" /></button>
                    <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-inner hidden sm:block">
                            {activeTab === 'messages' && getFolderIcon(folders.find(f => f.id === activeFolderId)?.icon)}
                            {activeTab === 'services' && <ShoppingBag className="w-6 h-6 text-indigo-500"/>}
                            {activeTab === 'projects' && <FolderKanban className="w-6 h-6 text-indigo-500"/>}
                            {activeTab === 'reviews' && <Star className="w-6 h-6 text-indigo-500"/>}
                            {activeTab === 'calendar' && <CalendarIcon className="w-6 h-6 text-indigo-500"/>}
                            {activeTab === 'demos' && <MonitorPlay className="w-6 h-6 text-indigo-500"/>}
                        </div>
                        <span className="truncate">
                            {activeTab === 'messages' ? (folders.find(f => f.id === activeFolderId)?.name || 'Zprávy') : activeTab === 'services' ? 'Ceník Služeb' : activeTab === 'reviews' ? 'Recenze' : activeTab === 'calendar' ? 'Pracovní Kalendář' : activeTab === 'demos' ? 'Live Demos' : 'Portfolio Projektů'}
                        </span>
                    </h2>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-medium uppercase tracking-wide ml-1">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeTab === 'calendar' ? 'bg-blue-500 shadow-[0_0_10px_blue]' : statusColor} transition-colors duration-500`}>{currentFolderUnread > 0 && <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>}</span>
                        <span>{activeTab === 'messages' ? (currentFolderUnread > 0 ? `${currentFolderUnread} Nepřečtených` : 'Vše přečteno') : activeTab === 'calendar' ? `${calendarEvents.length} událostí` : `${totalItems} záznamů`}</span>
                    </div>
                    {activeTab === 'messages' && (
                        <div className="flex items-center bg-[#1e293b] p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto mt-2 sm:mt-0 custom-scrollbar">
                            <button onClick={() => setFilterStatus('all')} className={`px-3 py-1 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${filterStatus === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Vše</button>
                            <button onClick={() => setFilterStatus('unread')} className={`px-3 py-1 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${filterStatus === 'unread' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Nepřečtené</button>
                            <button onClick={() => setFilterStatus('read')} className={`px-3 py-1 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${filterStatus === 'read' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Přečtené</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                {activeTab !== 'calendar' && (
                  <div className="relative group flex-1 xl:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition" /></div>
                      <input type="text" placeholder="Hledat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#1e293b]/50 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 block w-full pl-10 p-3.5 outline-none transition-all placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-[#1e293b]"/>
                  </div>
                )}
                <div className="flex gap-3">
                    {activeTab === 'messages' ? (
                        <>
                            <button onClick={() => setRefreshTrigger(p => p + 1)} className="p-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition group"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition duration-500'}`}/></button>
                            {currentFolderUnread > 0 && (<button onClick={markAllAsRead} className="px-4 py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-xl transition flex items-center gap-2 font-bold text-sm whitespace-nowrap justify-center"><CheckCheck className="w-4 h-4"/> <span className="hidden sm:inline">Přečíst vše</span></button>)}
                        </>
                    ) : activeTab === 'reviews' || activeTab === 'calendar' ? (
                        <>
                          <button onClick={() => setRefreshTrigger(p => p + 1)} className="p-3.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition group flex-1 sm:flex-none justify-center"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition duration-500'}`}/></button>
                          {activeTab === 'calendar' && <button onClick={() => { setSelectedDate(new Date()); openAdd(new Date()); }} className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ring-1 ring-white/20 flex-1 sm:flex-none whitespace-nowrap"><Plus className="w-5 h-5" /> <span className="hidden sm:inline">Přidat směnu</span><span className="sm:hidden">Směna</span></button>}
                        </>
                    ) : (
                        <button onClick={() => openAdd()} className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ring-1 ring-white/20 flex-1 sm:flex-none"><Plus className="w-5 h-5" /> <span className="hidden sm:inline">Vytvořit</span><span className="sm:hidden">Nový</span></button>
                    )}
                </div>
            </div>
        </header>

        {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-500"><Loader2 className="animate-spin w-10 h-10 text-indigo-500"/><p className="text-sm uppercase tracking-widest animate-pulse">Synchronizuji data...</p></div>
        ) : items.length === 0 && activeTab !== 'calendar' ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]"><div className="p-4 bg-white/5 rounded-full"><Search className="w-12 h-12 opacity-30 text-slate-400"/></div><div className="text-center"><p className="text-slate-400 font-medium text-lg">Tady je prázdno.</p><p className="text-slate-600 text-sm mt-1">Žádné položky odpovídající filtru.</p></div></div>
        ) : activeTab === 'calendar' ? (
            renderCalendar()
        ) : activeTab === 'reviews' ? (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {items.map(review => (
                    <div key={review.id} className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 transition-all duration-300 relative overflow-hidden ${review.is_approved ? 'bg-green-500/5 border-green-500/20' : 'bg-orange-500/5 border-orange-500/30'}`}>
                        <div className={`absolute top-0 left-0 bottom-0 w-1 ${review.is_approved ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">{(review.name || '?').charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white">{review.name}</h3>
                                        {review.is_approved ? <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">Schváleno</span> : <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-orange-500/20">Čeká na schválení</span>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>{review.role || 'Bez role'}</span><span>•</span>
                                        <div className="flex gap-0.5 text-yellow-500">{[...Array(review.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current"/>)}</div>
                                    </div>
                                </div>
                                <span className="text-slate-600 text-xs font-mono ml-auto bg-black/20 px-3 py-1 rounded-full border border-white/5 shrink-0">{new Date(review.created_at).toLocaleDateString('cs-CZ')}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed p-4 bg-black/20 rounded-xl border border-white/5 italic">"{review.text}"</p>
                        </div>
                        <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                            <button onClick={() => toggleReviewStatus(review)} className={`p-3 rounded-xl transition border flex items-center justify-center gap-2 md:w-12 ${review.is_approved ? 'bg-white/5 text-slate-400 border-transparent hover:bg-orange-500/10 hover:text-orange-400' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-600 hover:text-white'}`} title={review.is_approved ? "Skrýt" : "Schválit"}>{review.is_approved ? <ThumbsDown className="w-5 h-5"/> : <ThumbsUp className="w-5 h-5"/>}</button>
                            <button onClick={() => confirmDel(review)} className="p-3 bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition border border-transparent hover:border-red-500/30 flex items-center justify-center md:w-12"><Trash2 className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        ) : activeTab === 'messages' ? (
            <div className="space-y-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {items.map(msg => (
                    <div key={msg.id} draggable={allowDrag} onDragStart={(e) => handleDragStart(e, msg)} className={`group p-0 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row relative overflow-hidden ${msg.is_read ? 'bg-[#1e293b]/30 border-white/5' : 'bg-[#1e293b]/80 border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]'}`}>
                        <div className={`w-1 ${msg.is_read ? 'bg-transparent' : 'bg-gradient-to-b from-indigo-500 to-blue-500'}`}></div>
                        <div className="w-10 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 hover:bg-white/5 border-r border-white/5 transition" onMouseEnter={() => setAllowDrag(true)} onMouseLeave={() => setAllowDrag(false)}><GripVertical className="w-5 h-5"/></div>
                        
                        <div className="flex-1 p-5 z-10 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${msg.is_read ? 'bg-white/5 text-slate-500' : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg'}`}>{(msg.name || 'A').charAt(0).toUpperCase()}</div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-bold text-lg truncate select-text cursor-text ${msg.is_read ? 'text-slate-400' : 'text-white'}`}>{msg.name || 'Neznámý'}</h3>
                                            {!msg.is_read && <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/30">Nová</span>}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm group/email"><AtSign className="w-3 h-3"/> <span className="select-text cursor-text hover:text-indigo-400 transition" onClick={() => copyToClipboard(msg.email)}>{msg.email}</span></div>
                                    </div>
                                </div>

                                <div className="md:ml-auto mt-2 md:mt-0 flex flex-wrap gap-2 items-center">
                                    {msg.products?.name ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                            <Briefcase className="w-3 h-3" /> {msg.products.name}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-400 text-xs font-bold border border-slate-500/20">
                                            Obecný dotaz
                                        </span>
                                    )}
                                    <span className="text-slate-600 text-xs font-mono bg-black/20 px-3 py-1 rounded-full border border-white/5 whitespace-nowrap">{new Date(msg.created_at).toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border select-text cursor-text ${msg.is_read ? 'bg-transparent border-transparent text-slate-500' : 'bg-[#0f172a]/50 border-white/5 text-slate-300'}`}>{msg.message}</div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-center p-4 border-t md:border-t-0 md:border-l border-white/5 bg-black/10 md:bg-transparent">
                            {!msg.is_read ? (<button onClick={() => markAsRead(msg.id)} className="p-3 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition shadow-lg border border-indigo-500/20"><CheckCircle2 className="w-5 h-5"/></button>) : (<div className="p-3 text-slate-600 cursor-default"><Eye className="w-5 h-5"/></div>)}
                            <button onClick={() => confirmDel(msg)} className="p-3 bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition border border-transparent hover:border-red-500/30"><Trash2 className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        ) : activeTab === 'services' ? (
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#1e293b]/40 backdrop-blur-xl animate-in fade-in duration-500 slide-in-from-bottom-4 custom-scrollbar pb-2">
                <table className="w-full text-left text-sm text-slate-400 min-w-[700px]">
                    <thead className="bg-white/5 text-xs uppercase font-bold text-slate-300">
                        <tr>
                            <th className="px-6 py-4 tracking-wider">Název služby</th>
                            <th className="px-6 py-4 tracking-wider hidden md:table-cell">Tagy</th>
                            <th className="px-6 py-4 text-right tracking-wider cursor-pointer hover:text-white transition flex items-center justify-end gap-2">
                                Cena <ArrowUp className="w-3 h-3 text-indigo-400"/>
                            </th>
                            <th className="px-6 py-4 text-right tracking-wider w-32">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.map(item => (
                            <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white text-base">{item.name}</div>
                                    {item.description && (
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs">{item.description}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.tags && item.tags.length > 0 ? (
                                            item.tags.map((tag, i) => (
                                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-600 text-xs italic">Žádné tagy</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="font-bold text-white whitespace-nowrap bg-white/5 px-3 py-1 rounded-lg inline-block border border-white/5 group-hover:border-indigo-500/30 group-hover:text-indigo-200 transition">
                                        {item.price ? item.price : 'Dohodou'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition">
                                        <button onClick={() => openEdit(item)} className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg transition" title="Upravit">
                                            <Pencil className="w-4 h-4"/>
                                        </button>
                                        <button onClick={() => confirmDel(item)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition" title="Smazat">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : activeTab === 'demos' ? (
            // --- GRID PRO LIVE DEMOS ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {items.map(item => (
                    <div key={item.id} className="group relative bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                                <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-400"><MonitorPlay className="w-5 h-5"/></div>
                            </div>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline truncate mb-3 flex items-center gap-1">
                                {item.url} <ExternalLink className="w-3 h-3"/>
                            </a>
                            <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">{item.description}</p>
                            <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
                                <button onClick={() => openEdit(item)} className="flex-1 py-2 bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold uppercase tracking-wider">Upravit</button>
                                <button onClick={() => confirmDel(item)} className="px-3 py-2 bg-white/5 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // --- GRID PROJEKTŮ ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {items.map(item => { 
                    let thumb = null; if (activeTab === 'projects') { const gallery = item.images || (item.image_url ? [item.image_url] : []); thumb = gallery[0] }
                    return <div key={item.id} className="group relative bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 flex flex-col gap-4 overflow-hidden"><div className="w-full aspect-video rounded-xl bg-[#0f172a] relative overflow-hidden group cursor-pointer border border-white/5" onClick={() => thumb && openLightbox(item.images || [], 0)}>{thumb ? <img src={thumb} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"/> : <div className="w-full h-full flex flex-col items-center justify-center text-slate-600"><FolderKanban className="w-12 h-12 opacity-20"/></div>}</div><div className="flex-1 flex flex-col"><h3 className="font-bold text-lg text-white mb-1">{item.name || item.title}</h3><p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">{item.description}</p><div className="flex gap-2 border-t border-white/5 pt-4 mt-auto"><button onClick={() => openEdit(item)} className="flex-1 py-2 bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold uppercase tracking-wider">Upravit</button><button onClick={() => confirmDel(item)} className="px-3 py-2 bg-white/5 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg"><Trash2 className="w-4 h-4"/></button></div></div></div>
                })}
            </div>
        )}

        {activeTab !== 'calendar' && items.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-white/5 gap-4">
                <p className="text-sm text-slate-500 text-center md:text-left">
                    Zobrazeno {items.length} z {totalItems} záznamů
                </p>
                <div className="flex gap-2">
                    <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-sm font-bold flex items-center gap-2 transition">
                        <ChevronLeft className="w-4 h-4"/> 
                        <span className="hidden sm:inline">Předchozí</span>
                    </button>
                    
                    <span className="px-4 py-2 text-slate-400 text-sm font-mono flex items-center bg-[#1e293b] rounded-xl border border-white/5">{currentPage} / {totalPages || 1}</span>
                    
                    <button onClick={nextPage} disabled={currentPage >= totalPages} className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-sm font-bold flex items-center gap-2 transition">
                        <span className="hidden sm:inline">Další</span>
                        <ChevronRight className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* --- MODALS (FORM) - Responsivní wrapper --- */}
      {isFormOpen && activeTab !== 'messages' && activeTab !== 'reviews' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setIsFormOpen(false)}></div>
            <div className="bg-[#0f172a] border border-white/10 rounded-none md:rounded-3xl w-full md:max-w-3xl h-full md:h-auto md:max-h-[90vh] relative z-10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#162032]">
                    <h3 className="text-xl font-bold flex items-center gap-3 text-white"><div className={`p-2.5 rounded-xl ${isEditing ? 'bg-indigo-500/20 text-indigo-400' : 'bg-green-500/20 text-green-400'}`}>{isEditing ? <Pencil className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</div>{isEditing ? 'Upravit záznam' : 'Nový záznam'}</h3>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"><X className="w-6 h-6"/></button>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    <form id="dataForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Název</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition text-lg font-medium placeholder:text-slate-600" placeholder={activeTab === 'calendar' ? 'Např. Ranní směna' : 'Název...'}/>
                        </div>
                        {activeTab === 'calendar' ? (
                             <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2"><ClockIcon className="w-3 h-3"/> Začátek</label>
                                    <input type="datetime-local" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition [color-scheme:dark]"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2"><ClockIcon className="w-3 h-3"/> Konec</label>
                                    <input type="datetime-local" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition [color-scheme:dark]"/>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Typ směny</label>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setFormData({...formData, type: 'morning', title: 'Ranní'})} className={`flex-1 p-3 rounded-xl border ${formData.type === 'morning' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-[#1e293b] border-white/10 text-slate-400'}`}>☀️ Ranní</button>
                                        <button type="button" onClick={() => setFormData({...formData, type: 'night', title: 'Noční'})} className={`flex-1 p-3 rounded-xl border ${formData.type === 'night' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-[#1e293b] border-white/10 text-slate-400'}`}>🌙 Noční</button>
                                        <button type="button" onClick={() => setFormData({...formData, type: 'off', title: 'Volno'})} className={`flex-1 p-3 rounded-xl border ${formData.type === 'off' ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-[#1e293b] border-white/10 text-slate-400'}`}>🌴 Volno</button>
                                    </div>
                                </div>
                             </>
                        ) : activeTab === 'services' ? (
                            <>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Cena (Kč)</label>
                                    <input type="text" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition font-mono text-lg" placeholder="např. 4 500 - 7 000"/>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Tagy</label>
                                    <div className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-[60px] focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
                                        {formData.tags.map((tag, index) => (<span key={index} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 font-medium">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3"/></button></span>))}
                                        <input type="text" placeholder="Nový tag (Enter)..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setFormData({...formData, tags: [...formData.tags, tagInput.trim()]}); setTagInput('') } } }} className="bg-transparent outline-none text-white flex-1 h-8 placeholder:text-slate-600"/>
                                    </div>
                                </div>
                            </>
                        ) : activeTab === 'demos' ? (
                            // --- FORMULÁŘ PRO LIVE DEMOS (URL jako TEXT input) ---
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">URL Adresa</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.url} 
                                    onChange={e => setFormData({...formData, url: e.target.value})} 
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition text-lg font-medium placeholder:text-slate-600" 
                                    placeholder="/demos/muj-projekt/ nebo https://..."
                                />
                                <p className="text-[10px] text-slate-500 pl-1">Systém automaticky skryje <code>index.html</code></p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Galerie <span className="text-indigo-400 font-normal normal-case opacity-70 ml-2">Ctrl+V nebo Drag & Drop</span></label>
                                    <div className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 mb-6 ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-white/10 bg-[#1e293b] hover:bg-white/5'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                        <input type="file" multiple onChange={handleFileInputChange} className="hidden" id="file-upload" accept="image/*" />
                                        <label htmlFor="file-upload" className="w-full h-full p-10 flex flex-col items-center justify-center gap-3 cursor-pointer">
                                            {isUploading ? <Loader2 className="animate-spin w-10 h-10 text-indigo-500"/> : <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-500' : 'text-slate-500'}`}/>}
                                            <div className="text-center"><p className={`font-medium ${isDragging ? 'text-indigo-400' : 'text-slate-300'}`}>{isUploading ? 'Nahrávám...' : 'Klikni nebo přetáhni obrázky'}</p><p className="text-xs text-slate-500 mt-1">Podpora JPG, PNG, WEBP</p></div>
                                        </label>
                                    </div>
                                    {formData.images.length > 0 && (<div className="grid grid-cols-5 gap-3">{formData.images.map((imgUrl, index) => (<div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group shadow-sm"><img src={imgUrl} className="w-full h-full object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"><X className="w-3 h-3"/></button>{index === 0 && <div className="absolute bottom-0 inset-x-0 bg-indigo-600/90 text-[9px] text-center text-white py-0.5 font-bold uppercase tracking-wider backdrop-blur-sm">Cover</div>}</div>))}</div>)}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Tagy</label>
                                    <div className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-[60px] focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
                                        {formData.tags.map((tag, index) => (<span key={index} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 font-medium">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3"/></button></span>))}
                                        <input type="text" placeholder="Nový tag (Enter)..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setFormData({...formData, tags: [...formData.tags, tagInput.trim()]}); setTagInput('') } } }} className="bg-transparent outline-none text-white flex-1 h-8 placeholder:text-slate-600"/>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Popis / Poznámka</label>
                            <textarea required={activeTab !== 'calendar'} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white h-40 resize-none leading-relaxed placeholder:text-slate-600"/>
                        </div>
                    </form>
                </div>
                <div className="p-6 border-t border-white/10 bg-[#162032] flex justify-end gap-3 shrink-0">
                    <button onClick={() => setIsFormOpen(false)} className="px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition">Zrušit</button>
                    {isEditing && activeTab === 'calendar' && (
                        <button onClick={() => { confirmDel(formData); setIsFormOpen(false); }} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold transition mr-auto border border-red-500/20">Smazat</button>
                    )}
                    <button form="dataForm" disabled={isSubmitting || isUploading} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]">{isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}{isEditing ? 'Uložit' : 'Vytvořit'}</button>
                </div>
            </div>
        </div>
      )}

      {/* --- OSTATNÍ MODALY --- */}
      {isDeleteOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteOpen(false)}></div><div className="bg-[#1e293b] border border-white/10 rounded-3xl w-full max-w-sm relative z-10 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 ring-1 ring-white/10"><div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ring-4 ring-red-500/5"><AlertTriangle className="w-10 h-10"/></div><h3 className="text-2xl font-bold mb-3 text-white">Opravdu smazat?</h3><p className="text-slate-400 mb-8 leading-relaxed">Tato akce je nevratná a položka bude trvale odstraněna z databáze.</p><div className="flex gap-4 justify-center"><button onClick={() => setIsDeleteOpen(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold transition border border-white/5">Zrušit</button><button onClick={executeDel} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-lg shadow-red-500/20 transform hover:scale-105">Smazat navždy</button></div></div></div>)}
      
      {toast.show && (
        <div className={`fixed bottom-10 right-10 border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[60] animate-in slide-in-from-right-10 fade-in duration-300 ${toast.type === 'error' ? 'bg-[#1e293b] border-red-500/30' : 'bg-[#1e293b] border-white/10'}`}>
            <div className={`${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-green-500/20 text-green-400 border-green-500/20'} p-2 rounded-full border`}>
                {toast.type === 'error' ? <AlertTriangle className="w-6 h-6"/> : <CheckCircle2 className="w-6 h-6"/>}
            </div>
            <div>
                <h4 className={`font-bold text-sm ${toast.type === 'error' ? 'text-red-400' : 'text-white'}`}>{toast.type === 'error' ? 'Chyba' : 'Úspěch'}</h4>
                <p className="text-slate-400 text-xs">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 text-slate-500 hover:text-white transition"><X className="w-4 h-4"/></button>
        </div>
      )}

      {lightboxOpen && (<div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200" onClick={() => setLightboxOpen(false)}><button className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 z-50 rounded-full hover:bg-white/10 transition"><X className="w-10 h-10"/></button><div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>{lightboxImages.length > 1 && <button onClick={prevImage} className="absolute left-4 md:left-10 p-4 bg-black/50 hover:bg-indigo-600 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-40 border border-white/10"><ChevronLeft className="w-8 h-8"/></button>}<img src={lightboxImages[lightboxIndex]} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" />{lightboxImages.length > 1 && <button onClick={nextImage} className="absolute right-4 md:right-10 p-4 bg-black/50 hover:bg-indigo-600 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 z-40 border border-white/10"><ChevronRight className="w-8 h-8"/></button>}<div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-2 rounded-full text-white text-sm font-medium backdrop-blur-md border border-white/10 shadow-lg">{lightboxIndex + 1} / {lightboxImages.length}</div></div></div>)}
    </div>
  )
}