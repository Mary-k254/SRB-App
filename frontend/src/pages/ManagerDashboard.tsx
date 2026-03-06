import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Users, MessageSquare, Star, ArrowUpRight, LogOut, Send, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('/comments');
      setComments(response.data);
    } catch (error) { console.error('Failed to fetch comments'); }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/comments', { content: newComment, rating, targetType: 'APP' });
      setNewComment('');
      fetchComments();
    } catch (error) { alert('Failed to post comment'); }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950"></div>
      <header className="p-5 flex justify-between items-center bg-zinc-900/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center space-x-3"><div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]"><TrendingUp className="text-white" size={20} /></div><div><h1 className="text-xl font-black tracking-tighter uppercase">Insights<span className="text-indigo-500">Hub</span></h1><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.name}</p></div></motion.div>
        <button onClick={logout} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"><LogOut size={18} /></button>
      </header>

      <main className="p-5 max-w-4xl mx-auto space-y-8 pb-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ y: -8 }} className="bg-zinc-900/60 backdrop-blur-2xl p-7 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6 relative z-10"><div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:bg-indigo-500 transition-all group-hover:text-white"><BarChart3 size={24} /></div><span className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">+12% <ArrowUpRight size={12} className="ml-1" /></span></div>
            <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">Daily Revenue</p><p className="text-4xl font-black tracking-tighter">KES 48,200</p>
            <div className="absolute -bottom-4 -right-4 text-white/5 transition-transform group-hover:scale-110"><BarChart3 size={120} /></div>
          </motion.div>
          <motion.div whileHover={{ y: -8 }} className="bg-zinc-900/60 backdrop-blur-2xl p-7 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6 relative z-10"><div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:bg-indigo-500 transition-all group-hover:text-white"><Users size={24} /></div><span className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">+5% <ArrowUpRight size={12} className="ml-1" /></span></div>
            <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">Fleet Efficiency</p><p className="text-4xl font-black tracking-tighter">24/30 Active</p>
            <div className="absolute -bottom-4 -right-4 text-white/5 transition-transform group-hover:scale-110"><Users size={120} /></div>
          </motion.div>
        </div>

        <section className="space-y-6">
          <div className="flex justify-between items-center ml-2"><h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center space-x-3"><MessageSquare size={16} /><span>Passenger Pulse</span></h2><button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Filter: Recent</button></div>
          <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={handlePostComment} className="bg-zinc-900/80 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 shadow-3xl space-y-5">
            <textarea className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-5 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all outline-none placeholder:text-zinc-600 font-medium" placeholder="Post announcement..." rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <div className="flex justify-between items-center px-2">
              <div className="flex space-x-1.5 p-1 bg-white/5 rounded-full">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={20} strokeWidth={3} className={s <= rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'} onClick={() => setRating(s)} />))}</div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-black p-4 rounded-full"><Send size={20} strokeWidth={3} /></motion.button>
            </div>
          </motion.form>
          <div className="space-y-5">
            {comments.length === 0 ? <div className="text-center py-20 text-zinc-700 font-bold italic border-2 border-dashed border-white/5 rounded-[3rem]">No feedback received.</div> : comments.map((comment, idx) => (
              <motion.div key={comment.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 group relative">
                <div className="flex justify-between items-center mb-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center font-black text-indigo-500">{comment.user.name[0]}</div><div><p className="text-sm font-black tracking-tight">{comment.user.name}</p><p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">2h ago</p></div></div><div className="flex items-center px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500"><Star size={12} fill="currentColor" /><span className="text-[10px] font-black ml-1.5">{comment.rating}.0</span></div></div>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed pl-2 border-l-2 border-indigo-500/20 ml-5 py-1">{comment.content}</p>
                <div className="mt-5 flex justify-end space-x-6"><button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-indigo-500">Reply</button><button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500">Report</button><button className="text-zinc-800"><MoreHorizontal size={16} /></button></div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <div className="fixed inset-0 -z-20 pointer-events-none mix-blend-color-dodge opacity-5"><div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1.5px,transparent_1.5px)] bg-[size:40px_40px]"></div></div>
    </div>
  );
};

export default ManagerDashboard;
