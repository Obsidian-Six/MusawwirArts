import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExploreByStyle = () => {
  const styles = [
    { name: "Abstract", slug: "abstract", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" },
    { name: "Contemporary", slug: "contemporary", image: "https://images.pexels.com/photos/1787242/pexels-photo-1787242.jpeg" },
    { name: "Landscape", slug: "landscape", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800" },
    { name: "Mythological Figurative", slug: "mythological", image: "https://images.unsplash.com/photo-1767256760778-3b58b89ee787?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TXl0aG9sb2dpY2FsJTIwRmlndXJhdGl2ZXxlbnwwfHwwfHx8MA%3D%3D" },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#f8f7f4] px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Responsive stacking */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 md:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-slate-900 mb-2">
              Shop by Style
            </h2>
            <p className="text-slate-500 font-sans text-xs md:text-sm tracking-wide">
              Curated edits for every aesthetic and space
            </p>
          </div>
          <Link 
            to="/paintings" 
            className="hidden md:flex items-center gap-2 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-[#B69D6D] transition-colors border-b border-slate-900 pb-1"
          >
            View All Styles <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid - 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {styles.map((style, index) => (
            <Link 
              key={index} 
              to={`/paintings?style=${style.slug}`}
              className="group relative h-56 sm:h-72 md:h-80 overflow-hidden cursor-pointer rounded-sm border border-slate-100 shadow-sm block"
            >
              {/* Background Image with Slow Zoom */}
              <img 
                src={style.image} 
                alt={style.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Text Content - Positioned Bottom Left */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <h3 className="text-white text-lg md:text-2xl font-serif italic flex items-center gap-2 translate-y-1 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {style.name}
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#B69D6D]" />
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile-only View All - Adjusted tracking for small screens */}
        <div className="mt-10 text-center md:hidden">
          <Link to="/paintings" className="inline-flex items-center gap-2 border-b border-black pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
            View All Styles <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ExploreByStyle;