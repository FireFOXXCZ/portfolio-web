import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Komponenty
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/admin/Header'
import Calendar from '../components/admin/Calendar'
import Settings from '../components/admin/Settings'
import { MessagesList, DemosList, ServicesTable, ProjectsGrid, ReviewsList } from '../components/admin/Content'
import { FormModal, DeleteModal, FolderModal } from '../components/admin/Modals' // Lightbox přesunut do Content.jsx

export default function Admin() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('projects') 
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all') 
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const ITEMS_PER_PAGE = activeTab === 'services' ? 10 : 5 
  const [unreadCounts, setUnreadCounts] = useState({})      
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0) 
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [folders, setFolders] = useState([])
  const [activeFolderId, setActiveFolderId] = useState(null)
  
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderIcon, setNewFolderIcon] = useState('folder')
  const [editingFolder, setEditingFolder] = useState(null)
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState(null)

  const [allowDrag, setAllowDrag] = useState(false) 
  const [draggedMessage, setDraggedMessage] = useState(null)
  const [draggedFolderId, setDraggedFolderId] = useState(null) 
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarEvents, setCalendarEvents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [tagInput, setTagInput] = useState('')

  // UPDATED INITIAL STATE FOR BILINGUAL SUPPORT
  const initialFormState = { 
    id: null, 
    title: '', title_en: '', 
    price: '', 
    description: '', description_en: '', 
    images: [], 
    tags: [], tags_en: [], 
    start_time: '', end_time: '', 
    type: 'morning', 
    url: '' 
  }
  const [formData, setFormData] = useState(initialFormState)

  const toLocalISOString = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  const showToast = (msg, type = 'success') => { 
    setToast({ show: true, message: msg, type }); 
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000) 
  };

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const copyToClipboard = (text) => { 
    navigator.clipboard.writeText(text); 
    showToast(`Zkopírováno: ${text}`) 
  };

  useEffect(() => {
    if (window.$crisp) { window.$crisp.push(['do', 'chat:hide']); }
    
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }
      setUser(user)
      await fetchFolders()
      await fetchUnreadCounts()
    }
    init()

    const channel = supabase.channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => { fetchUnreadCounts(); if(activeTab === 'messages') setRefreshTrigger(p => p+1) })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => { fetchUnreadCounts(); if(activeTab === 'reviews') setRefreshTrigger(p => p+1) })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => { if(activeTab === 'calendar') setRefreshTrigger(p => p+1) })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_demos' }, () => { if(activeTab === 'demos') setRefreshTrigger(p => p+1) })
      .subscribe()
    return () => { supabase.removeChannel(channel); if (window.$crisp) { window.$crisp.push(['do', 'chat:show']); } }
  }, [activeTab, navigate])

  useEffect(() => {
    if (activeTab === 'calendar') fetchCalendarEvents();
    else if (activeTab === 'settings') { setLoading(false); }
    else fetchData();
    fetchUnreadCounts();
  }, [activeTab, activeFolderId, refreshTrigger, filterStatus, currentPage, searchTerm, currentDate])

  async function fetchCalendarEvents() {
    setLoading(true);
    const { data } = await supabase.from('calendar_events').select('*');
    if (data) setCalendarEvents(data);
    setLoading(false);
  }

  async function fetchData() {
    setLoading(true);
    let query;
    if (activeTab === 'messages') {
        query = supabase.from('messages').select('*, products(name)', { count: 'exact' }).eq('folder_id', activeFolderId);
        if (filterStatus === 'unread') query = query.eq('is_read', false);
        if (filterStatus === 'read') query = query.eq('is_read', true);
        if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
        query = query.order('created_at', { ascending: false });
    } else if (activeTab === 'reviews') {
        query = supabase.from('reviews').select('*', { count: 'exact' });
        if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,text.ilike.%${searchTerm}%`);
        query = query.order('created_at', { ascending: false });
    } else if (activeTab === 'demos') {
        query = supabase.from('live_demos').select('*', { count: 'exact' });
        if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);
        query = query.order('created_at', { ascending: false });
    } else {
        const table = activeTab === 'services' ? 'products' : 'projects';
        query = supabase.from(table).select('*', { count: 'exact' });
        if (searchTerm) query = query.ilike(activeTab === 'services' ? 'name' : 'title', `%${searchTerm}%`);
        query = query.order('created_at', { ascending: false });
    }
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const { data, count } = await query.range(from, from + ITEMS_PER_PAGE - 1);
    if (data) { setItems(data); setTotalItems(count || 0); }
    setLoading(false);
  }

  async function fetchUnreadCounts() {
      const { data: msgData } = await supabase.from('messages').select('folder_id').eq('is_read', false);
      if (msgData) {
          const counts = {};
          msgData.forEach(msg => { counts[msg.folder_id] = (counts[msg.folder_id] || 0) + 1 });
          setUnreadCounts(counts);
      }
      const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false);
      setPendingReviewsCount(count || 0);
  }

  async function fetchFolders() {
      const { data } = await supabase.from('folders').select('*').order('position', { ascending: true });
      if (data && data.length > 0) { 
        setFolders(data); 
        if (!activeFolderId) setActiveFolderId(data[0].id); 
      }
  }

  async function markAllAsRead() {
    await supabase.from('messages').update({ is_read: true }).eq('folder_id', activeFolderId).eq('is_read', false);
    setRefreshTrigger(p => p+1);
  }

  async function markAsRead(id) { await supabase.from('messages').update({ is_read: true }).eq('id', id); setRefreshTrigger(p => p+1); }
  async function toggleReviewStatus(rev) { await supabase.from('reviews').update({ is_approved: !rev.is_approved }).eq('id', rev.id); setRefreshTrigger(p => p+1); }

  async function executeDeleteFolder() {
    if (!folderToDelete) return;
    await supabase.from('messages').update({ folder_id: 1 }).eq('folder_id', folderToDelete.id);
    const { error } = await supabase.from('folders').delete().eq('id', folderToDelete.id);
    if (!error) {
        showToast("Složka smazána, zprávy přesunuty");
        await fetchFolders(); setActiveFolderId(1); setActiveTab('messages');
    }
    setIsDeleteFolderOpen(false); setFolderToDelete(null);
  }

  const handleFolderReorder = async (draggedId, targetId) => {
    if (draggedId === targetId) return;
    const newFolders = [...folders];
    const draggedIdx = newFolders.findIndex(f => f.id === draggedId);
    const targetIdx = newFolders.findIndex(f => f.id === targetId);
    const [removed] = newFolders.splice(draggedIdx, 1);
    newFolders.splice(targetIdx, 0, removed);
    setFolders(newFolders);
    const updates = newFolders.map((f, index) => ({ id: f.id, name: f.name, icon: f.icon, position: index }));
    await supabase.from('folders').upsert(updates);
  };

  async function handleCreateOrUpdateFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folderData = { name: newFolderName, icon: newFolderIcon };
    let error;
    if (editingFolder) {
        const { error: err } = await supabase.from('folders').update(folderData).eq('id', editingFolder.id);
        error = err;
    } else {
        const { error: err } = await supabase.from('folders').insert([{ ...folderData, position: folders.length }]);
        error = err;
    }
    if (!error) {
        showToast(editingFolder ? "Složka upravena" : "Složka vytvořena");
        setNewFolderName(''); setNewFolderIcon('folder'); setEditingFolder(null);
        setIsFolderModalOpen(false); fetchFolders();
    } else showToast(error.message, 'error');
  }

  const openEditFolder = (folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderIcon(folder.icon || 'folder');
    setIsFolderModalOpen(true);
  };

  const handleFileInputChange = async (e) => {
    let files = [];
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      files = Array.from(e.clipboardData.files);
    } else if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      files = Array.from(e.dataTransfer.files);
    } else if (e.target && e.target.files) {
      files = Array.from(e.target.files);
    }
    if (files.length === 0) return;
    setIsUploading(true);
    const uploadedUrls = [...(formData.images || [])];
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const fileExt = file.name ? file.name.split('.').pop() : 'png';
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
      if (!uploadError) {
        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
    }
    setFormData(prev => ({ ...prev, images: uploadedUrls }));
    setIsUploading(false);
  };

  async function executeDel() {
      if (!itemToDelete) return;
      const tableMap = { projects: 'projects', services: 'products', reviews: 'reviews', calendar: 'calendar_events', demos: 'live_demos', messages: 'messages' };
      const { error } = await supabase.from(tableMap[activeTab]).delete().eq('id', itemToDelete.id);
      if (!error) { showToast("Smazáno"); setIsFormOpen(false); setRefreshTrigger(p => p+1); }
      setIsDeleteOpen(false); setItemToDelete(null);
  }

  const handleSave = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    let table = activeTab === 'services' ? 'products' : activeTab === 'calendar' ? 'calendar_events' : activeTab === 'demos' ? 'live_demos' : 'projects';
    
    // UPDATED PAYLOAD CONSTRUCTION WITH ENGLISH FIELDS
    let payload = {};
    if (activeTab === 'calendar') {
        payload = { title: formData.title, description: formData.description, start_time: new Date(formData.start_time).toISOString(), end_time: new Date(formData.end_time).toISOString(), type: formData.type };
    } else if (activeTab === 'services') {
        payload = { 
            name: formData.title, name_en: formData.title_en,
            description: formData.description, description_en: formData.description_en,
            price: formData.price, 
            tags: formData.tags, tags_en: formData.tags_en 
        };
    } else if (activeTab === 'demos') {
        payload = { 
            title: formData.title, title_en: formData.title_en,
            description: formData.description, description_en: formData.description_en,
            url: formData.url 
        };
    } else {
        payload = { 
            title: formData.title, title_en: formData.title_en,
            description: formData.description, description_en: formData.description_en,
            images: formData.images, 
            tags: formData.tags, tags_en: formData.tags_en
        };
    }

    const q = isEditing ? supabase.from(table).update(payload).eq('id', formData.id) : supabase.from(table).insert([payload]);
    const { error } = await q;
    if (!error) { setIsFormOpen(false); setRefreshTrigger(p => p+1); showToast("Uloženo"); }
    else showToast(error.message, 'error');
    setIsSubmitting(false);
  }

  const openAdd = (date = null) => { 
    const now = date || new Date();
    const s = new Date(now); s.setHours(6,0,0,0);
    const e = new Date(now); e.setHours(18,0,0,0);
    setFormData({ ...initialFormState, start_time: toLocalISOString(s), end_time: toLocalISOString(e), type: 'morning' }); 
    setIsEditing(false); setIsFormOpen(true); 
  };
  
  const openEdit = (item) => {
    if (activeTab === 'calendar') {
        setFormData({ ...item, start_time: toLocalISOString(new Date(item.start_time)), end_time: toLocalISOString(new Date(item.end_time)) });
    } else if (activeTab === 'services') {
        setFormData({ 
            ...item, 
            title: item.name, title_en: item.name_en, // Mapping 'name' to 'title' for form consistency
            tags: item.tags || [], tags_en: item.tags_en || []
        });
    } else {
        setFormData({ 
            ...item, 
            title: item.title, title_en: item.title_en,
            tags: item.tags || [], tags_en: item.tags_en || []
        });
    }
    setIsEditing(true); setIsFormOpen(true);
  }

  const handleDragStart = (e, msg) => {
    setDraggedMessage(msg);
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("drag-type", "message");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} 
        folders={folders} activeFolderId={activeFolderId} setActiveFolderId={setActiveFolderId}
        unreadCounts={unreadCounts} pendingReviewsCount={pendingReviewsCount} onLogout={handleLogout} 
        setIsFolderModalOpen={() => { setEditingFolder(null); setNewFolderName(''); setNewFolderIcon('folder'); setIsFolderModalOpen(true); }} 
        onDeleteFolder={(folder) => { setFolderToDelete(folder); setIsDeleteFolderOpen(true); }}
        onEditFolder={openEditFolder}
        draggedFolderId={draggedFolderId} setDraggedFolderId={setDraggedFolderId} onFolderReorder={handleFolderReorder}
        onDropOnFolder={async (e, folderId) => {
            const dragType = e.dataTransfer.getData("drag-type");
            if (dragType === "message" && draggedMessage) {
                await supabase.from('messages').update({ folder_id: folderId }).eq('id', draggedMessage.id);
                setItems(prev => prev.filter(m => m.id !== draggedMessage.id));
                fetchUnreadCounts(); setDraggedMessage(null);
            }
        }}
      />
      <main className="flex-1 md:ml-72 p-4 md:p-12 relative z-10 overflow-y-auto h-screen">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} folders={folders} activeFolderId={activeFolderId}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm} currentFolderUnread={unreadCounts[activeFolderId] || 0}
          totalItems={totalItems} calendarCount={calendarEvents.length} filterStatus={filterStatus} setFilterStatus={setFilterStatus} 
          setRefreshTrigger={setRefreshTrigger} markAllAsRead={markAllAsRead} openAdd={openAdd} loading={loading}
          userEmail={user?.email} 
        />
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-500"><Loader2 className="animate-spin w-10 h-10 text-indigo-500"/></div>
        ) : (
          <>
            {activeTab === 'messages' && <MessagesList items={items} allowDrag={allowDrag} setAllowDrag={setAllowDrag} handleDragStart={handleDragStart} markAsRead={markAsRead} confirmDel={(i) => { setItemToDelete(i); setIsDeleteOpen(true); }} copyToClipboard={copyToClipboard} />}
            {activeTab === 'projects' && <ProjectsGrid items={items} openEdit={openEdit} confirmDel={(i) => { setItemToDelete(i); setIsDeleteOpen(true); }} />}
            {activeTab === 'services' && <ServicesTable items={items} openEdit={openEdit} confirmDel={(i) => { setItemToDelete(i); setIsDeleteOpen(true); }} />}
            {activeTab === 'demos' && <DemosList items={items} openEdit={openEdit} confirmDel={(i) => { setItemToDelete(i); setIsDeleteOpen(true); }} />}
            {activeTab === 'reviews' && <ReviewsList items={items} toggleReviewStatus={toggleReviewStatus} confirmDel={(i) => { setItemToDelete(i); setIsDeleteOpen(true); }} />}
            {activeTab === 'calendar' && <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} calendarEvents={calendarEvents} openAdd={openAdd} openEdit={openEdit} />}
            {activeTab === 'settings' && <Settings />}
          </>
        )}
      </main>

      <FormModal 
        isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} activeTab={activeTab} formData={formData} setFormData={setFormData} 
        isEditing={isEditing} handleSave={handleSave} isSubmitting={isSubmitting} isUploading={isUploading} 
        handleFileInputChange={handleFileInputChange} toLocalISOString={toLocalISOString}
        tagInput={tagInput} setTagInput={setTagInput} removeImage={(idx) => setFormData(p => ({...p, images: p.images.filter((_,i) => i!==idx)}))}
        
        /* UPDATE TAG REMOVAL FOR BOTH LANGS */
        removeTag={(t, lang = 'cz') => {
            if (lang === 'en') setFormData(p => ({...p, tags_en: p.tags_en.filter(tag => tag!==t)}));
            else setFormData(p => ({...p, tags: p.tags.filter(tag => tag!==t)}));
        }} 
        
        confirmDel={() => { setItemToDelete(formData); setIsDeleteOpen(true); }}
        isDragging={isDragging} 
        handleDragOver={(e) => {e.preventDefault(); setIsDragging(true)}} 
        handleDragLeave={() => setIsDragging(false)} 
        handleDrop={(e) => {e.preventDefault(); setIsDragging(false); handleFileInputChange(e)}}
      />
      
      <DeleteModal isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} executeDel={executeDel} />
      <DeleteModal isDeleteOpen={isDeleteFolderOpen} setIsDeleteOpen={setIsDeleteFolderOpen} executeDel={executeDeleteFolder} title={`Smazat složku "${folderToDelete?.name}"?`} description="Zprávy v této složce budou přesunuty do doručené pošty." />

      <FolderModal 
        isFolderModalOpen={isFolderModalOpen} setIsFolderModalOpen={setIsFolderModalOpen} 
        newFolderName={newFolderName} setNewFolderName={setNewFolderName} 
        newFolderIcon={newFolderIcon} setNewFolderIcon={setNewFolderIcon}
        createFolder={handleCreateOrUpdateFolder} isEditing={!!editingFolder}
      />

      {toast.show && (
        <div className="fixed bottom-10 right-10 border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[60] bg-[#1e293b] border-white/10 animate-in fade-in slide-in-from-right-5">
            <CheckCircle2 className="text-green-500 w-5 h-5" />
            <p className="text-white text-sm">{toast.message}</p>
            <button onClick={() => setToast({ ...toast, show: false })}><X className="w-4 h-4 text-slate-500"/></button>
        </div>
      )}
    </div>
  )
}