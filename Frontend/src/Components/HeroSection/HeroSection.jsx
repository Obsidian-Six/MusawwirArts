import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  const rawApiUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const API_URL = String(rawApiUrl).replace(/\/$/, "");
  // Derive server host from API_URL and normalize it to include protocol.
  let SERVER_URL = API_URL.includes('/api') ? API_URL.split('/api')[0] : API_URL || '';
  if (!SERVER_URL) SERVER_URL = window.location.origin;
  // If missing protocol but looks like a host (contains dot or localhost), add current protocol.
  if (!/^https?:\/\//i.test(SERVER_URL)) {
    if (SERVER_URL.includes('.') || SERVER_URL.includes('localhost')) {
      SERVER_URL = `${window.location.protocol}//${SERVER_URL}`;
    } else {
      // Likely misconfigured (e.g. 'uploads'); fallback to origin to avoid producing invalid hostnames.
      console.warn('VITE_BASE_URL appears invalid, falling back to window.location.origin for uploads host. Value:', rawApiUrl);
      SERVER_URL = window.location.origin;
    }
  }

const cleanImagePath = (path) => {
  if (!path) return "";
  let s = String(path);
  s = s.replace(/^\/+/, ''); // remove leading slashes
  s = s.replace(/public\/uploads\//gi, '');
  s = s.replace(/public\//gi, '');
  // collapse repeated uploads/ to a single occurrence
  s = s.replace(/(?:uploads\/)+/gi, 'uploads/');
  // remove a single leading uploads/ so final path is like 'homepage/file.png'
  s = s.replace(/^uploads\//i, '');
  return s;
};

const getFullUrl = (path) => {
  if (!path) return "/placeholder-banner.jpg";
  if (String(path).startsWith('http') || String(path).startsWith('blob:') || String(path).startsWith('data:')) return path;

  const clean = cleanImagePath(path);
  return `${SERVER_URL}/uploads/${clean}`;
};

  /**
   * Component: Handles image loading with sequential fallbacks
   */
  const ImageWithFallback = ({ path, initialSrc, alt, className }) => {
    const [fallbackIndex, setFallbackIndex] = useState(0);

    const buildCandidates = () => {
      if (initialSrc && (String(initialSrc).startsWith('blob:') || String(initialSrc).startsWith('data:'))) {
        return [initialSrc];
      }

      if (!path && !initialSrc) return ['/placeholder-banner.jpg'];
      if (path && String(path).startsWith('http')) return [path];

      const clean = cleanImagePath(path);
      return [
        `${SERVER_URL}/uploads/${clean}`, // Try env domain first
        `/uploads/${clean}`,              // Relative fallback (nginx alias)
        `${window.location.origin}/uploads/${clean}`, // Local origin fallback
        '/placeholder-banner.jpg'
      ];
    };

    const candidates = buildCandidates();
    const src = candidates[fallbackIndex] || initialSrc || '';

    return (
      <img
        src={src}
        alt={alt}
        decoding="async"
        loading="eager"
        fetchpriority="high"
        className={className}
        onError={(e) => {
          if (fallbackIndex + 1 < candidates.length) {
            setFallbackIndex(fallbackIndex + 1);
          } else {
            e.target.onerror = null;
            // Optional: set a default placeholder image here if all fail
          }
        }}
      />
    );
  };

  const defaultSlides = [
    {
      type: 'image',
      url: 'https://plus.unsplash.com/premium_photo-1706561252297-d9b575e9f295?q=80&w=1170&auto=format&fit=crop',
      title: 'Textured Realities',
      subtitle: 'In Every Shape. A Story.'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1578301996581-bf7caec556c0?q=80&w=1051&auto=format&fit=crop',
      title: 'The Modern Minimalist',
      subtitle: 'Exploring abstract boundaries'
    }
  ];

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`${API_URL}/homepage`);
        const result = await response.json();
        if (result.success && result.data?.banners?.length > 0) {
          setSlides(result.data.banners);
        } else {
          setSlides(defaultSlides);
        }
      } catch (err) {
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, [API_URL]);

  const paginate = (newDirection) => {
    setIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [index, slides.length]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-300" size={32} />
      </div>
    );
  }

  const slide = slides[index];

  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-black">

      {/* ANIMATED SLIDES */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide?.url || index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-black/40 z-[11]" />
            {slide?.type === 'video' ? (
              <video
                src={getFullUrl(slide.url)}
                className="w-full h-full object-cover"
                autoPlay loop muted playsInline
              />
            ) : (
              <ImageWithFallback
                path={slide.url}
                initialSrc={getFullUrl(slide.url)}
                alt={slide?.title}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SVG BACKGROUND OVERLAY */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 md:opacity-40">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,20 L30,40 M30,40 L25,60 M30,40 L50,30 M50,30 L70,50 M70,50 L85,30"
            stroke="#A6894B" strokeWidth="0.1" fill="none" strokeDasharray="1,1" />
        </svg>
      </div>

      {/* TEXT CONTENT */}
      <div className="relative z-30 h-full flex flex-col justify-center items-center text-center px-8">
        <motion.span
          key={`sub-${index}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#ffb922] uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-4"
        >
          {slide?.subtitle}
        </motion.span>

        <motion.h1
          key={`title-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white text-4xl md:text-7xl font-serif tracking-tight mb-8 max-w-4xl"
        >
          {slide?.title}
        </motion.h1>

        <motion.button
          key={`btn-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => Navigate(slide?.ctaLink || '/paintings')}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 border border-white/50 text-white uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all"
        >
          {slide?.ctaText || 'Explore Collection'}
        </motion.button>
      </div>

      {/* NAV CONTROLS */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-12">
          <button onClick={() => paginate(-1)} className="text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-3">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-[2px] transition-all duration-700 ${index === i ? 'w-12 bg-[#A6894B]' : 'w-6 bg-white/30'}`}
              />
            ))}
          </div>

          <button onClick={() => paginate(1)} className="text-white/60 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;