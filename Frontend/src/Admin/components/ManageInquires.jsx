import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, Mail, Phone, User, MessageSquare } from 'lucide-react';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/inquiries/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        // Sorting by newest first
        const sortedData = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInquiries(sortedData);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });
      
      if (response.ok) {
        fetchInquiries();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry permanently? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 min-h-screen bg-stone-50/30 font-sans">
      
      {/* HEADER */}
      <div className="mb-10 border-b border-stone-200 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-stone-900 italic">Collector Inquiries</h2>
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] mt-2 font-bold">
            {inquiries.length} Messages in Registry
          </p>
        </div>
        <button 
          onClick={fetchInquiries}
          className="text-stone-400 hover:text-stone-900 text-[10px] uppercase tracking-widest font-bold transition-colors"
        >
          Refresh List
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-400 font-serif italic text-sm">Accessing Gallery Records...</p>
          </div>
        ) : inquiries.length > 0 ? (
          inquiries.map((inq) => (
            <div 
              key={inq._id} 
              className={`group bg-white border transition-all duration-500 rounded-lg overflow-hidden ${
                inq.status === 'completed' 
                  ? 'border-stone-100 opacity-60 grayscale-[0.5]' 
                  : 'border-stone-200 shadow-sm hover:shadow-xl hover:border-stone-300'
              }`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  
                  {/* DATA COLUMN */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        inq.status === 'completed' ? 'bg-stone-100 text-stone-400' : 'bg-stone-900 text-white'
                      }`}>
                        {inq.status === 'completed' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                        {inq.status || 'Pending'}
                      </div>
                      <span className="text-stone-400 text-[10px] font-medium tracking-wide">
                        Received: {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-stone-900">
                          <User size={14} className="text-[#A6894B]" />
                          <h4 className="text-lg font-serif italic leading-none">{inq.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-stone-500 pl-5 text-sm">
                          <Mail size={12} />
                          <a href={`mailto:${inq.email}`} className="hover:text-stone-900 transition-colors">{inq.email}</a>
                        </div>
                        {inq.phone && (
                          <div className="flex items-center gap-2 text-stone-500 pl-5 text-sm">
                            <Phone size={12} />
                            <span>{inq.phone}</span>
                          </div>
                        )}
                      </div>

                      {inq.paintingTitle && (
                        <div className="md:text-right">
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Interest in</p>
                          <p className="text-sm font-serif italic text-stone-900">"{inq.paintingTitle}"</p>
                        </div>
                      )}
                    </div>

                    <div className="relative bg-stone-50 p-5 rounded border border-stone-100 group-hover:bg-white transition-colors duration-500">
                      <MessageSquare size={14} className="absolute -top-2 -left-2 text-stone-200" />
                      <p className="text-stone-700 text-sm leading-relaxed font-sans italic">
                        {inq.message}
                      </p>
                    </div>
                  </div>

                  {/* ACTION COLUMN */}
                  <div className="flex flex-row lg:flex-col gap-3 justify-end lg:justify-start lg:min-w-[180px] lg:border-l lg:border-stone-100 lg:pl-8">
                    {inq.status !== 'completed' ? (
                      <button 
                        onClick={() => markAsCompleted(inq._id)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-3 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-[#A6894B] transition-all duration-300 active:scale-95"
                      >
                        <CheckCircle size={14} />
                        Resolve
                      </button>
                    ) : (
                      <div className="hidden lg:flex items-center justify-center py-3 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                        Handled
                      </div>
                    )}
                    
                    <button 
                      onClick={() => deleteInquiry(inq._id)}
                      className="flex items-center justify-center gap-2 border border-stone-200 text-stone-400 px-5 py-3 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300 active:scale-95"
                    >
                      <Trash2 size={14} />
                      Archive
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border-2 border-dashed border-stone-200 py-32 text-center rounded-xl">
            <div className="mb-4 flex justify-center">
              <MessageSquare size={40} className="text-stone-200" />
            </div>
            <h3 className="text-stone-900 font-serif italic text-xl">The Gallery is Quiet</h3>
            <p className="text-stone-400 text-xs uppercase tracking-widest mt-2 font-bold">No current collector inquiries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInquiries;