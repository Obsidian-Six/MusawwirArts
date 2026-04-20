import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to handle image paths from backend
const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-art.jpg";
    if (path.startsWith('http')) return path;

    const baseUrl = import.meta.env.VITE_BASE_URL.split('/api')[0].replace(/\/$/, "");

    // 2. Clean the path: Extract just the filename to avoid pathing issues between Windows/Linux
    const fileName = path.split('\\').pop().split('/').pop();

    // 3. Return the exact absolute URL
    return `${baseUrl}/uploads/paintings/${fileName}`;
};
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Assuming your backend has a /categories endpoint 
        // OR you can fetch all paintings and filter unique categories
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/paintings`);
        const result = await response.json();

        if (response.ok) {
          // Normalize result to an array of paintings regardless of response shape
          const items = result?.data || (Array.isArray(result) ? result : []);

          // Logic: Get one unique painting for each category to use as the cover image
          const uniqueCategories = [];
          const seen = new Set();

          items.forEach(item => {
            if (!item) return;

            // category can be a string or an object { name, slug }
            const categoryName = (typeof item.category === 'string')
              ? item.category
              : (item.category?.name || item.category?.slug || '').toString();

            if (!categoryName) return;

            const key = categoryName.toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              uniqueCategories.push({
                title: categoryName,
                desc: `Explore our collection of ${categoryName} masterpieces`,
                image: getFullImageUrl(item.imageUrl),
                link: `/paintings?category=${encodeURIComponent(categoryName)}`
              });
            }
          });

          setCategories(uniqueCategories.slice(0, 4)); // Limit to top 4
        } else {
          console.error('Failed to fetch paintings for categories', response.status);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-4">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] uppercase tracking-[0.3em]">Loading Collections...</span>
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-white px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-slate-900 mb-3">
            Explore by Category
          </h2>
          <p className="text-slate-500 font-sans text-sm md:text-[17px] tracking-wide max-w-2xl mx-auto px-4">
            Traverse across curated collections to find the perfect piece for your space.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <Link 
              to={cat.link} 
              key={index} 
              className="group relative h-[350px] sm:h-[450px] md:h-[500px] overflow-hidden rounded-lg cursor-pointer shadow-sm border border-slate-200 bg-stone-200"
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-serif italic flex items-center gap-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 capitalize">
                  {cat.title}
                  <ArrowRight 
                    size={20} 
                    className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#A6894B]" 
                  />
                </h3>
                <p className="text-white/80 text-xs md:text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 font-sans">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;