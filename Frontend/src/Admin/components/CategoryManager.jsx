import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderTree, Globe, Loader2, Edit3, X } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: Track edit mode
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    parent: '',
    description: '',
    metaTitle: '',
    metaDescription: ''
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const result = await response.json();
      if (result.success) setCategories(result.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Switch to Edit Mode
  const handleEditClick = (cat) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      parent: cat.parent?._id || cat.parent || '',
      description: cat.description || '',
      metaTitle: cat.seo?.metaTitle || '',
      metaDescription: cat.seo?.metaDescription || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', parent: '', description: '', metaTitle: '', metaDescription: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      parent: formData.parent || null,
      description: formData.description,
      seo: {
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription
      }
    };

    try {
      const url = editingId 
        ? `${BASE_URL}/categories/${editingId}` 
        : `${BASE_URL}/categories`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(editingId ? "Category Updated!" : "Category Created!");
        cancelEdit();
        fetchCategories();
      }
    } catch (err) {
      alert("Error saving category");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      const response = await fetch(`${BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) fetchCategories();
      else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      
      {/* LEFT: FORM (Sticky on desktop) */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100 shadow-sm lg:sticky lg:top-8 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl flex items-center gap-2 text-stone-900">
              {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
              {editingId ? "Edit Category" : "New Category"}
            </h3>
            {editingId && (
              <button onClick={cancelEdit} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 px-1">Category Name</label>
              <input 
                name="name" 
                required
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Abstract"
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 transition-all" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 px-1">Parent Category</label>
              <select 
                name="parent" 
                value={formData.parent} 
                onChange={handleChange}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 appearance-none"
              >
                <option value="">None (Top Level)</option>
                {categories
                  .filter(cat => cat._id !== editingId) // Prevent self-parenting
                  .map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 px-1">Description</label>
              <textarea 
                name="description" 
                rows="2"
                value={formData.description} 
                onChange={handleChange}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-stone-900 transition-all" 
              />
            </div>

            <div className="pt-4 border-t border-stone-50">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 mb-3 flex items-center gap-1">
                <Globe size={12} /> SEO Settings
              </h4>
              <div className="space-y-3">
                <input 
                  name="metaTitle" 
                  placeholder="Meta Title"
                  value={formData.metaTitle} 
                  onChange={handleChange}
                  className="w-full bg-stone-50 text-xs border-none rounded-lg px-3 py-2 focus:ring-1 focus:ring-stone-900" 
                />
                <textarea 
                  name="metaDescription" 
                  placeholder="Meta Description"
                  value={formData.metaDescription} 
                  onChange={handleChange}
                  className="w-full bg-stone-50 text-xs border-none rounded-lg px-3 py-2 focus:ring-1 focus:ring-stone-900" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-900 hover:bg-black'
              } text-white`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                editingId ? "Update Category" : "Create Category"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: LIST */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
          <h3 className="font-serif text-xl flex items-center gap-2">
            <FolderTree size={20} /> Collection Structure
          </h3>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest hidden sm:block">
            {categories.length} Categories Total
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-stone-300" /></div>
        ) : (
          <div className="grid gap-3">
            {categories.length === 0 && (
              <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                <p className="text-stone-400 text-sm italic">No categories created yet.</p>
              </div>
            )}
            
            {categories.map((cat) => (
              <div 
                key={cat._id} 
                className={`bg-white border border-stone-100 p-4 md:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm transition-all hover:shadow-md ${
                  cat.parent ? 'ml-4 md:ml-12 border-l-4 border-l-stone-200' : ''
                } ${editingId === cat._id ? 'ring-2 ring-amber-500 border-transparent' : ''}`}
              >
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800">{cat.name}</span>
                    {cat.parent && (
                      <span className="text-[8px] md:text-[9px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Sub
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5 font-mono">{cat.slug}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] text-stone-300 uppercase font-bold tracking-widest">SEO Status</p>
                    <div className="flex gap-1 sm:justify-end mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${cat.seo?.metaTitle ? 'bg-green-400' : 'bg-stone-200'}`} title="Meta Title"></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${cat.seo?.metaDescription ? 'bg-green-400' : 'bg-stone-200'}`} title="Meta Description"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditClick(cat)}
                      className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title="Edit Category"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;