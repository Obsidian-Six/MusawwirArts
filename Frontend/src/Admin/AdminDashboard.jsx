import { useState, useEffect } from 'react';
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

import { Menu, X, Star,FileText, Plus, LayoutGrid, MessageSquare, ChevronLeft, Image, User } from 'lucide-react';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
  }, [activeTab]);

  const handleEditClick = (painting) => {
    setSelectedPainting(painting);
    setActiveTab('edit');
    setIsMobileMenuOpen(false); // Close menu on mobile after selection
  };

  const handleSaveSuccess = () => {
    setSelectedPainting(null);
    setActiveTab('manage');
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const navItems = [
    { id: 'overview', label: 'Spotlight', icon: <Star size={18} /> },
    { id: 'edithomePage', label: 'Add Home Page', icon: <Plus size={18} /> },
    { id: 'homepage', label: 'Manage Home Page', icon: <LayoutGrid size={18} /> },
    { id: 'add', label: 'Add Painting', icon: <Plus size={18} /> },
    { id: 'manage', label: 'Manage Gallery', icon: <LayoutGrid size={18} /> },
    { id: 'featured', label: 'Featured Collections', icon: <Image size={18} /> },
    { id: 'manageDrafts', label: 'Manage Drafts', icon: <FileText size={18} /> },
    { id: 'manageCategory', label: 'Manage Categories', icon: <LayoutGrid size={18} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <FileText size={18} /> },
    { id: 'blog', label: 'Blog / Content', icon: <FileText size={18} /> },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={18} /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <h1 className="text-xl font-serif tracking-tight border-b border-stone-100 pb-4">
          Musawwir <span className="italic font-normal text-stone-500">Arts</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (item.id === 'add') setSelectedPainting(null);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-medium
              ${activeTab === item.id || (activeTab === 'edit' && item.id === 'manage')
                ? 'bg-stone-900 text-white shadow-lg shadow-stone-200'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-stone-50">
        <button
          onClick={handleLogout}
          className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors px-4"
        >
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f7f4] text-stone-900 font-sans">

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-100 flex items-center justify-between px-6 z-40">
        <span className="font-serif italic text-lg">Musawwir</span>
        
        <div className="flex items-center gap-2">
          {/* Mobile Profile Icon */}
          <div className="relative">
            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-sm mr-2"
            >
              A
            </button>
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-100 shadow-xl rounded-xl py-2 z-50">
                  <button 
                    onClick={() => { setActiveTab('changepassword'); setProfileMenuOpen(false); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-600"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white shadow-xl z-50 w-72 transform transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:h-screen lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full min-h-screen pt-16 lg:pt-0">
        
        {/* Desktop Profile Header */}
        <div className="hidden lg:flex items-center justify-end px-12 py-6 border-b border-stone-100 bg-white">
          <div className="relative">
            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 hover:bg-stone-50 p-2 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-lg">A</div>
              <div className="text-left">
                <p className="text-sm font-bold text-stone-900">Admin</p>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Settings</p>
              </div>
            </button>
            
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-100 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => { setActiveTab('changepassword'); setProfileMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-12">

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            {/* ADD PAINTING */}
            {activeTab === 'add' && (
              <PaintingForm mode="add" onSaveSuccess={handleSaveSuccess} />
            )}

            {/* MANAGE GALLERY */}
            {activeTab === 'manage' && (
              <ManageGallery onEdit={handleEditClick} />
            )}

            {/* EDIT PAINTING */}
            {activeTab === 'edit' && selectedPainting && (
              <div className="space-y-6">
                <button
                  onClick={() => setActiveTab('manage')}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 group"
                >
                  <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Return to Collection
                </button>
                <PaintingForm
                  mode="edit"
                  initialData={selectedPainting}
                  onSaveSuccess={handleSaveSuccess}
                />
              </div>
            )}

            {/* INQUIRIES */}
            {activeTab === 'inquiries' && (
              <ManageInquiries />
            )}
            {activeTab === 'homepage' && (
              <ManageHomepage />
            )}
            {activeTab === 'edithomePage' && (
              <EditHomepage />
            )}
            {activeTab === 'manageCategory' && (
              <CategoryManager />
            )}
            {activeTab === 'featured' && (
              <FeaturedCollectionsManager />
            )}
            {activeTab === 'testimonials' && (
              <AdminTestimonials />
            )}
            {activeTab === 'changepassword' && (
              <ChangePassword />
            )}
            
            {activeTab === 'manageDrafts' && (
              <DraftsList
                onEdit={handleEditClick}
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
  );
};

export default AdminDashboard;