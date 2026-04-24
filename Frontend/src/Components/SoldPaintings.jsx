import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import images from assets
import img1 from '../assets/sold-paintings/vintage_city_painting_1776424998426.png';
import img2 from '../assets/sold-paintings/red_abstract_city_1776425023378.png';
import img3 from '../assets/sold-paintings/copper_mountain_valley_1776425040138.png';
import img4 from '../assets/sold-paintings/winter_morning_harbor_1776425058035.png';
import img5 from '../assets/sold-paintings/golden_twilight_scape_1776425075367.png';
import img6 from '../assets/sold-paintings/turquoise_dream_city_1776425097902.png';
import img7 from '../assets/sold-paintings/sunset_reflections_art_1776425114616.png';
import img8 from '../assets/sold-paintings/ethereal_abstract_garden_1776425164221.png';

const soldPaintingsData = [
  {
    id: 1,
    title: "The Silver Sky",
    artist: "Vinita Karim",
    size: "30\" x 40\"",
    medium: "Acrylic, gold and copper leaf on",
    surface: "Canvas",
    image: img1,
  },
  {
    id: 2,
    title: "Mystery of the Red City",
    artist: "Vinita Karim",
    size: "30\" x 30\"",
    medium: "Acrylic, gold and copper leaf on",
    surface: "Canvas",
    image: img2,
  },
  {
    id: 3,
    title: "Copper Mountains",
    artist: "Vinita Karim",
    size: "48\" x 36\"",
    medium: "Acrylic, gold, copper on canvas",
    surface: "",
    image: img3,
  },
  {
    id: 4,
    title: "Winter Morning",
    artist: "Vinita Karim",
    size: "24\" x 30\"",
    medium: "Acrylic, gold, copper leaf on",
    surface: "Canvas",
    image: img4,
  },
  {
    id: 5,
    title: "Golden Twilight",
    artist: "Vinita Karim",
    size: "36\" x 36\"",
    medium: "Mixed media, gold leaf on",
    surface: "Canvas",
    image: img5,
  },
  {
    id: 6,
    title: "Turquoise Dream",
    artist: "Vinita Karim",
    size: "40\" x 30\"",
    medium: "Acrylic, gold accents on",
    surface: "Canvas",
    image: img6,
  },
  {
    id: 7,
    title: "Sunset Reflections",
    artist: "Vinita Karim",
    size: "24\" x 24\"",
    medium: "Oil and gold leaf on",
    surface: "Canvas",
    image: img7,
  },
  {
    id: 8,
    title: "Ethereal Garden",
    artist: "Vinita Karim",
    size: "48\" x 48\"",
    medium: "Acrylic, copper leaf on",
    surface: "Canvas",
    image: img8,
  }
];

const SoldPaintings = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 400;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
        
        {/* Navigation Buttons - Hidden on Mobile, shown on hover/desktop */}
        <div className="absolute top-1/2 -left-2 md:left-4 -translate-y-1/2 z-10 hidden md:block">
          <button 
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full bg-white border border-stone-100 shadow-sm text-stone-400 hover:text-stone-900 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="absolute top-1/2 -right-2 md:right-4 -translate-y-1/2 z-10 hidden md:block">
          <button 
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full bg-white border border-stone-100 shadow-sm text-stone-400 hover:text-stone-900 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-8 md:gap-12 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {soldPaintingsData.map((painting) => (
            <div 
              key={painting.id} 
              className="flex-shrink-0 w-[280px] md:w-[350px] snap-start group"
            >
              {/* Image Frame */}
              <div className="h-[350px] md:h-[450px] flex items-center justify-center bg-stone-50 overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500 border border-stone-100/50">
                <img 
                  src={painting.image} 
                  alt={painting.title}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full w-auto h-auto object-contain grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-stone-900">
                {/* Left Side */}
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-serif leading-tight">
                    {painting.title}
                  </h3>
                  <p className="text-[11px] md:text-xs italic text-stone-500">
                    By {painting.artist}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-stone-400 mt-1 uppercase tracking-wider">
                    Size: {painting.size}
                  </p>
                </div>

                {/* Right Side */}
                <div className="text-right space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-stone-800">
                    PRICE ON REQUEST
                  </p>
                  <div className="text-[9px] md:text-[10px] text-stone-400 leading-tight">
                    <p>{painting.medium}</p>
                    <p>{painting.surface}</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#B8860B]">
                      SOLD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SoldPaintings;
