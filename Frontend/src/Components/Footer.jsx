import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white font-sans text-stone-900 mt-auto">
      {/* Top Banner section */}
      <div 
        className="w-full h-64 md:h-[400px] bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url('/footer-banner.png')` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <h2 
          className="text-white text-[45px] md:text-[80px] italic font-serif tracking-wide text-center px-4 relative z-10" 
          style={{ textShadow: "2px 4px 8px rgba(0,0,0,0.3)" }}
        >
          In Every Shape. A Story.
        </h2>
      </div>

      {/* Main Grid structure */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Top Left: Logo */}
          <div className="p-8 md:p-12 border-b md:border-r border-[#E5E5E5] flex items-start justify-start">
             <img src="/translogo.png" alt="MUSAWWIR ART" className="h-12 md:h-16" />
          </div>

          {/* Top Right: Contacts */}
          <div className="p-8 md:p-12 border-b border-[#E5E5E5] flex flex-col sm:flex-row justify-between">
            <div className="text-[12px] font-bold text-stone-500 uppercase tracking-widest pt-1 mb-4 sm:mb-0">
              Contacts
            </div>
            <div className="sm:text-right space-y-4 text-[#CAA371] text-[14px]">
              <p className="font-bold">+971 55 743 0228</p>
              <p className="font-bold underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors"><a href="mailto:musawwirart1@gmail.com">musawwirart1@gmail.com</a></p>
              <p className="font-bold">24/7 Support</p>
            </div>
          </div>

          {/* Bottom Left: Socials */}
          <div className="p-8 md:p-12 border-b md:border-r border-[#E5E5E5] flex flex-col sm:flex-row justify-between">
            <div className="text-[12px] font-bold text-stone-500 uppercase tracking-widest pt-1 mb-4 sm:mb-0">
              Socials
            </div>
            <div className="sm:text-right space-y-4 text-[#CAA371] text-[14px] font-bold">
              <p><a href="https://www.instagram.com/musawwir_art" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Instagram</a></p>
              <p><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Facebook</a></p>
              <p><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Twitter</a></p>
            </div>
          </div>

          {/* Bottom Right: About Musawwir */}
          <div className="p-8 md:p-12 border-b border-[#E5E5E5] flex flex-col sm:flex-row justify-between">
            <div className="text-[12px] font-bold text-stone-500 uppercase tracking-widest pt-1 mb-4 sm:mb-0">
              About Musawwir
            </div>
            <div className="sm:text-right space-y-4 text-[#CAA371] text-[14px] font-bold">
              <p><Link to="/aboutus" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">About Us</Link></p>
              <p><Link to="/blog" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Blog</Link></p>
              <p><a href="#" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">The Canvas</a></p>
              <p><Link to="/art-maintenance" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Art Maintenance</Link></p>
              <p><Link to="/faq" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">FAQs</Link></p>
              <p><Link to="/terms" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Terms of Service</Link></p>
            </div>
          </div>

        </div>

        {/* Very bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 px-8 md:px-12 text-[11px] md:text-[12px] font-bold text-[#CAA371] gap-4">
          <div className="md:flex-1 flex justify-start">
            <Link to="/privacy" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Privacy Policy</Link>
          </div>
          <div className="md:flex-1 flex justify-center">
            <Link to="/terms" className="underline underline-offset-4 decoration-[1px] hover:text-[#a07c50] transition-colors">Terms of use</Link>
          </div>
          <div className="md:flex-1 flex justify-end text-center md:text-right uppercase">
            © {currentYear} MUSAWWIR ART. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;