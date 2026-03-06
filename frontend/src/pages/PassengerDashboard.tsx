import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, CreditCard, Star, Search, LogOut, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PassengerDashboard: React.FC = () => {
  const [activeTrips, setActiveTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => { fetchActiveTrips(); }, []);

  const fetchActiveTrips = async () => {
    try {
      const response = await api.get('/bookings/active');
      setActiveTrips(response.data);
    } catch (error) { console.error('Failed to fetch trips'); }
  };

  const handleCalculateFare = () => {
    setIsSearching(true);
    setTimeout(() => {
      const distance = Math.floor(Math.random() * 20) + 1; 
      setEstimatedFare(50 + (distance * 30));
      setIsSearching(false);
    }, 800);
  };

  const handleBooking = async () => {
    if (!selectedTrip) return;
    setIsBooking(true);
    try {
      await api.post('/bookings', { tripId: selectedTrip.id, pickupLat: -1.286389, pickupLng: 36.817223, dropoffLat: -1.2921, dropoffLng: 36.8219 });
      alert('Booking successful!');
      setIsBooking(false);
    } catch (error) { alert('Booking failed'); setIsBooking(false); }
  };

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950"></div>
      <header className="p-5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]"><Navigation className="text-white" size={20} /></div>
          <div><h1 className="text-xl font-black tracking-tighter">SMART<span className="text-emerald-500">BOOK</span></h1><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.name}</p></div>
        </motion.div>
        <button onClick={logout} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><LogOut size={18} className="text-zinc-400" /></button>
      </header>

      <main className="p-5 max-w-2xl mx-auto space-y-6 pb-32 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-zinc-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-5">
          <div className="relative space-y-1">
            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-3xl border border-white/5 focus-within:border-emerald-500/50 transition-colors"><MapPin className="text-emerald-500" size={20} /><input type="text" placeholder="Where are you?" className="bg-transparent w-full outline-none text-sm placeholder:text-zinc-500" value={pickup} onChange={(e) => setPickup(e.target.value)} /></div>
            <div className="absolute left-6 top-11 h-6 w-0.5 bg-gradient-to-b from-emerald-500/50 to-emerald-500/0"></div>
            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-3xl border border-white/5 focus-within:border-emerald-500/50 transition-colors"><ChevronRight className="text-zinc-500" size={20} /><input type="text" placeholder="Where are you going?" className="bg-transparent w-full outline-none text-sm placeholder:text-zinc-500" value={destination} onChange={(e) => setDestination(e.target.value)} /></div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCalculateFare} className="w-full bg-emerald-500 text-black py-4 rounded-3xl font-black tracking-wider hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center space-x-2">{isSearching ? <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <><Search size={20} strokeWidth={3} /><span>SEARCH ROUTES</span></>}</motion.button>
        </motion.div>

        <AnimatePresence>{estimatedFare && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[2rem] flex justify-between items-center"><div><p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mb-1">Estimated Fare</p><p className="text-3xl font-black text-white">KES {estimatedFare}</p></div><div className="bg-emerald-500/20 p-3 rounded-2xl"><CreditCard className="text-emerald-500" size={32} /></div></motion.div>}</AnimatePresence>

        <section className="space-y-4">
          <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center space-x-3 ml-2"><Clock size={16} /><span>Vehicles Near You</span></h2>
          <div className="space-y-3">
            {activeTrips.length === 0 ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5 text-center text-zinc-600">No vehicles active right now.</motion.div> : activeTrips.map((trip, idx) => (
              <motion.div key={trip.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedTrip(trip)} className={`p-5 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${selectedTrip?.id === trip.id ? 'bg-emerald-500 border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.2)]' : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80'}`}>
                <div className="flex justify-between items-start relative z-10">
                  <div><p className={`font-black text-lg ${selectedTrip?.id === trip.id ? 'text-black' : 'text-white'}`}>{trip.route.name}</p><p className={`text-xs font-bold ${selectedTrip?.id === trip.id ? 'text-black/60' : 'text-zinc-500'}`}>{trip.vehicle.plateNumber} • {trip.driver.name}</p></div>
                  <div className="text-right"><p className={`text-lg font-black ${selectedTrip?.id === trip.id ? 'text-black' : 'text-emerald-500'}`}>KES {trip.route.baseFare}</p><div className={`flex items-center text-xs font-bold justify-end ${selectedTrip?.id === trip.id ? 'text-black/80' : 'text-amber-500'}`}><Star size={12} fill="currentColor" /><span className="ml-1">4.8</span></div></div>
                </div>
                <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform ${selectedTrip?.id === trip.id ? 'text-black' : 'text-white'}`}><Navigation size={80} strokeWidth={3} /></div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>{selectedTrip && <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-20"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBooking} disabled={isBooking} className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-zinc-100 transition-all flex items-center justify-center space-x-3">{isBooking ? <div className="h-6 w-6 border-3 border-black/20 border-t-black rounded-full animate-spin"></div> : <><span className="ml-2">CONFIRM BOOKING</span><ChevronRight size={24} strokeWidth={3} /></>}</motion.button></motion.div>}</AnimatePresence>
      <div className="fixed inset-0 -z-20 opacity-20 pointer-events-none"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div></div>
    </div>
  );
};

export default PassengerDashboard;
