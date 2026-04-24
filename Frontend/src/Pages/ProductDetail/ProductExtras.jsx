import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, Truck, ShieldCheck, Info } from 'lucide-react';

const ProductExtras = ({ currentProduct }) => {
    const [activeTab, setActiveTab] = useState('Product Description');
    const [relatedPaintings, setRelatedPaintings] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { name: 'Product Description', icon: <Info size={14} /> },
        { name: 'Why Us', icon: <Award size={14} /> },
        { name: 'Authenticity', icon: <ShieldCheck size={14} /> },
        { name: 'Shipping & Returns', icon: <Truck size={14} /> }
    ];

    useEffect(() => {
        const fetchRelated = async () => {
            if (!currentProduct?.category) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/paintings`);
                const result = await response.json();
                if (response.ok) {
                    const data = result.data || result;
                    const filtered = data.filter(p =>
                        p._id !== currentProduct._id && 
                       (p.category?._id || p.category) === (currentProduct.category?._id || currentProduct.category)
                    );
                    setRelatedPaintings(filtered);
                }
            } catch (err) {
                console.error("Error fetching related paintings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, [currentProduct]);

    const getFullImageUrl = (path) => {
        if (!path) return "/placeholder-art.jpg";
        const baseUrl = import.meta.env.VITE_BASE_URL.split('/api')[0].replace(/\/$/, "");
        const fileName = path.split('\\').pop().split('/').pop();
        return `${baseUrl}/uploads/paintings/${fileName}`;
    };

    const getCategoryDisplay = (cat) => {
        if (!cat) return '';
        if (typeof cat === 'string') return cat;
        if (typeof cat === 'object') {
            if (cat.name) return cat.name;
            if (cat.slug) return cat.slug;
            if (cat._id) return cat._id;
            try { return String(cat); } catch { return '' }
        }
        return String(cat);
    };

    return (
        <div className="mt-24 border-t border-stone-200 pt-16">
            {/* TABS NAVIGATION - Refined Sans-Serif */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 border-b border-stone-100 mb-12 overflow-x-auto no-scrollbar mx-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`group pb-5 text-[14px] tracking-[0.1em] transition-all whitespace-nowrap flex items-center gap-2 font-sans font-bold ${
                            activeTab === tab.name
                                ? 'text-stone-900 border-b-2 border-[#A6894B]'
                                : 'text-stone-600 hover:text-stone-800'
                        }`}
                    >
                        <span className={activeTab === tab.name ? 'text-[#A6894B]' : 'opacity-50'}>
                            {tab.icon}
                        </span>
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto transition-all duration-500 min-h-[300px] font-serif text-center">
                {activeTab === 'Product Description' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col items-center">
                        <p className="text-2xl text-stone-900 leading-relaxed italic border-stone-200">
                            A masterful capture of {getCategoryDisplay(currentProduct?.category)} using {currentProduct?.medium}.
                        </p>
                        <div className="text-lg text-stone-700 leading-loose max-w-3xl mx-auto">
                            {currentProduct.description || "Every brushstroke in this piece tells a unique story of perspective and technique."}
                        </div>
                    </div>
                )}

                {activeTab === 'Why Us' && (
                    <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="space-y-6 text-lg text-stone-800 leading-relaxed">
                            <p>At Musawwir Art, we believe that purchasing a masterpiece is more than a transaction; it is the beginning of a legacy.</p>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Expertly Curated Collections",
                                "Global White-Glove Delivery",
                                "Bespoke Framing Options",
                                "Digital Provenance Tracking"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans">
                                    <div className="w-1.5 h-1.5 bg-[#A6894B]" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'Authenticity' && (
                    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <h4 className="text-stone-900 text-xl italic font-medium">Guaranteed Provenance</h4>
                        <p className="text-lg text-stone-700 leading-relaxed">
                            Every artwork is accompanied by a physical **Certificate of Authenticity**, hand-signed by the artist and embossed with our seal.
                        </p>
                        <div className="p-8 bg-stone-50 border border-stone-100 rounded-sm italic text-stone-500 text-base">
                            This digital and physical record ensures your investment is protected across generations.
                        </div>
                    </div>
                )}

                {activeTab === 'Shipping & Returns' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="space-y-4 text-center">
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A6894B] font-sans">Complimentary Shipping</h4>
                            <p className="text-lg text-stone-800 leading-relaxed">Artworks are professionally crated and insured for their full value to ensure pristine arrival.</p>
                        </div>
                        <div className="space-y-4 text-center">
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A6894B] font-sans">7-Day Return Policy</h4>
                            <p className="text-lg text-stone-800 leading-relaxed">If the piece does not resonate with your space, we facilitate a professional return and full refund.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* RELATED PRODUCTS - Clean Grid */}
            <div className="mt-32 pt-20 border-t border-stone-200">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="space-y-3">
                        <h3 className="text-3xl font-serif text-stone-900 italic leading-tight">
                            More from this collection
                        </h3>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-sans font-bold">
                            Explore similar works in <span className="text-stone-900">{getCategoryDisplay(currentProduct?.category)}</span>
                        </p>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button className="p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
                            <ChevronLeft size={18} className="text-stone-600" />
                        </button>
                        <button className="p-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
                            <ChevronRight size={18} className="text-stone-600" />
                        </button>
                    </div>
                </div>

                {relatedPaintings.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                        {relatedPaintings.slice(0, 4).map((art) => (
                            <Link
                                key={art._id}
                                to={`/paintings/${art._id}`}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="group block space-y-5"
                            >
                                <div className="h-[250px] md:h-[320px] flex items-center justify-center overflow-hidden bg-stone-50 shadow-sm transition-shadow group-hover:shadow-md border border-stone-100/50">
                                    <img
                                        src={getFullImageUrl(art.imageUrl)}
                                        alt={art.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-[1.2s] group-hover:scale-105"
                                    />
                                </div>

                                <div className="space-y-2 px-1">
                                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-stone-900 group-hover:text-[#A6894B] transition-colors font-sans">
                                        {art.title}
                                    </h4>
                                    <p className="text-xs text-stone-500 font-serif italic">
                                        {art.medium}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center border border-dashed border-stone-200 text-[10px] uppercase tracking-widest text-stone-400 font-sans">
                        {loading ? "Discovering masterpieces..." : "No additional works found"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductExtras;