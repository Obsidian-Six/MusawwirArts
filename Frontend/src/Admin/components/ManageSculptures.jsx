import React, { useState, useEffect } from 'react';

const ManageSculptures = ({ onEdit }) => {
  const [sculptures, setSculptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetchSculptures();
  }, []);

  const fetchSculptures = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sculptures?mode=admin`);
      const result = await response.json();
      let data = result.data || (Array.isArray(result) ? result : []);

      if (Array.isArray(data)) {
        const publishedOnly = data.filter(p => p.status === 'published');
        setSculptures(publishedOnly);
      } else {
        setSculptures([]);
      }
    } catch (error) {
      console.error("Error fetching sculptures:", error);
      setSculptures([]);
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-art.jpg";
    if (path.startsWith('http')) return path;
    const rootUrl = API_URL.split('/api')[0].replace(/\/$/, "");
    const fileName = path.split('\\').pop().split('/').pop();
    return `${rootUrl}/uploads/sculptures/${fileName}`;
  };

  const handleDelete = async (sculptureId) => {
    if (!window.confirm("Are you sure you want to remove this sculpture?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/sculptures/${sculptureId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchSculptures();
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const filteredSculptures = Array.isArray(sculptures)
    ? sculptures.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 p-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">Sculpture Collection</h2>
          <p className="text-stone-400 text-[10px] md:text-xs uppercase tracking-[0.2em]">
            Archiving {sculptures.length} Published Sculptures
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search sculptures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-stone-900 transition-all shadow-sm outline-none font-serif"
          />
        </div>
      </div>

      <div className="bg-white md:rounded-[2.5rem] rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-stone-400 animate-pulse font-serif italic">
            Refining the gallery...
          </div>
        ) : filteredSculptures.length === 0 ? (
          <div className="p-20 text-center text-stone-300 italic">
            No published sculptures match your search.
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-50">
                    <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Sculpture</th>
                    <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Dimensions</th>
                    <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Status</th>
                    <th className="p-8 text-[10px] uppercase tracking-widest text-stone-400 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredSculptures.map((sculpture) => (
                    <tr key={sculpture._id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden shadow-inner flex-shrink-0">
                            <img
                              src={getFullImageUrl(sculpture.imageUrl)}
                              alt={sculpture.title}
                              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                              onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Sculpture+Missing'; }}
                            />
                          </div>
                          <div>
                            <p className="font-serif text-lg text-stone-900 leading-tight">{sculpture.title}</p>
                            <p className="text-[10px] text-stone-400 uppercase tracking-tighter mt-1">{sculpture.material}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <p className="text-[11px] text-stone-500">{sculpture.dimensions}</p>
                        {sculpture.weight && <p className="text-[10px] text-stone-400 mt-1">{sculpture.weight}</p>}
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${sculpture.isAvailable ? 'bg-emerald-500' : 'bg-stone-300'}`}></div>
                          <span className="text-[11px] font-bold uppercase text-stone-500">
                            {sculpture.isAvailable ? 'Available' : 'Sold'}
                          </span>
                        </div>
                      </td>

                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onEdit(sculpture)} className="p-3 text-stone-400 hover:text-stone-900 hover:bg-white rounded-xl transition-all shadow-hover">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                          </button>
                          <button onClick={() => handleDelete(sculpture._id)} className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-stone-100">
              {filteredSculptures.map((sculpture) => (
                <div key={sculpture._id} className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                      <img
                        src={getFullImageUrl(sculpture.imageUrl)}
                        alt={sculpture.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Sculpture+Missing'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-lg text-stone-900 leading-tight">{sculpture.title}</h3>
                        <div className={`w-2 h-2 rounded-full mt-2 ${sculpture.isAvailable ? 'bg-emerald-500' : 'bg-stone-300'}`}></div>
                      </div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{sculpture.material}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-stone-400 font-medium">{sculpture.dimensions}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(sculpture)}
                        className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 active:bg-stone-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sculpture._id)}
                        className="p-2 text-stone-300 hover:text-red-500 active:bg-red-50 rounded-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageSculptures;
