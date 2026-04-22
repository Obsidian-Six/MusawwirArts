import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const InputWrapper = ({ label, value, onChange, show, setShow, placeholder }) => (
    <div className="group relative">
      <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-1 md:mb-2 font-bold group-focus-within:text-stone-900 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required
          className="w-full px-0 py-2 md:py-3 border-b border-stone-200 focus:border-stone-900 outline-none transition-all text-stone-900 placeholder:text-stone-300 bg-transparent pr-10 text-sm md:text-base"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-0 bottom-2 md:bottom-3 text-stone-400 hover:text-stone-900 transition-colors focus:outline-none p-1"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-2xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-stone-900">Security Settings</h2>
          <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Update your admin password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 mt-8">
        {error && (
          <div className="bg-red-50 text-red-700 text-[11px] md:text-xs p-3 md:p-4 rounded-xl border border-red-100 font-bold flex items-center gap-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-[11px] md:text-xs p-3 md:p-4 rounded-xl border border-green-100 font-bold flex items-center gap-3">
            {success}
          </div>
        )}

        <InputWrapper 
          label="Current Password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          show={showCurrent} 
          setShow={setShowCurrent} 
          placeholder="Enter current password" 
        />

        <InputWrapper 
          label="New Password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          show={showNew} 
          setShow={setShowNew} 
          placeholder="Minimum 6 characters" 
        />

        <div className="group relative">
          <label className="block text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-1 md:mb-2 font-bold group-focus-within:text-stone-900 transition-colors">
            Confirm New Password
          </label>
          <input
            type={showNew ? "text" : "password"}
            required
            className="w-full px-0 py-2 md:py-3 border-b border-stone-200 focus:border-stone-900 outline-none transition-all text-stone-900 placeholder:text-stone-300 bg-transparent text-sm md:text-base"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-stone-50 py-3.5 md:py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase hover:bg-black transition-all active:scale-[0.98] disabled:bg-stone-300"
          >
            {loading ? 'Updating Identity...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
