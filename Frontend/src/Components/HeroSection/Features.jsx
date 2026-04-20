import React from 'react';
import { ShieldCheck, LayoutGrid, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Blockchain Authenticated Art",
      description: "You will never have to worry about the authenticity of any art purchased from Musawwir Art.",
      icon: <ShieldCheck className="text-[#B69D6D] mb-6" size={28} strokeWidth={1} />
    },
    {
      title: "Curated Collection",
      description: "We choose wisely so you can select from the best of modern and traditional masterpieces.",
      icon: <LayoutGrid className="text-[#B69D6D] mb-6" size={28} strokeWidth={1} />
    },
    {
      title: "Worldwide Shipping",
      description: "We don't let location be a constraint to acquire the art you like. Securely delivered to your door.",
      icon: <Globe className="text-[#B69D6D] mb-6" size={28} strokeWidth={1} />
    }
  ];

  return (
    <section className="bg-[#FAF9F6] py-12 md:py-20 px-6 md:px-12 lg:px-24 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center md:items-start px-4 md:px-10 py-4 md:py-8 text-center md:text-left 
                ${index !== features.length - 1 ? 'md:border-r border-slate-200' : ''}
                ${index !== features.length - 1 ? 'border-b md:border-b-0 pb-12 md:pb-8 border-slate-100 md:border-transparent' : ''}
              `}
            >
              {/* Icon */}
              {feature.icon}
              
              <h3 className="text-xl md:text-2xl font-serif italic text-slate-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-sm leading-relaxed text-slate-500 font-sans tracking-wide max-w-[280px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;