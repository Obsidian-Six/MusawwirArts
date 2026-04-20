import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewCollection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#B69D6D] min-h-[auto] md:min-h-[500px] flex items-center px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Content Column */}
        <div className="text-white space-y-4 md:space-y-6 max-w-lg order-2 lg:order-1 flex flex-col items-center text-center mx-auto">
          <span className="block text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
            Traditional Heritage
          </span>
          
          <h2 className="text-[28px] sm:text-[32px] md:text-[42px] font-serif italic leading-tight px-4">
            The Musawwir Signature Collection
          </h2>
          
          <p className="text-[14px] md:text-[16px] leading-relaxed opacity-90 font-light px-4">
            Discover a curated world of blockchain-authenticated masterpieces. 
            From the intricate dots of Gond Harmony to the bold spirit of our 
            contemporary heritage series, each piece is a celebration of 
            timeless craftsmanship and cultural storytelling.
          </p>
          
          <button 
            onClick={() => navigate('/paintings')}
            className="px-8 py-3 border border-white/50 text-white uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all mt-4"
          >
            Explore Collection
          </button>
        </div>

        {/* Right Image Column */}
        <div className="relative order-1 lg:order-2 flex justify-center">
          {/* Adjusted translation for mobile to prevent overflow */}
          <div className="bg-white p-3 md:p-4 shadow-2xl transform lg:translate-x-12">
            <img 
              src="/Client_images/DSC01510.jpg" 
              loading="lazy"
              decoding="async"
              alt="Musawwir Traditional Art" 
              className="w-full h-auto object-cover max-h-[400px] md:max-h-[600px]"
            />
          </div>
          
          {/* Soft decorative background element */}
          <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 opacity-20 bg-black/10 rounded-full blur-3xl"></div>
        </div>

      </div>
    </section>
  );
};

export default NewCollection;