import { GripVertical, AtSign, Briefcase, Eye, CheckCircle2, Trash2, Pencil, MonitorPlay, ExternalLink, Star, ThumbsUp, ThumbsDown, FolderKanban, ArrowUp, Tag, ChevronLeft, ChevronRight, X, Images } from 'lucide-react'
import { useState } from 'react'

export function MessagesList({ items, allowDrag, setAllowDrag, handleDragStart, markAsRead, confirmDel, copyToClipboard }) {
    return (
        <div className="space-y-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {items.map(msg => (
                <div key={msg.id} draggable={allowDrag} onDragStart={(e) => handleDragStart(e, msg)} className={`group rounded-2xl border transition-all duration-300 flex flex-col md:flex-row relative overflow-hidden ${msg.is_read ? 'bg-[#1e293b]/30 border-white/5' : 'bg-[#1e293b]/80 border-indigo-500/30'}`}>
                    <div className={`w-1 ${msg.is_read ? 'bg-transparent' : 'bg-indigo-500'}`}></div>
                    <div className="w-10 flex items-center justify-center cursor-grab text-slate-600 border-r border-white/5" onMouseEnter={() => setAllowDrag(true)} onMouseLeave={() => setAllowDrag(false)}><GripVertical className="w-5 h-5"/></div>
                    
                    <div className="flex-1 p-5 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${msg.is_read ? 'bg-white/5 text-slate-500' : 'bg-indigo-600 text-white'}`}>{msg.name?.charAt(0).toUpperCase()}</div>
                                <div className="min-w-0">
                                    <h3 className={`font-bold truncate ${msg.is_read ? 'text-slate-400' : 'text-white'}`}>{msg.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm"><AtSign className="w-3 h-3"/> <span className="hover:text-indigo-400 cursor-pointer" onClick={() => copyToClipboard(msg.email)}>{msg.email}</span></div>
                                </div>
                            </div>
                            <div className="md:ml-auto flex flex-wrap items-center gap-2">
                                 {msg.products?.name ? (
                                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-wider">
                                         <Briefcase className="w-3 h-3"/> {msg.products.name}
                                     </span>
                                 ) : (
                                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-400 text-[10px] font-bold border border-slate-500/20 uppercase tracking-wider">
                                         Obecný dotaz
                                     </span>
                                 )}
                                 <span className="text-slate-600 text-xs font-mono bg-black/20 px-2 py-1 rounded border border-white/5">{new Date(msg.created_at).toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl text-sm whitespace-pre-wrap border ${msg.is_read ? 'bg-transparent border-transparent text-slate-500' : 'bg-[#0f172a]/50 border-white/5 text-slate-300'}`}>{msg.message}</div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 justify-center p-4 border-t md:border-t-0 md:border-l border-white/5 bg-black/10">
                        {!msg.is_read ? (<button onClick={() => markAsRead(msg.id)} className="p-3 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition shadow-lg border border-indigo-500/20"><CheckCircle2 className="w-5 h-5"/></button>) : (<div className="p-3 text-slate-600"><Eye className="w-5 h-5"/></div>)}
                        <button onClick={() => confirmDel(msg)} className="p-3 bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition border border-transparent hover:border-red-500/30"><Trash2 className="w-5 h-5"/></button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function DemosList({ items, openEdit, confirmDel }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {items.map(item => (
                <div key={item.id} className="group bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg text-white">{item.title}</h3>
                            <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-400"><MonitorPlay className="w-5 h-5"/></div>
                        </div>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 flex items-center gap-1 mb-3 hover:underline"><ExternalLink className="w-3 h-3"/> {item.url}</a>
                        <p className="text-sm text-slate-400 line-clamp-3">{item.description}</p>
                    </div>
                    <div className="flex gap-2 border-t border-white/5 pt-4">
                        <button onClick={() => openEdit(item)} className="flex-1 py-2 bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold uppercase transition">Upravit</button>
                        <button onClick={() => confirmDel(item)} className="px-3 py-2 bg-white/5 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function ServicesTable({ items, openEdit, confirmDel }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#1e293b]/40 backdrop-blur-xl animate-in fade-in duration-500 slide-in-from-bottom-4">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-white/5 text-xs uppercase font-bold text-slate-300">
                    <tr><th className="px-6 py-4">Služba</th><th className="px-6 py-4 hidden md:table-cell">Tagy</th><th className="px-6 py-4 text-right">Cena</th><th className="px-6 py-4 text-right">Akce</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {items.map(item => (
                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4"><div className="font-bold text-white text-base">{item.name}</div><div className="text-xs text-slate-500 truncate max-w-xs">{item.description}</div></td>
                            <td className="px-6 py-4 hidden md:table-cell"><div className="flex flex-wrap gap-1.5">{item.tags?.map((t, i) => <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t}</span>)}</div></td>
                            <td className="px-6 py-4 text-right font-bold text-white">{item.price}</td>
                            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition"><button onClick={() => openEdit(item)} className="p-2 hover:text-indigo-400"><Pencil className="w-4 h-4"/></button><button onClick={() => confirmDel(item)} className="p-2 hover:text-red-400"><Trash2 className="w-4 h-4"/></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function ProjectsGrid({ items, openEdit, confirmDel }) {
    const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

    const openGallery = (images, index = 0) => {
        setLightbox({ open: true, images: images, index: index });
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                {items.map(item => {
                    const images = item.images || [];
                    const thumb = images[0] || item.image_url;
                    const hasMore = images.length > 1;

                    return (
                        <div key={item.id} className="group bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 transition-all flex flex-col h-full relative">
                            <div className="relative mb-4 shrink-0">
                                {hasMore && (
                                    <div className="absolute -bottom-1 -right-1 w-full h-full bg-indigo-500/20 rounded-xl -z-10 translate-x-1 translate-y-1"></div>
                                )}
                                <div 
                                    className="w-full aspect-video rounded-xl bg-[#0f172a] overflow-hidden border border-white/5 cursor-pointer relative group/img"
                                    onClick={() => thumb && openGallery(images.length > 0 ? images : [thumb])}
                                >
                                    {thumb ? (
                                        <>
                                            <img src={thumb} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500" alt={item.title}/>
                                            {hasMore && (
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                                                    <Images className="w-3 h-3" />
                                                    +{images.length - 1}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-indigo-600/0 group-hover/img:bg-indigo-600/10 transition-colors flex items-center justify-center">
                                                <Eye className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity w-8 h-8" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                                            <FolderKanban className="w-12 h-12 opacity-20"/>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                            
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {item.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 uppercase tracking-tight flex items-center gap-1">
                                            <Tag className="w-2 h-2" /> {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{item.description}</p>
                            
                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => openEdit(item)} className="flex-1 py-2 bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold uppercase transition">Upravit</button>
                                <button onClick={() => confirmDel(item)} className="px-3 py-2 bg-white/5 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* LIGHTBOX MODAL - PŘIDÁNO z-[100] ABY PŘEKRYLO SIDEBAR */}
            {lightbox.open && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <button 
                        onClick={() => setLightbox({ ...lightbox, open: false })}
                        className="absolute top-6 right-6 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[110]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setLightbox({ ...lightbox, open: false })}>
                        <div className="relative max-w-5xl max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            {lightbox.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }))}
                                        className="absolute -left-4 md:-left-20 p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl text-white transition-all z-[110] backdrop-blur-md border border-white/5"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button 
                                        onClick={() => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }))}
                                        className="absolute -right-4 md:-right-20 p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl text-white transition-all z-[110] backdrop-blur-md border border-white/5"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}

                            <img 
                                src={lightbox.images[lightbox.index]} 
                                className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 border border-white/5" 
                                alt="Preview"
                            />

                            {/* Indikátor pozice v galerii */}
                            {lightbox.images.length > 1 && (
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-sm font-bold tracking-widest font-mono">
                                    {lightbox.index + 1} / {lightbox.images.length}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export function ReviewsList({ items, toggleReviewStatus, confirmDel }) {
    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {items.map(review => (
                <div key={review.id} className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 transition-all duration-300 relative overflow-hidden ${review.is_approved ? 'bg-green-500/5 border-green-500/20' : 'bg-orange-500/5 border-orange-500/30'}`}>
                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${review.is_approved ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">{(review.name || '?').charAt(0).toUpperCase()}</div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white">{review.name}</h3>
                                    {review.is_approved ? <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded-full border border-green-500/20">Schváleno</span> : <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase rounded-full border border-orange-500/20">Čeká</span>}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>{review.role || 'Zákazník'}</span>•
                                    <div className="flex gap-0.5 text-yellow-500">{[...Array(review.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current"/>)}</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm italic p-4 bg-black/20 rounded-xl border border-white/5">"{review.text}"</p>
                    </div>
                    <div className="flex md:flex-col gap-2 justify-center pt-4 md:pt-0">
                        <button onClick={() => toggleReviewStatus(review)} className={`p-3 rounded-xl transition ${review.is_approved ? 'bg-white/5 text-slate-400 hover:text-orange-400' : 'bg-green-500/10 text-green-400 hover:bg-green-600 hover:text-white'}`}>{review.is_approved ? <ThumbsDown className="w-5 h-5"/> : <ThumbsUp className="w-5 h-5"/>}</button>
                        <button onClick={() => confirmDel(review)} className="p-3 bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition"><Trash2 className="w-5 h-5"/></button>
                    </div>
                </div>
            ))}
        </div>
    )
}