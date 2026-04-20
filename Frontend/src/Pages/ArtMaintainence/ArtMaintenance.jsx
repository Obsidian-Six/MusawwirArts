import React from 'react';
import { MessageCircle } from 'lucide-react';
import SubNav from '../../Components/SubNav';

// Import local assets
import dustRemovalImg from '../../assets/maintenance/dust_removal.png';
import microscopicImg from '../../assets/maintenance/microscopic_cleaning.png';
import dryCleaningImg from '../../assets/maintenance/dry_cleaning.png';
import uvTreatmentImg from '../../assets/maintenance/uv_treatment.png';
import sketchImg from '../../assets/maintenance/sketch.png';

const MaintenanceSection = ({ title, description, image, isReversed, whatsappLink }) => {
  return (
    <section className={`py-16 md:py-28 flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20`}>
      {/* Image Container */}
      <div className="w-full md:w-1/2 group overflow-hidden bg-stone-100 aspect-[4/3] rounded-sm shadow-sm relative text-center flex items-center justify-center">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-stone-900/5 transition-opacity duration-500 group-hover:opacity-0" />
      </div>

      {/* Text Container */}
      <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
        <h2 className="text-3xl md:text-4xl font-serif italic text-stone-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-[15px] md:text-[16px] text-stone-500 font-light leading-relaxed max-w-xl">
          {description}
        </p>
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#B69D6D] text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <MessageCircle size={16} />
          Enquire Now
        </a>
      </div>
    </section>
  );
};

const ArtMaintenance = () => {
  const whatsappBase = "https://wa.me/971585415011?text=";

  const services = [
    {
      title: "Dust, Residue Removal",
      description: "Despite of how much care one takes of their prized artworks, they can see accumulation of dust and grime on the painting, especially in the gap between the artwork and its frame. Our experts use soft, fine brushes to carefully remove this grime from hard to reach gaps.",
      image: dustRemovalImg,
      isReversed: false,
      whatsappLink: whatsappBase + encodeURIComponent("Hi Musawwir Art, I would like to inquire about Dust and Residue Removal services for my artwork.")
    },
    {
      title: "Microscopic Cleaning",
      description: "Similar to dust, often finer debris such as a human hair or pet fur gets stuck on artworks, this might affect the painting's quality in the long haul. Our experts closely examine the artworks and remove these tiny debris with precision tools.",
      image: microscopicImg,
      isReversed: true,
      whatsappLink: whatsappBase + encodeURIComponent("Hi Musawwir Art, I would like to inquire about Microscopic Cleaning for my collection.")
    },
    {
      title: "Dry Cleaning",
      description: "Like all other things, artworks accumulate dust over time and damages it. Though clean-up at home is useful, it is best to seek professional help. Our experts use archival-grade materials, that are used in museums to clean the artworks gently, to make it look as good as new.",
      image: dryCleaningImg,
      isReversed: false,
      whatsappLink: whatsappBase + encodeURIComponent("Hi Musawwir Art, I'm interested in professional Dry Cleaning services for my paintings.")
    },
    {
      title: "Germicidal UV Treatment",
      description: "Weather plays a vital role on the quality of the painting. In extreme climates, humidity and fluctuations can cause mould and mildew growth. Our Germicidal UV treatment removes these growth at an early stage and prevents long-term discoloration.",
      image: uvTreatmentImg,
      isReversed: true,
      whatsappLink: whatsappBase + encodeURIComponent("Hi Musawwir Art, I'd like to book a Germicidal UV Treatment for art preservation.")
    },
    {
      title: "Documentation & Archiving",
      description: "Favorite artworks are often accompanied by extensive paperwork—invoices, authenticity certificates, and blockchain records. We help you organize and identify these critical documents, creating professional folders to ensure your collection's provenance is perfectly preserved.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
      isReversed: false,
      whatsappLink: whatsappBase + encodeURIComponent("Hi Musawwir Art, I need assistance with Collection Documentation and Archiving.")
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Split Banner Header */}
      <div className="bg-white pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px] md:min-h-[400px]">
          {/* Left: Text */}
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 space-y-6 bg-white">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-stone-900 leading-tight">
              Art Maintenance
            </h1>
            <p className="text-[14px] md:text-lg text-stone-400 font-light max-w-sm leading-relaxed">
              It is called art collection for a reason - it is a legacy that you maintain.
            </p>
          </div>
          {/* Right: Sketch with Beige Background - Decreased Height */}
          <div className="bg-[#F2EBE3] flex items-center justify-center p-6 md:p-12">
            <img 
              src={sketchImg} 
              alt="Art Conservation Sketch" 
              className="max-h-[180px] md:max-h-[220px] w-auto mix-blend-multiply opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <SubNav active="Art Maintenance" />

      <div className="px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto pt-16 pb-20">
        
        {/* Dynamic Sections */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <MaintenanceSection key={index} {...service} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 md:mt-32 text-center py-20 bg-[#FAF9F6] border border-stone-100 rounded-sm">
          <h3 className="text-2xl md:text-3xl font-serif italic text-stone-900 mb-8 max-w-xl mx-auto leading-relaxed px-4">
            "Every masterpiece deserves a lifetime of brilliance."
          </h3>
          <p className="text-stone-400 text-sm uppercase tracking-[0.3em] font-bold mb-10">Start Your Conservation Plan</p>
          <a 
            href={whatsappBase + encodeURIComponent("Hi Musawwir Art, I would like to discuss a comprehensive maintenance plan for my art collection.")}
            className="inline-block px-12 py-5 border border-stone-900 text-stone-900 text-[14px] font-bold uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all duration-500"
          >
            Connect With A Curator
          </a>
        </div>

      </div>
    </div>
  );
};

export default ArtMaintenance;
