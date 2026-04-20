import React from 'react';

const SubNav = ({ active }) => {
  const links = [
    { label: "Art Maintenance", href: "/art-maintenance" },
    { label: "FAQ's", href: "/faq" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <div className="w-full border-b border-stone-100 bg-white shadow-sm overflow-x-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <nav className="flex justify-start md:justify-center items-center gap-8 md:gap-16 py-6 min-w-max">
          {links.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className={`text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                active === link.label 
                ? "text-[#B69D6D] border-b border-[#B69D6D]" 
                : "text-stone-400 hover:text-stone-900"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SubNav;
