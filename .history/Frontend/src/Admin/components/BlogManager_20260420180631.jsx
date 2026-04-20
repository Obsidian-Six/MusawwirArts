import React, { useState, useEffect, useMemo } from 'react';
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
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', categories: '', tags: '', status: 'draft', scheduledAt: '', author: 'Musawwir Art', seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', keywords: '' } });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/blogs?mode=admin&search=${searchTerm}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setBlogs(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, [searchTerm]);

  const handleAction = async (method, id = '', body = null) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/blogs/${id}`, { method, headers: { 'Authorization': `Bearer ${token}` }, body });
    if (res.ok) { fetchBlogs(); return true; }
    return false;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([k, v]) => submitData.append(k, typeof v === 'object' ? JSON.stringify(v) : v));
    
    // Process Arrays
    ['categories', 'tags'].forEach(k => submitData.append(k, JSON.stringify(formData[k].split(',').map(s => s.trim()).filter(Boolean))));
    
    const files = imageList.filter(i => i.file).map(i => i.file);
    if (files.length) files.forEach(f => submitData.append('images', f));
    else if (editingBlog) submitData.append('existingImages', JSON.stringify(imageList.filter(i => i.remotePath).map(i => i.remotePath)));

    if (await handleAction(editingBlog ? 'PUT' : 'POST', editingBlog?._id || '', submitData)) {
      setActiveTab('list');
      setEditingBlog(null);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({ ...blog, categories: blog.categories.join(', '), tags: blog.tags.join(', '), scheduledAt: blog.scheduledAt?.slice(0, 16) || '' });
    setImageList(blog.images.map(img => ({ src: `${API_URL.replace('/api', '')}${img}`, remotePath: img })));
    setActiveTab('form');
  };

  const Input = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5 px-1">
        {Icon && <Icon size={12} />} {label}
      </label>
      {props.type === 'textarea' ? (
        <textarea {...props} className="w-full px-4 py-3 bg-stone-50 rounded-xl text-sm focus:ring-2 focus:ring-stone-200 outline-none transition-all" />
      ) : (
        <input {...props} className="w-full px-4 py-3 bg-stone-50 rounded-xl text-sm focus:ring-2 focus:ring-stone-200 outline-none transition-all" />
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-serif">Content Engine</h2>
          <p className="text-stone-400 text-xs">Manage your stories and insights.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          {activeTab === 'list' ? (
            <>
              <input placeholder="Search..." className="px-4 py-2 bg-stone-50 rounded-lg text-sm w-full" onChange={e => setSearchTerm(e.target.value)} />
              <button onClick={() => { setEditingBlog(null); setActiveTab('form'); }} className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shrink-0"><Plus size={16}/> New</button>
            </>
          ) : (
            <button onClick={() => setActiveTab('list')} className="text-stone-500 flex items-center gap-2 text-sm"><ChevronLeft size={16}/> Back</button>
          )}
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-x-auto shadow-sm">
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
                <tr key={blog._id} className="group hover:bg-stone-50/50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0">
                      {blog.images?.[0] && <img src={`${API_URL.replace('/api', '')}${blog.images[0]}`} className="w-full h-full object-cover" />}
                    </div>
                    <div className="truncate max-w-[200px] font-medium text-sm">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-400">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(blog)} className="p-1 hover:text-blue-600"><Edit2 size={14}/></button>
                    <button onClick={() => handleAction('DELETE', blog._id)} className="p-1 hover:text-red-600"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4">
              <Input label="Post Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <Input label="Excerpt" type="textarea" rows="2" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
              <Input label="Content" type="textarea" rows="12" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-tighter text-indigo-500">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Meta Title" value={formData.seo.metaTitle} onChange={e => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})} />
                <Input label="Slug/Canonical" value={formData.seo.canonicalUrl} onChange={e => setFormData({...formData, seo: {...formData.seo, canonicalUrl: e.target.value}})} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4">
              <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold shadow-lg shadow-stone-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Save size={16}/> {editingBlog ? 'Update' : 'Publish'}
              </button>
              <Input label="Status" type="select" icon={Layers} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </Input>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Media</label>
              <div className="grid grid-cols-3 gap-2">
                {imageList.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded bg-stone-50 overflow-hidden border border-stone-100">
                    <img src={img.src} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageList(imageList.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-white shadow rounded-full p-0.5"><X size={10}/></button>
                  </div>
                ))}
                <label className="aspect-square rounded border-2 border-dashed border-stone-100 flex flex-col items-center justify-center text-stone-300 hover:border-stone-300 cursor-pointer">
                  <Plus size={16}/>
                  <input type="file" multiple className="hidden" onChange={e => {
                    const files = Array.from(e.target.files);
                    setImageList([...imageList, ...files.map(f => ({ src: URL.createObjectURL(f), file: f }))]);
                  }} />
                </label>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4 text-xs">
              <Input label="Categories" value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} />
              <Input label="Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogManager;