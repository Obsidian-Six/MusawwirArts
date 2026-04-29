import React from 'react';
import { motion } from 'framer-motion';

const ArtAdvisory = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Side: Illustration */}
          <div className="flex justify-center md:justify-start">
            <div className="relative max-w-[500px] w-full">
              <img 
                src="/painting_demo.webp" 
                alt="Artist at work" 
                className="w-full h-auto object-contain opacity-90"
              />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <h2 className="text-2xl md:text-4xl font-serif text-stone-900 tracking-tight leading-tight">
                ART CURATION & <br className="hidden md:block" /> ADVISORY
              </h2>
              <div className="w-12 h-0.5 bg-[#A6894B]"></div>
            </div>

            <div className="space-y-6 text-stone-600 font-serif italic text-base md:text-lg leading-relaxed">
              <p>
                Finding the right piece of art is a journey of discovery. Whether you are decorating your home, 
                choosing a centerpiece for your office, or expanding a private collection, our experts are 
                here to guide you through every step.
              </p>
              <p>
                We help you find the perfect balance of color, style, and scale to complement your space's 
                unique architecture and atmosphere, transforming any environment into a personal sanctuary.
              </p>
            </div>

            <div className="pt-4">
               <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-stone-400">
                  Curating excellence since inception
               </p>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default ArtAdvisory;
