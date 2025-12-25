
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { api } from '@/client/api';
import gsap from 'gsap';

interface UserHomeProps {
  onSelectRestaurant: (id: string) => void;
}

const UserHome: React.FC<UserHomeProps> = ({ onSelectRestaurant }) => {
  const { } = useApp();
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current, 
      { opacity: 0, y: 50, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' }
    );
    tl.fromTo('.cuisine-item', 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, stagger: 0.05, duration: 0.8, ease: 'power4.out' },
      '-=0.8'
    );
    tl.fromTo('.restaurant-card', 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power3.out' },
      '-=0.6'
    );
  }, [selectedCuisine]);

  const handleCuisineClick = (cuisine: string | null) => {
    setSelectedCuisine(cuisine);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          cuisine: selectedCuisine || '',
          location: '',
          minRating: '',
          sort: 'createdAt',
          dir: 'desc'
        });
        const res = await api.get(`/restaurants?${params.toString()}`);
        const data = res.data || res;
        const mapped = (data || []).map((r: any) => ({
          id: r._id,
          ownerId: r.owner,
          name: r.name,
          location: r.location,
          cuisine: r.cuisineTypes || [],
          about: r.about || '',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
          rating: r.rating || 0,
          status: (r.status || 'PENDING').toLowerCase(),
          createdAt: Date.parse(r.createdAt || new Date().toISOString())
        }));
        setList(mapped);
        setTotal((res.pagination && res.pagination.total) || mapped.length);
      } catch (e: any) {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedCuisine, page, limit]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12" ref={containerRef}>
      {/* Hero Section */}
      <div ref={heroRef} className="orange-gradient rounded-[3rem] p-10 md:p-20 mb-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_20px_50px_rgba(255,77,77,0.3)]">
        <div className="relative z-10 flex-1 space-y-8">
          <div className="space-y-4">
            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">Summer Sale 20% Off</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Delicious Food <br/><span className="text-yellow-300">Fast Delivery</span>
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-xl leading-relaxed font-medium">
            Discover the best kitchens in your city, curated just for you. From spicy grills to coastal delights, your next feast is just a swipe away.
          </p>
          <div className="flex gap-6">
             <div className="bg-white/20 backdrop-blur-lg rounded-[2rem] p-6 flex flex-col items-center w-32 border border-white/10 shadow-xl">
               <span className="text-3xl font-black">50+</span>
               <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Kitchens</span>
             </div>
             <div className="bg-white/20 backdrop-blur-lg rounded-[2rem] p-6 flex flex-col items-center w-32 border border-white/10 shadow-xl">
               <span className="text-3xl font-black">4.8</span>
               <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Avg Rating</span>
             </div>
          </div>
        </div>
        <div className="relative z-10 hidden lg:block">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
              alt="Hero Food"
              className="w-96 h-96 object-cover rounded-[4rem] border-[12px] border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400 opacity-10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      {/* Cuisines Section */}
      <div className="mb-20">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8 text-center">Popular Cuisines</h3>
        <div className="overflow-x-auto pb-6 no-scrollbar">
          <div className="flex justify-between items-center gap-8 min-w-max px-4">
            <div 
              onClick={() => handleCuisineClick(null)}
              className="cuisine-item group cursor-pointer flex flex-col items-center gap-4"
            >
              <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center border transition-all transform group-hover:-translate-y-2 group-hover:scale-110 ${!selectedCuisine ? 'orange-gradient text-white border-transparent shadow-xl' : 'bg-white border-gray-100 shadow-sm'}`}>
                <i className="fas fa-th-large text-2xl"></i>
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${!selectedCuisine ? 'text-[#FF4D4D]' : 'text-charcoal opacity-60'}`}>All</span>
            </div>
            {[
              { name: 'Burgers', icon: 'hamburger' },
              { name: 'Sushi', icon: 'fish' },
              { name: 'Italian', icon: 'pizza-slice' },
              { name: 'Healthy', icon: 'leaf' },
              { name: 'Bakery', icon: 'bread-slice' },
              { name: 'South Indian', icon: 'pepper-hot' },
              { name: 'North Indian', icon: 'fire' },
              { name: 'Seafood', icon: 'utensils' }
            ].map((cuisine) => (
              <div 
                key={cuisine.name} 
                onClick={() => handleCuisineClick(cuisine.name)}
                className="cuisine-item group cursor-pointer flex flex-col items-center gap-4"
              >
                <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center border transition-all transform group-hover:-translate-y-2 group-hover:scale-110 ${selectedCuisine === cuisine.name ? 'orange-gradient text-white border-transparent shadow-xl' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <i className={`fas fa-${cuisine.icon} text-2xl ${selectedCuisine === cuisine.name ? 'text-white' : 'text-[#FF4D4D]'}`}></i>
                </div>
                <span className={`text-xs font-black uppercase tracking-widest ${selectedCuisine === cuisine.name ? 'text-[#FF4D4D]' : 'text-charcoal opacity-60'}`}>{cuisine.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div ref={listRef} className="scroll-mt-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-charcoal tracking-tight">Hand-Picked for You</h2>
            <p className="text-gray-400 text-lg font-medium">
              {selectedCuisine ? `Showing top ${selectedCuisine} spots` : 'Top kitchens near your current location'}
            </p>
          </div>
          <button onClick={() => handleCuisineClick(null)} className="text-[#FF4D4D] font-black text-sm uppercase tracking-widest hover:bg-[#FF4D4D] hover:text-white px-6 py-3 rounded-2xl transition-all border border-[#FF4D4D]">Reset Filters</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-[2.5rem] h-80 border border-gray-100"></div>
          ))}
          {!loading && list.length > 0 ? list.map((resto) => (
            <div 
              key={resto.id} 
              className="restaurant-card bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50 cursor-pointer group flex flex-col h-full"
              onClick={() => onSelectRestaurant(resto.id)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={resto.image} 
                  alt={resto.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                   <i className="fas fa-star text-yellow-400 text-sm"></i>
                   <span className="text-sm font-black text-charcoal">{resto.rating}</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-charcoal group-hover:text-[#FF4D4D] transition-colors tracking-tight leading-tight">{resto.name}</h3>
                  <p className="text-gray-400 font-bold text-sm">
                    <i className="fas fa-map-marker-alt mr-2 text-[#FF4D4D]/50"></i> {resto.location}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery</span>
                    <span className="text-sm font-bold text-charcoal">20-30 min</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl orange-gradient text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl">
                    <i className="fas fa-chevron-right text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          )) : !loading ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 text-2xl">
                 <i className="fas fa-search"></i>
              </div>
              <p className="text-gray-400 font-bold text-xl">No kitchens match this cuisine.</p>
              <button onClick={() => handleCuisineClick(null)} className="text-orange-500 font-black uppercase tracking-widest text-sm underline decoration-2">Clear all filters</button>
            </div>
          ) : null}
        </div>
        <div className="flex justify-center items-center gap-4 mt-10">
          <button disabled={page <= 1 || loading} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-4 py-2 rounded-xl border text-xs font-bold disabled:opacity-50">Prev</button>
          <span className="text-xs font-black text-gray-500">Page {page}</span>
          <button disabled={page * limit >= total || loading} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border text-xs font-bold disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
