import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Star, MapPin, Edit3, X, Loader2, Upload, User } from 'lucide-react';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Image states
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        text: '',
        stars: 5
    });

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    /**
     * Helper: Cleans the path from database strings
     */
    const cleanImagePath = (path) => {
        if (!path) return "";
        let s = String(path);
        s = s.replace(/^\/+/, '');
        s = s.replace(/public\/uploads\//gi, '');
        s = s.replace(/public\//gi, '');
        s = s.replace(/(?:uploads\/)+/gi, 'uploads/');
        s = s.replace(/^uploads\//i, '');
        return s;
    };

    /**
     * Helper: Builds full URL for preview and display
     */
    const getFullImageUrl = (path) => {
        const SERVER_URL = import.meta.env.VITE_BASE_URL.replace(/\/api$/, '');
        if (!path) return null;
        if (String(path).startsWith('http') || String(path).startsWith('blob:') || String(path).startsWith('data:')) return path;

        const clean = cleanImagePath(path);
        return `${SERVER_URL}/uploads/${clean}`;
    };

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${BASE_URL}/testimonials`);
            const result = await res.json();
            if (result.success) setTestimonials(result.data);
        } catch (err) {
            console.error("Error fetching testimonials", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleEdit = (t) => {
        setEditingId(t._id);
        setFormData({
            name: t.name,
            location: t.location,
            text: t.text,
            stars: t.stars
        });
        
        // Use the consistent helper for the edit preview
        if (t.authorImage) {
            setPreviewUrl(getFullImageUrl(t.authorImage));
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({ name: '', location: '', text: '', stars: 5 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('location', formData.location);
        data.append('text', formData.text);
        data.append('stars', formData.stars);
        
        if (selectedFile) {
            data.append('authorImage', selectedFile);
        }

        try {
            const url = editingId 
                ? `${BASE_URL}/testimonials/${editingId}` 
                : `${BASE_URL}/testimonials`;
            
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                body: data 
            });

            if (res.ok) {
                fetchTestimonials();
                closeModal();
            }
        } catch (err) {
            console.error("Error saving testimonial", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this testimonial?")) return;
        try {
            const res = await fetch(`${BASE_URL}/testimonials/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchTestimonials();
        } catch (err) {
            console.error("Error deleting", err);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-stone-400" />
        </div>
    );

    return (
        <div className="p-4 md:p-10 bg-white min-h-screen font-serif">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-light tracking-tight text-stone-900">Collector Feedback</h1>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Manage Public Testimonials</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={14} /> Add New
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t._id} className="group relative border border-stone-100 p-6 bg-stone-50/50 hover:bg-white hover:shadow-xl transition-all duration-500 rounded-sm flex flex-col">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleEdit(t)} className="text-stone-300 hover:text-stone-900 transition-colors">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(t._id)} className="text-stone-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Author Image Display */}
                            <div className="mb-4">
                                {t.authorImage ? (
                                    <img 
                                        src={getFullImageUrl(t.authorImage)} 
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full object-cover border border-stone-200"
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-avatar.jpg"; }}
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, i) => (
                                    <Star key={i} size={10} fill="#A6894B" color="#A6894B" />
                                ))}
                            </div>

                            <p className="text-stone-600 text-sm italic leading-relaxed mb-8 break-words">"{t.text}"</p>

                            <div className="flex flex-col gap-0.5 pt-4 border-t border-stone-100 mt-auto">
                                <span className="text-sm font-semibold text-stone-900">{t.name}</span>
                                <span className="text-[10px] text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                    <MapPin size={10} /> {t.location}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-md p-6 md:p-8 shadow-2xl relative overflow-y-auto max-h-[95vh]">
                            <button onClick={closeModal} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900">
                                <X size={20} />
                            </button>

                            <h2 className="text-xl mb-6 font-light">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-stone-400 tracking-widest">Collector Photo</label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center overflow-hidden">
                                            {previewUrl ? (
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <User className="text-stone-300" size={24} />
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-stone-50 px-4 py-2 border border-stone-200 text-[10px] uppercase tracking-widest hover:bg-stone-100 transition-colors">
                                            <Upload size={12} className="inline mr-2" /> 
                                            {previewUrl ? 'Change' : 'Upload'}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-stone-400 tracking-widest">Collector Name</label>
                                    <input 
                                        type="text" value={formData.name} required
                                        className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none text-sm bg-transparent"
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-stone-400 tracking-widest">Location</label>
                                    <input 
                                        type="text" value={formData.location} required placeholder="e.g. London, UK"
                                        className="w-full border-b border-stone-200 py-2 focus:border-stone-900 outline-none text-sm bg-transparent"
                                        onChange={e => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-stone-400 tracking-widest">Feedback</label>
                                    <textarea 
                                        value={formData.text} required rows={4}
                                        className="w-full border border-stone-100 p-3 focus:border-stone-900 outline-none text-sm bg-stone-50/50"
                                        onChange={e => setFormData({...formData, text: e.target.value})}
                                    />
                                </div>

                                <div className="flex items-center justify-between bg-stone-50 p-3">
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Rating</label>
                                    <select 
                                        value={formData.stars}
                                        className="bg-transparent text-sm outline-none font-bold"
                                        onChange={e => setFormData({...formData, stars: Number(e.target.value)})}
                                    >
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                    </select>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button 
                                        type="button" onClick={closeModal} 
                                        className="flex-1 py-4 text-xs uppercase tracking-widest border border-stone-200 hover:bg-stone-50 transition-colors order-2 sm:order-1"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" disabled={isSubmitting}
                                        className="flex-1 py-4 text-xs uppercase tracking-widest bg-stone-900 text-white hover:bg-black transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : (editingId ? 'Update' : 'Save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTestimonials;