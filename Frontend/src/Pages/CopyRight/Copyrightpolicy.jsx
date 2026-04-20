import React from 'react';
import SubNav from '../../Components/SubNav';

const CopyrightPolicy = () => {
  const sections = [
    { id: "ownership", title: "1. Ownership & IP" },
    { id: "scope", title: "2. Scope of Protection" },
    { id: "prohibited", title: "3. Prohibited Uses" },
    { id: "confidentiality", title: "4. Photos & Privacy" },
    { id: "acquisition", title: "5. Private Acquisition" },
    { id: "permitted", title: "6. Permitted Exceptions" },
    { id: "dmca", title: "7. DMCA & Takedown" },
    { id: "consequences", title: "8. Infringement Results" },
    { id: "trademarks", title: "9. Brand & Trademarks" },
    { id: "governing", title: "10. Law & Jurisdiction" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-[#F9F8F6] pt-32 pb-24 px-6 md:px-12 text-center border-b border-stone-100">
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tight">Copyright & IP</h1>
        <p className="mt-4 text-stone-500 uppercase tracking-[0.4em] text-[11px] font-bold">Official Usage Policy</p>
      </div>

      <SubNav active="Copyright" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 pt-24 pb-20 px-6 md:px-12 lg:px-24">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block w-72 shrink-0 h-fit sticky top-32">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-900 mb-6 pb-2 border-b border-stone-200">Legal Index</h4>
          <nav className="flex flex-col gap-4 text-[14px] text-stone-400">
            {sections.map(sec => (
              <a key={sec.id} href={`#${sec.id}`} className="hover:text-stone-900 transition-colors border-l-2 border-transparent hover:border-stone-900 pl-4 py-1">
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Section */}
        <main className="flex-grow">
          <header className="mb-16 border-b border-stone-100 pb-12">
            <div className="flex items-center gap-4 mb-8">
                <img src="/translogo.png" alt="Logo" className="h-6 opacity-80" />
                <span className="h-4 w-[1px] bg-stone-300"></span>
                <span className="text-stone-500 font-bold tracking-[0.2em] text-[10px] uppercase">MUSAWWIR ART</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif italic text-stone-900 mb-6 leading-tight">
                Copyright, Intellectual Property & Usage Policy
            </h1>
            <div className="flex flex-col gap-2 text-stone-900 font-serif italic text-lg mb-4">
                <p>www.musawwirart.com</p>
                <p>– Fine Art & Luxury Paintings –</p>
            </div>
            <div className="flex flex-wrap gap-4 text-stone-400 text-sm font-medium uppercase tracking-widest">
                <span>Effective Date: 2024</span>
                <span className="hidden md:inline">|</span>
                <span>All Rights Reserved</span>
            </div>
          </header>

          <div className="prose prose-stone max-w-none text-[16px] md:text-[17px] leading-relaxed text-stone-700 font-normal space-y-20">
            
            {/* 1. Ownership */}
            <section id="ownership" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">1. Ownership of Artwork & Intellectual Property</h2>
              <p>
                All paintings, artworks, illustrations, sketches, drafts, visual compositions, and creative works displayed on the Musawwir Art website (<strong>www.musawwirart.com</strong>) — including their digital representations, photographs, and reproductions — are the exclusive intellectual property of <strong>Musawwir Art</strong> and its affiliated artists.
              </p>
              <p>
                These works are protected under applicable copyright law, including but not limited to the <strong>Indian Copyright Act, 1957</strong>, and relevant international copyright conventions, including the Berne Convention for the Protection of Literary and Artistic Works.
              </p>
              <p>
                Musawwir Art retains full and sole ownership of all moral rights, reproduction rights, distribution rights, display rights, and derivative work rights in connection with every artwork featured on this website or in any associated materials. No transfer of any intellectual property right is implied, granted, or inferred by the mere display or viewing of these works online.
              </p>
            </section>

            {/* 2. Scope */}
            <section id="scope" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">2. Scope of Copyright Protection</h2>
              <p>The copyright protection applicable to Musawwir Art's collection extends comprehensively to all of the following:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none !pl-0">
                {[
                    "Original paintings (oil, acrylic, watercolour, mixed media)",
                    "High and low-resolution digital photographs of all artworks",
                    "Cropped, edited, or stylistically altered versions",
                    "Artist sketches, preparatory studies, and work-in-progress",
                    "Titles, descriptions, narratives, and associated text",
                    "Overall design, layout, and visual identity of the website",
                    "Promotional content, catalogue materials, and social media posts"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px] bg-stone-50 p-4 rounded-sm border border-stone-100">
                        <span className="text-stone-300 font-serif">›</span> {item}
                    </li>
                ))}
              </ul>
              <p className="bg-stone-900 text-stone-100 p-8 rounded-sm text-sm italic leading-loose">
                Musawwir Art's collection includes works of significant artistic and commercial value, with individual pieces valued from several lakhs of Indian Rupees to substantially higher amounts. The rarity, craftsmanship, and exclusivity of these works demand a correspondingly high level of legal protection.
              </p>
            </section>

            {/* 3. Prohibited Uses */}
            <section id="prohibited" className="space-y-8 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">3. Prohibited Uses — Strictly Enforced</h2>
              <p className="font-bold text-stone-900">
                No individual, organisation, business entity, media house, digital platform, social media account, or any third party is permitted to engage in any of the following activities without obtaining prior express written authorisation from Musawwir Art:
              </p>
              <div className="space-y-3 text-[15px]">
                {[
                    "Reproducing, copying, printing, or duplicating any artwork image in any form or medium",
                    "Publishing or displaying artwork images on any website, blog, social media page, or digital platform",
                    "Downloading, saving, or storing digital copies of artwork photographs for any purpose",
                    "Using artwork images in advertising, marketing campaigns, or promotional materials",
                    "Incorporating artwork images into merchandise, products, textiles, or commercial goods",
                    "Creating derivative works, adaptations, or artistic recreations based on Musawwir Art's works",
                    "Editing, cropping, filtering, digitally altering, or manipulating artwork photographs",
                    "Sharing or forwarding artwork images through messaging applications, emails, or digital channels",
                    "Displaying artworks in exhibitions, galleries, or public spaces without prior written consent",
                    "Using artwork images in educational, academic, or research materials without authorisation",
                    "Uploading artwork photographs to AI training datasets, image recognition systems, or any machine learning models"
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 border-b border-stone-50 pb-3">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0"></div>
                        <span>{item}</span>
                    </div>
                ))}
              </div>
              <p className="text-sm font-bold text-red-900 bg-red-50 p-5 border border-red-100 italic">
                Any unauthorised use of Musawwir Art's intellectual property — whether for commercial gain or otherwise — constitutes a serious infringement of copyright and shall be treated with the utmost legal seriousness. Musawwir Art reserves the right to pursue all available legal remedies, including civil claims for damages, injunctions, and, where applicable, criminal proceedings.
              </p>
            </section>

            {/* 4. Confidentiality */}
            <section id="confidentiality" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">4. Artwork Photographs — Confidentiality & Privacy</h2>
              <p>
                The photographs and digital representations of artworks available on this website are shared exclusively for the purpose of informing prospective collectors and art enthusiasts about Musawwir Art's portfolio. They are <strong>NOT</strong> in the public domain and must <strong>NOT</strong> be treated as freely available imagery.
              </p>
              <p>
                These images are private, confidential visual records of highly valuable physical artworks. Their distribution, sharing, or replication outside the authorised channels of Musawwir Art is strictly prohibited. Visitors to this website are trusted to view these images solely for personal appreciation and legitimate enquiry purposes.
              </p>
              <p>
                Musawwir Art takes the privacy and security of its artwork photography with the highest seriousness and actively monitors the digital environment for any unauthorised use or distribution of its visual content.
              </p>
            </section>

            {/* 5. Sale Requests */}
            <section id="acquisition" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">5. Artwork Available for Sale — On Request Only</h2>
              <p>
                The artworks showcased on this website and in Musawwir Art's portfolio are available for acquisition exclusively on a <strong>private, by-request basis</strong>. These works are NOT listed for open or public sale. The display of any artwork on this website does not constitute a public offer of sale.
              </p>
              <p>
                All purchase enquiries, commission requests, and acquisition discussions are handled with complete confidentiality and are conducted directly with Musawwir Art's representatives. Each transaction is private and tailored to the individual collector.
              </p>
              <div className="bg-stone-50 p-6 rounded-sm border border-stone-200 text-sm font-bold text-stone-800">
                 For artwork purchase enquiries or sale requests, please contact us at: <br/> 
                 www.musawwirart.com | musawwirart1@gmail.com | +971 55 743 0228
              </div>
            </section>

            {/* 6. Permitted Exceptions */}
            <section id="permitted" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">6. Permitted Use — Limited Exceptions</h2>
              <p>Strictly limited and non-commercial use of Musawwir Art’s content may be permissible only in the following circumstances, and only when accompanied by full and accurate attribution:</p>
              <ul className="list-disc pl-6 space-y-4 font-medium text-stone-800">
                <li>Personal, non-commercial reference for individual collectors or art appreciators, where no reproduction or distribution is involved.</li>
                <li>Genuine journalistic or editorial coverage of Musawwir Art, subject to prior written approval from Musawwir Art.</li>
                <li>Academic research or art criticism, provided that use is minimal, appropriately attributed, and does not substitute for viewing the original work.</li>
              </ul>
              <div className="bg-stone-50 p-6 rounded-sm border border-stone-200">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-stone-400">Mandatory Credit Line:</p>
                <p className="text-stone-900 font-mono text-sm bg-white p-4 border border-stone-100">
                    © Musawwir Art. All Rights Reserved. www.musawwirart.com
                </p>
              </div>
            </section>

            {/* 7. DMCA */}
            <section id="dmca" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">7. Digital Millennium Copyright Act (DMCA) & Takedown</h2>
              <p>
                Musawwir Art actively enforces its intellectual property rights across all digital platforms. If you become aware of any unauthorised use or distribution of Musawwir Art's content on any website, social media platform, or digital channel, you are encouraged to notify us immediately.
              </p>
              <p>
                Additionally, if you believe that content on this website infringes upon your intellectual property rights, please submit a formal written notice to Musawwir Art containing full details of the alleged infringement, including the specific content in question and the nature of your ownership claim.
              </p>
            </section>

            {/* 8. Consequences */}
            <section id="consequences" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">8. Consequences of Infringement</h2>
              <p>
                Musawwir Art takes all instances of intellectual property infringement with the utmost seriousness. Any unauthorised use, reproduction, or distribution of Musawwir Art’s artwork or website content may result in one or more of the following actions:
              </p>
              <ul className="list-decimal pl-6 space-y-3 font-medium">
                <li>Formal legal notice and demand for immediate cessation of infringing activity.</li>
                <li>Civil claims for compensation, including claims for loss of earnings, reputational damage, and punitive damages.</li>
                <li>Application for injunctive relief to prevent ongoing or anticipated infringement.</li>
                <li>Referral to relevant intellectual property enforcement authorities.</li>
                <li>Criminal complaint where the infringement constitutes an offence under applicable law.</li>
              </ul>
            </section>

            {/* 9. Brand Assets */}
            <section id="trademarks" className="space-y-6 scroll-mt-32">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">9. Website Content & Trademarks</h2>
              <p>
                All content published on the Musawwir Art website, including but not limited to written descriptions, artist biographies, pricing information, collection narratives, logos, brand names, and visual design elements, is the proprietary property of Musawwir Art and is protected by applicable intellectual property law.
              </p>
              <p>
                The name <strong>'Musawwir Art'</strong>, its logo, and associated brand identifiers are trademarks of Musawwir Art. Their use in any context without prior written authorisation is strictly prohibited.
              </p>
            </section>

            {/* 10. Governing Law */}
            <section id="governing" className="space-y-6 scroll-mt-32 border-b border-stone-100 pb-16">
              <h2 className="text-2xl font-serif italic text-stone-900 border-b border-stone-100 pb-3">10. Governing Law & Jurisdiction</h2>
              <p>
                This Copyright, Intellectual Property & Usage Policy shall be governed by and construed in accordance with the laws of <strong>India</strong>, including the Indian Copyright Act, 1957, the Trade Marks Act, 1999, and all other applicable statutes and regulations.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the competent courts of <strong>India</strong>.
              </p>
            </section>

            {/* Contact Details */}
            <section className="space-y-10 pt-10 pb-20">
              <div className="text-center">
                <h3 className="text-3xl font-serif text-stone-900 mb-2">Acquisition & Permissions</h3>
                <p className="text-stone-500">For all copyright-related enquiries, permissions, or artwork acquisition requests, please contact:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#F9F8F6] p-10 rounded-sm border border-stone-100">
                <div className="space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">Official Channels</p>
                    <div className="space-y-4">
                        <p className="text-sm">Email: <span className="text-stone-900 font-medium font-serif italic">musawwirart1@gmail.com</span></p>
                        <p className="text-sm">Phone: <span className="text-stone-900 font-medium">+971 55 743 0228</span></p>
                        <p className="text-sm">Web: <span className="text-stone-900 font-medium">www.musawwirart.com</span></p>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">Legal Residence</p>
                    <div className="text-stone-900 font-medium">
                        <p>Musawwir Art</p>
                        <p className="text-stone-500 font-normal mt-1 text-sm italic leading-relaxed">
                            Luxury Art & Fine Paintings. <br/>
                            Curated Excellence.
                        </p>
                    </div>
                </div>
              </div>
              <p className="text-center text-[11px] text-stone-400 font-bold uppercase tracking-[0.4em] pt-12">
                © 2024 Musawwir Art. All Rights Reserved.
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CopyrightPolicy;