import { useState, useEffect, useRef } from 'react';
import OverviewComponent from './components/OverviewComponent';
import PaintingForm from './components/PaintingForm';
import ManageGallery from './components/ManageGallery';
import ManageInquiries from './components/ManageInquires';
import ManageHomepage from './components/ManageHomePage';
import CategoryManager from './components/CategoryManager';
import EditHomepage from './components/EditHomePage';
import DraftsList from './components/DraftsList';
import AdminTestimonials from './components/Testimonials';
import BlogManager from './components/BlogManager';
import FeaturedCollectionsManager from './components/FeaturedCollectionsManager';
import ChangePassword from './components/ChangePassword';
import SculptureForm from './components/SculptureForm';
import ManageSculptures from './components/ManageSculptures';

import {
  Menu, X, Star, FileText, Plus, LayoutGrid,
  MessageSquare, ChevronLeft, Image, User,
  LogOut, Settings, Palette, Box, Home,
  Layers, Users, Newspaper
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [selectedSculpture, setSelectedSculpture] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  const [stats, setStats] = useState({
    totalPaintings: 0,
    totalInquiries: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleEditClick = (painting) => {
    setSelectedPainting(painting);
    setActiveTab('edit');
    setIsMobileMenuOpen(false);
  };

  const handleSculptureEditClick = (sculpture) => {
    setSelectedSculpture(sculpture);
    setActiveTab('editSculpture');
    setIsMobileMenuOpen(false);
  };

  const handleSaveSuccess = () => {
    setSelectedPainting(null);
    setActiveTab('manage');
    fetchStats();
  };

  const handleSculptureSaveSuccess = () => {
    setSelectedSculpture(null);
    setActiveTab('manageSculptures');
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const navigationGroups = [
    {
      title: "Main",
      items: [
        { id: 'overview', label: 'Spotlight', icon: <Star size={18} /> },
        { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={18} /> },
      ]
    },
    {
      title: "Gallery Management",
      items: [
        { id: 'add', label: 'New Painting', icon: <Plus size={18} /> },
        { id: 'manage', label: 'All Paintings', icon: <Palette size={18} /> },
        { id: 'addSculpture', label: 'New Sculpture', icon: <Plus size={18} /> },
        { id: 'manageSculptures', label: 'All Sculptures', icon: <Box size={18} /> },
        { id: 'manageDrafts', label: 'Drafts', icon: <FileText size={18} /> },
      ]
    },
    {
      title: "Site Content",
      items: [
        { id: 'homepage', label: 'Home Sections', icon: <Home size={18} /> },
        { id: 'edithomePage', label: 'Edit Content', icon: <Layers size={18} /> },
        { id: 'featured', label: 'Collections', icon: <Image size={18} /> },
        { id: 'manageCategory', label: 'Categories', icon: <LayoutGrid size={18} /> },
        { id: 'blog', label: 'Blog Posts', icon: <Newspaper size={18} /> },
        { id: 'testimonials', label: 'Testimonials', icon: <Users size={18} /> },
      ]
    }
  ];


  const Sidebar = ({ activeTab, setActiveTab, setSelectedPainting, setSelectedSculpture, setIsMobileMenuOpen, handleLogout }) => (
    <div className="flex flex-col h-full bg-white lg:bg-transparent">
      <div className="p-8 pb-10">
        <h1 className="text-2xl font-serif tracking-tight text-stone-900">
          Musawwir <span className="italic font-normal text-stone-400">Arts</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mt-2 font-bold">Curator Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {navigationGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="px-4 text-[9px] uppercase tracking-[0.25em] font-black text-stone-300">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'add') setSelectedPainting(null);
                    if (item.id === 'addSculpture') setSelectedSculpture(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-medium
                    ${activeTab === item.id ||
                      (activeTab === 'edit' && item.id === 'manage') ||
                      (activeTab === 'editSculpture' && item.id === 'manageSculptures')
                      ? 'bg-stone-900 text-white shadow-xl shadow-stone-200 scale-[1.02]'
                      : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
                >
                  <span className={`${activeTab === item.id ? 'text-white' : 'text-stone-400 group-hover:text-stone-900'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 mt-6 border-t border-stone-100 bg-stone-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFDFB] text-stone-900 font-sans selection:bg-stone-900 selection:text-white overflow-hidden">

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-stone-100 flex items-center justify-between px-6 z-[60]">
        <div className="flex flex-col">
          <span className="font-serif italic text-xl tracking-tight">Musawwir</span>
          <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-bold">Admin Console</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 border border-stone-200"
          >
            <User size={20} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 bg-stone-900 text-white rounded-xl shadow-lg shadow-stone-200"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[65] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white z-[70] w-80 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-r border-stone-100/50
        lg:translate-x-0 lg:static lg:h-full lg:bg-[#FDFDFB]
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setSelectedPainting={setSelectedPainting} 
          setSelectedSculpture={setSelectedSculpture} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          handleLogout={handleLogout} 
        />

      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top Desktop Bar */}
        <div className="hidden lg:flex items-center justify-between px-12 py-8 bg-[#FDFDFB]/80 backdrop-blur-md border-b border-stone-50 z-[40] flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
              Dashboard / <span className="text-stone-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">System Live</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-4 group p-1 pr-4 rounded-full hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">Curator Admin</p>
                  <p className="text-[9px] uppercase tracking-wider text-stone-400">Security Level 1</p>
                </div>
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-56 bg-white border border-stone-100 shadow-2xl rounded-2xl py-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 py-2 border-b border-stone-50 mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">Settings</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar pt-20 lg:pt-0"
        >


          <div className="max-w-7xl mx-auto p-4 md:p-12">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <OverviewComponent
                  totalPaintings={stats.totalPaintings}
                  pendingInquiries={stats.totalInquiries}
                  recentActivity={stats.recentActivity}
                  loading={loading}
                  onNavigate={(id) => setActiveTab(id)}
                />
              )}

              {/* PAINTING ACTIONS */}
              {activeTab === 'add' && (
                <PaintingForm mode="add" onSaveSuccess={handleSaveSuccess} />
              )}
              {activeTab === 'manage' && (
                <ManageGallery onEdit={handleEditClick} />
              )}
              {activeTab === 'edit' && selectedPainting && (
                <div className="space-y-8">
                  <button
                    onClick={() => setActiveTab('manage')}
                    className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all group"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Paintings
                  </button>
                  <PaintingForm
                    mode="edit"
                    initialData={selectedPainting}
                    onSaveSuccess={handleSaveSuccess}
                  />
                </div>
              )}

              {/* SCULPTURE ACTIONS */}
              {activeTab === 'addSculpture' && (
                <SculptureForm mode="add" onSaveSuccess={handleSculptureSaveSuccess} />
              )}
              {activeTab === 'manageSculptures' && (
                <ManageSculptures onEdit={handleSculptureEditClick} />
              )}
              {activeTab === 'editSculpture' && selectedSculpture && (
                <div className="space-y-8">
                  <button
                    onClick={() => setActiveTab('manageSculptures')}
                    className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all group"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Sculptures
                  </button>
                  <SculptureForm
                    mode="edit"
                    initialData={selectedSculpture}
                    onSaveSuccess={handleSculptureSaveSuccess}
                  />
                </div>
              )}

              {/* SITE MANAGEMENT */}
              {activeTab === 'inquiries' && <ManageInquiries />}
              {activeTab === 'homepage' && <ManageHomepage />}
              {activeTab === 'edithomePage' && <EditHomepage />}
              {activeTab === 'manageCategory' && <CategoryManager />}
              {activeTab === 'featured' && <FeaturedCollectionsManager />}
              {activeTab === 'testimonials' && <AdminTestimonials />}
              {activeTab === 'changepassword' && <ChangePassword />}
              {activeTab === 'manageDrafts' && (
                <DraftsList
                  onEdit={(item, type) => {
                    if (type === 'sculpture') {
                      handleSculptureEditClick(item);
                    } else {
                      handleEditClick(item);
                    }
                  }}
                  API_URL={import.meta.env.VITE_BASE_URL.replace(/\/$/, "")}
                />
              )}
              {activeTab === 'blog' && (
                <BlogManager
                  API_URL={import.meta.env.VITE_BASE_URL.replace(/\/$/, "")}
                />
              )}

            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
    `}} />
    </div>
  );
};

export default AdminDashboard;