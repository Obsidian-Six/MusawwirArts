import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Paintings', path: '/paintings' },
        { name: 'Artist', path: '/artist' },
        { name: 'About Us', path: '/aboutus' },
        { name: 'Blog', path: '/blog' },
    ];

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
                    <a href="tel:+971557430228" className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase underline-animate">
                        <Phone size={12} className="hidden sm:block" />
                        Helpline +971 55 743 0228
                    </a>
                </div>

                {/* 2. MAIN NAVIGATION */}
                <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-24 py-4">
                    <div className="grid grid-cols-3 items-center">
                        
                        {/* LEFT: Desktop Links / Mobile Toggle */}
                        <div className="flex items-center">
                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-8 lg:gap-14 text-[13px] font-bold uppercase tracking-[0.2em] text-gray-800">
                                {navLinks.slice(0, 3).map((link) => (
                                    <Link key={link.path} to={link.path} className="hover:text-[#A6894B] transition-colors underline-animate">
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Toggle Button */}
                            <button onClick={toggleMenu} className="md:hidden p-1 text-gray-700 hover:text-[#A6894B]">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {/* CENTER: Logo */}
                        <div onClick={() => navigate('/')} className="flex flex-col items-center justify-center group cursor-pointer">
                            <img src="/translogo.png" alt="Logo" className="h-9 sm:h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                            <span className="text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.2em] sm:tracking-[0.35em] font-bold uppercase text-gray-900 mt-1 whitespace-nowrap">
                                MUSAWWIR ART
                            </span>
                        </div>

                        {/* RIGHT: Desktop Blog / Mobile Admin */}
                        <div className="flex items-center justify-end">
                            <nav className="hidden md:block text-[13px] font-bold uppercase tracking-[0.2em] text-gray-800">
                                <Link to="/blog" className="hover:text-[#A6894B] transition-colors underline-animate">Blog</Link>
                            </nav>
                            
                            {/* Mobile Shortcut to Admin (Using your logic) */}
                            <button onClick={() => navigate('/admin/login')} className="md:hidden text-[10px] font-bold uppercase text-[#A6894B]">
                                Login
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. MOBILE OVERLAY MENU */}
                <div className={`fixed inset-0 bg-white z-[60] transition-transform duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center p-6 border-b border-gray-50">
                            <span className="font-bold tracking-widest text-gray-900">MENU</span>
                            <X size={24} onClick={toggleMenu} className="text-gray-700 cursor-pointer" />
                        </div>
                        
                        <nav className="flex flex-col p-8 gap-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path} 
                                    onClick={toggleMenu}
                                    className="text-2xl font-light tracking-widest uppercase text-gray-800 hover:text-[#A6894B]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto p-8 bg-gray-50 text-center">
                            <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-4">Contact Our Gallery</p>
                            <a href="tel:+971557430228" className="text-lg font-medium text-[#A6894B]">+971 55 743 0228</a>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;