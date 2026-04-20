import React, { useState, useEffect } from 'react';
import { Send, Camera, User, Mail, Phone, X } from 'lucide-react';

const ContactForm = ({ onClose, artworkName, paintingId, paintingImage }) => {
  const [animate, setAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 300);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. DATABASE SUBMISSION
      const dbResponse = await fetch(`${API_URL}/inquiries/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paintingId: paintingId,
          paintingTitle: artworkName
        }),
      });

      if (!dbResponse.ok) throw new Error("Failed to save inquiry");

      // 2. PREPARE WHATSAPP MESSAGE
      // Using \n for line breaks and encoding properly
      const messageText = `*New Gallery Inquiry*\n\n` +
                          `*Art Piece:* ${artworkName}\n` +
                          `*Collector:* ${formData.name}\n` +
                          `*Email:* ${formData.email}\n` +
                          `*Phone:* ${formData.phone}\n` +
                          `*Message:* ${formData.message}`;
      
      const whatsappURL = `https://wa.me/971557430228?text=${encodeURIComponent(messageText)}`;

      // 3. REDIRECT LOGIC
      // We alert the user first, then redirect. 
      // Using window.location.href is more reliable than window.open for "redirects"
      alert("Inquiry recorded! Redirecting you to WhatsApp to finalize your request...");
      
      // Redirect to WhatsApp
      window.location.href = whatsappURL;

    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-stone-900">
      <div 
        className={`relative w-full max-w-5xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.25)] flex flex-col md:flex-row overflow-hidden transition-all duration-700 ease-out transform ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.95]'
        }`}
      >
        <button 
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-black z-50 p-2 transition-all hover:rotate-90"
        >
          <X size={22} />
        </button>

        {/* Left Side Branding */}
        <div className="md:w-1/3 relative bg-stone-900 hidden md:block">
          <img 
            src={paintingImage || "/Admin_side.jpeg"} 
            alt={artworkName || "Art Gallery"} 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10">
            <p className="text-[#A6894B] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Exclusive</p>
            <h2 className="text-white text-3xl font-serif italic">Acquisition</h2>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-2/3 p-8 md:p-12 lg:px-16 lg:py-10 flex flex-col justify-center bg-white">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl text-stone-900 font-serif tracking-tight">
              Gallery Inquiry
            </h1>
            <p className="text-stone-500 text-xs font-sans mt-2 tracking-wide">
              Requesting details for: <span className="text-stone-900 font-bold">{artworkName}</span>
            </p>
          </header>

          <form className="space-y-8 font-sans" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              
              {/* Read-Only Artwork Field */}
              <div className="relative border-b border-stone-200 py-1 transition-colors group opacity-60">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-800 font-bold block mb-1">
                  Selected Artwork
                </label>
                <div className="flex items-center">
                  <span className="text-[#A6894B] mr-3"><Camera size={14}/></span>
                  <input 
                    type="text"
                    value={artworkName}
                    readOnly
                    tabIndex="-1"
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-stone-900 p-0 font-medium cursor-default focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Map for Inputs */}
              {[
                { label: "Your Name", icon: <User size={14}/>, placeholder: "Full Name", type: "text", key: 'name' },
                { label: "Email Address", icon: <Mail size={14}/>, placeholder: "Email", type: "email", key: 'email' },
                { label: "Phone", icon: <Phone size={14}/>, placeholder: "Phone", type: "tel", key: 'phone' }
              ].map((field) => (
                <div key={field.key} className="relative border-b border-stone-200 py-1 hover:border-[#A6894B] transition-colors group focus-within:border-[#A6894B]">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-stone-800 font-bold block mb-1">
                    {field.label}
                  </label>
                  <div className="flex items-center">
                    <span className="text-[#A6894B] mr-3">{field.icon}</span>
                    <input 
                      required
                      type={field.type}
                      name={field.key}
                      value={formData[field.key]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-stone-900 p-0 placeholder:text-stone-300 font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Message Textarea */}
            <div className="relative border-b border-stone-200 py-1 hover:border-[#A6894B] transition-colors focus-within:border-[#A6894B]">
              <label className="text-[10px] uppercase tracking-[0.2em] text-stone-800 font-bold block mb-1">Message</label>
              <textarea 
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="1"
                placeholder={`I am interested in acquiring "${artworkName}"...`}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-stone-900 p-0 placeholder:text-stone-300 resize-none min-h-[40px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`group relative w-full md:w-auto bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-4 transition-all duration-500 overflow-hidden shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? 'Processing...' : 'Send Request'} 
                  {!isSubmitting && <Send size={12} className="group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-[#A6894B] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;