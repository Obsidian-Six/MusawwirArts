import React from 'react';
import { ArrowRight } from 'lucide-react';

const MosaicTile = ({ title, subtitle, buttonText, image, className }) => (
  <div className={`relative overflow-hidden group min-h-[450px] ${className}`}>
    {/* Background Image with slow zoom */}
    <img 
      src={image} 
      alt={title} 
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" 
    />
    
    {/* Darker, cinematic gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
    
    {/* Content positioned at the bottom left for an editorial look */}
    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
      <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B69D6D] font-bold mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        {subtitle}
      </span>
      <h3 className="text-3xl md:text-4xl font-serif italic text-white mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
        {title}
      </h3>
      <button className="flex items-center gap-3 text-white text-[11px] font-bold uppercase tracking-[0.2em] group/btn w-fit translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
        <span className="border-b border-white/40 pb-1 group-hover/btn:border-white transition-colors">
          {buttonText}
        </span>
        <ArrowRight size={16} className="text-[#B69D6D] group-hover/btn:translate-x-2 transition-transform" />
      </button>
    </div>
  </div>
);

const TwoGrid = () => {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 w-full">
        
        {/* Row 1: Large Left, Small Right */}
        <MosaicTile 
          className="md:col-span-8 h-[500px] md:h-[650px]"
          subtitle="Our Truth"
          title="Premium-Quality Prints"
          buttonText="Materials"
          image="/Client_images/image_d690e0.jpg" 
        />
        <MosaicTile 
          className="md:col-span-4 h-[500px] md:h-[650px]"
          subtitle="Heritage Art"
          title="The Majestic Bull"
          buttonText="About Us"
          image="/Client_images/DSC01359.jpg" 
        />

        {/* Row 2: Small Left, Large Right */}
        <MosaicTile 
          className="md:col-span-5 h-[500px] md:h-[600px]"
          subtitle="Craftsmanship"
          title="Hand-Carved Frames"
          buttonText="Learn More"
          image="/Client_images/DSC01377.jpg" 
        />
        <MosaicTile 
          className="md:col-span-7 h-[500px] md:h-[600px]"
          subtitle="450+ Pieces"
          title="The Spades King Collection"
          buttonText="Shop All"
          image="" 
        />

      </div>
    </section>
  );
};

export default TwoGrid;