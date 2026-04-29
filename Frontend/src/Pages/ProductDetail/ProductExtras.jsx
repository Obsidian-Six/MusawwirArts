import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, Truck, ShieldCheck, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductExtras = ({ currentProduct }) => {
    const [activeTab, setActiveTab] = useState('Product Description');
    const [relatedPaintings, setRelatedPaintings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const renderTabContent = (tabName) => {
        switch (tabName) {
            case 'Product Description':
                return (
                    <div className="space-y-8 flex flex-col items-center text-center">
                        <p className="text-xl md:text-2xl text-stone-900 leading-relaxed italic border-stone-200">
                            A masterful capture of {getCategoryDisplay(currentProduct?.category)} using {currentProduct?.medium}.
                        </p>
                        <div className="text-base md:text-lg text-stone-700 leading-loose max-w-3xl mx-auto">
                            {currentProduct.description || "Every brushstroke in this piece tells a unique story of perspective and technique."}
                        </div>
                    </div>
                );
            case 'Why Musawwir':
                return (
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-base md:text-lg text-stone-800 leading-relaxed text-center md:text-left">
                            <p>At Musawwir Art, we believe that purchasing a masterpiece is more than a transaction; it is the beginning of a legacy.</p>
                        </div>
                        <ul className="grid grid-cols-1 gap-4">
                            {[
                                "Expertly Curated Collections",
                                "Global White-Glove Delivery",
                                "Bespoke Framing Options",
                                "Digital Provenance Tracking"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans">
                                    <div className="w-1.5 h-1.5 bg-[#A6894B]" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Authenticity':
                return (
                    <div className="max-w-3xl mx-auto space-y-6 text-center">
                        <h4 className="text-stone-900 text-xl italic font-medium">Guaranteed Provenance</h4>
                        <p className="text-base md:text-lg text-stone-700 leading-relaxed">
                            Every artwork is accompanied by a physical **Certificate of Authenticity**, hand-signed by the artist and embossed with our seal.
                        </p>
                        <div className="p-8 bg-stone-50 border border-stone-100 rounded-sm italic text-stone-500 text-base">
                            This digital and physical record ensures your investment is protected across generations.
                        </div>
                    </div>
                );
            case 'Shipping & Returns':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        <div className="space-y-4 text-center">
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A6894B] font-sans">Complimentary Shipping</h4>
                            <p className="text-base md:text-lg text-stone-800 leading-relaxed">Artworks are professionally crated and insured for their full value to ensure pristine arrival.</p>
                        </div>
                        <div className="space-y-4 text-center">
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A6894B] font-sans">7-Day Return Policy</h4>
                            <p className="text-base md:text-lg text-stone-800 leading-relaxed">If the piece does not resonate with your space, we facilitate a professional return and full refund.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const tabs = [
        { name: 'Product Description', icon: <Info size={14} /> },
        { name: 'Why Musawwir', icon: <Award size={14} /> },
        { name: 'Authenticity', icon: <ShieldCheck size={14} /> },
        { name: 'Shipping & Returns', icon: <Truck size={14} /> }
    ];

    return (
        <div className="mt-24 border-t border-stone-200 pt-16 px-4 md:px-0">
            {/* DESKTOP TABS - Hidden on Mobile */}
            <div className="hidden md:block">
                <div className="flex flex-nowrap justify-center gap-8 md:gap-12 border-b border-stone-100 mb-12 overflow-x-auto no-scrollbar mx-auto">
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

                <div className="max-w-5xl mx-auto min-h-[300px] font-serif">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderTabContent(activeTab)}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* MOBILE ACCORDION - Hidden on Desktop */}
            <div className="md:hidden space-y-2">
                {tabs.map((tab) => (
                    <div key={tab.name} className="border-b border-stone-100">
                        <button
                            onClick={() => setActiveTab(activeTab === tab.name ? '' : tab.name)}
                            className="w-full py-6 flex justify-between items-center text-left group"
                        >
                            <span className={`text-[14px] font-sans font-bold uppercase tracking-[0.15em] transition-colors flex items-center gap-3 ${
                                activeTab === tab.name ? 'text-stone-900' : 'text-stone-500'
                            }`}>
                                <span className={activeTab === tab.name ? 'text-[#A6894B]' : 'opacity-40'}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </span>
                            {activeTab === tab.name ? (
                                <ChevronUp size={18} className="text-[#A6894B]" />
                            ) : (
                                <ChevronDown size={18} className="text-stone-300" />
                            )}
                        </button>
                        <AnimatePresence>
                            {activeTab === tab.name && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-10 font-serif">
                                        {renderTabContent(tab.name)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* RELATED PRODUCTS - Clean Grid */}
            {relatedPaintings.length > 0 && (
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
                </div>
            )}
        </div>
    );
};

export default ProductExtras;