import React, { useState, useEffect } from 'react';
import { Edit3, FileText, Loader2, Globe, Trash2, Palette, Box } from 'lucide-react';

const DraftsList = ({ onEdit, API_URL }) => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishingId, setPublishingId] = useState(null);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            const [paintingsRes, sculpturesRes] = await Promise.all([
                fetch(`${API_URL}/paintings?mode=admin`),
                fetch(`${API_URL}/sculptures?mode=admin`)
            ]);

            const paintingsResult = await paintingsRes.json();
            const sculpturesResult = await sculpturesRes.json();

            const pData = Array.isArray(paintingsResult.data) ? paintingsResult.data : (Array.isArray(paintingsResult) ? paintingsResult : []);
            const sData = Array.isArray(sculpturesResult.data) ? sculpturesResult.data : (Array.isArray(sculpturesResult) ? sculpturesResult : []);

            const pDrafts = pData.filter(p => p.status === 'draft').map(item => ({ ...item, type: 'painting' }));
            const sDrafts = sData.filter(s => s.status === 'draft').map(item => ({ ...item, type: 'sculpture' }));

            // Combine and sort by createdAt
            const allDrafts = [...pDrafts, ...sDrafts].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setDrafts(allDrafts);
        } catch (error) {
            console.error("Error fetching drafts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to permanently delete this ${type} draft?`)) return;
        
        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'sculpture' ? 'sculptures' : 'paintings';
            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setDrafts(prev => prev.filter(p => p._id !== id));
            } else {
                alert("Failed to delete draft.");
            }
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    const handleQuickPublish = async (item) => {
        if (!window.confirm(`Publish "${item.title}" live?`)) return;

        setPublishingId(item._id);

        try {
            const token = localStorage.getItem('token');
            const endpoint = item.type === 'sculpture' ? 'sculptures' : 'paintings';
            
            // Prepare update data
            const updateData = { ...item, status: 'published' };
            delete updateData.type; // Don't send our local 'type' flag

            const response = await fetch(`${API_URL}/${endpoint}/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                setDrafts(prev => prev.filter(p => p._id !== item._id));
                // Dispatch event for any components listening
                const eventName = item.type === 'sculpture' ? 'sculpturePublished' : 'paintingPublished';
                window.dispatchEvent(new CustomEvent(eventName, { detail: item._id }));
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Publishing Error:", err);
        } finally {
            setPublishingId(null);
        }
    };

    const getFullImageUrl = (item) => {
        const rootUrl = API_URL.split('/api')[0].replace(/\/$/, "");
        const path = item.imageUrl;
        if (!path) return "/placeholder-art.jpg";
        if (path.startsWith('http')) return path;
        
        // Ensure path logic matches the specific folder
        const folder = item.type === 'sculpture' ? 'sculptures' : 'paintings';
        const fileName = path.split('\\').pop().split('/').pop();
        return `${rootUrl}/uploads/${folder}/${fileName}`;
    };

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-stone-900" size={32} />
            <p className="text-stone-400 font-serif italic text-sm">Opening the archives...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-2xl">
                        <FileText className="text-amber-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-stone-900">Work in Progress</h2>
                        <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
                            {drafts.length} Unfinished Masterpieces
                        </p>
                    </div>
                </div>
                <button 
                  onClick={fetchDrafts}
                  className="text-stone-400 hover:text-stone-900 text-[10px] uppercase tracking-widest font-black transition-colors"
                >
                  Refresh Archives
                </button>
            </div>

            {drafts.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-stone-100 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6 text-stone-200">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-stone-900 italic">No Drafts Found</h3>
                    <p className="text-stone-400 text-xs uppercase tracking-widest mt-2 font-medium">Every piece is either published or yet to be started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {drafts.map((item) => (
                        <div key={item._id} className="group bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
                            <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
                                <img
                                    src={getFullImageUrl(item)}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <button 
                                    onClick={() => handleDelete(item._id, item.type)}
                                    className="absolute top-6 right-6 bg-white shadow-xl p-3 rounded-full text-stone-300 hover:text-red-500 hover:scale-110 transition-all active:scale-95"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <div className="bg-stone-900 text-white px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Draft</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 ${
                                        item.type === 'sculpture' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {item.type === 'sculpture' ? <Box size={10} /> : <Palette size={10} />}
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-xl font-serif text-stone-900 truncate leading-tight">{item.title}</h3>
                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-bold">
                                        {item.category?.name || (item.material ? `Material: ${item.material}` : "Uncategorized")}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => onEdit(item, item.type)}
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-stone-50 rounded-2xl text-stone-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-100 hover:text-stone-900 transition-all group"
                                    >
                                        <Edit3 size={14} className="group-hover:rotate-12 transition-transform" /> 
                                        Resume Masterpiece
                                    </button>

                                    <button
                                        disabled={publishingId === item._id}
                                        onClick={() => handleQuickPublish(item)}
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-stone-200 disabled:bg-stone-200 disabled:shadow-none active:scale-95"
                                    >
                                        {publishingId === item._id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Globe size={14} />
                                        )}
                                        Go Live
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DraftsList;