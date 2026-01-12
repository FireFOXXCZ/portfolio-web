import { X, Save, AlertTriangle, Upload, Clock as ClockIcon, Loader2, Inbox, Archive, Clock, CheckSquare, Folder, Star, Tag, Mail, Bell, Languages } from 'lucide-react'
import { useEffect, useState } from 'react' // Added useState

/* --- HLAVNÍ FORMULÁŘOVÝ MODÁL --- */
export function FormModal({ 
    isFormOpen, setIsFormOpen, activeTab, formData, setFormData, isEditing, handleSave, 
    isSubmitting, isUploading, handleFileInputChange, isDragging, handleDragOver, 
    handleDragLeave, handleDrop, tagInput, setTagInput, removeImage, removeTag, 
    confirmDel, toLocalISOString 
}) {
    const [formLang, setFormLang] = useState('cz'); // Local state for switching tabs

    useEffect(() => {
        const handlePaste = (e) => {
            if (!isFormOpen || activeTab === 'calendar' || activeTab === 'services' || activeTab === 'demos') return;
            if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
                handleFileInputChange(e);
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [isFormOpen, activeTab, handleFileInputChange]);

    if (!isFormOpen) return null;

    const formatForInput = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.length === 16) return dateStr;
        const date = new Date(dateStr);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsFormOpen(false)}></div>
            <div className="bg-[#0f172a] border border-white/10 rounded-none md:rounded-3xl w-full md:max-w-3xl h-full md:h-auto md:max-h-[90vh] relative z-10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#162032] shrink-0">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-white">{isEditing ? 'Upravit záznam' : 'Nový záznam'}</h3>
                        
                        {/* JAZYKOVÝ PŘEPÍNAČ JEN PRO BILINGVNÍ OBSAH */}
                        {['projects', 'services', 'demos'].includes(activeTab) && (
                            <div className="flex bg-[#0f172a] rounded-lg p-1 border border-white/10">
                                <button type="button" onClick={() => setFormLang('cz')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${formLang === 'cz' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>CZ</button>
                                <button type="button" onClick={() => setFormLang('en')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${formLang === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>EN</button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 text-slate-400 hover:text-white transition"><X/></button>
                </div>
                
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    <form id="dataForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* NÁZEV / TITULEK (Podle jazyka) */}
                        {activeTab !== 'calendar' && (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                    {formLang === 'cz' ? <><img src="https://flagcdn.com/w20/cz.png" width="16" /> Název</> : <><img src="https://flagcdn.com/w20/gb.png" width="16" /> Title</>}
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formLang === 'cz' ? (formData.title || '') : (formData.title_en || '')} 
                                    onChange={e => setFormData({ ...formData, [formLang === 'cz' ? 'title' : 'title_en']: e.target.value })} 
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 outline-none text-white transition"
                                />
                            </div>
                        )}
                        
                        {activeTab === 'calendar' ? (
                             <>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Událost</label>
                                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 text-white"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2"><ClockIcon className="w-3 h-3"/> Začátek</label>
                                    <input type="datetime-local" required value={formatForInput(formData.start_time)} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 outline-none text-white [color-scheme:dark]"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2"><ClockIcon className="w-3 h-3"/> Konec</label>
                                    <input type="datetime-local" required value={formatForInput(formData.end_time)} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 outline-none text-white [color-scheme:dark]"/>
                                </div>
                             </>
                        ) : activeTab === 'services' ? (
                            <>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Cena (Kč)</label>
                                    <input type="text" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 outline-none text-white font-mono"/>
                                </div>
                                {/* TAGS (BILINGUAL) */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        {formLang === 'cz' ? 'Tagy' : 'Tags'} (Enter)
                                    </label>
                                    <div className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-[60px]">
                                        {(formLang === 'cz' ? formData.tags : (formData.tags_en || [])).map((tag, index) => (
                                            <span key={index} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 font-medium">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag, formLang)}><X className="w-3 h-3"/></button>
                                            </span>
                                        ))}
                                        <input 
                                            type="text" 
                                            value={tagInput} 
                                            onChange={e => setTagInput(e.target.value)} 
                                            onKeyDown={(e) => { 
                                                if (e.key === 'Enter') { 
                                                    e.preventDefault(); 
                                                    if (tagInput.trim()) { 
                                                        const field = formLang === 'cz' ? 'tags' : 'tags_en';
                                                        setFormData({ ...formData, [field]: [...(formData[field] || []), tagInput.trim()] }); 
                                                        setTagInput('') 
                                                    } 
                                                } 
                                            }} 
                                            className="bg-transparent outline-none text-white flex-1 h-8" 
                                            placeholder={formLang === 'cz' ? "Přidat..." : "Add..."}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : activeTab === 'demos' ? (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">URL Adresa</label>
                                <input type="text" required value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 outline-none text-white"/>
                            </div>
                        ) : (
                            /* PROJECTS SPECIFIC (SHARED IMAGES, SEPARATE TAGS) */
                            <div className="space-y-6 md:col-span-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Galerie (Shared)</label>
                                    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center gap-3 ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-white/10 bg-[#1e293b] hover:bg-white/5'}`}>
                                        <input type="file" multiple onChange={handleFileInputChange} className="absolute inset-0 opacity-0 cursor-pointer" id="file-upload" accept="image/*" />
                                        {isUploading ? <Loader2 className="animate-spin w-10 h-10 text-indigo-500"/> : <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-400' : 'text-slate-500'}`}/>}
                                        <p className="font-medium text-slate-300 text-center pointer-events-none">Klikni nebo přetáhni soubory</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                                        {formData.images?.map((img, index) => (
                                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-[#1e293b]">
                                            <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"><X className="w-3 h-3"/></button>
                                          </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        {formLang === 'cz' ? <><img src="https://flagcdn.com/w20/cz.png" width="16" /> Tagy</> : <><img src="https://flagcdn.com/w20/gb.png" width="16" /> Tags</>}
                                    </label>
                                    <div className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 items-center min-h-[60px]">
                                        {(formLang === 'cz' ? formData.tags : (formData.tags_en || [])).map((tag, index) => (
                                            <span key={index} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 font-medium">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag, formLang)}><X className="w-3 h-3"/></button>
                                            </span>
                                        ))}
                                        <input 
                                            type="text" 
                                            value={tagInput} 
                                            onChange={e => setTagInput(e.target.value)} 
                                            onKeyDown={(e) => { 
                                                if (e.key === 'Enter') { 
                                                    e.preventDefault(); 
                                                    if (tagInput.trim()) { 
                                                        const field = formLang === 'cz' ? 'tags' : 'tags_en';
                                                        setFormData({ ...formData, [field]: [...(formData[field] || []), tagInput.trim()] }); 
                                                        setTagInput('') 
                                                    } 
                                                } 
                                            }} 
                                            className="bg-transparent outline-none text-white flex-1 h-8" 
                                            placeholder={formLang === 'cz' ? "React, SEO..." : "React, SEO..."}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* POPIS / DESCRIPTION (BILINGUAL) */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                {formLang === 'cz' ? <><img src="https://flagcdn.com/w20/cz.png" width="16" /> Popis</> : <><img src="https://flagcdn.com/w20/gb.png" width="16" /> Description</>}
                            </label>
                            <textarea 
                                required={activeTab !== 'calendar'} 
                                value={formLang === 'cz' ? (formData.description || '') : (formData.description_en || '')} 
                                onChange={e => setFormData({ ...formData, [formLang === 'cz' ? 'description' : 'description_en']: e.target.value })} 
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 focus:border-indigo-500 outline-none text-white h-40 resize-none leading-relaxed"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#162032] flex justify-end gap-3 shrink-0">
                    <button onClick={() => setIsFormOpen(false)} className="px-6 py-3 text-slate-400 hover:text-white transition font-bold">Zrušit</button>
                    {isEditing && (
                        <button type="button" onClick={confirmDel} className="px-6 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold transition mr-auto border border-red-500/20 hover:bg-red-500 hover:text-white">Smazat</button>
                    )}
                    <button form="dataForm" disabled={isSubmitting || isUploading} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg">
                      {isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>} {isEditing ? 'Uložit' : 'Vytvořit'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ... (DeleteModal, FolderModal remain same)
export function DeleteModal({ isDeleteOpen, setIsDeleteOpen, executeDel, title = "Opravdu smazat?", description = "Tuto akci nelze vrátit zpět." }) {
    if (!isDeleteOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)}></div>
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-md relative z-10 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ring-4 ring-red-500/5"><AlertTriangle className="w-10 h-10"/></div>
                <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">{description}</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold transition border border-white/5">Zrušit</button>
                    <button onClick={executeDel} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition shadow-lg shadow-red-500/20 transform hover:scale-105">Smazat</button>
                </div>
            </div>
        </div>
    )
}

export function FolderModal({ isFolderModalOpen, setIsFolderModalOpen, newFolderName, setNewFolderName, newFolderIcon, setNewFolderIcon, createFolder, isEditing }) {
    if (!isFolderModalOpen) return null;
    const iconList = [ { id: 'folder', Icon: Folder }, { id: 'inbox', Icon: Inbox }, { id: 'archive', Icon: Archive }, { id: 'clock', Icon: Clock }, { id: 'check', Icon: CheckSquare }, { id: 'star', Icon: Star }, { id: 'tag', Icon: Tag }, { id: 'mail', Icon: Mail }, { id: 'bell', Icon: Bell } ];
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFolderModalOpen(false)}></div>
            <form onSubmit={createFolder} className="bg-[#1e293b] border border-white/10 rounded-3xl w-full max-w-sm relative z-10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold mb-6 text-white">{isEditing ? 'Upravit složku' : 'Nová složka'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Název složky</label>
                        <input autoFocus type="text" required value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 text-white transition-all" placeholder="Název..."/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Vyberte ikonu</label>
                        <div className="grid grid-cols-5 gap-2">
                            {iconList.map(({ id, Icon }) => (
                                <button key={id} type="button" onClick={() => setNewFolderIcon(id)} className={`p-3 rounded-xl border transition-all flex items-center justify-center ${newFolderIcon === id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-110' : 'bg-[#0f172a] border-white/5 text-slate-400 hover:text-white hover:border-white/10'}`}><Icon className="w-5 h-5" /></button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button type="button" onClick={() => setIsFolderModalOpen(false)} className="flex-1 py-3 text-slate-400 hover:text-white transition font-bold text-sm">Zrušit</button>
                    <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 text-sm">{isEditing ? 'Uložit' : 'Vytvořit'}</button>
                </div>
            </form>
        </div>
    )
}