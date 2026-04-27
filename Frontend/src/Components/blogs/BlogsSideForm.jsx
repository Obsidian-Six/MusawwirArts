
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import PhoneInputPkg from "react-phone-input-2";
const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;
import 'react-phone-input-2/lib/style.css';

const services = [
    "Original Paintings",
    "Custom Commissions",
    "Art Consultation",
    "Limited Edition Prints",
    "Exhibition Inquiry",
    "Portrait Study",
    "Abstract Works",
    "Others",
];

const BlogsSidebarForm = ({ blogTitle }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSubmitted(false);

        const contact = {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            message: `[Interests: ${selectedServices.join(", ")}] ${message}${blogTitle ? ` (Inquiry from blog: ${blogTitle})` : ""}`,
            paintingId: null, // Explicitly null for blog inquiries
            paintingTitle: blogTitle || "General Blog Inquiry",
        };

        try {
            // 1. DATABASE SUBMISSION
            const dbResponse = await fetch(`${API_URL}/inquiries/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact),
            });

            if (!dbResponse.ok) throw new Error("Failed to save inquiry");

            // 2. PREPARE WHATSAPP MESSAGE
            const messageText = `*New Blog Inquiry*\n\n` +
                `*Blog:* ${blogTitle || "General"}\n` +
                `*Collector:* ${contact.name}\n` +
                `*Email:* ${email}\n` +
                `*Phone:* ${phone}\n` +
                `*Interests:* ${selectedServices.join(", ")}\n` +
                `*Message:* ${message}`;

            const whatsappURL = `https://wa.me/971557430228?text=${encodeURIComponent(messageText)}`;

            // 3. SUCCESS STATE & REDIRECT
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setSelectedServices([]);
            setMessage("");
            setIsSubmitting(false);
            setIsSubmitted(true);

            alert("Inquiry recorded! Redirecting to WhatsApp...");
            window.location.href = whatsappURL;

        } catch (err) {
            console.error("Submission error:", err);
            alert("Submission failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 shadow-sm sticky top-32">
            <div className="mb-6">
                <h3 className="text-xl font-serif text-stone-900 mb-2">Artistic Inquiry</h3>
                <p className="text-[11px] text-stone-500 uppercase tracking-widest leading-relaxed">
                    Interested in a piece or a custom commission? Let's begin the dialogue.
                </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleFormSubmit}>
                {/* Compact Name Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1" htmlFor="first-name">
                            First Name
                        </label>
                        <input
                            required
                            className="border border-slate-200 p-2.5 text-xs outline-none w-full focus:border-[#A6894B] transition-all bg-white"
                            id="first-name"
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1" htmlFor="last-name">
                            Last Name
                        </label>
                        <input
                            required
                            className="border border-slate-200 p-2.5 text-xs outline-none w-full focus:border-[#A6894B] transition-all bg-white"
                            id="last-name"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="border border-slate-200 p-2.5 text-xs outline-none w-full focus:border-[#A6894B] transition-all"
                            id="email"
                            type="email"
                            placeholder="abc@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            Phone
                        </label>
                        <PhoneInput
                            country={"in"}
                            value={phone}
                            onChange={(value) => setPhone(value)}
                            inputClass="!border !border-slate-200 !p-2.5 !h-auto !text-xs !w-full !rounded-none"
                            containerClass="!w-full"
                            buttonClass="!border-slate-200 !bg-white"
                        />
                    </div>
                </div>

                {/* Compact Services */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                        I'm interested in
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {services.map((service, index) => {
                            const isSelected = selectedServices.indexOf(service) !== -1;
                            return (
                                <label
                                    key={index}
                                    className={`px-3 py-1.5 text-[9px] font-bold uppercase cursor-pointer border transition-all ${isSelected
                                        ? "bg-[#A6894B] border-[#A6894B] text-white"
                                        : "bg-white border-slate-200 text-slate-500 hover:border-[#A6894B]"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => {
                                            if (!isSelected) setSelectedServices([...selectedServices, service]);
                                            else setSelectedServices(selectedServices.filter((s) => s !== service));
                                        }}
                                    />
                                    {service}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Message */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                        Message
                    </label>
                    <textarea
                        required
                        className="border border-slate-200 p-2.5 text-xs outline-none w-full focus:border-[#A6894B] min-h-[80px] resize-none"
                        placeholder="Share your thoughts or specific requirements..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                {/* THE SUBMIT BUTTON */}
                <div className="pt-2 relative z-50">
                    <button
                        disabled={isSubmitting}
                        className="w-full font-black text-[11px] uppercase tracking-[0.2em] py-4 text-white bg-stone-900 hover:bg-[#A6894B] transition-all flex items-center justify-center gap-2 group shadow-lg active:scale-[0.98]"
                        type="submit"
                    >
                        {isSubmitting ? "Processing..." : (
                            <>
                                Send Inquiry <GoArrowUpRight className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </>
                        )}
                    </button>
                </div>

                {isSubmitted && (
                    <p className="text-green-600 text-[10px] font-bold text-center mt-2 animate-bounce">
                        ENQUIRY SENT SUCCESSFULLY!
                    </p>
                )}
            </form>
        </div>
    );
};

export default BlogsSidebarForm;