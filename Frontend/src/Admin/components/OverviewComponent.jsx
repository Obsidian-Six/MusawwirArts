import React from 'react';

const OverviewComponent = ({ 
  totalPaintings = 0, 
  pendingInquiries = 0, 
  recentActivity = [], 
  loading = false,
  onNavigate 
}) => {
  
  // Identify the latest masterpiece for the spotlight
  const spotlight = recentActivity.length > 0 ? recentActivity[0] : null;

  // Image URL Helper (Matches your other components)
  const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200";
    if (path.startsWith('http')) return path;
    const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
    const rootUrl = API_URL.split('/api')[0].replace(/\/$/, "");
    const fileName = path.split('\\').pop().split('/').pop();
    return `${rootUrl}/uploads/paintings/${fileName}`;
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 1. ELEGANT WELCOME HEADER */}
      <header className="text-center space-y-2 max-w-2xl mx-auto pt-2 flex-shrink-0">
        <span className="text-[9px] bg-stone-100 px-4 py-1.5 rounded-full uppercase tracking-[0.4em] text-stone-500 font-bold">
          Curator's Console
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 italic tracking-tight">
          Welcome back, Curator.
        </h2>
        <p className="text-stone-700 tracking-[0.2em] uppercase text-[11px] md:text-[13px]">
          Your digital sanctuary currently holds <span className="text-stone-900 font-bold">{totalPaintings} Masterpieces</span>.
        </p>
        <div className="h-px w-16 bg-stone-200 mx-auto mt-4"></div>
      </header>

      {/* 2. THE ART SPOTLIGHT CARD */}
      <div className="flex-1 my-6 min-h-0">
        <div className="h-full relative group overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-white shadow-2xl border border-stone-100/50">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-stone-50">
               <div className="text-center space-y-4">
                 <div className="w-12 h-12 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
                 <p className="text-[10px] uppercase tracking-widest text-stone-400">Curating Spotlight...</p>
               </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row h-full">
              
              {/* Image Section */}
              <div className="h-1/2 lg:h-full lg:w-3/5 relative overflow-hidden bg-stone-100">
                <img 
                  src={getFullImageUrl(spotlight?.imageUrl)} 
                  alt={spotlight?.title || "Spotlight Art"} 
                  className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110 ease-out grayscale-[0.2] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Floating Badge for New Arrivals */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-stone-900">Recently Published</p>
                </div>
              </div>

              {/* Text Section */}
              <div className="h-1/2 lg:h-full lg:w-2/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-hidden relative">
                <div className="space-y-4 md:space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-amber-500"></span>
                    <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.3em]">
                      Featured Creation
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-stone-900 leading-tight">
                    {spotlight?.title || "No Recent Works"} <br /> 
                    <span className="italic text-stone-400 text-2xl lg:text-3xl">
                      {spotlight?.category || "The Gallery Awaits"}
                    </span>
                  </h3>
                  
                  {spotlight?.description && (
                    <p className="hidden md:line-clamp-3 text-stone-600 text-sm leading-relaxed italic font-serif border-l-2 border-stone-100 pl-6">
                      "{spotlight.description}"
                    </p>
                  )}

                  <div className="pt-2 md:pt-4">
                    <button 
                      onClick={() => onNavigate('manage')}
                      className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900"
                    >
                      <span className="border-b-2 border-stone-900 pb-1 group-hover:text-stone-500 group-hover:border-stone-200 transition-all">
                        Explore Full Collection
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
                
                {/* Subtle Watermark Background */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] select-none">
                   <h1 className="text-[120px] font-serif italic">M</h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. OPTIONAL: PENDING INQUIRIES NOTIFICATION BAR (Small footer) */}
      {pendingInquiries > 0 && (
        <div 
          onClick={() => onNavigate('inquiries')}
          className="mb-2 bg-stone-900 text-white p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-black transition-colors animate-bounce shadow-xl"
        >
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">New Collector Inquiries</span>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-serif italic">{pendingInquiries} Pending</span>
        </div>
      )}
    </div>
  );
};

export default OverviewComponent;