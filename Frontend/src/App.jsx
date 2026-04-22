import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

// Public Components
import Header from './Components/Header';
import HeroSection from './Components/HeroSection/HeroSection';
import FloatingButtons from './Components/FloatingButtons';
import Features from './Components/HeroSection/Features';
import CategorySection from './Components/CategorySection';
import ExploreByStyle from './Components/ExploreByStyle';
import Footer from './Components/Footer';
import ArtSection from './Components/ArtSection';
import NewCollection from './Components/NewCollection';
import FeaturedCollections from './Components/FeaturedCollections';
import InstagramSection from './Components/ConnectInstagram';
import SoldPaintings from './Components/SoldPaintings';
import DiscoverArt from './Components/DiscoverArt';
import ContactForm from './Components/ContactForm';
import TestimonialSlider from './Components/TestimonialSlider';

// Pages
import AboutUs from './Pages/AboutUs/AboutUs';
import ArtMaintenance from './Pages/ArtMaintainence/ArtMaintenance';
import PaintingsPage from './Pages/PaintingsPage';
import ProductDetailsPage from './Pages/ProductDetail/ProductDetailPage'; 
import BlogPage from './Pages/Blog/BlogPage';
import BlogDetailPage from './Pages/Blog/BlogDetailPage';
import FAQ from './Pages/FAQ/FAQ';
import TermsOfService from './Pages/TermsOfService/TermsOfService';
import CopyrightPolicy from './Pages/CopyRight/Copyrightpolicy';
import ArtistDetail from './Pages/Artist/ArtistDetail';
import MandeepGhai from './Pages/Artist/MandeepGhai';


// Admin Components
import AdminLogin from './Admin/AdminLogin';
import AdminSignup from './Admin/AdminSignup';
import AdminDashboard from './Admin/AdminDashboard';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen">
      <FloatingButtons />

      {/* Header only shows on public routes */}
      {!isAdminRoute && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/art-maintenance" element={<ArtMaintenance />} />
        <Route path="/paintings" element={<PaintingsPage />} />
        <Route path="/paintings/:id" element={<ProductDetailsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/copyright" element={<CopyrightPolicy />} />
        <Route path="/artist" element={<MandeepGhai />} />
        <Route path="/artist/amol-pawar" element={<ArtistDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback to login if someone just types /admin */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        
        {/* 404 Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer only shows on public routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// --- PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // If no token, redirect to login
  return token ? children : <Navigate to="/admin/login" replace />;
};

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedArt, setSelectedArt] = useState(""); // New state for the title
  const [selectedArtImage, setSelectedArtImage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only auto-show if the user hasn't already opened one
      if(!showForm) setShowForm(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Function to handle opening the form from a card
  const handleArtClick = (payload) => {
    // payload may be a string (legacy) or an object { title, imageUrl }
    if (!payload) return;
    if (typeof payload === 'string') {
      setSelectedArt(payload);
      setSelectedArtImage("");
    } else {
      setSelectedArt(payload.title || "");
      setSelectedArtImage(payload.imageUrl || "");
    }
    setShowForm(true);
  };

  return (
    <>
      {/* INQUIRY MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
            onClick={() => {
              setShowForm(false);
              setSelectedArt(""); // Clear on close
            }}
          />
          <div className="relative z-10 w-full flex justify-center">
            {/* Pass the selectedArt as a prop to your ContactForm */}
            <ContactForm 
              onClose={() => { setShowForm(false); setSelectedArt(""); setSelectedArtImage(""); }} 
              artworkName={selectedArt}
              paintingImage={selectedArtImage}
            />
          </div>
        </div>
      )}

      <HeroSection />
      <Features />
      <CategorySection />
      <ExploreByStyle />
      <FeaturedCollections />
      <NewCollection />
      <ArtSection onArtClick={handleArtClick} /> 
      <DiscoverArt onArtClick={handleArtClick} />
      <SoldPaintings />
      <InstagramSection />
      <TestimonialSlider />
    </>
  );
}
export default App;