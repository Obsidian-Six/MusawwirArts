import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ArtistDetail = () => {
    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const artist = {
        name: "Amol Pawar",
        profileImage: "/uploads/artists/amol_profile.png",
        portfolio: [
            {
                title: "Shiva Shakti Couple",
                medium: "Acrylic on Canvas",
                size: "48\" x 60\"",
                price: "Rs. 525,000",
                image: "/uploads/artists/shakti_couple.png"
            },
            {
                title: "Hanuman",
                medium: "Acrylic on Canvas",
                size: "30\" x 60\"",
                price: "Rs. 393,750",
                image: "/uploads/artists/hanuman.png"
            },
            {
                title: "Shakti",
                medium: "Acrylic on Canvas",
                size: "30\" x 30\"",
                price: "Rs. 164,000",
                image: "/uploads/artists/shakti.png"
            },
            {
                title: "Shiva",
                medium: "Acrylic on Canvas",
                size: "60\" x 60\"",
                price: "Rs. 656,000",
                image: "/uploads/artists/shiva.png"
            },
            {
                title: "Shiva parvati",
                medium: "Acrylic on Canvas",
                size: "24\" x 36\"",
                price: "Rs. 157,500",
                image: "/uploads/artists/parvati.png"
            },
            {
                title: "Shiva & Nandi",
                medium: "Acrylic on Canvas",
                size: "60\" x 60\"",
                price: "Rs. 656,000",
                isSold: true,
                image: "/uploads/artists/shiva.png" // Reusing Shiva since last Gen failed
            }
        ]
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 pb-20">
            {/* 1. ARTIST HEADER */}
            <div className="pt-24 pb-16 flex flex-col items-center border-b border-gray-100">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 ring-1 ring-gray-100 bg-gray-50">
                    <img 
                        src={artist.profileImage} 
                        alt={artist.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-3xl md:text-5xl font-serif text-gray-900 tracking-tight">
                    {artist.name}
                </h1>
            </div>

            {/* 2. BREADCRUMBS */}
            <nav className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-8 flex items-center gap-3 text-[11px] md:text-[12px] uppercase tracking-[0.1em] text-gray-400 font-medium">
                <Link to="/" className="hover:text-gray-900">Home</Link>
                <span>›</span>
                <span className="text-gray-900 font-bold">{artist.name}</span>
            </nav>

            {/* 3. PORTFOLIO GRID */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16 lg:gap-y-24">
                    {artist.portfolio.map((work, index) => (
                        <div key={index} className="group flex flex-col">
                            {/* Work Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
                                <img 
                                    src={work.image} 
                                    alt={work.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white/60 hover:text-red-500 hover:bg-white transition-all">
                                    <Heart size={18} />
                                </button>
                                {work.isSold && (
                                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                                       {/* Optional overlay for sold works */}
                                    </div>
                                )}
                            </div>

                            {/* Work Details */}
                            <div className="grid grid-cols-[1fr_auto] gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-[16px] md:text-[18px] font-bold text-gray-900">{work.title}</h3>
                                    <p className="text-[12px] md:text-[13px] text-gray-500 italic">By {artist.name}</p>
                                    <p className="text-[11px] text-gray-400 uppercase tracking-widest pt-1">Size: {work.size}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[14px] md:text-[16px] font-bold text-gray-900">{work.price}</p>
                                    <p className="text-[11px] text-gray-500">{work.medium}</p>
                                    {work.isSold && (
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#A6894B] pt-2">SOLD</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Back to top scroll button (Visual only, floating buttons handles real one) */}
            <div className="flex justify-center mt-32">
                 <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
                    className="w-12 h-12 bg-[#A6894B] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                 </button>
            </div>
        </div>
    );
};

export default ArtistDetail;
