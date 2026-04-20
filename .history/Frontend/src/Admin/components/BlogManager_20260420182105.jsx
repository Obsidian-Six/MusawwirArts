import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, Save, X, Calendar, 
  Tag, Layers, Info, Search, Image as ImageIcon,
  CheckCircle, Clock, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';

const BlogManager = ({ API_URL }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categories: '',
    tags: '',
    status: 'draft',
    scheduledAt: '',
    author: 'Musawwir Art',
    seo: {
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      keywords: ''
    }
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // imageList holds both remote and local images with metadata
  const [imageList, setImageList] = useState([]); // { src, file?, remotePath? }
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/blogs?mode=admin&search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (err) {
      console.error("Fetch Blogs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      categories: (blog.categories || []).join(', '),
      tags: (blog.tags || []).join(', '),
      status: blog.status || 'draft',
      scheduledAt: blog.scheduledAt ? new Date(blog.scheduledAt).toISOString().slice(0, 16) : '',
      author: blog.author || 'Musawwir Art',
      seo: {
        metaTitle: blog.seo?.metaTitle || '',
        metaDescription: blog.seo?.metaDescription || '',
        canonicalUrl: blog.seo?.canonicalUrl || '',
        keywords: blog.seo?.keywords || ''
      }
    });
    const remoteImgs = (blog.images || []).map(img => ({ src: `${API_URL.replace('/api', '')}${img}`, remotePath: img }));
    setImagePreviews(remoteImgs.map(i => i.src));
    setImageList(remoteImgs);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error("Delete Blog Error:", err);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // append new files to imageFiles and imageList
      setImageFiles((prev) => [...prev, ...files]);
      const localItems = files.map(f => ({ src: URL.createObjectURL(f), file: f }));
      setImageList((prev) => [...prev, ...localItems]);
      setImagePreviews((prev) => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleRemoveImage = (index) => {
    setImageList((prev) => {
      const item = prev[index];
      // If it's a local file, remove it from imageFiles
      if (item?.file) {
        setImageFiles((old) => old.filter(f => f !== item.file));
      }
      const next = prev.filter((_, i) => i !== index);
      setImagePreviews(next.map(i => i.src));
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const submitData = new FormData();
    
    submitData.append('title', formData.title);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('content', formData.content);
    submitData.append('status', formData.status);
    submitData.append('author', formData.author);
    if (formData.scheduledAt) submitData.append('scheduledAt', formData.scheduledAt);
    
    // Process categories and tags
    const cats = formData.categories.split(',').map(c => c.trim()).filter(c => c);
    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    submitData.append('categories', JSON.stringify(cats));
    submitData.append('tags', JSON.stringify(tags));
    submitData.append('seo', JSON.stringify(formData.seo));
    
    // Append multiple images under the key 'images' to match backend Multer expects
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => submitData.append('images', file));
    } else if (editingBlog) {
      // No new files uploaded while editing: send remaining remote image paths so backend can persist deletions
      const remainingRemote = imageList.filter(i => i.remotePath).map(i => i.remotePath);
      submitData.append('existingImages', JSON.stringify(remainingRemote));
    }

    try {
      const url = editingBlog ? `${API_URL}/blogs/${editingBlog._id}` : `${API_URL}/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });

      if (response.ok) {
        alert(editingBlog ? 'Post updated successfully!' : 'Post published successfully!');
        setActiveTab('list');
        setEditingBlog(null);
        resetForm();
        fetchBlogs();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save post'}`);
      }
    } catch (err) {
      console.error("Save Blog Error:", err);
      alert('Network error. Please check your connection and the backend server.');
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      categories: '',
      tags: '',
      status: 'draft',
      scheduledAt: '',
      author: 'Musawwir Art',
      seo: {
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        keywords: ''
      }
    });
    setImageFiles([]);
    setImagePreviews([]);
    setImageList([]);
    setShowAllImages(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'published': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={10} /> Published</span>;
      case 'scheduled': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={10} /> Scheduled</span>;
      default: return <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><FileText size={10} /> Draft</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-900">Content Engine</h2>
          <p className="text-stone-500 text-sm mt-1">Manage your stories, thoughts, and art insights.</p>
        </div>
        
        {activeTab === 'list' ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search stories..." 
                className="pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-stone-200 transition-all w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { resetForm(); setEditingBlog(null); setActiveTab('form'); }}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-200"
            >
              <Plus size={18} /> New Post
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setActiveTab('list')}
            className="flex items-center justify-center sm:justify-start gap-2 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors w-full sm:w-auto"
          >
            <ChevronLeft size={18} /> Back to Library
          </button>
        )}
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-100 text-center space-y-4">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-stone-900">Your library is empty</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto mt-1">Start writing your first art blog or gallery update to engage with your audience.</p>
              </div>
              <button 
                onClick={() => setActiveTab('form')}
                className="px-6 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium mx-auto"
              >
                Create First Post
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-100">
                      <th className="px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Article</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Status</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Categories</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Date</th>
                      <th className="px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="px-4 sm:px-6 py-4 sm:py-5 min-w-[250px]">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden relative border border-stone-200">
                              {(blog.images && blog.images[0]) ? (
                                <img 
                                  src={`${API_URL.replace('/api', '')}${blog.images[0]}`} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                  <ImageIcon size={18} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-stone-900 leading-tight line-clamp-1">{blog.title}</h4>
                              <p className="text-xs text-stone-400 mt-1 line-clamp-1">{blog.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5">
                          {getStatusBadge(blog.status)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5">
                          <div className="flex flex-wrap gap-1">
                            {blog.categories.slice(0, 2).map((cat, i) => (
                              <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-[10px] font-medium whitespace-nowrap">{cat}</span>
                            ))}
                            {blog.categories.length > 2 && <span className="text-[10px] text-stone-400">+{blog.categories.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-xs text-stone-500 whitespace-nowrap">
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5">
                          <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(blog)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors bg-stone-50 sm:bg-transparent rounded-lg sm:rounded-none"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(blog._id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors bg-stone-50 sm:bg-transparent rounded-lg sm:rounded-none"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          <div className="space-y-6 lg:space-y-8">
            {/* Main Fields */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl border border-stone-100 space-y-6 shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Post Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="The intersection of Arabic Calligraphy and Modern Abstract..."
                  className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl text-base sm:text-lg font-serif focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Excerpt (Summary)</label>
                <textarea 
                  required
                  rows="3"
                  maxLength="300"
                  placeholder="A brief introduction to catch the reader's eye..."
                  className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-stone-200 transition-all outline-none resize-none"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                />
                <p className="text-[10px] text-right text-stone-400 uppercase tracking-tighter">{formData.excerpt.length}/300 chars</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Story Content</label>
                <textarea 
                  required
                  rows="15"
                  placeholder="Tell your story here..."
                  className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-stone-200 transition-all outline-none font-sans leading-relaxed"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
                <div className="pt-2 flex items-start sm:items-center gap-2 text-[10px] text-stone-400">
                  <Info size={14} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Supports plain text. Future updates will include rich text formatting.</span>
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl border border-stone-100 space-y-6 shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Search size={16} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest">Search Performance (SEO)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Meta Title</label>
                  <input 
                    type="text" 
                    placeholder={formData.title || "Custom browser title..."}
                    className="w-full px-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                    value={formData.seo.metaTitle}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Canonical URL</label>
                  <input 
                    type="text" 
                    placeholder="/blog/your-custom-slug"
                    className="w-full px-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                    value={formData.seo.canonicalUrl}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, canonicalUrl: e.target.value}})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Meta Description</label>
                  <textarea 
                    rows="2"
                    placeholder="Short description for search engine results..."
                    className="w-full px-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-stone-200 transition-all outline-none resize-none"
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">SEO Keywords (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="art gallery, abstract, oil painting, calligraphy..."
                    className="w-full px-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                    value={formData.seo.keywords}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, keywords: e.target.value}})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-100 space-y-6 shadow-sm shadow-stone-100">
              <button 
                type="submit"
                className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-stone-200 hover:bg-stone-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} /> {editingBlog ? 'Update Post' : 'Publish Now'}
              </button>

              <div className="pt-2 border-t border-stone-50 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5"><Layers size={10} /> Status</label>
                  <select 
                    className="w-full px-3 py-2.5 bg-stone-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-stone-200 transition-all cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish (Live)</option>
                    <option value="scheduled">Schedule (Timed)</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5"><Calendar size={10} /> Launch Date</label>
                    <input 
                      type="datetime-local" 
                      required
                      className="w-full px-3 py-2 bg-stone-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-stone-200 transition-all cursor-pointer"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-100 space-y-4 shadow-sm shadow-stone-100">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5"><ImageIcon size={12} /> Featured Media</label>
              <div 
                className={`relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border-2 border-dashed transition-all
                  ${imageList && imageList.length > 0 ? 'border-transparent' : 'border-stone-100 hover:border-stone-300 bg-stone-50'}`}
                onClick={() => document.getElementById('blog-image-input').click()}
              >
                {imageList && imageList.length > 0 ? (
                  <div className="w-full h-full p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(showAllImages ? imageList : imageList.slice(0,4)).map((item, i) => (
                        <div key={i} className="relative rounded-md overflow-hidden bg-stone-100">
                          <img src={item.src} alt={`Preview ${i+1}`} className="w-full h-20 sm:h-16 md:h-20 object-cover" />
                          <button
                            type="button"
                            onClick={(ev) => { ev.stopPropagation(); handleRemoveImage(i); }}
                            className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-md hover:bg-white"
                          >
                            <X size={14} className="text-stone-600" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {imageList.length > 4 && (
                      <div className="mt-2 flex justify-center">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setShowAllImages(prev => !prev); }} className="text-[11px] text-stone-700 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                          {showAllImages ? 'Show less' : `Show more (${imageList.length})`}
                        </button>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <p className="text-white text-xs font-bold uppercase tracking-widest">Change Images</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 gap-2">
                    <Plus size={24} strokeWidth={1.5} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Upload Header Images</p>
                  </div>
                )}
              </div>
              <input 
                id="blog-image-input"
                type="file" 
                accept="image/*"
                multiple
                className="hidden" 
                onChange={handleImageChange}
              />
              <p className="text-[9px] text-stone-400 leading-relaxed italic text-center">Optimized WebP conversion will happen automatically upon saving.</p>
            </div>

            {/* Taxonomies */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-100 space-y-6 shadow-sm shadow-stone-100">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5"><Layers size={12} /> Category</label>
                <input 
                  type="text" 
                  placeholder="Inspiration, Technical, Updates..."
                  className="w-full px-3 py-2.5 bg-stone-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                  value={formData.categories}
                  onChange={(e) => setFormData({...formData, categories: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5"><Tag size={12} /> Tags</label>
                <input 
                  type="text" 
                  placeholder="modern art, oil, exhibit..."
                  className="w-full px-3 py-2.5 bg-stone-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5">Pen Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2.5 bg-stone-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-stone-200 transition-all outline-none"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogManager;