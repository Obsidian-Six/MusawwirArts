import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Calendar, User, ArrowLeft 
} from 'lucide-react';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  
  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
  const BASE_URL = API_URL.split('/api')[0].replace(/\/$/, "");

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/blogs/${slug}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
        document.title = `${data.data.seo?.metaTitle || data.data.title} | Musawwir Art`;
        fetchRelated(data.data.categories[0]);
      } else {
        navigate('/blog');
      }
    } catch (err) {
      console.error("Fetch Blog Error:", err);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category) => {
    try {
      const response = await fetch(`${API_URL}/blogs?category=${category}&limit=3`);
      const data = await response.json();
      if (data.success) {
        setRelatedBlogs(data.data.filter(b => b.slug !== slug));
      }
    } catch (err) {
      console.error("Fetch Related Error:", err);
    }
  };

  /**
   * Renders paragraphs and injects images from the array.
   * If there are more images than paragraphs, the rest are shown in a grid at the end.
   */
  const renderArtGalleryContent = () => {
    if (!blog.content) return null;

    const paragraphs = blog.content.split(/\n\s*\n/);
    const allImages = blog.images || [];
    
    // We use a counter to keep track of which images we've already shown
    let displayedImageCount = 0;

    return (
      <>
        {paragraphs.map((para, index) => {
          // Determine if we should show an image after this paragraph
          // We show images 1, 2, 3... after paragraphs 1, 2, 3...
          const imageToShow = allImages[index + 1]; // +1 because index 0 is the hero image
          if (imageToShow) displayedImageCount++;

          return (
            <React.Fragment key={index}>
              <p className="mb-10 leading-[2] text-stone-700">{para}</p>
              
              {imageToShow && (
                <div className="my-16 group animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <div className="rounded-2xl overflow-hidden bg-stone-100 shadow-2xl">
                    <img 
                      src={`${BASE_URL}${imageToShow}`} 
                      alt={`Artwork detail ${index + 1}`}
                      className="w-full h-auto object-cover max-h-[700px] hover:scale-105 transition-transform duration-[3s]"
                    />
                  </div>
                  <p className="mt-4 text-[10px] text-stone-400 font-serif italic text-center uppercase tracking-widest">
                    Study of {blog.title} — Detail No. {index + 1}
                  </p>
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* IMPORTANT: Show any remaining images that weren't 
          interspersed between paragraphs in a beautiful grid 
        */}
        {allImages.length > (paragraphs.length) && (
          <div className="mt-24 space-y-12">
            <div className="flex items-center gap-4">
               <div className="h-[1px] flex-1 bg-stone-100"></div>
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A6894B]">Extended Gallery</span>
               <div className="h-[1px] flex-1 bg-stone-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allImages.slice(paragraphs.length).map((img, i) => (
                <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  <img 
                    src={`${BASE_URL}${img}`} 
                    className="w-full h-full object-cover" 
                    alt="Gallery item" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9]">
      <div className="w-12 h-12 border-2 border-stone-100 border-t-[#A6894B] rounded-full animate-spin" />
    </div>
  );

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans">
      {/* Article Header */}
      <header className="max-w-[1600px] mx-auto pt-24 md:pt-40 pb-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Collection
          </Link>
          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-[1.1] tracking-tight">
            {blog.title}
          </h1>
          <div className="flex justify-center items-center gap-6 text-stone-400 text-[10px] tracking-[0.2em] uppercase pt-4">
             <span>{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             <span className="w-1.5 h-1.5 bg-[#A6894B] rounded-full" />
             <span className="italic">{blog.author}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Hero Image (First image in array) */}
          {blog.images && blog.images[0] && (
            <div className="mb-24 rounded-[2rem] overflow-hidden shadow-3xl shadow-stone-200">
              <img 
                src={`${BASE_URL}${blog.images[0]}`} 
                className="w-full aspect-[16/10] object-cover" 
                alt="Principal Work" 
              />
            </div>
          )}

          {/* Combined Paragraphs and Visuals */}
          <article className="prose prose-stone prose-xl max-w-none font-serif text-[19px] leading-[1.9] text-stone-800">
            {renderArtGalleryContent()}
          </article>

          {/* Tags Section */}
          <div className="mt-32 pt-12 border-t border-stone-100 flex flex-wrap gap-3">
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-6 py-2 bg-white text-stone-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-stone-100 hover:border-[#A6894B] hover:text-[#A6894B] transition-all cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Similar Works / Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-stone-900 py-32 text-white">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6894B]">Curated Selection</span>
                <h2 className="text-4xl md:text-5xl font-serif">Similar <span className="italic text-stone-400">Narratives</span></h2>
              </div>
              <Link to="/blog" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group border-b border-[#A6894B] pb-2">
                View All Pieces <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {relatedBlogs.map((rel) => (
                <Link to={`/blog/${rel.slug}`} key={rel._id} className="group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-stone-800">
                    <img 
                      src={`${BASE_URL}${rel.images[0] || rel.featuredImage}`} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                      alt={rel.title}
                    />
                  </div>
                  <h3 className="font-serif text-2xl group-hover:text-[#A6894B] transition-colors">{rel.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailPage;