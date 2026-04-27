import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, Calendar, User, ArrowLeft
} from 'lucide-react';

import BlogsSidebarForm from '../../Components/blogs/BlogsSideForm';

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
   */
  const renderArtGalleryContent = () => {
    if (!blog.content) return null;

    const paragraphs = blog.content.split(/\n\s*\n/);
    const allImages = blog.images || [];

    // Inline images: skip index 0 (hero), cap at 5
    const inlineImages = allImages.slice(1, 6);
    const totalParagraphs = paragraphs.length;
    const totalImages = inlineImages.length;

    // Distribute images evenly across paragraphs
    // e.g. 4 images across 8 paragraphs → image at para 0, 2, 4, 6
    const imageAtIndex = {};
    for (let i = 0; i < totalImages; i++) {
      const paraIdx = Math.min(
        Math.round((i / totalImages) * totalParagraphs),
        totalParagraphs - 1
      );
      imageAtIndex[paraIdx] = inlineImages[i];
    }

    return (
      <div className="space-y-0">
        {paragraphs.map((para, index) => {
          const imageToShow = imageAtIndex[index];

          return (
            <div key={index} className="mb-12">
              {imageToShow && (
                <div className="mb-6 rounded-xl overflow-hidden shadow-md w-full aspect-[4/3] bg-stone-50">
                  <img
                    src={`${BASE_URL}${imageToShow}`}
                    alt={`Artwork detail`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <p className="leading-relaxed text-stone-700 font-serif text-lg">{para}</p>
            </div>
          );
        })}

        {/* Extended Gallery — images beyond what was inlined */}
        {allImages.length > 6 && (
          <div className="mt-16 pt-10 border-t border-stone-100">
            <h3 className="text-xl font-serif text-stone-900 mb-8">Related Studies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {allImages.slice(6).map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-sm h-40">
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
      </div>
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
      {/* Header */}
      <header className="max-w-7xl mx-auto pt-32 pb-16 px-6 text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Journal
        </Link>
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight mb-6">
          {blog.title}
        </h1>
        <div className="flex justify-center items-center gap-4 text-stone-400 text-[10px] tracking-widest uppercase">
          <span>{new Date(blog.publishedAt).toLocaleDateString('en-GB')}</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full" />
          <span>{blog.author}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Content Column */}
          <div className="lg:col-span-8">
            {/* Main Image */}
            {blog.images && blog.images[0] && (
              <div className="mb-16 rounded-xl overflow-hidden shadow-xl">
                <img
                  src={`${BASE_URL}${blog.images[0]}`}
                  className="w-full h-auto object-cover"
                  alt="Principal Work"
                />
              </div>
            )}

            <div className="prose prose-stone max-w-none">
              {renderArtGalleryContent()}
            </div>

            <div className="mt-20 pt-10 border-t border-stone-100 flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-4 py-1 bg-white text-stone-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-stone-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32">
            <BlogsSidebarForm blogTitle={blog.title} />
          </aside>
        </div>
      </main>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white py-24 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-serif text-stone-900 mb-12">Continue Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedBlogs.map((rel) => (
                <Link to={`/blog/${rel.slug}`} key={rel._id} className="group">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={`${BASE_URL}${rel.images[0] || rel.featuredImage}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={rel.title}
                    />
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-[#A6894B] transition-colors">{rel.title}</h3>
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