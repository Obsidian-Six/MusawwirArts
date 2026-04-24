import React, { useState, useRef, useEffect } from 'react';

const ImageZoom = ({ src, alt, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Zoom factor (e.g., 2.5 means 250% background size)
  const ZOOM_FACTOR = 2.5;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Lens size is reciprocal of ZOOM_FACTOR
    const lensWidth = width / ZOOM_FACTOR;
    const lensHeight = height / ZOOM_FACTOR;

    // Relative mouse position
    let x = e.clientX - left;
    let y = e.clientY - top;

    // Calculate lens top-left such that mouse is centered
    let lX = x - lensWidth / 2;
    let lY = y - lensHeight / 2;

    // Clamp lens to container boundaries
    if (lX < 0) lX = 0;
    if (lY < 0) lY = 0;
    if (lX > width - lensWidth) lX = width - lensWidth;
    if (lY > height - lensHeight) lY = height - lensHeight;

    setLensPos({ x: lX, y: lY });

    // Calculate background position percentages (0 to 100)
    // Formula: (current_pos / max_possible_pos) * 100
    const xPercent = (lX / (width - lensWidth)) * 100;
    const yPercent = (lY / (height - lensHeight)) * 100;

    setPosition({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="relative w-full group select-none">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-white cursor-zoom-in shadow-md ring-1 ring-stone-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          decoding="async"
          loading="eager"
          fetchpriority="high"
          className="w-full h-auto max-h-[80vh] object-contain mx-auto transition-opacity duration-300"
        />

        {/* Amazon-Style Lens (Blue Grid) */}
        {isHovered && (
          <div
            className="absolute pointer-events-none border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.1)] z-10"
            style={{
              left: lensPos.x,
              top: lensPos.y,
              width: `${100 / ZOOM_FACTOR}%`,
              height: `${100 / ZOOM_FACTOR}%`,
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '12px 12px',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
            }}
          />
        )}
      </div>

      {/* Zoom Container (Adjacent) - Fits within detail column space */}
      {isHovered && (
        <div 
          className="absolute top-0 left-full ml-10 z-[60] hidden lg:block w-[72%] h-full border border-stone-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${ZOOM_FACTOR * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundRepeat: 'no-repeat',
          }}
        >
            {/* Glossy overlay for realism */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent ring-1 ring-inset ring-black/5" />
            
            {/* Dynamic "Zoom" Label (Amazon-like) */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded uppercase tracking-widest font-bold">
              Detail View
            </div>
        </div>
      )}

      {/* Mobile/Small Screen Fallback: Inner Zoom */}
      {isHovered && (
        <div className="lg:hidden absolute inset-0 pointer-events-none z-[60] overflow-hidden bg-white">
             <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: '200%',
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
