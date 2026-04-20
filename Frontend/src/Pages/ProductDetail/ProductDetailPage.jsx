import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContactForm from '../../Components/ContactForm';
import { Heart, Share2, Mail, MessageCircle, Maximize2, X, ShieldCheck } from 'lucide-react';
import ProductExtras from './ProductExtras';
import ImageZoom from '../../Components/ImageZoom';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-art.jpg";
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_BASE_URL.split('/api')[0].replace(/\/$/, "");
    const fileName = path.split('\\').pop().split('/').pop();
    return `${baseUrl}/uploads/paintings/${fileName}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/paintings/${id}`);
        const result = await response.json();
        if (response.ok) setProduct(result.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Ensure the page is scrolled to top when navigating to a product detail
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsFullScreen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "971557430228";
    const message = `Hi! I'm interested in booking the painting: "${product?.title}" with "${product?.dimensions}". Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-serif uppercase tracking-[0.3em] text-stone-500 text-sm animate-pulse">
      Loading Artwork...
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center font-serif text-stone-600">
      Artwork not found.
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-20">
      {/* Full Screen Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[100] bg-stone-950/98 flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setIsFullScreen(false)}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all bg-white/10 p-2 rounded-full"
          >
            <X size={28} />
          </button>
          <img 
            src={getFullImageUrl(product.imageUrl)} 
            alt={product.title} 
            className="max-w-full max-h-full object-contain shadow-2xl ring-1 ring-white/10"
          />
        </div>
      )}

      {/* Breadcrumbs - Sharper visibility */}
      <nav className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-stone-400 mb-10">
        <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span className="opacity-30">/</span>
        <Link to="/paintings" className="hover:text-stone-900 transition-colors">Paintings</Link>
        <span className="opacity-30">/</span>
        <span className="text-stone-900 font-semibold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        
        {/* LEFT: Image Section */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 z-50">
          <ImageZoom 
            src={getFullImageUrl(product.imageUrl)} 
            alt={product.title} 
            onClick={() => setIsFullScreen(true)}
          />
        </div>

        {/* RIGHT: Details Section */}
        <div className="lg:col-span-5 space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl md:text-5xl text-stone-900 font-serif leading-[1.1] tracking-tight">
              {product.title}
            </h1>
            <p className="text-lg text-[#A6894B] font-serif italic tracking-wide">
              {product.artist || 'Original Piece by Musawwir'}
            </p>
          </header>

          <div className="grid grid-cols-2 gap-y-8 gap-x-4 pt-8 border-t border-stone-200">
            <div className="space-y-1">
                <p className="text-[11px] text-stone-400 uppercase tracking-[0.2em] font-bold">Dimensions</p>
                <p className="text-sm text-stone-800 font-medium">{product.dimensions}</p>
            </div>
            <div className="space-y-1">
                <p className="text-[11px] text-stone-400 uppercase tracking-[0.2em] font-bold">Medium</p>
                <p className="text-sm text-stone-800 font-medium">{product.medium}</p>
            </div>
            <div className="col-span-2 space-y-1">
                <p className="text-[11px] text-stone-400 uppercase tracking-[0.2em] font-bold">Provenance ID</p>
                <p className="text-[12px] text-stone-500 font-mono break-all">{product._id?.toUpperCase()}</p>
            </div>
            <div className="col-span-2 space-y-1 pt-4 border-t border-stone-100">
                <p className="text-[11px] text-stone-400 uppercase tracking-[0.2em] font-bold">Copyright & Usage</p>
                <Link 
                  to="/copyright" 
                  className="text-[12px] text-[#A6894B] font-bold underline underline-offset-4 hover:text-[#8a6d35] transition-colors inline-flex items-center gap-2"
                >
                  <ShieldCheck size={14} />
                  View Ownership & Usage Policy
                </Link>
            </div>
          </div>

          {/* Value Proposition Box */}
          <div className="flex gap-4 p-5 bg-stone-50 rounded-sm border-l-4 border-[#A6894B]">
             <ShieldCheck size={24} className="text-[#A6894B] flex-shrink-0" />
             <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">Certified Provenance</h4>
                <p className="text-[12px] leading-relaxed text-stone-600 italic">
                  This artwork is digitally verified and registered on the blockchain for permanent ownership history.
                </p>
             </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={handleWhatsAppRedirect}
              className="flex-grow bg-[#1a1a1a] text-white py-5 rounded-sm text-xs font-bold uppercase tracking-[0.25em] hover:bg-stone-800 transition-all active:scale-[0.98] shadow-lg shadow-stone-200"
            >
              Request for Price
            </button>
            <button className="px-6 border border-stone-200 rounded-sm hover:bg-stone-50 transition-colors group">
              <Heart size={20} className="text-stone-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Social Share & Footer Details */}
          <div className="pt-10 space-y-6">
            <div className="flex items-center justify-between border-t border-stone-100 pt-6">
              <span className="text-[11px] text-stone-400 uppercase tracking-[0.1em]">Share this work:</span>
              <div className="flex gap-4">
                <button className="text-stone-400 hover:text-stone-900 transition-all"><Share2 size={18} /></button>
                <button className="text-stone-400 hover:text-green-600 transition-all"><MessageCircle size={18} /></button>
                <button className="text-stone-400 hover:text-stone-900 transition-all"><Mail size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isContactOpen && (
        <ContactForm 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
          artworkName={product.title}
          paintingImage={getFullImageUrl(product.imageUrl)}
        />
      )}

      {/* Dynamic Product Extras */}
      <div className="mt-24">
        <ProductExtras currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;