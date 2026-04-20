import React from 'react';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .underline-animate {
                    position: relative;
                    display: inline-block;
                    cursor: pointer;
                }
                .underline-animate::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px; /* Slightly thicker underline for better visibility */
                    bottom: -4px;
                    left: 0;
                    background-color: currentColor;
                    transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .underline-animate:hover::after {
                    width: 100%;
                }
            `}} />

            <header className="w-full bg-white font-sans border-b border-gray-100 relative z-50">
                {/* 1. TOP GOLD BAR - Increased font size slightly */}
                <div className="bg-[#A6894B] text-white py-2.5 px-4 flex justify-center items-center relative">
                    <a href="tel:+971557430228" className="text-[11px] sm:text-[12px] font-bold tracking-[0.25em] uppercase underline-animate text-center">
                        Helpline +971 55 743 0228
                    </a>
                </div>

                {/* 2. MAIN NAVIGATION */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-6 md:py-8">
                    <div className="grid grid-cols-3 items-center">
                        
                        {/* LEFT: Core Navigation - Increased text to 14px (text-sm) */}
                        <div className="hidden md:flex items-center">
                            <nav className="flex items-center gap-10 lg:gap-14 text-[14px] font-extrabold uppercase tracking-[0.25em] text-stone-900">
                                <Link to='/paintings' className="hover:text-[#A6894B] transition-colors underline-animate">Paintings</Link> 
                                <Link to="/aboutus" className="hover:text-[#A6894B] transition-colors underline-animate">About Us</Link>
                            </nav>
                        </div>

                        {/* MOBILE LEFT: Menu Toggle */}
                        <div className="flex md:hidden items-center">
                            <Menu 
                                size={28} 
                                strokeWidth={2} 
                                className="text-stone-900 cursor-pointer" 
                                onClick={() => navigate('/admin/login')} 
                            />
                        </div>

                        {/* CENTER: Logo - Made branding text larger */}
                        <div onClick={() => navigate('/')} className="flex flex-col items-center justify-center group cursor-pointer">
                            <img src="/translogo.png" alt="Logo" className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                            <span className="text-[13px] sm:text-[15px] tracking-[0.4em] font-black uppercase text-stone-900 mt-2 whitespace-nowrap">
                                MUSAWWIR ART
                            </span>
                        </div>

                        {/* RIGHT: Blog - Pushed to the far right */}
                        <div className="flex items-center justify-end">
                            <nav className="hidden md:block text-[14px] font-extrabold uppercase tracking-[0.25em] text-stone-900">
                                <Link to="/blog" className="hover:text-[#A6894B] transition-colors underline-animate">Blog</Link>
                            </nav>
                            
                            {/* If you add icons back later, they would go here */}
                        </div>
                    </div>

                    {/* 3. MOBILE ONLY NAVIGATION - Larger text for mobile thumbs */}
                    <nav className="flex md:hidden justify-between items-center mt-6 pt-5 border-t border-stone-100 text-[11px] font-black uppercase tracking-[0.2em] text-stone-800 px-2">
                        <div className="flex gap-8">
                            <Link to="/paintings" className="hover:text-[#A6894B]">Paintings</Link>
                            <Link to="/aboutus" className="hover:text-[#A6894B]">About Us</Link>
                        </div>
                        <Link to="/blog" className="text-[#A6894B]">Blog</Link>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;