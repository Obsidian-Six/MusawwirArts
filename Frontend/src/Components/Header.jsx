import React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .underline-animate {
                    position: relative;
                    display: inline-block;
                    cursor: pointer;
                }
                .underline-animate::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 1.5px;
                    bottom: -2px;
                    left: 0;
                    background-color: currentColor;
                    transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .underline-animate:hover::after {
                    width: 100%;
                }
            `}} />

            <header className="w-full bg-white font-sans border-b border-gray-100 relative z-50">
                {/* 1. TOP GOLD BAR */}
                <div className="bg-[#A6894B] text-white py-2 px-4 flex justify-center items-center relative">
                    <a href="tel:+971557430228" className="text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase underline-animate text-center">
                        Helpline +971 55 743 0228
                    </a>
                </div>

                {/* 2. MAIN NAVIGATION CONTAINER */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-3 md:py-3">
                    <div className="grid grid-cols-3 md:grid-cols-[1.5fr_auto_1.5fr] items-center gap-2 md:gap-4">

                        {/* LEFT: Desktop Nav */}
                        <div className="hidden md:flex items-center">
                            <nav className="flex items-center gap-8 lg:gap-14 text-[13px] font-bold uppercase tracking-[0.2em] text-gray-800">
                                <Link to='/paintings' className="hover:text-[#A6894B] transition-colors underline-animate">Paintings</Link>
                                <Link to='/sculptures' className="hover:text-[#A6894B] transition-colors underline-animate">Sculptures</Link>
                                <Link to="/aboutus" className="hover:text-[#A6894B] transition-colors underline-animate">About Us</Link>
                            </nav>
                        </div>

                        {/* MOBILE LEFT: Menu Toggle */}
                        <div className="flex md:hidden items-center">
                            <Menu
                                size={22}
                                strokeWidth={1.5}
                                className="text-gray-700 cursor-pointer"
                                onClick={() => navigate('/admin/login')}
                            />
                        </div>

                        {/* CENTER: Logo */}
                        <div onClick={() => navigate('/')} className="flex flex-col items-center justify-center group cursor-pointer">
                            <img src="/translogo.png" alt="Logo" className="h-8 sm:h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                            <span className="text-[9px] sm:text-[11px] md:text-[12px] tracking-[0.2em] sm:tracking-[0.35em] font-bold uppercase text-gray-900 mt-1 whitespace-nowrap underline-animate">
                                MUSAWWIR ART
                            </span>
                        </div>

                        {/* RIGHT: Blog Link Pinned Right */}
                        <div className="flex items-center justify-end text-gray-800">
                            <nav className="hidden md:flex items-center gap-8 lg:gap-14 text-[13px] font-bold uppercase tracking-[0.2em]">
                                <Link to='/artist' className="hover:text-[#A6894B] transition-colors underline-animate">Artist</Link>
                                <Link to="/blog" className="hover:text-[#A6894B] transition-colors underline-animate">Blog</Link>
                            </nav>
                        </div>
                    </div>

                    {/* 3. MOBILE ONLY NAVIGATION */}
                    {/* 3. MOBILE ONLY NAVIGATION */}
                    <nav className="flex md:hidden justify-center items-center mt-4 pt-3 border-t border-gray-50 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                        <div className="flex flex-wrap gap-5 sm:gap-8 justify-center">
                            <Link to="/paintings" className="hover:text-[#A6894B]">Paintings</Link>
                            <Link to="/sculptures" className="hover:text-[#A6894B]">Sculptures</Link>
                            <Link to="/artist" className="hover:text-[#A6894B]">Artist</Link>
                            <Link to="/aboutus" className="hover:text-[#A6894B]">About Us</Link>
                            <Link to="/blog" className="hover:text-[#A6894B]">Blog</Link>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;