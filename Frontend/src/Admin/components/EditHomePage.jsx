import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, Plus, Image as ImageIcon, 
  Globe, Loader2, AlertCircle, Edit3, X, Eye
} from 'lucide-react';

const EditHomepage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data from DB
  const [banners, setBanners] = useState([]);
  const [seo, setSeo] = useState({ metaTitle: '', metaDescription: '' });

  // Form State
  const [currentSlide, setCurrentSlide] = useState({ title: '', subtitle: '', ctaText: '', ctaLink: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
  const SERVER_URL = API_URL.split('/api')[0];
  const token = localStorage.getItem('token');

  // Image helper that cycles through likely candidate URLs until success
  const ImageWithFallback = ({ path, initialSrc, alt, className }) => {
    const [index, setIndex] = useState(0);
    const apiBase = API_URL.includes('/api') ? API_URL.split('/api')[0] : API_URL;

    const buildCandidates = () => {
      if (!path && !initialSrc) return ['/placeholder-banner.jpg'];
      if (initialSrc && (initialSrc.startsWith('blob:') || initialSrc.startsWith('data:'))) {
        return [initialSrc];
      }
      if (path && path.startsWith('http')) return [path];

      const clean = (path || '').startsWith('/') ? (path || '') : `/${path || ''}`;
      return [
        `${apiBase}${clean.startsWith('/uploads') ? clean : `/uploads${clean}`}`,
        `${window.location.origin}${clean}`,
        clean.startsWith('/uploads') ? clean : `/uploads${clean}`,
      ];
    };

    const candidates = buildCandidates();
    const src = (initialSrc && (initialSrc.startsWith('blob:') || initialSrc.startsWith('data:'))) ? initialSrc : (candidates[index] || '/placeholder-banner.jpg');

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          if (index + 1 < candidates.length) {
            setIndex((i) => i + 1);
            e.target.src = candidates[index + 1];
          } else {
            e.target.onerror = null;
            e.target.src = '/placeholder-banner.jpg';
          }
        }}
      />
    );
  };

  // Helper to format the image URL correctly
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Force /uploads prefix if not present
    if (!cleanPath.startsWith('/uploads')) {
        return `${SERVER_URL}/uploads${cleanPath}`;
    }
    return `${SERVER_URL}${cleanPath}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/homepage`);
      if (res.data.success && res.data.data) {
        setBanners(res.data.data.banners || []);
        setSeo(res.data.data.seo || { metaTitle: '', metaDescription: '' });
      }
    } catch (err) {
      console.error("Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentSlide({ title: '', subtitle: '', ctaText: '', ctaLink: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleEditInitiate = (slide) => {
    setCurrentSlide(slide);
    // Use the helper to ensure the preview works
    setPreviewUrl(getFullUrl(slide.url));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!currentSlide.title && !selectedFile && !currentSlide.url) {
      return alert("Please provide at least a title or an image.");
    }

    setIsSaving(true);
    const formData = new FormData();
    if (selectedFile) formData.append('file', selectedFile);
    
    formData.append('data', JSON.stringify({ 
      banner: currentSlide, 
      seo: seo 
    }));

    try {
      await axios.post(`${API_URL}/homepage/update`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      alert("Changes saved successfully.");
      resetForm();
      fetchData(); 
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-stone-400" size={40} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen pb-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Homepage Content</h1>
          <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">Configure Hero Visuals & SEO</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-10">
        <aside className="space-y-2">
          <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} icon={<ImageIcon size={18} />} label="Hero Slides" />
          <TabButton active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} icon={<Globe size={18} />} label="SEO Settings" />
        </aside>

        <main className="space-y-8">
          {activeTab === 'hero' && (
            <>
              <section className="bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-serif italic text-stone-700">
                    {currentSlide._id ? 'Modify Existing Slide' : 'Add New Hero Slide'}
                  </h2>
                  {currentSlide._id && (
                    <button onClick={resetForm} className="flex items-center gap-1 text-[10px] uppercase font-bold text-stone-400 hover:text-stone-600 transition-colors">
                      <X size={14}/> Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 overflow-hidden group transition-all hover:border-stone-400">
                      {previewUrl ? (
                        <ImageWithFallback path={currentSlide?.url} initialSrc={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-stone-300">
                          <ImageIcon size={40} strokeWidth={1} />
                          <span className="text-[10px] mt-3 font-bold uppercase tracking-widest">Click to Upload Image</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if(file) {
                            setSelectedFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InputGroup label="Main Title" value={currentSlide.title} onChange={(val) => setCurrentSlide({...currentSlide, title: val})} />
                    <InputGroup label="Subtitle / Tagline" value={currentSlide.subtitle} isTextArea onChange={(val) => setCurrentSlide({...currentSlide, subtitle: val})} />
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black disabled:bg-stone-300 transition-all"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      {currentSlide._id ? 'Save Changes' : 'Upload New Slide'}
                    </button>
                  </div>
                </div>
              </section>

              {/* LIST OF EXISTING BANNERS FOR EASY EDITING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((slide) => (
                    <div key={slide._id} className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-2xl shadow-sm">
                        <ImageWithFallback path={slide.url} initialSrc={getFullUrl(slide.url)} alt="" className="w-20 h-12 object-cover rounded-lg bg-stone-50" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-stone-800 truncate">{slide.title}</h4>
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Hero Slide</p>
                        </div>
                        <button onClick={() => handleEditInitiate(slide)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                            <Edit3 size={16} />
                        </button>
                    </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'seo' && (
            <div className="bg-white border border-stone-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
               <div className="bg-[#A6894B]/10 border border-[#A6894B]/20 p-4 rounded-xl flex items-start gap-3 mb-4">
                  <AlertCircle className="text-[#A6894B] shrink-0" size={18} />
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Global SEO settings define how Musawwir Arts appears in search engine results.
                  </p>
               </div>
               <InputGroup label="Meta Title" value={seo.metaTitle} onChange={(val) => setSeo({...seo, metaTitle: val})} />
               <InputGroup label="Meta Description" value={seo.metaDescription} isTextArea onChange={(val) => setSeo({...seo, metaDescription: val})} />
               <button 
                 onClick={handleSave} 
                 disabled={isSaving}
                 className="bg-stone-900 text-white px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
               >
                 {isSaving && <Loader2 size={14} className="animate-spin"/>}
                 Update SEO
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Sub-components remains the same...
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
      active ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' : 'text-stone-500 hover:bg-stone-50'
    }`}
  >
    {icon}
    <span className={active ? 'font-medium' : 'font-normal'}>{label}</span>
  </button>
);

const InputGroup = ({ label, value, onChange, isTextArea = false }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">{label}</label>
    {isTextArea ? (
      <textarea 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-50 border-none rounded-xl p-4 text-sm focus:ring-1 focus:ring-stone-200 outline-none h-24 resize-none transition-all"
      />
    ) : (
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-50 border-none rounded-xl p-4 text-sm focus:ring-1 focus:ring-stone-200 outline-none transition-all"
      />
    )}
  </div>
);

export default EditHomepage;