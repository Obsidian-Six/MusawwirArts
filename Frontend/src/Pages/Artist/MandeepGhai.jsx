import React, { useState, useEffect, useRef } from 'react';
import buildImageUrl from '../../Utils/buildImageUrl';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, MapPin, GraduationCap, Quote } from 'lucide-react';

const MandeepGhai = () => {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    // --- URL LOGIC ---
    const rawApiUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    const API_URL = String(rawApiUrl).replace(/\/$/, "");

    // Derive server host from API_URL and normalize it to include protocol.
    let SERVER_URL = API_URL.includes('/api') ? API_URL.split('/api')[0] : API_URL || '';
    if (!SERVER_URL) SERVER_URL = window.location.origin;

    // If missing protocol but looks like a host, add current protocol.
    if (!/^https?:\/\//i.test(SERVER_URL)) {
        if (SERVER_URL.includes('.') || SERVER_URL.includes('localhost')) {
            SERVER_URL = `${window.location.protocol}//${SERVER_URL}`;
        } else {
            console.warn('VITE_BASE_URL appears invalid, falling back to window.location.origin. Value:', rawApiUrl);
            SERVER_URL = window.location.origin;
        }
    }

    // use buildImageUrl for consistent image path resolution

    // --- FETCHING ---
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPaintings();
    }, []);

    const fetchPaintings = async () => {
        try {
            const response = await fetch(`${API_URL}/paintings`);
            if (response.ok) {
                const data = await response.json();
                setPaintings(data);
            }
        } catch (error) {
            console.error("Failed to fetch paintings:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollLeft = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    };

    return (
        <div className="bg-white min-h-screen font-sans text-stone-900 pb-20 overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-stone-100">
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-4 h-full">
                        <div className="border-r border-stone-900"></div>
                        <div className="border-r border-stone-900"></div>
                        <div className="border-r border-stone-900"></div>
                    </div>
                </div>
                <div className="relative z-10 text-center px-6">
                    <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-stone-500 mb-4 block animate-fade-in">
                        Featured Artist
                    </span>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-stone-900 tracking-tight leading-tight mb-6">
                        Mandeep Kumar Ghai
                    </h1>
                    <div className="h-px w-20 bg-[#A6894B] mx-auto mb-6"></div>
                    <p className="text-lg md:text-xl font-light italic text-stone-600 max-w-2xl mx-auto">
                        "A refined dialogue between cultural heritage and modern expression."
                    </p>
                </div>
            </div>

            {/* --- MAIN BIO SECTION --- */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-2xl md:text-3xl font-serif text-stone-900">Contemporary Indian Artist</h2>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                Mandeep Kumar Ghai (b. 1984, Punjab, India) is a distinguished contemporary artist whose work embodies a refined dialogue between cultural heritage and modern expression.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 pt-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-stone-50 rounded-full text-[#A6894B]">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-stone-900">Gold Medalist</h4>
                                    <p className="text-stone-500 text-sm">Himachal Pradesh University, Shimla (2009)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-stone-50 rounded-full text-[#A6894B]">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-stone-900">Punjab, India</h4>
                                    <p className="text-stone-500 text-sm">Born 1984, working globally</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-stone-50 rounded-full text-[#A6894B]">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-stone-900">Academic Research</h4>
                                    <p className="text-stone-500 text-sm">Expertise in Modern Indian Art</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8 text-stone-700 leading-relaxed text-[16px] md:text-[18px]">
                        <p>Mandeep Kumar Ghai has developed a distinctive visual language defined by depth, balance, and emotional resonance. His works have been exhibited at prominent institutions like the Dhoomimal Art Gallery, New Delhi.</p>
                        <p>Expanding his international presence, his paintings have been featured in curated exhibitions in London (UK) and Dubai (UAE).</p>
                        <p className="border-l-4 border-[#A6894B] pl-6 italic text-stone-500 py-2">
                            "His artistic practice is marked by layered textures, refined compositions, and a subtle interplay between narrative and abstraction."
                        </p>
                        <p>A recipient of the Junior Fellowship (2011–12) from the Ministry of Culture, Government of India, he continues to contribute actively to the contemporary art landscape.</p>
                    </div>
                </div>
            </div>

            {/* --- PAINTING SLIDER SECTION --- */}
            <section className="py-24 md:py-32 bg-white overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative group">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A6894B] font-bold block mb-2">Portfolio</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 tracking-tight">The Works of Mandeep Kumar Ghai</h2>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-[#A6894B] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div 
                            ref={sliderRef}
                            className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                        >
                            {paintings.length > 0 ? (
                                paintings.map((painting) => (
                                    <div 
                                        key={painting._id} 
                                        className="flex-shrink-0 w-[280px] md:w-[400px] snap-start group cursor-pointer"
                                        onClick={() => navigate(`/paintings/${painting._id}`)}
                                    >
                                        <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-stone-50 mb-6 border border-stone-100/50">
                                            <img 
                                                src={buildImageUrl(painting.imageUrl)} 
                                                alt={painting.title} 
                                                loading="lazy"
                                                decoding="async"
                                                className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-1000 group-hover:scale-105"
                                                onError={(e) => {
                                                    try {
                                                      if (e?.target?.dataset?.fallback === 'true') return;
                                                      e.target.dataset.fallback = 'true';
                                                      e.target.src = buildImageUrl('');
                                                    } catch (err) {console.error('Error loading image:', err);}
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500"></div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#A6894B] transition-colors">{painting.title}</h3>
                                            <p className="text-stone-500 text-sm tracking-wide">{painting.medium} • {painting.dimensions}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-20 text-stone-400">
                                    No paintings found in the collection.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <div className="max-w-[1400px] mx-auto px-6 mb-20">
                <div className="bg-stone-900 text-white p-12 md:p-20 text-center relative overflow-hidden rounded-sm">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-serif mb-8 tracking-wide">Acquire an Original Mandeep Kumar Ghai</h2>
                        <Link to="/paintings" className="inline-block px-10 py-4 bg-[#A6894B] text-white uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#8e7540] transition-colors">
                            View All Paintings
                        </Link>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
            `}} />
        </div>
    );
};

export default MandeepGhai;