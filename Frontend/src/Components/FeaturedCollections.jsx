import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const API_URL = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL.replace(/\/$/, "") : 'http://localhost:3000/api';

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/featured-collections`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error("Failed to fetch featured collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const getAspectRatio = (style) => {
    switch (style) {
      case 'Square (1:1)': return '1 / 1';
      case 'Horizontal Rectangle (4:3)': return '4 / 3';
      case 'Landscape (16:9)': return '16 / 9';
      case 'Vertical Rectangle (3:4)': return '3 / 4';
      case 'Portrait (9:16)': return '9 / 16';
      default: return '1 / 1';
    }
  };

  if (loading || collections.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative group">
        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-10 text-center tracking-wide">
          Featured Collections
        </h2>

        {/* Carousel Container */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory hide-scrollbar relative scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {collections.map((item) => (
            <div 
              key={item._id} 
              className="flex-shrink-0 snap-center flex flex-col group cursor-pointer"
            >
              {/* Image Container: Aspect ratio enforced by admin layout style selection */}
              <div 
                className="h-[300px] md:h-[400px] lg:h-[450px] flex justify-center items-center overflow-hidden mb-4 rounded-sm bg-stone-50"
                style={{ aspectRatio: getAspectRatio(item.layoutStyle) }}
              >
                  <img 
                  src={`${API_URL.replace('/api', '')}${item.imageUrl}`} 
                  alt={item.title} 
                  className="w-full h-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
                />
              </div>

              {/* Details Section */}
              <div className="flex justify-between items-start mt-2 border-t border-stone-200 pt-3">
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-stone-900 tracking-tight">{item.title}</h3>
                  <p className="text-sm font-semibold text-stone-500 tracking-widest mt-1 uppercase">Size: {item.dimensions}</p>
                </div>
                <div className="flex flex-col items-end pt-1">
                  <p className="text-sm font-medium text-stone-600 tracking-widest uppercase">{item.medium}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-stone-100 z-10 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronLeft className="text-stone-800 w-5 h-5" />
        </button>
        
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-stone-100 z-10 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronRight className="text-stone-800 w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedCollections;
