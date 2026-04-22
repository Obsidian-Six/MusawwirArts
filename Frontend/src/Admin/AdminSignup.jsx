import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, { 
        email, 
        password 
      });

      if (response.data.message === 'User registered successfully' || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white shadow-2xl overflow-hidden border border-stone-100 h-auto md:min-h-[600px] relative rounded-3xl md:rounded-none">
        
        {/* SUCCESS OVERLAY */}
        {success && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mb-4 shadow-lg scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-stone-900">Registration Complete</h2>
            <p className="text-stone-500 text-[10px] md:text-xs mt-2 tracking-widest uppercase">Redirecting to Login...</p>
          </div>
        )}

        {/* LEFT SIDE: Visual Section */}
        <div className="md:w-1/2 relative hidden md:block">
          <img 
            src="/Admin_side.jpeg" 
            alt="Art Gallery" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex flex-col justify-end p-8 lg:p-12">
            <h2 className="text-white text-3xl lg:text-4xl font-serif font-light leading-tight">
              Curating <br /> <span className="italic font-normal">Excellence.</span>
            </h2>
            <div className="h-1 w-12 bg-white/60 my-6"></div>
            <p className="text-stone-200 text-[10px] lg:text-xs tracking-widest uppercase">Musawwir Arts | Admin Portal</p>
          </div>
        </div>

        {/* RIGHT SIDE: Form Section */}
        <div className="md:w-1/2 w-full p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          
          <Link 
            to="/" 
            className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors group text-[10px] tracking-[0.2em] uppercase font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Gallery
          </Link>

          <div className="mb-8 md:mb-10 mt-8 md:mt-0">
            <h1 className="text-2xl md:text-3xl font-serif text-stone-900 mb-2">Create Account</h1>
            <p className="text-stone-600 text-sm">Register new administrative credentials.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6 md:space-y-8" autoComplete="off">
            
            {error && (
              <div className="bg-red-50 text-red-700 text-[11px] md:text-xs p-3 md:p-4 rounded-xl border border-red-100 font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="group">
              <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-1 md:mb-2 font-bold group-focus-within:text-stone-900 transition-colors">
                Admin Email
              </label>
              <input
                type="email"
                required
                className="w-full px-0 py-2 md:py-3 border-b border-stone-200 focus:border-stone-900 outline-none transition-all text-stone-900 placeholder:text-stone-300 bg-transparent text-sm md:text-base"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="group relative">
              <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-1 md:mb-2 font-bold group-focus-within:text-stone-900 transition-colors">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-0 py-2 md:py-3 border-b border-stone-200 focus:border-stone-900 outline-none transition-all text-stone-900 placeholder:text-stone-300 bg-transparent pr-10 text-sm md:text-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 md:bottom-3 text-stone-400 hover:text-stone-900 transition-colors focus:outline-none p-1"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="group relative">
              <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-1 md:mb-2 font-bold group-focus-within:text-stone-900 transition-colors">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-0 py-2 md:py-3 border-b border-stone-200 focus:border-stone-900 outline-none transition-all text-stone-900 placeholder:text-stone-300 bg-transparent text-sm md:text-base"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 md:pt-6">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-stone-900 text-stone-50 py-3.5 md:py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:bg-stone-300 disabled:shadow-none"
              >
                {loading ? 'Registering...' : success ? 'Success' : 'Create Account'}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <Link to="/admin/login" className="text-xs text-stone-500 hover:text-stone-900 font-semibold tracking-wider transition-colors inline-block pb-1 border-b border-transparent hover:border-stone-900">
                Already have an account? Login here.
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
