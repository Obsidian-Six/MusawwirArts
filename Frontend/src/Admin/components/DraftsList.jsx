import React, { useState, useEffect } from 'react';
import { Edit3, FileText, Loader2, Globe, Trash2 } from 'lucide-react';

const DraftsList = ({ onEdit, API_URL }) => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishingId, setPublishingId] = useState(null);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const response = await fetch(`${API_URL}/paintings?mode=admin`);
            const result = await response.json();
            // Filter to only show drafts
            const onlyDrafts = result.filter(p => p.status === 'draft');
            setDrafts(onlyDrafts);
        } catch (error) {
            console.error("Error fetching drafts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this draft?")) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/paintings/${id}`, {
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

    const handleQuickPublish = async (painting) => {
        if (!window.confirm(`Publish "${painting.title}" live?`)) return;

        setPublishingId(painting._id);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/paintings/${painting._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...painting,
                    status: 'published'
                })
            });

            if (response.ok) {
                setDrafts(prev => prev.filter(p => p._id !== painting._id));
                try { 
                    window.dispatchEvent(new CustomEvent('paintingPublished', { detail: painting._id })); 
                } catch (e) { 
                    console.error("Event Dispatch Error:", e);
                }
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

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-stone-300" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <FileText className="text-amber-500" size={24} />
                <h2 className="text-2xl font-serif text-stone-900">Work in Progress</h2>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {drafts.length} Drafts
                </span>
            </div>

            {drafts.length === 0 ? (
                <div className="bg-stone-50 rounded-[2rem] p-16 text-center border-2 border-dashed border-stone-100">
                    <p className="text-stone-400 italic">Your draft folder is empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drafts.map((painting) => (
                        <div key={painting._id} className="group bg-white rounded-3xl border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={`${API_URL.split('/api')[0]}${painting.imageUrl}`}
                                    alt={painting.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <button 
                                    onClick={() => handleDelete(painting._id)}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-stone-400 hover:text-red-500 shadow-sm transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">Draft</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-serif text-stone-900 truncate">{painting.title}</h3>
                                    <p className="text-xs text-stone-400">
                                        {painting.category?.name || "Uncategorized"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 pt-2 border-t border-stone-50">
                                    <button
                                        onClick={() => onEdit(painting)}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-stone-50 rounded-xl text-stone-900 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-100 transition-colors"
                                    >
                                        <Edit3 size={14} /> Resume Editing
                                    </button>

                                    <button
                                        disabled={publishingId === painting._id}
                                        onClick={() => handleQuickPublish(painting)}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:bg-stone-300"
                                    >
                                        {publishingId === painting._id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Globe size={14} />
                                        )}
                                        Publish to Site
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