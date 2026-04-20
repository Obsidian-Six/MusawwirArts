import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';
import SubNav from '../../Components/SubNav';

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className="text-[15px] md:text-[17px] font-serif italic text-stone-800 group-hover:text-stone-500 transition-colors">
          {title}
        </span>
        {isOpen ? <ChevronUp size={18} className="text-stone-300" /> : <ChevronDown size={18} className="text-stone-300" />}
      </button>
      {isOpen && (
        <div className="pb-8 text-[14px] md:text-[15px] leading-relaxed text-stone-500 font-light space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner Header */}
      <div className="bg-[#F2EBE3] pt-32 pb-24 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tight">FAQ's</h1>
      </div>

      {/* Secondary Navigation */}
      <SubNav active="FAQ's" />

      <div className="max-w-4xl mx-auto pt-24 pb-20 px-6 md:px-12">
        
        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 p-8 bg-[#FAF9F6] rounded-sm border border-stone-100">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
              <MapPin size={18} />
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500 max-w-[180px]">
              #198, CMH Road, 2nd Floor, Suite No.783, Indiranagar, Bangalore, Karnataka, India 560 038
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
              <Mail size={18} />
            </div>
            <a href="mailto:musawwirart1@gmail.com" className="text-[12px] font-bold text-stone-800 hover:underline">
              musawwirart1@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
              <Phone size={18} />
            </div>
            <p className="text-[12px] font-bold text-stone-800">
              +971 5854 15011
            </p>
          </div>
        </div>

        {/* --- BUYER FAQ SECTION --- */}
        <div className="mb-20">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900 mb-8 pb-4 border-b border-stone-100">Buyer FAQ</h2>
          
          <div className="space-y-2">
            <AccordionItem title="How do I place an order on Musawwir Art?">
              <p>Purchasing a masterpiece is a seamless four-step process:</p>
              <ol className="list-decimal pl-5 space-y-3 mt-3">
                <li><strong>Explore:</strong> Browse our curated collections and click on any artwork to view details.</li>
                <li><strong>Squire:</strong> If a piece speaks to you, click 'Add to Cart' or use the 'Inquire' button for price requests.</li>
                <li><strong>Checkout:</strong> Review your selection and proceed to our secure checkout where you'll provide shipping details.</li>
                <li><strong>Confirmation:</strong> Once the order is placed, you'll receive a confirmation email within 24 hours.</li>
              </ol>
            </AccordionItem>

            <AccordionItem title="Does the image accurately represent the artwork?">
              <p>We strive for the highest degree of image accuracy. However, due to the intricate nature of our works—often involving gold leaf and complex textures—minor variations in color may occurs as photography cannot always capture the exact depth and shimmer of the original piece.</p>
            </AccordionItem>

            <AccordionItem title="How accurate are the dimensions listed?">
              <p>Musawwir Art verifies all dimensions. However, as each canvas is unique and hand-stretched, dimensions may vary slightly (typically within 1 inch).</p>
            </AccordionItem>

            <AccordionItem title="Are all artworks genuine and authenticated?">
              <div className="flex gap-4">
                <ShieldCheck size={40} className="text-[#B69D6D] shrink-0" />
                <p>Absolutely. Every piece sold on Musawwir Art is 100% genuine. We use blockchain authentication to provide a digital immutable certificate of ownership alongside a physical Certificate of Authenticity signed by the artist.</p>
              </div>
            </AccordionItem>

            <AccordionItem title="How long will delivery take?">
              <p>Standard delivery typically takes 10-14 business days. We will provide you with a tracking number as soon as your masterpiece is dispatched from our curation center or the artist's studio.</p>
            </AccordionItem>

            <AccordionItem title="How are the artworks packaged?">
              <p><strong>Unframed works:</strong> Rolled with acid-free paper, wrapped in protective bubble layers, and placed in a heavy-duty protective cylinder.</p>
              <p><strong>Framed works:</strong> Secured with corner protectors, multi-layer bubble wrap, and shipped in a custom reinforced box to ensure safe arrival.</p>
            </AccordionItem>

            <AccordionItem title="What is the Musawwir Return Policy?">
              <p>To maintain the integrity of our collection, we generally do not accept returns. However, in the rare event that an artwork arrives damaged, please contact us immediately (within 24 hours of receipt) with photographic evidence to initiate a replacement or refund process.</p>
            </AccordionItem>
          </div>
        </div>

        {/* --- ARTIST FAQ SECTION --- */}
        <div className="mb-20">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900 mb-8 pb-4 border-b border-stone-100">Artist FAQ</h2>
          
          <div className="space-y-2">
            <AccordionItem title="Who can sell on Musawwir Art?">
              <p>We welcome professional artists, curators, and galleries whose work aligns with our standards of excellence and cultural storytelling. All partners must sign an authenticity guarantee agreement.</p>
            </AccordionItem>

            <AccordionItem title="How do I register as a Musawwir Artist?">
              <p>We are always seeking exceptional talent. To apply:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Send a portfolio selection (JPEG), bio, and price list to <a href="mailto:support@musawwir.art" className="underline">support@musawwir.art</a>.</li>
                <li>Our curation team will review your application within 5-7 business days.</li>
                <li>If approved, we will send a partnership agreement to be finalized.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Can I sell works listed with other galleries?">
              <p>Yes, we do not require exclusivity. We only ask that you notify us immediately if a piece is sold elsewhere so we can update our digital gallery.</p>
            </AccordionItem>

            <AccordionItem title="How does the payout process work?">
              <p>Once a sale is confirmed and the 7-day delivery verification period has passed, payments are processed directly to your registered bank account within 7-10 business days.</p>
            </AccordionItem>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-stone-100">
          <p className="text-stone-400 text-sm italic transition-all hover:text-stone-600">
            Still have questions? Our curators are available 24/7.
          </p>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
