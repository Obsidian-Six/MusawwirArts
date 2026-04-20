import React, { useState, useEffect } from 'react';
import { Globe, Save, Loader2 } from 'lucide-react';

const PaintingForm = ({ initialData, mode = 'add', onSaveSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Orientation States
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const [tempFile, setTempFile] = useState(null); 
  const [orientation, setOrientation] = useState('square'); 

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dimensions: '',
    medium: '',
    category: '',
    isAvailable: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/categories`);
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-art.jpg";
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_BASE_URL.split('/api')[0].replace(/\/$/, "");
    const fileName = path.split('\\').pop().split('/').pop();
    return `${baseUrl}/uploads/paintings/${fileName}`;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dimensions: initialData.dimensions || '',
        medium: initialData.medium || '',
        category: initialData.category?._id || initialData.category || '',
        isAvailable: initialData.isAvailable ?? true,
      });
      setPreviewUrl(getFullImageUrl(initialData.imageUrl));
      // Sync orientation if it exists in initialData
      if (initialData.orientation) setOrientation(initialData.orientation);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempFile(file);
      setShowOrientationModal(true); 
    }
  };

  const handleOrientationChoice = (choice) => {
    setOrientation(choice);
    setImageFile(tempFile);
    setPreviewUrl(URL.createObjectURL(tempFile));
    setShowOrientationModal(false);
    setTempFile(null);
  };

  const handleSubmit = async (targetStatus) => {
    if (!formData.title) return alert("Please enter a title.");
    if (!formData.category || formData.category === "") {
      return alert("Please select a category for this artwork.");
    }
    if (mode === 'add' && !imageFile) return alert("Please upload an image.");

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description || '');
      data.append('dimensions', formData.dimensions || '');
      data.append('medium', formData.medium || '');
      data.append('category', formData.category || '');
      data.append('isAvailable', String(formData.isAvailable));
      data.append('status', targetStatus);
      data.append('orientation', orientation);

      if (imageFile) {
        data.append('image', imageFile);
      }

      const token = localStorage.getItem('token');
      const url = mode === 'add'
        ? `${import.meta.env.VITE_BASE_URL}/paintings`
        : `${import.meta.env.VITE_BASE_URL}/paintings/${initialData._id}`;

      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully ${targetStatus === 'published' ? 'Published' : 'Saved as Draft'}!`);
        if (onSaveSuccess) onSaveSuccess(result);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm mx-auto font-serif relative">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl text-stone-900">
          {mode === 'add' ? 'Register New Artwork' : 'Edit Masterpiece'}
        </h3>
        {initialData?.status === 'draft' && (
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Currently a Draft
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* IMAGE UPLOAD SECTION */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">Artwork Image</label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`w-full md:w-64 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center relative shadow-inner transition-all duration-500 ${
              orientation === 'landscape' ? 'aspect-video' : 'aspect-square'
            }`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="text-[9px] uppercase tracking-tighter text-stone-400 font-serif">No Image Selected</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-stone-900 file:text-white hover:file:bg-black cursor-pointer font-serif"
              />
              <p className="text-[10px] text-stone-400 mt-2 italic">
                Display Mode: <span className="uppercase font-bold text-stone-600">{orientation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ORIENTATION POPUP MODAL */}
        {showOrientationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
              <h4 className="text-xl text-center mb-2 font-serif">Image Orientation</h4>
              <p className="text-stone-500 text-sm text-center mb-8 font-light font-serif">Select how this image should be framed in the gallery.</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleOrientationChoice('square')}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-stone-100 hover:border-stone-900 transition-all group"
                >
                  <div className="w-12 h-12 border-2 border-stone-300 group-hover:border-stone-900 rounded-sm" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-serif">Normal/Square</span>
                </button>

                <button
                  onClick={() => handleOrientationChoice('landscape')}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-stone-100 hover:border-stone-900 transition-all group"
                >
                  <div className="w-16 h-10 border-2 border-stone-300 group-hover:border-stone-900 rounded-sm" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-serif">Landscape</span>
                </button>
              </div>

              <button
                onClick={() => { setShowOrientationModal(false); setTempFile(null); }}
                className="w-full mt-6 text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors font-serif"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 outline-none font-serif"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.parent?.name
                    ? `${cat.name} Sub of (${cat.parent.name})`
                    : cat.name
                  }
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Dimensions</label>
            <input name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Medium</label>
            <input name="medium" value={formData.medium} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 outline-none" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} id="avail" className="w-4 h-4 accent-stone-900" />
          <label htmlFor="avail" className="text-xs font-bold uppercase tracking-widest text-stone-700">Currently Available</label>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 outline-none" />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-stone-50">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('draft')}
            className="flex-1 flex items-center justify-center gap-2 bg-stone-100 text-stone-900 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save as Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('published')}
            className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-stone-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Globe size={16} />}
            Publish to Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaintingForm;