import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, Users, AlertCircle, CheckCircle, LogOut, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: -1.286389, lng: 36.817223 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOnline) {
      fetchMyBookings();
      const interval = setInterval(updateLocation, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const fetchMyBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data);
    } catch (error) { console.error('Failed to fetch bookings'); }
  };

  const updateLocation = async () => {
    const newLat = currentLocation.lat + (Math.random() - 0.5) * 0.001;
    const newLng = currentLocation.lng + (Math.random() - 0.5) * 0.001;
    setCurrentLocation({ lat: newLat, lng: newLng });
    try {
      await api.patch('/bookings/location', { vehicleId: 'some-vehicle-id', lat: newLat, lng: newLng });
    } catch (error) { console.error('Failed to update location'); }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black"></div>
      <header className="p-5 flex justify-between items-center bg-zinc-900/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"><Activity className="text-black" size={20} /></div>
          <div><h1 className="text-xl font-black tracking-tighter uppercase">Drive<span className="text-zinc-500">Hub</span></h1><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.name}</p></div>
        </motion.div>
        <div className="flex items-center space-x-5">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOnline(!isOnline)} className={`px-5 py-2 rounded-[2rem] text-[10px] font-black tracking-[0.2em] transition-all border-2 shadow-2xl ${isOnline ? 'bg-emerald-500 text-black border-emerald-500 shadow-emerald-500/20' : 'bg-transparent text-white border-white/10 hover:border-white/30 shadow-none'}`}>{isOnline ? 'ONLINE' : 'GO ONLINE'}</motion.button>
          <button onClick={logout} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="p-5 max-w-2xl mx-auto space-y-6 pb-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
        <div className="bg-zinc-900/60 backdrop-blur-2xl p-7 rounded-[3rem] border border-white/5 shadow-3xl">
          <div className="flex justify-between items-center mb-6"><h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Performance Dashboard</h2><div className={`p-2 rounded-full ${isOnline ? 'bg-emerald-500/10 text-emerald-500 animate-pulse' : 'bg-white/5 text-zinc-600'}`}><Navigation size={20} /></div></div>
          <div className="grid grid-cols-2 gap-5">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 p-5 rounded-[2.5rem] border border-white/5"><p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Total Trips</p><p className="text-3xl font-black tracking-tighter">12</p></motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 p-5 rounded-[2.5rem] border border-white/5"><p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Today's Profit</p><p className="text-3xl font-black tracking-tighter text-emerald-500">KES 4.2k</p></motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-3xl flex items-start space-x-4"><div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><AlertCircle size={20} /></div><div><p className="font-black text-sm text-blue-100 uppercase tracking-wider">Live Traffic Hub</p><p className="text-xs text-blue-200/60 font-medium">Clear flow on Thika Road. High volume in CBD.</p></div></motion.div>

        <section className="space-y-4">
          <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center space-x-3 ml-2"><Users size={16} /><span>Active Pickups</span></h3>
          <div className="space-y-4">
            {!isOnline ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/30 p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center"><div className="bg-zinc-900 p-4 rounded-full inline-block mb-4 text-zinc-600"><Activity size={32} /></div><p className="text-sm text-zinc-500 font-bold">Go online to start</p></motion.div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 text-zinc-600 font-bold italic">Scanning requests...</div>
            ) : (
              bookings.map((booking, idx) => (
                <motion.div key={booking.id} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} className="bg-zinc-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border-r-4 border-emerald-500 shadow-2xl relative group overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10"><div><h4 className="font-black text-xl tracking-tighter">{booking.passenger.name}</h4><p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Passenger Found</p></div><span className="bg-emerald-500/20 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase">{booking.status}</span></div>
                  <div className="space-y-3 relative z-10"><div className="flex items-center space-x-3 text-sm text-zinc-400 font-medium"><div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div><span>Pickup: -1.28, 36.81</span></div><div className="flex items-center space-x-3 text-sm text-zinc-400 font-medium"><div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span>Destination: -1.29, 36.82</span></div></div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 bg-white text-black py-4 rounded-[2rem] font-black text-sm tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-center space-x-2"><span>START NAVIGATION</span><ChevronRight size={18} strokeWidth={3} /></motion.button>
                  <div className="absolute -right-6 -bottom-6 text-white/5 transition-transform group-hover:scale-125"><Users size={120} /></div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
      <div className="fixed inset-0 -z-20 opacity-30 mix-blend-overlay"><div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:30px_30px]"></div></div>
    </div>
  );
};

export default DriverDashboard;
