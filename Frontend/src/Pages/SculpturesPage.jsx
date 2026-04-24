import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SculpturesPage = () => {
    const [sculptures, setSculptures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 9;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sculptures`);
                if (!response.ok) throw new Error('Failed to fetch sculpture data');

                const result = await response.json();
                let rawData = result.data || (Array.isArray(result) ? result : []);
                const publishedOnly = rawData.filter(p => p.status === 'published');

                setSculptures(publishedOnly);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getFullImageUrl = (path) => {
        if (!path) return "/placeholder-art.jpg";
        if (path.startsWith('http')) return path;
        const baseUrl = import.meta.env.VITE_BASE_URL.split('/api')[0].replace(/\/$/, "");
        const fileName = path.split('\\').pop().split('/').pop();
        return `${baseUrl}/uploads/sculptures/${fileName}`;
    };

    const totalPages = Math.ceil(sculptures.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sculptures.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center font-serif text-xs uppercase tracking-widest text-stone-400">
            Loading Sculptures...
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center font-serif text-red-400">
            Error: {error}
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 font-serif">
            <nav className="text-[10px] md:text-xs text-gray-400 mb-6 uppercase tracking-widest font-serif">
                Home &nbsp; / &nbsp; <span className="text-gray-900">Sculptures</span>
            </nav>

            <h1 className="text-3xl md:text-4xl text-center mb-12 tracking-tight text-gray-900 font-light font-serif">
                Sculpture Collection
            </h1>

            {sculptures.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
                    {currentItems.map((art) => (
                        <Link
                            key={art._id}
                            to={`/sculptures/${art._id}`}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            <div className="w-full h-[240px] sm:h-[300px] lg:h-[380px] flex items-center justify-center mb-4 md:mb-6 relative overflow-hidden bg-white">
                                <img
                                    src={getFullImageUrl(art.imageUrl)}
                                    alt={art.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="max-w-full max-h-full w-auto h-auto object-contain duration-700 "
                                />
                                <div className="absolute inset-0 bg-black/[0.01] group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                            </div>

                            <div className="flex flex-col gap-1.5 font-sans mt-auto pt-2">
                                <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.15em] text-gray-900 leading-snug group-hover:text-[#A6894B] transition-colors font-medium">
                                    {art.title}
                                </h3>

                                <div className="flex flex-col mt-0.5 border-t border-stone-50 pt-1.5">
                                    <p className="text-[11px] md:text-[12px] text-stone-600 tracking-tight italic leading-relaxed">
                                        {art.material}
                                    </p>
                                    <p className="text-[10px] md:text-[11px] text-stone-400 tracking-wide font-light">
                                        {art.dimensions} {art.weight && `• ${art.weight}`}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-stone-400 text-xs uppercase tracking-[0.3em] font-serif">
                    No sculptures found in the collection.
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4 pt-10 border-t border-stone-100 font-serif">
                    <button
                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                        disabled={currentPage === 1}
                        className="text-[10px] uppercase tracking-widest px-4 py-2 disabled:opacity-20 font-serif"
                    >
                        Prev
                    </button>

                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0); }}
                                className={`w-8 h-8 text-[10px] flex items-center justify-center rounded-full transition-all font-serif ${currentPage === i + 1
                                    ? 'bg-stone-900 text-white shadow-md'
                                    : 'text-stone-400 hover:bg-stone-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                        disabled={currentPage === totalPages}
                        className="text-[10px] uppercase tracking-widest px-4 py-2 disabled:opacity-20 font-serif"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default SculpturesPage;
