import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, User, Lock, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      const role = response.data.user.role;
      if (role === 'PASSENGER') navigate('/passenger');
      else if (role === 'DRIVER') navigate('/driver');
      else if (role === 'MANAGER') navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-center items-center px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] -z-10 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[150px] -z-10 rounded-full animate-pulse-slow"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-zinc-900/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative">
        <div className="flex justify-center mb-10">
          <div className="bg-emerald-500 p-4 rounded-[1.5rem] shadow-[0_0_30px_rgba(16,185,129,0.3)] rotate-12">
            <Navigation className="text-white" size={32} strokeWidth={3} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Smart<span className="text-emerald-500">Booking</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Premium Transit Ecosystem</p>
        </div>

        <AnimatePresence>{error && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-2xl mb-6 text-center">{error}</motion.div>}</AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"><User size={20} /></div>
            <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium text-sm placeholder:text-zinc-600" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"><Lock size={20} /></div>
            <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium text-sm placeholder:text-zinc-600" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full bg-white text-black py-4 rounded-[1.5rem] font-black tracking-widest text-sm hover:bg-zinc-100 transition-all flex items-center justify-center space-x-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)] mt-4 disabled:opacity-50">
            {isLoading ? <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <><span className="ml-2">LOG IN</span><ArrowRight size={18} strokeWidth={3} /></>}
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center space-y-4">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">New to the ecosystem? <Link to="/register" className="text-emerald-500 hover:text-emerald-400">Join Now</Link></p>
          <div className="flex items-center space-x-6 pt-4 text-zinc-700"><Activity size={24} /><ShieldCheck size={24} /></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
