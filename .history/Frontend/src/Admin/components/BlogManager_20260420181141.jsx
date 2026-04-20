import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Calendar, Tag, Layers, Info, Search, 
  Image as ImageIcon, CheckCircle, Clock, FileText, ChevronLeft
} from 'lucide-react';

const BlogManager = ({ API_URL }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [imageList, setImageList] = useState([]); 

  const initialFormState = { 
    title: '', excerpt: '', content: '', categories: '', tags: '', 
    status: 'draft', scheduledAt: '', author: 'Musawwir Art', 
    seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', keywords: '' } 
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/blogs?mode=admin&search=${searchTerm}`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) setBlogs(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, [searchTerm]);

  const resetForm = () => {
    setFormData(initialFormState);
    setImageList([]);
    setEditingBlog(null);
  };

  const handleAction = async (method, id = '', body = null) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/blogs/${id}`, { 
      method, 
      headers: { 'Authorization': `Bearer ${token}` }, 
      body 
    });
    if (res.ok) { fetchBlogs(); return true; }
    return false;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    // Append primary fields
    Object.entries(formData).forEach(([k, v]) => {
      if (k !== 'seo') submitData.append(k, v);
    });
    
    // Process JSON fields
    submitData.append('seo', JSON.stringify(formData.seo));
    ['categories', 'tags'].forEach(k => {
      const arr = formData[k].split(',').map(s => s.trim()).filter(Boolean);
      submitData.append(k, JSON.stringify(arr));
    });
    
    // Handle Images
    const newFiles = imageList.filter(i => i.file).map(i => i.file);
    if (newFiles.length) {
      newFiles.forEach(f => submitData.append('images', f));
    } else if (editingBlog) {
      const existing = imageList.filter(i => i.remotePath).map(i => i.remotePath);
      submitData.append('existingImages', JSON.stringify(existing));
    }

    if (await handleAction(editingBlog ? 'PUT' : 'POST', editingBlog?._id || '', submitData)) {
      setActiveTab('list');
      resetForm();
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({ 
      ...blog, 
      categories: (blog.categories || []).join(', '), 
      tags: (blog.tags || []).join(', '), 
      scheduledAt: blog.scheduledAt?.slice(0, 16) || '' 
    });
    setImageList((blog.images || []).map(img => ({ 
      src: `${API_URL.replace('/api', '')}${img}`, 
      remotePath: img 
    })));
    setActiveTab('form');
  };

  // Reusable Input Component fixing the "Void Element" error
  const Input = ({ label, icon: Icon, children, ...props }) => {
    const baseClass = "w-full px-4 py-3 bg-stone-50 rounded-xl text-sm focus:ring-2 focus:ring-stone-200 outline-none transition-all";
    
    return (
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5 px-1">
          {Icon && <Icon size={12} />} {label}
        </label>
        {props.type === 'textarea' ? (
          <textarea {...props} className={baseClass} />
        ) : props.type === 'select' ? (
          <select {...props} className={baseClass}>{children}</select>
        ) : (
          <input {...props} className={baseClass} />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif">Content Engine</h2>
          <p className="text-stone-400 text-xs">Manage your art stories and insights.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          {activeTab === 'list' ? (
            <>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                <input 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-stone-50 rounded-lg text-sm w-full outline-none focus:ring-1 focus:ring-stone-200" 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
              <button 
                onClick={() => { resetForm(); setActiveTab('form'); }} 
                className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shrink-0 hover:bg-stone-800 transition-colors"
              >
                <Plus size={16}/> New
              </button>
            </>
          ) : (
            <button onClick={() => { setActiveTab('list'); resetForm(); }} className="text-stone-500 flex items-center gap-2 text-sm hover:text-stone-900 transition-colors">
              <ChevronLeft size={16}/> Back to Library
            </button>
          )}
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-stone-50/50 text-[10px] uppercase text-stone-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {blogs.map(blog => (
                  <tr key={blog._id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                        {blog.images?.[0] && <img src={`${API_URL.replace('/api', '')}${blog.images[0]}`} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div className="truncate max-w-[200px] font-medium text-sm text-stone-800">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-400">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(blog)} className="p-1 hover:text-stone-900 mx-1"><Edit2 size={14}/></button>
                      <button onClick={() => handleAction('DELETE', blog._id)} className="p-1 hover:text-red-600 mx-1"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4 shadow-sm">
              <Input label="Post Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <Input label="Excerpt" type="textarea" rows="2" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
              <Input label="Content" type="textarea" rows="12" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Search size={14}/> SEO Optimization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Meta Title" value={formData.seo.metaTitle} onChange={e => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})} />
                <Input label="Custom Slug" value={formData.seo.canonicalUrl} onChange={e => setFormData({...formData, seo: {...formData.seo, canonicalUrl: e.target.value}})} />
                <div className="md:col-span-2">
                  <Input label="Meta Description" type="textarea" rows="2" value={formData.seo.metaDescription} onChange={e => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4 shadow-sm">
              <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold shadow-lg shadow-stone-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Save size={16}/> {editingBlog ? 'Update Post' : 'Publish Story'}
              </button>
              <Input label="Status" type="select" icon={Layers} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="draft">Save as Draft</option>
                <option value="published">Publish Live</option>
                <option value="scheduled">Schedule Post</option>
              </Input>
              {formData.status === 'scheduled' && (
                <Input label="Schedule Date" type="datetime-local" value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} />
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4 shadow-sm">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <ImageIcon size={14}/> Gallery Assets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {imageList.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg bg-stone-50 overflow-hidden border border-stone-100">
                    <img src={img.src} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setImageList(imageList.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/90 shadow rounded-full p-1 hover:bg-white"><X size={10}/></button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-stone-100 flex flex-col items-center justify-center text-stone-300 hover:border-stone-300 hover:bg-stone-50 cursor-pointer transition-all">
                  <Plus size={20}/>
                  <span className="text-[8px] font-bold uppercase mt-1">Add</span>
                  <input type="file" multiple className="hidden" onChange={e => {
                    const files = Array.from(e.target.files);
                    setImageList([...imageList, ...files.map(f => ({ src: URL.createObjectURL(f), file: f }))]);
                  }} />
                </label>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4 shadow-sm">
              <Input label="Categories (CSV)" icon={Tag} value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} />
              <Input label="Tags (CSV)" icon={Tag} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              <Input label="Author Name" icon={FileText} value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogManager;