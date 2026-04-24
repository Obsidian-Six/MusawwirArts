import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer 
      className="w-full font-sans mt-auto bg-cover bg-center relative"
      style={{ backgroundImage: `url('/footer-banner.png')` }}
    >
      {/* Semi-opaque overlay for elegant text contrast over the banner */}
      <div className="absolute inset-0 bg-[#F8F5F0]/82"></div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto w-full flex flex-col pt-8 md:pt-16">
        {/* Top Row: Logo, Brand Name, and Socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black/10">
          
          {/* Top Left: Logo & Serif Brand Identity */}
          <div className="p-8 md:p-12 md:border-r border-black/10 flex items-center justify-start gap-4">
             <img src="/translogo.png" alt="Logo" className="h-10 md:h-14" />
             <div className="flex flex-col">
                <span className="text-stone-800 text-[24px] md:text-[32px] italic font-serif leading-none tracking-tight">
                  Musawwir Art
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#8a6a40] font-bold mt-1">
                  Fine Art Gallery
                </span>
             </div>
          </div>

          {/* Top Right: Social Media Links */}
          <div className="p-8 md:p-12 flex justify-between">
            <div className="text-[13px] font-bold text-stone-800 uppercase tracking-widest pt-1">
              Socials
            </div>
            <div className="text-right space-y-4 text-[#8a6a40] text-[15px] font-medium">
              <p><a href="https://www.instagram.com/musawwir_art" target="_blank" rel="noopener noreferrer" className="flex items-center justify-end gap-3 hover:text-stone-900 transition-colors"><FiInstagram className="text-lg text-stone-800"/> <span className="underline underline-offset-4 decoration-[1px]">Instagram</span></a></p>
              <p><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-end gap-3 hover:text-stone-900 transition-colors"><FiFacebook className="text-lg text-stone-800"/> <span className="underline underline-offset-4 decoration-[1px]">Facebook</span></a></p>
              <p><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-end gap-3 hover:text-stone-900 transition-colors"><FiTwitter className="text-lg text-stone-800"/> <span className="underline underline-offset-4 decoration-[1px]">Twitter</span></a></p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation and Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black/10">
          
          {/* About Links Section */}
          <div className="p-8 md:p-12 md:border-r border-black/10 flex justify-between">
            <div className="text-[13px] font-bold text-stone-800 uppercase tracking-widest pt-1">
              About Musawwir
            </div>
            <div className="text-right space-y-4 text-[#8a6a40] text-[15px] font-medium">
              <p><Link to="/aboutus" onClick={scrollToTop} className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">About Us</Link></p>
              <p><Link to="/blog" onClick={scrollToTop} className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">Blog</Link></p>
              <p><Link to="/paintings" onClick={scrollToTop} className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">The Canvas</Link></p>
              <p><Link to="/art-maintenance" onClick={scrollToTop} className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">Art Maintenance</Link></p>
              <p><Link to="/faq" onClick={scrollToTop} className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">FAQs</Link></p>
              <p><Link to="/terms" onClick={scrollToTop} className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">Terms of Service</Link></p>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="p-8 md:p-12 flex justify-between">
            <div className="text-[13px] font-bold text-stone-800 uppercase tracking-widest pt-1">
              Contacts
            </div>
            <div className="text-right space-y-4 text-[#8a6a40] text-[15px] font-medium">
              <p className="flex items-center justify-end gap-3 text-stone-800"><FiPhone className="text-lg"/> <span className="underline underline-offset-4 decoration-[1px]">+971 55 743 0228</span></p>
              <p className="flex items-center justify-end gap-3"><FiMail className="text-lg text-stone-800"/> <a href="mailto:musawwirart1@gmail.com" className="underline underline-offset-4 decoration-[1px] hover:text-stone-900 transition-colors">musawwirart1@gmail.com</a></p>
              <p className="flex items-center justify-end gap-3 text-stone-800"><FiMessageSquare className="text-lg"/> <span>24/7 Support</span></p>
            </div>
          </div>
        </div>

        {/* Footer Brand Statement and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-end py-10 px-8 md:px-12 gap-6 md:gap-0">
          <div className="text-[12px] font-bold text-[#8a6a40] uppercase mb-1 md:mb-3">
            © {currentYear} MUSAWWIR ART. ALL RIGHTS RESERVED.
          </div>
          <div className="text-stone-800 text-[40px] md:text-[65px] italic font-serif leading-none" style={{ textShadow: "1px 1px 1px rgba(255,255,255,0.6)" }}>
            In Every Shape. A Story.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;