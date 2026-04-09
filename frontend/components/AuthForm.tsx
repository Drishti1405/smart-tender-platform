import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthFormProps {
  onSignIn: (email: string, pass: string) => Promise<void>;
  onSignUp: (name: string, email: string, pass: string, role: UserRole) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSignIn, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'NEEDER' as UserRole
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await onSignIn(formData.email, formData.password);
      } else {
        if (!formData.name) throw new Error("Name is required");
        await onSignUp(formData.name, formData.email, formData.password, formData.role);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade relative">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] sm:rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden relative group mx-4 sm:mx-0">
        <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 grad-ocean opacity-80 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 relative z-10">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 grad-indigo rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white font-black shadow-2xl shadow-indigo-200 mb-4 sm:mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 relative">
              <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] sm:rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter text-center leading-[1.1] font-outfit uppercase">
              {isLogin ? 'Intelligence' : 'Secure'}<br/><span className="text-indigo-600">{isLogin ? 'Access' : 'Registration'}</span>
            </h1>
            <p className="text-slate-400 mt-3 sm:mt-4 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none opacity-60">
              Smart Tender Evaluation Protocol
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {!isLogin && (
              <div className="space-y-2 group/field">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within/field:text-indigo-500 transition-colors">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within/field:text-indigo-500 transition-colors">Email ID</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within/field:text-indigo-500 transition-colors">Authorization Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'NEEDER' })}
                    className={`py-4 rounded-[1.2rem] border-4 font-black text-[10px] uppercase tracking-[0.1em] transition-all relative overflow-hidden ${
                      formData.role === 'NEEDER' 
                        ? 'grad-indigo border-white text-white shadow-2xl shadow-indigo-100 scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                    className={`py-4 rounded-[1.2rem] border-4 font-black text-[10px] uppercase tracking-[0.1em] transition-all relative overflow-hidden ${
                      formData.role === 'VENDOR' 
                        ? 'grad-emerald border-white text-white shadow-2xl shadow-emerald-100 scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    Vendor
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-[1.2rem] animate-shake">
                <div className="flex items-center space-x-3">
                  <p className="text-rose-600 text-[10px] font-black uppercase tracking-tight leading-none">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 mt-4 border-4 border-white/20 ${
                isLoading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:grad-indigo hover:-translate-y-1 hover:shadow-indigo-200 active:grad-ocean'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Processing...
                </div>
              ) : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center space-y-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.25em] hover:text-indigo-700 group transition-all"
            >
              <span className="border-b-2 border-indigo-100 group-hover:border-indigo-600 pb-1">
                {isLogin ? 'New User Sign-up' : 'Return to Login'}
              </span>
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-5 sm:py-6 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 flex justify-center space-x-8 sm:space-x-10 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">
          <span>SaaS Ready</span>
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-200 rounded-full my-auto"></span>
          <span>AES Secured</span>
        </div>
      </div>
    </div>
  );
};

