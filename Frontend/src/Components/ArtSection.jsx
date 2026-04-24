import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const ArtCard = ({ title, imageUrl, onArtClick }) => {
  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-art.jpg";
    if (path.startsWith('http')) return path;

    // This ensures we point to the root domain (art.musawwirart.com) 
    // instead of the API subdomain for static assets
    const baseUrl = import.meta.env.VITE_BASE_URL?.split('/api')[0].replace(/\/$/, "") || "";

    // If the path already includes "/uploads", don't add it again
    let cleanPath = path;
    if (!path.startsWith('/uploads')) {
        cleanPath = path.startsWith('/') ? `/uploads/paintings${path}` : `/uploads/paintings/${path}`;
    }
    
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div 
      onClick={() => onArtClick({ title, imageUrl: getFullImageUrl(imageUrl) })} 
      className="group cursor-pointer block"
    >
      {/* Container with shadow and border for that 'Fine Art' feel */}
      <div className="relative bg-white p-2 md:p-3 shadow-sm border border-stone-100 mb-3 md:mb-5 rounded-sm transition-all duration-500 group-hover:shadow-md">
        <div className="relative h-[250px] md:h-[350px] flex items-center justify-center overflow-hidden rounded-sm bg-stone-50">
          <img 
            src={getFullImageUrl(imageUrl)} 
            alt={title} 
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
            onError={(e) => { 
                e.target.src = 'https://placehold.co/400x500?text=Art+Preview'; 
                e.target.onerror = null; 
            }}
          />
          
          {/* Wishlist Button - Propagation stopped to prevent popup trigger */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-2.5 backdrop-blur-md bg-white/60 border border-white/30 rounded-full shadow-sm hover:bg-white transition-all duration-300 z-10"
          >
            <Heart size={16} className="text-stone-800 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Typography: Serif Italic for that elegant gallery look */}
      <div className="px-1 text-center">
        <h3 className="text-[13px] md:text-[16px] font-serif italic text-stone-900 mb-2 leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

const ArtSection = ({ onArtClick }) => {
  const artPieces = [
    { 
      _id: "69e0e57c40138e65c81c0a35", 
      title: "Mix media drawing", 
      imageUrl: "/uploads/paintings/processed-1776346488773.webp" 
    },
    { 
      _id: "69e0e3f640138e65c81c0a27", 
      title: "Mix Media drawing",
      imageUrl: "/uploads/paintings/processed-1776346098872.webp" ,
    },
    { 
      _id: "69e0d9c840138e65c81c0983", 
      title: "City Scope", 
      imageUrl: "/uploads/paintings/processed-1776343493571.webp" 
    },
    { 
      _id: "69e0d76240138e65c81c094e", 
      title: "The Bodhi Whisper", 
      imageUrl: "/uploads/paintings/processed-1776342879395.webp" 
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-serif italic text-stone-900 mb-3">
              Curated Masterpieces
            </h2>
            <p className="text-stone-500 font-sans text-sm md:text-[16px] tracking-wide max-w-lg">
              Handpicked authentic artworks, authenticated via blockchain for modern collectors.
            </p>
          </div>
          
          <Link to="/paintings" className="hidden md:flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-stone-800 hover:underline decoration-[#B69D6D] underline-offset-8 transition-all">
            See More <ArrowRight size={18} className="text-[#B69D6D]" />
          </Link>
        </div>

        {/* Art Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {artPieces.map((art) => (
            <ArtCard 
               key={art._id} 
               title={art.title} 
               imageUrl={art.imageUrl} 
               onArtClick={onArtClick}
            />
          ))}
        </div>

        {/* Mobile "See More" - hidden on desktop */}
        <div className="mt-12 text-center md:hidden">
          <Link to="/paintings" className="inline-flex items-center gap-2 border-b border-black pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
            View All Artworks <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArtSection;