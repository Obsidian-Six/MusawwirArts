import React from 'react';
import FAQSection from './FAQsection';

const AboutUs = () => {
    const imageSrc = "/Client_images/Weight_Of_Moments.jpg";

    return (
        <main className="bg-white min-h-screen">
            {/* 1. Page Header */}
            <header className="py-12 md:py-20 text-center">
                <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight">
                    About Us
                </h1>
            </header>

            {/* 2. Full-Width Image Section */}
            <section className="relative w-full overflow-hidden">
                <div className="w-screen max-w-none ml-[50%] -translate-x-[50%] h-[400px] md:h-[600px]">
                    <img
                        src={imageSrc}
                        alt="Weight of Moments Exhibition"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                {/* 3. Narrative Content Section */}
                <div className="space-y-8 md:space-y-10 text-slate-800">
                    <p className="text-base md:text-lg leading-relaxed font-light">
                        Musawwir Art was founded on the belief that masterpiece-level art should be accessible to those who truly appreciate it.
                        We serve as a bridge for distinguished contemporary artists, providing them a stage that transcends geographical
                        boundaries. Our mission is to curate a space where the profound talent of senior artists meets the discerning eye
                        of the global collector.
                    </p>

                    <p className="text-base md:text-lg leading-relaxed font-light">
                        We recognize that building a collection is a deeply personal journey. Whether you are curating for a private
                        residence, a corporate boardroom, or a legacy portfolio, we simplify the process through bespoke
                        <span className="border-b border-slate-900 font-medium mx-1 cursor-pointer hover:text-[#B69D6D] hover:border-[#B69D6D] transition-colors">
                            art advisory
                        </span>
                        and consulting services. By handling the complexities of authentication and acquisition, we allow you to
                        remain focused on the pure experience of the art itself.
                    </p>

                    <p className="text-lg md:text-xl leading-relaxed italic font-serif text-slate-600 border-l-2 border-[#B69D6D] pl-6 py-1">
                        "True artistic satisfaction comes from an honest attempt at expression. Our purpose is to ensure that honesty is witnessed by the world."
                    </p>
                </div>

                {/* 4. Testimonial / Quote Section - Reduced spacing here */}
                <div className="mt-16 md:mt-20 pt-12 border-t border-slate-100 text-center">
                    <div className="flex justify-center mb-2">
                        <span className="text-5xl text-[#B69D6D]/30 font-serif">“</span>
                    </div>

                    <blockquote className="text-xl md:text-2xl font-serif italic text-slate-700 max-w-2xl mx-auto leading-relaxed">
                        "The collection at Musawwir Art is a testament to the enduring power of heritage. Each piece tells a story that resonates far beyond the canvas."
                    </blockquote>

                    <div className="mt-10 md:mt-14 flex flex-col items-center">
                        <div className="mb-4">
                            <img
                                src="/translogo.png"
                                alt="Musawwir Art Logo"
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>

                        <div className="w-8 h-[1px] bg-[#B69D6D] mb-4"></div>

                        <p className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[12px] font-bold text-slate-900">
                            Musawwir Art Gallery
                        </p>
                        <p className="text-slate-400 text-[9px] md:text-[10px] uppercase tracking-widest mt-1">
                            Curating Excellence
                        </p>
                    </div>
                </div>
            </section>
            <FAQSection/>
        </main>
    );
};

export default AboutUs;