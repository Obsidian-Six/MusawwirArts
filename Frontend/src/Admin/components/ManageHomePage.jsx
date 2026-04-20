import React, { useState, useEffect } from 'react';
import {
  Edit3, Trash2, Search, Loader2, Save,
  X, Image as ImageIcon, Link2, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const ManageHomepage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Editor States
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const rawApiUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const API_URL = String(rawApiUrl).replace(/\/$/, "");
  let SERVER_URL = API_URL.includes('/api') ? API_URL.split('/api')[0] : API_URL || '';
  if (!SERVER_URL) SERVER_URL = window.location.origin;
  if (!/^https?:\/\//i.test(SERVER_URL)) {
    if (SERVER_URL.includes('.') || SERVER_URL.includes('localhost')) {
      SERVER_URL = `${window.location.protocol}//${SERVER_URL}`;
    } else {
      console.warn('VITE_BASE_URL appears invalid, falling back to window.location.origin for uploads host. Value:', rawApiUrl);
      SERVER_URL = window.location.origin;
    }
  }
  const token = localStorage.getItem('token');

  /**
   * Helper: Standardizes path cleaning to avoid double "uploads/" or "public/" prefixes
   */
  /**
     * Helper: Standardizes path cleaning to avoid double "uploads/" or "public/" prefixes
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
   * Helper: Builds the full URL for the server
   */
  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-banner.jpg";
    if (String(path).startsWith('http') || String(path).startsWith('blob:') || String(path).startsWith('data:')) return path;

    const clean = cleanImagePath(path);
    return `${SERVER_URL}/uploads/${clean}`;
  };

  /**
   * Component: Handles image loading with sequential fallbacks
   */
  const ImageWithFallback = ({ path, initialSrc, alt, className }) => {
    const [fallbackIndex, setFallbackIndex] = useState(0);

    const buildCandidates = () => {
      if (initialSrc && (String(initialSrc).startsWith('blob:') || String(initialSrc).startsWith('data:'))) {
        return [initialSrc];
      }

      if (!path && !initialSrc) return ['/placeholder-banner.jpg'];
      if (path && String(path).startsWith('http')) return [path];

      const clean = cleanImagePath(path);
      return [
        `${SERVER_URL}/uploads/${clean}`,               // Try env/API domain first
        `/uploads/${clean}`,                            // Try relative alias (nginx)
        `${window.location.origin}/uploads/${clean}`,  // Try frontend origin
        '/placeholder-banner.jpg'
      ];
    };

    const candidates = buildCandidates();
    const src = candidates[fallbackIndex] || '/placeholder-banner.jpg';

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          if (fallbackIndex + 1 < candidates.length) {
            setFallbackIndex(fallbackIndex + 1);
          } else {
            e.target.onerror = null;
            e.target.src = '/placeholder-banner.jpg';
          }
        }}
      />
    );
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/homepage`);
      const result = await response.json();
      if (result.success && result.data) {
        const fetchedBanners = result.data.banners || (result.data.banner ? [result.data.banner] : []);
        setBanners(fetchedBanners);
      }
    } catch (error) {
      console.error("Error fetching homepage banners:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleEditClick = (banner) => {
    setEditingBanner({ ...banner });
    setPreviewUrl(getFullImageUrl(banner.url));
    setSelectedFile(null);
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    const formData = new FormData();
    if (selectedFile) formData.append('file', selectedFile);

    formData.append('data', JSON.stringify({
      banner: editingBanner
    }));

    try {
      await axios.post(`${API_URL}/homepage/update`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Banner updated successfully!");
      setEditingBanner(null);
      fetchHomepageData();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm("Remove this photo permanently?")) return;
    try {
      await axios.delete(`${API_URL}/homepage/banner/${bannerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchHomepageData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const filteredBanners = banners.filter(b =>
    (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-8 animate-in fade-in duration-700">

      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif text-stone-900">Homepage Photos</h2>
          <p className="text-stone-400 text-xs uppercase tracking-[0.2em]">
            Managing {banners.length} Hero Visuals
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
          <input
            type="text"
            placeholder="Search slides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-full pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-stone-900 transition-all shadow-sm outline-none"
          />
        </div>
      </div>

      {/* 2. BANNER TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-50">
              <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Visual</th>
              <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Content Details</th>
              <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {loading ? (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                  <Loader2 className="animate-spin text-stone-200 mx-auto" size={32} />
                </td>
              </tr>
            ) : filteredBanners.map((banner) => (
              <tr key={banner._id} className="group hover:bg-stone-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-6">
                    <ImageWithFallback
                      path={banner.url}
                      initialSrc={getFullImageUrl(banner.url)}
                      alt={banner.title}
                      className="w-24 h-16 rounded-xl object-cover shadow-inner bg-stone-100"
                    />
                    <div>
                      <p className="font-serif text-lg text-stone-900">{banner.title || 'Untitled'}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-tighter">Hero Slide</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm text-stone-500 italic max-w-xs truncate">
                  {banner.subtitle || 'No subtitle'}
                </td>
                <td className="p-6 text-right space-x-2">
                  <button
                    onClick={() => handleEditClick(banner)}
                    className="p-3 text-stone-400 hover:text-stone-900 hover:bg-white rounded-xl transition-all shadow-sm"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. EDIT OVERLAY (MODAL) */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-8 border-b border-stone-100">
              <h3 className="text-2xl font-serif text-stone-900">Update Hero Slide</h3>
              <button onClick={() => setEditingBanner(null)} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-10">
              {/* Media Upload Left */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Hero Image</label>
                <div className="relative aspect-video rounded-3xl bg-stone-50 border-2 border-dashed border-stone-200 overflow-hidden group hover:border-[#A6894B] transition-colors">
                  <ImageWithFallback path={editingBanner?.url} initialSrc={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase">
                    Change Photo
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-[10px]">
                  <AlertCircle size={12} />
                  Recommended: 1920x1080px (Landscape)
                </div>
              </div>

              {/* Form Content Right */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Main Title</label>
                  <input
                    type="text"
                    value={editingBanner.title || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-[#A6894B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Subtitle</label>
                  <textarea
                    value={editingBanner.subtitle || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm outline-none h-24 resize-none focus:ring-1 focus:ring-[#A6894B]"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="flex-1 bg-stone-900 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="px-8 border border-stone-200 text-stone-500 py-4 rounded-2xl text-xs font-bold uppercase hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomepage;