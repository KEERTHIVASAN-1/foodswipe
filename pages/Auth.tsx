
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';
import { motion } from 'framer-motion';
import ThreeBackground from '../components/ThreeBackground';

const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('USER');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, role);
    } else {
      signup(name, email, role);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#fcfcfc] overflow-hidden">
      <ThreeBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
      >
        <div className="orange-gradient p-12 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
             <i className="fas fa-utensils text-2xl"></i>
          </div>
          <h1 className="text-3xl font-black mb-2 text-white">FoodSwipe</h1>
          <p className="opacity-80 font-bold uppercase tracking-widest text-[10px] text-white">
            {isLogin ? 'Welcome Back' : 'Join the Feast'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-4">
            <button 
              type="button" 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white shadow-sm text-charcoal' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button 
              type="button" 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white shadow-sm text-charcoal' : 'text-gray-400'}`}
            >
              Signup
            </button>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 transition-all text-charcoal font-medium" 
                  placeholder="Alex Johnson" 
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 transition-all text-charcoal font-medium" 
                placeholder="alex@foodswipe.com" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 transition-all text-charcoal font-medium pr-14" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors p-2"
                >
                  <i className={`fas fa-eye${showPassword ? '-slash' : ''} text-sm`}></i>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Access Role</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'USER', label: 'User' },
                  { id: 'OWNER', label: 'Owner' },
                  { id: 'ADMIN', label: 'Admin' }
                ].map((r) => (
                  <button 
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-tight border-2 transition-all ${role === r.id ? 'border-orange-400 bg-orange-50 text-orange-500' : 'border-gray-100 text-gray-400'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-gray-400 font-bold italic text-center leading-relaxed">
                {role === 'OWNER' ? 'Register as a Restaurant Owner to manage your kitchen.' : role === 'ADMIN' ? 'Moderator access for system health.' : 'Standard account for ordering.'}
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full orange-gradient text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transform active:scale-95 transition-all mt-6"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
