import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const cleanImagePath = (path) => {
    if (!path) return "";
    let s = String(path);
    s = s.replace(/^\/+/, '');
    s = s.replace(/public\/uploads\//gi, '');
    s = s.replace(/public\//gi, '');
    s = s.replace(/(?:uploads\/)+/gi, 'uploads/');
    s = s.replace(/^uploads\//i, '');
    return s;
  };

  const getFullImageUrl = (path) => {
    const SERVER_URL = import.meta.env.VITE_BASE_URL.replace(/\/api$/, '');
    if (!path) return "/placeholder-avatar.jpg";
    if (String(path).startsWith('http') || String(path).startsWith('blob:') || String(path).startsWith('data:')) return path;
    const clean = cleanImagePath(path);
    return `${SERVER_URL}/uploads/${clean}`;
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/testimonials`);
        const result = await res.json();
        if (result.success) setTestimonials(result.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prev) => (prev + newDirection + totalPages) % totalPages);
  };

  if (loading || testimonials.length === 0) return null;

  const startIndex = page * itemsPerPage;
  const visibleItems = testimonials.slice(startIndex, startIndex + itemsPerPage);

  // Animation Variants for a professional "shutter" feel
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="py-24 bg-[#FAF9F6] font-sans text-[#222] overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-24 relative">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl tracking-[0.25em] font-medium mb-3 uppercase text-stone-800">Testimonials</h2>
          <p className="italic font-serif text-stone-400 text-xl">Feedback from our collectors</p>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Navigation Buttons */}
          <button 
            onClick={() => paginate(-1)}
            className="absolute -left-4 md:-left-12 z-30 p-4 border border-stone-200 rounded-full bg-white/80 backdrop-blur-sm hover:bg-stone-50 transition-all shadow-lg active:scale-90"
          >
            <ChevronLeft size={28} className="text-stone-600" />
          </button>

          <div className="w-full relative min-h-[580px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-4"
              >
                {visibleItems.map((item) => (
                  <motion.div 
                    key={item._id} 
                    whileHover={{ y: -10 }}
                    className="flex flex-col h-full bg-white border border-stone-100 p-8 pt-12 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl relative group"
                  >
                    <div className="absolute top-6 right-6 bg-[#B38B4D] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">
                      Verified
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-32 h-32 bg-stone-50 border-4 border-stone-50 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
                        {item.authorImage ? (
                          <img 
                            src={getFullImageUrl(item.authorImage)} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-avatar.jpg"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={48} className="text-stone-300" />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-bold text-xl leading-tight uppercase tracking-wider text-stone-900">
                          {item.name}
                        </h4>
                        <p className="text-xs text-stone-400 uppercase tracking-widest mt-1 font-medium">{item.location}</p>
                      </div>
                    </div>

                    <div className="flex justify-center gap-1 mb-6">
                        {[...Array(item.stars)].map((_, i) => (
                          <Star key={i} size={16} fill="#B38B4D" color="#B38B4D" />
                        ))}
                    </div>

                    <div className="border-t border-stone-100 pt-6 flex-grow text-center">
                      <p className="text-[#555] text-[17px] leading-[1.8] font-light italic px-2">
                        "{item.text}"
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            onClick={() => paginate(1)}
            className="absolute -right-4 md:-right-12 z-30 p-4 border border-stone-200 rounded-full bg-white/80 backdrop-blur-sm hover:bg-stone-50 transition-all shadow-lg active:scale-90"
          >
            <ChevronRight size={28} className="text-stone-600" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-16">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const newDir = i > page ? 1 : -1;
                setDirection(newDir);
                setPage(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === page ? 'w-16 bg-stone-800' : 'w-3 bg-stone-200 hover:bg-stone-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;