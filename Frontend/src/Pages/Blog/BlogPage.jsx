import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Palette, Layers, Sparkles, User, Images } from 'lucide-react';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Collection');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
  const BASE_URL = API_URL.split('/api')[0].replace(/\/$/, "");

  const categories = [
    { name: 'All Collection', icon: <Palette size={14} /> },
    { name: 'Oil & Canvas', icon: <Layers size={14} /> },
    { name: 'Abstract Depth', icon: <Sparkles size={14} /> },
    { name: 'Technique & Process', icon: <Palette size={14} /> },
    { name: 'Artist Spotlight', icon: <User size={14} /> }
  ];

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, selectedCategory]);

  // Logic to cycle images when a user hovers over a card
  useEffect(() => {
    let interval;
    if (hoveredIndex !== null) {
      interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % 5); // Cycle through up to 5 images
      }, 1500);
    } else {
      setActiveImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [hoveredIndex]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/blogs?search=${searchTerm}`;
      if (selectedCategory !== 'All Collection') {
        url += `&category=${selectedCategory}`;
      }
      const response = await fetch(url);
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

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-20 font-sans">
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-stone-100 pb-16">
          <div className="space-y-6 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6894B]">The Musawwir Journal</span>
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-[1.1]">
              Reflections on <span className="italic">Art & Soul</span>
            </h1>
          </div>

          <div className="flex flex-col gap-8">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                type="text" 
                placeholder="Search collection..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-stone-100 rounded-2xl outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <nav className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                    ${selectedCategory === cat.name ? 'bg-stone-900 text-white shadow-xl' : 'bg-white text-stone-400 border border-stone-100'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="flex justify-center p-32">
            <div className="w-12 h-12 border-2 border-stone-100 border-t-[#A6894B] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {blogs.map((blog, idx) => {
              const images = blog.images && blog.images.length > 0 ? blog.images : [blog.featuredImage];
              const currentImg = hoveredIndex === idx ? images[activeImageIndex % images.length] : images[0];

              return (
                <article 
                  key={blog._id} 
                  className="group flex flex-col"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Gallery Frame */}
                  <Link to={`/blog/${blog.slug}`} className="relative aspect-[4/5] bg-stone-200 rounded-sm overflow-hidden mb-10 block p-4 shadow-inner">
                    <div className="w-full h-full bg-white shadow-2xl relative overflow-hidden">
                      <img 
                        src={`${BASE_URL}${currentImg}`} 
                        alt={blog.title}
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                        onError={(e) => { e.target.src = 'https://placehold.co/800x1000?text=Artwork+Not+Found'; }}
                      />
                      
                      {/* Image Count Indicator */}
                      {images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-[10px] font-bold">
                          <Images size={12} />
                          <span>1 / {images.length}</span>
                        </div>
                      )}

                      {/* Animated Progress Bar (Only visible on hover) */}
                      {hoveredIndex === idx && images.length > 1 && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                          <div 
                            className="h-full bg-[#A6894B] transition-all duration-[1500ms] ease-linear"
                            style={{ width: `${((activeImageIndex + 1) / images.length) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="space-y-5 px-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A6894B]">
                        {blog.categories[0]}
                      </span>
                      <span className="text-[9px] text-stone-400 font-medium uppercase">
                         {new Date(blog.publishedAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>

                    <h2 className="text-3xl font-serif text-stone-900 group-hover:text-[#A6894B] transition-colors leading-tight">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    <p className="text-stone-500 text-[15px] leading-relaxed line-clamp-2 font-serif italic">
                      "{blog.excerpt}"
                    </p>

                    <div className="mt-auto pt-4">
                      <Link 
                        to={`/blog/${blog.slug}`} 
                        className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900"
                      >
                        Explore Narrative <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;