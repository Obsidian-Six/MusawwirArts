import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion, ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What defines the Musawwir aesthetic?",
      answer: "Our collection is a dialogue between classical Islamic geometry and modern minimalism. We focus on 'Musawwir' (The Fashioner), bringing spiritual depth to living spaces through intricate calligraphy and sacred patterns."
    },
    {
      question: "Are these original hand-painted works?",
      answer: "We offer both original commissioned canvases and museum-grade fine art prints. Each print is reproduced with high-fidelity pigment inks to ensure the gold leaf textures and ink strokes feel authentic to the touch."
    },
    {
      question: "What is the quality of the materials?",
      answer: "We use heavyweight 100% cotton acid-free canvas and archival inks. This ensures that the spiritual beauty of your piece remains vibrant and resistant to fading for over 75 years."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-20 bg-white text-[#1a1a1a]">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircleQuestion size={32} strokeWidth={1.5} className="text-[#A6894B]" />
        <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight">What is Musawwir?</h2>
      </div>

      {/* Overlapping Avatar Group (Artists/Team) */}
      <div className="flex items-center -space-x-4 mb-10">
        {[
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
        ].map((url, i) => (
          <img
            key={i}
            src={url}
            alt="Musawwir Artist"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white object-cover shadow-sm"
          />
        ))}
      </div>

      {/* Description Text */}
      <div className="max-w-2xl mb-12 space-y-6">
        <p className="text-lg md:text-xl leading-relaxed text-stone-700">
          At Musawwir, we believe art is a form of Dhikr. Our mission is to transform modern homes into sanctuaries of reflection through <a className="text-[#A6894B]  decoration-1 underline-offset-4 hover:text-[#8a6f3a] transition-colors">hand-crafted Islamic art</a> that honors tradition without compromising on modern design.
        </p>
        <p className="text-stone-500 italic">
          Seeking a bespoke piece? <a  className="text-[#A6894B]  decoration-1 underline-offset-4 font-medium">Connect with our calligraphy masters</a>
        </p>
      </div>

      {/* Accordion / FAQ Section */}
      <div className="border-t border-stone-200">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-stone-200">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full py-6 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors group"
            >
              <span className="font-bold text-[13px] md:text-[15px] tracking-[0.1em] uppercase group-hover:text-[#A6894B] transition-colors duration-300">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown size={20} className="text-stone-400" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-8 text-stone-600 leading-relaxed max-w-2xl text-[15px] md:text-base">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;