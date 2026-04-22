import React from 'react';

const InstagramSection = () => {
  const instaImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=708&auto=format&fit=crop", alt: "Customer with art" },
    { id: 2, src: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1000", alt: "Art in kitchen setting" },
    { id: 3, src: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1000", alt: "Modern living room art" }
  ];

  return (
    <section className="py-12 md:py-16 bg-[#f8f7f4] border-t border-stone-100">
      {/* Header - Adjusted tracking and size for mobile */}
      <div className="text-center mb-8 md:mb-10 px-4">
        <h2 className="text-[11px] md:text-[14px] font-bold uppercase tracking-[0.25em] md:tracking-[0.4em] text-gray-900">
          Connect With Us On Instagram
        </h2>
      </div>

      {/* 3-Column Image Grid - Maintains 3 columns even on mobile for 'Insta' feel */}
      <div className="grid grid-cols-3 gap-0.5 md:gap-1">
        {instaImages.map((img) => (
          <a 
            key={img.id} 
            href="https://www.instagram.com/musawwir_art" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative aspect-square overflow-hidden group cursor-pointer block"
          >
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay on Hover - Hidden on mobile to keep interaction simple */}
            <div className="absolute inset-0 bg-black/20 md:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg className="w-5 h-5 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;