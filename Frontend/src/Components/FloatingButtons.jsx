import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButtons = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="fixed bottom-8 right-6 z-[9999] flex flex-col gap-4">
            <AnimatePresence>
                {/* Scroll to Top Button */}
                {isVisible && (
                    <motion.button
                        key="scroll-to-top" // ADDED UNIQUE KEY
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="w-12 h-12 md:w-14 md:h-14 bg-[#A6894B] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#8e7540] transition-colors duration-300"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={24} strokeWidth={2.5} />
                    </motion.button>
                )}

                {/* WhatsApp Button */}
                <motion.a
                    key="whatsapp-link" // ADDED UNIQUE KEY
                    href="https://wa.me/+971557430228"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
                    aria-label="Contact on WhatsApp"
                >
                    <FaWhatsapp size={28} fill="currentColor" />
                </motion.a>
            </AnimatePresence>
        </div>
    );
};

export default FloatingButtons;