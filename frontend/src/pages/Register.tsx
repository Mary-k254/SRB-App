import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, User, Lock, Mail, ChevronRight, Activity } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('PASSENGER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password, name, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (role === 'PASSENGER') navigate('/passenger');
      else if (role === 'DRIVER') navigate('/driver');
      else if (role === 'MANAGER') navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    if (role === 'PASSENGER') return <User size={32} className="text-emerald-500" />;
    if (role === 'DRIVER') return <Navigation size={32} className="text-indigo-500" />;
    if (role === 'MANAGER') return <Activity size={32} className="text-purple-500" />;
    return <User size={32} />;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-center items-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] -z-10 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[150px] -z-10 rounded-full animate-pulse-slow"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-zinc-900/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative">
        <div className="flex justify-center mb-10">
          <motion.div key={role} initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 12, opacity: 1 }} className="bg-zinc-800 p-5 rounded-[2rem] border border-white/10 shadow-3xl">
            {getRoleIcon()}
          </motion.div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Join the<span className="text-emerald-500">Fleet</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Premium Transit Ecosystem</p>
        </div>

        <AnimatePresence>{error && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-2xl mb-6 text-center">{error}</motion.div>}</AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"><User size={20} /></div>
            <input type="text" placeholder="Full name" className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium text-sm placeholder:text-zinc-600" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"><Mail size={20} /></div>
            <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium text-sm placeholder:text-zinc-600" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"><Lock size={20} /></div>
            <input type="password" placeholder="Password (min 6 characters)" className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium text-sm placeholder:text-zinc-600" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"><Activity size={20} /></div>
            <select className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-bold text-[10px] uppercase tracking-widest text-zinc-400 appearance-none" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="PASSENGER" className="bg-zinc-900">Passenger</option>
              <option value="DRIVER" className="bg-zinc-900">Driver</option>
              <option value="MANAGER" className="bg-zinc-900">Sacco Manager</option>
            </select>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full bg-emerald-500 text-black py-5 rounded-[1.5rem] font-black tracking-widest text-sm hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2 shadow-[0_10px_30px_rgba(16,185,129,0.3)] mt-6 disabled:opacity-50">
            {isLoading ? <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <><span className="ml-2">CREATE ACCOUNT</span><ChevronRight size={18} strokeWidth={3} /></>}
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center"><p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Already have an account? <Link to="/login" className="text-white hover:text-emerald-500">Sign in</Link></p></div>
      </motion.div>
    </div>
  );
};

export default Register;
