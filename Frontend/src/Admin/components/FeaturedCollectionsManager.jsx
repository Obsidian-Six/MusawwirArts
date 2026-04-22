import React, { useState, useEffect } from 'react';
import { Camera, Trash2, X, Plus } from 'lucide-react';

const FeaturedCollectionsManager = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    dimensions: '',
    medium: '',
    layoutStyle: 'Square (1:1)'
  });
  const [customDimension, setCustomDimension] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL.replace(/\/$/, "") : 'http://localhost:3000/api';

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/featured-collections`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    // reset input value if referenced, but standard approach works
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    const dims_value = formData.dimensions === 'Custom' ? customDimension : formData.dimensions;
    if (!dims_value) {
      setError('Please provide dimensions');
      return;
    }

    setSaving(true);
    setError(null);

    const token = localStorage.getItem('token');
    const submitData = new FormData();
    submitData.append('image', imageFile);
    submitData.append('title', formData.title);
    submitData.append('dimensions', dims_value);
    submitData.append('medium', formData.medium);
    submitData.append('layoutStyle', formData.layoutStyle);

    try {
      const response = await fetch(`${API_URL}/featured-collections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        setFormData({ title: '', dimensions: '', medium: '', layoutStyle: 'Square (1:1)' });
        setCustomDimension('');
        removeImage();
        fetchCollections();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this featured item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/featured-collections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchCollections();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const predefinedDimensions = [
    '24" x 24"',
    '30" x 30"',
    '36" x 36"',
    '40" x 40"',
    '12" x 16"',
    '16" x 20"',
    '18" x 24"',
    '24" x 36"',
    '3" x 4"',
    '4" x 4"'
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-serif text-stone-900">Featured Collections</h2>
          <p className="text-sm text-stone-500 mt-1">Manage dimensionally responsive featured artwork.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD FORM */}
        <div className="lg:col-span-1 border border-stone-200 rounded-xl bg-white p-6 h-fit sticky top-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-6 flex items-center gap-2">
            <Plus size={16} /> Add Featured
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Artwork Image *
              </label>
              
              {previewUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-stone-200 group">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-200 rounded-lg h-48 flex flex-col items-center justify-center text-stone-400 hover:border-stone-300 hover:text-stone-500 hover:bg-stone-50 transition-all cursor-pointer">
                  <Camera size={24} className="mb-2" />
                  <span className="text-sm font-medium">Click to browse</span>
                  <span className="text-xs mt-1">JPEG, PNG, WebP (Max 5MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                placeholder="E.g. Banaras Ghat At Night"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Dimensions *</label>
                <select
                  required={!customDimension}
                  value={formData.dimensions}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                >
                  <option value="" disabled>Select size</option>
                  {predefinedDimensions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  <option value="Custom">Custom...</option>
                </select>
                
                {formData.dimensions === 'Custom' && (
                  <input
                    type="text"
                    required
                    value={customDimension}
                    onChange={(e) => setCustomDimension(e.target.value)}
                    placeholder='e.g. 10" x 20"'
                    className="w-full mt-2 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Medium *</label>
                <input
                  type="text"
                  required
                  value={formData.medium}
                  onChange={(e) => setFormData({...formData, medium: e.target.value})}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                  placeholder="E.g. Acrylic on Canvas"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Image Layout Style *</label>
              <select
                required
                value={formData.layoutStyle}
                onChange={(e) => setFormData({...formData, layoutStyle: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="Square (1:1)">Square (1:1)</option>
                <option value="Horizontal Rectangle (4:3)">Horizontal Rectangle (4:3)</option>
                <option value="Landscape (16:9)">Landscape (16:9)</option>
                <option value="Vertical Rectangle (3:4)">Vertical Rectangle (3:4)</option>
                <option value="Portrait (9:16)">Portrait (9:16)</option>
              </select>
              <p className="text-[10px] text-stone-400 mt-1 uppercase">This forces the image into a specific shape on the frontend.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-stone-900 text-white rounded-lg text-sm tracking-wider font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'ADDING...' : 'ADD TO FEATURED'}
            </button>
          </form>
        </div>

        {/* GALLERY GRID */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <span className="text-stone-400 text-sm tracking-wider uppercase">Loading...</span>
            </div>
          ) : collections.length === 0 ? (
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
              <span className="text-stone-400 text-sm tracking-wider uppercase">No featured collections found</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map(item => (
                <div key={item._id} className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div 
                    className="bg-stone-100 overflow-hidden relative"
                    style={{ 
                      aspectRatio: item.layoutStyle === 'Square (1:1)' ? '1 / 1' :
                      item.layoutStyle === 'Horizontal Rectangle (4:3)' ? '4 / 3' :
                      item.layoutStyle === 'Landscape (16:9)' ? '16 / 9' :
                      item.layoutStyle === 'Vertical Rectangle (3:4)' ? '3 / 4' :
                      item.layoutStyle === 'Portrait (9:16)' ? '9 / 16' : '1 / 1'
                    }}
                  >
                    <img
                      src={`${API_URL.replace('/api', '')}${item.imageUrl}`}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-lg text-stone-900 mb-1 truncate">{item.title}</h4>
                    <p className="text-sm text-stone-500 italic mb-1 truncate">{item.medium}</p>
                    <p className="text-xs uppercase tracking-wider text-stone-400">Size: {item.dimensions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollectionsManager;
