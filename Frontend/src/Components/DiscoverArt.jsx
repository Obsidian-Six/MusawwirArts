import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscoverArt = ({ onArtClick }) => {
  // Helper to handle your VPS image paths
  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x500?text=Art+Preview";
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_BASE_URL?.split('/api')[0].replace(/\/$/, "") || "";
    const cleanPath = path.startsWith('/') ? path : `/uploads/paintings/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const categories = [
    { title: "Animals", desc: "Art that makes you smile", img: "https://images.unsplash.com/photo-1626577117723-85f9aaf0e580?w=600&auto=format&fit=crop&q=60" },
    { title: "Botanical", desc: "Bring the outdoors in", img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80" },
    { title: "Minimal", desc: "For calm, uncluttered rooms", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80" },
    { title: "Colorful", desc: "Make your walls pop", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80" },
    { title: "Abstract", desc: "Abstract art to anchor a room", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80" },
    { title: "Traditional", desc: "Rooted in heritage", img: "https://images.unsplash.com/photo-1731251452479-3037b1af9abc?w=600&auto=format&fit=crop&q=60" }
  ];

  // Dynamic products from your MongoDB data
  const dynamicProducts = [
    { 
        _id: "69e0d12840138e65c81c0917", 
        title: "Vow & Secrecy", 
        imageUrl: "/uploads/paintings/processed-1776341285534.webp" 
    },
    { 
        _id: "69e0d62840138e65c81c0944", 
        title: "Internal Architecture", 
        imageUrl: "/uploads/paintings/processed-1776342565017.webp" 
    },
    { 
        _id: "69e0c9c740138e65c81c0872", 
        title: "Panel Art", 
        imageUrl: "/uploads/paintings/processed-1776339397442.webp" 
    },
    { 
        _id: "69e0aa2840138e65c81c075f", 
        title: "Drawing Mix Media", 
        imageUrl: "/uploads/paintings/processed-1776331300582.webp" 
    },
  ];

  return (
    <div className="bg-[#FAF9F6] font-sans text-slate-900 border-t border-stone-100">
      
      {/* --- CATEGORY GRID SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic mb-2">Discover Art You'll Love</h2>
          <p className="text-slate-500 text-sm sm:text-base">Curated edits to transform your walls</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/paintings?category=${cat.title.toLowerCase()}`}
              className="group relative h-60 sm:h-80 overflow-hidden rounded-lg cursor-pointer shadow-sm border border-slate-200 block"
            >
              <img 
                src={cat.img} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5">
                <h3 className="text-white text-lg sm:text-2xl font-serif italic flex items-center gap-2">
                  {cat.title} 
                  <ArrowRight size={18} className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                </h3>
                <p className="text-white/80 text-[10px] sm:text-sm mt-1 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- PRODUCT GRID SECTION (Now Dynamic) --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif italic mb-2">Instant Impact Art Prints</h2>
            <p className="text-slate-500 text-sm sm:text-base">Elevate your space with curated prints</p>
          </div>
          {/* Changed to Link for proper routing to Paintings page */}
          <Link 
            to="/paintings" 
            className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-widest hover:underline decoration-[#A6894B] underline-offset-4"
          >
            See More <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dynamicProducts.map((product) => (
            <div 
              key={product._id} 
              className="group cursor-pointer"
              onClick={() => onArtClick({ title: product.title, imageUrl: getFullImageUrl(product.imageUrl) })} // Added the popup trigger
            >
              <div className="relative bg-white p-2 md:p-3 shadow-sm border border-slate-100 mb-3 md:mb-4 rounded-md">
                <div className="aspect-[4/5] overflow-hidden rounded-sm relative bg-stone-50">
                  <img 
                    src={getFullImageUrl(product.imageUrl)} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x500?text=Art+Preview'; }}
                  />
                  <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the form when liking
                    }}
                    className="absolute bottom-2 right-2 p-1.5 md:p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-10"
                  >
                    <Heart size={16} className="text-slate-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
              <h3 className="font-serif italic text-stone-900 mb-1 text-[13px] sm:text-[15px] text-center line-clamp-1">
                {product.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoverArt;


// 69e0d12840138e65c81c0917
// 69e0d62840138e65c81c0944
// 69e0c9c740138e65c81c0872
// 69e0aa2840138e65c81c075f