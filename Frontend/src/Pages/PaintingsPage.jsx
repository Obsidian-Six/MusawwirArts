import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PaintingsPage = () => {
    const [paintings, setPaintings] = useState([]);
    const [filteredPaintings, setFilteredPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [dynamicCategories, setDynamicCategories] = useState([{ name: 'All', slug: 'all' }]);
    const [activeCategorySlug, setActiveCategorySlug] = useState('all');
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

    const location = useLocation();
    const itemsPerPage = 9;

    // 1. Fetch BOTH Paintings and Categories on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [paintingsRes, categoriesRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BASE_URL}/paintings`),
                    fetch(`${import.meta.env.VITE_BASE_URL}/categories`)
                ]);

                if (!paintingsRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch gallery data');

                const paintingsResult = await paintingsRes.json();
                const categoriesResult = await categoriesRes.json();

                if (categoriesResult.success) {
                    setDynamicCategories([{ name: 'All', slug: 'all' }, ...categoriesResult.data]);
                }

                let rawData = paintingsResult.data || (Array.isArray(paintingsResult) ? paintingsResult : []);
                const publishedOnly = rawData.filter(p => p.status === 'published');

                setPaintings(publishedOnly);
                setFilteredPaintings(publishedOnly);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Sync activeCategory with URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category') || params.get('style');
        window.scrollTo(0, 0);

        if (categoryParam) {
            setActiveCategorySlug(categoryParam.toLowerCase());
        } else {
            setActiveCategorySlug('all');
        }
    }, [location.search]);

    // 3. Filter paintings based on activeCategorySlug
    useEffect(() => {
        if (activeCategorySlug === 'all') {
            setFilteredPaintings(paintings);
        } else {
            const filter = activeCategorySlug.toLowerCase();
            const filtered = paintings.filter(p => {
                const categoryName = (p.category?.name || (typeof p.category === 'string' ? p.category : "")).toLowerCase();
                const categorySlug = (p.category?.slug || (typeof p.category === 'string' ? p.category : "")).toLowerCase();

                if (categorySlug === filter || categoryName === filter) return true;

                const keyword = filter.endsWith('s') ? filter.slice(0, -1) : filter;
                if (categoryName.includes(keyword) || categorySlug.includes(keyword)) return true;

                if (p.category?.parent?.name?.toLowerCase().includes(keyword)) return true;
                if (p.category?.parent?.slug?.toLowerCase().includes(keyword)) return true;

                return false;
            });
            setFilteredPaintings(filtered);
        }
        setCurrentPage(1);
    }, [activeCategorySlug, paintings]);

    const getFullImageUrl = (path) => {
        if (!path) return "/placeholder-art.jpg";
        if (path.startsWith('http')) return path;
        const baseUrl = import.meta.env.VITE_BASE_URL.split('/api')[0].replace(/\/$/, "");
        const fileName = path.split('\\').pop().split('/').pop();
        return `${baseUrl}/uploads/paintings/${fileName}`;
    };

    const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredPaintings.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center font-serif text-xs uppercase tracking-widest text-stone-400">
            Loading Gallery...
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center font-serif text-red-400">
            Error: {error}
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 font-serif">
            {/* Breadcrumbs */}
            <nav className="text-[10px] md:text-xs text-gray-400 mb-6 uppercase tracking-widest font-serif">
                Home &nbsp; / &nbsp; <span className="text-gray-900">Paintings</span>
            </nav>

            <h1 className="text-3xl md:text-4xl text-center mb-8 tracking-tight text-gray-900 font-light font-serif">
                The Collection
            </h1>

            {/* Category Filter */}
            <div className="mb-12 border-b border-stone-100 pb-8 flex flex-col items-center">
                <div
                    className={`flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-4 overflow-hidden transition-all duration-700 ease-in-out ${isCategoriesExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-[32px] md:max-h-[40px] opacity-90'
                        }`}
                >
                    {dynamicCategories.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => setActiveCategorySlug(cat.slug)}
                            className={`text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all font-serif py-1 ${activeCategorySlug === cat.slug
                                ? 'text-stone-900 font-bold border-b border-stone-900'
                                : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {dynamicCategories.length > 5 && (
                    <button
                        onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                        className="mt-6 text-[9px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all font-medium border-b border-transparent hover:border-stone-900 pb-0.5"
                    >
                        {isCategoriesExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </div>

            {filteredPaintings.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
                    {currentItems.map((art) => (
                        <Link
                            key={art._id}
                            to={`/paintings/${art._id}`}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            {/* 1. bg-white ensures a pure white background 
                                2. items-center perfectly centers the painting vertically and horizontally
                                3. Fixed heights keep the grid perfectly aligned
                            */}
                            <div className="w-full h-[240px] sm:h-[300px] lg:h-[380px] flex items-center justify-center mb-4 md:mb-6 relative overflow-hidden bg-white">
                                <img
                                    src={getFullImageUrl(art.imageUrl)}
                                    alt={art.title}
                                    loading="lazy"
                                    decoding="async"
                                    // Removed the shadow here to make it perfectly flat and minimal, 
                                    // relying purely on the white space for framing.
                                    className="max-w-full max-h-full w-auto h-auto object-contain duration-700 "
                                />
                                {/* Very subtle hover overlay to indicate it's clickable without being intrusive */}
                                <div className="absolute inset-0 bg-black/[0.01] group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                            </div>

                            {/* Text Container */}
                            <div className="flex flex-col gap-1.5 font-sans mt-auto pt-2">
                                {/* Title: Slightly larger, uppercase, with letter spacing for a premium feel */}
                                <h3 className="text-[12px] md:text-[14px] uppercase tracking-[0.15em] text-gray-900 leading-snug group-hover:text-[#A6894B] transition-colors font-medium">
                                    {art.title}
                                </h3>

                                {/* Category: Small, subtle, and clean */}
                                <p className="text-[10px] md:text-[11px] text-[#A6894B] tracking-widest uppercase font-semibold">
                                    {art.category?.parent?.name
                                        ? `${art.category.parent.name} • ${art.category.name}`
                                        : (art.category?.name || 'Artwork')
                                    }
                                </p>

                                {/* Medium & Size: Grouped slightly with a subtle divider or just clean lines */}
                                <div className="flex flex-col mt-0.5 border-t border-stone-50 pt-1.5">
                                    <p className="text-[11px] md:text-[12px] text-stone-600 tracking-tight italic leading-relaxed">
                                        {art.medium}
                                    </p>
                                    <p className="text-[10px] md:text-[11px] text-stone-400 tracking-wide font-light">
                                        {art.dimensions}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-stone-400 text-xs uppercase tracking-[0.3em] font-serif">
                    No artworks found in this category.
                </div>
            )}


            {/* Pagination */}
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

export default PaintingsPage;