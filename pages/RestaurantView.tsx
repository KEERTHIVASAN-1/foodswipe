
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import gsap from 'gsap';
import { api } from '@/api';

interface RestaurantViewProps {
  restaurantId: string;
  onBack: () => void;
}

const RestaurantView: React.FC<RestaurantViewProps> = ({ restaurantId, onBack }) => {
  const { addToCart } = useApp();
  const headerRef = useRef<HTMLDivElement>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [restaurantReviews, setRestaurantReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (headerRef.current) {
      tl.fromTo(headerRef.current, 
        { opacity: 0, y: 50, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' }
      );
    }
    tl.fromTo('.menu-category',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power4.out' },
      '-=0.6'
    );
    tl.fromTo('.menu-item-card', 
      { opacity: 0, y: 30, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.8, ease: 'power3.out' },
      '-=0.8'
    );
  }, [restaurantId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/restaurants/${restaurantId}`);
        const data = res.data || res;
        const r = data.restaurant;
        const mappedR = {
          id: r._id,
          ownerId: r.owner,
          name: r.name,
          location: r.location,
          cuisine: r.cuisineTypes || [],
          about: r.about || '',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
          rating: r.rating || 0,
          status: (r.status || 'PENDING').toLowerCase()
        };
        setRestaurant(mappedR);
        const mappedItems = (data.items || []).map((i: any) => ({
          id: i._id, restaurantId: i.restaurant, name: i.name, image: i.imageUrl, price: i.price, category: i.category, description: '', isTopSelling: i.isTopSelling, rating: i.rating || 0
        }));
        setItems(mappedItems);
        const rev = await api.get(`/restaurants/${restaurantId}/reviews`);
        setRestaurantReviews((rev.data || rev).map((r: any) => ({ id: r._id, itemId: r.item?._id, userName: r.user?.name || 'User', rating: r.rating, comment: r.comment || '', date: r.createdAt })));
      } catch (e: any) {
        setError('Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [restaurantId]);

  if (loading) {
    return <div className="p-20"><div className="animate-pulse h-64 bg-gray-100 rounded-3xl mb-10"></div><div className="animate-pulse h-40 bg-gray-100 rounded-3xl"></div></div>;
  }
  if (error || !restaurant) {
    return <div className="p-20 text-center text-gray-400 font-bold">Unable to load restaurant.</div>;
  }

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="pb-32 bg-[#fafafa]">
      {/* Cover Image & Back Button */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={restaurant.image} className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110" alt={restaurant.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-10 left-10 w-14 h-14 rounded-2xl glass flex items-center justify-center text-charcoal hover:scale-110 transition-all shadow-xl group border border-white/30"
        >
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        </button>
      </div>

      {/* Main Info Card */}
      <div className="max-w-6xl mx-auto px-4 md:px-12 -mt-32 relative z-10">
        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-gray-50" ref={headerRef}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl md:text-6xl font-black text-charcoal tracking-tight">{restaurant.name}</h1>
                <div className="bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20">Open Now</div>
              </div>
              <p className="text-gray-400 font-bold text-lg flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xs">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                {restaurant.location} • {restaurant.cuisine.join(', ')}
              </p>
            </div>
            <div className="flex gap-6 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none text-center bg-gray-50 px-8 py-5 rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-3xl font-black text-charcoal">{restaurant.rating}</p>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-1">Rating</p>
              </div>
              <div className="flex-1 lg:flex-none text-center bg-gray-50 px-8 py-5 rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-3xl font-black text-charcoal">30m</p>
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-1">Speed</p>
              </div>
            </div>
          </div>
          <p className="text-gray-500 leading-relaxed max-w-4xl text-lg font-medium">
            {restaurant.about}
          </p>
        </div>

        {/* Menu & Reviews Content Grid */}
        <div className="mt-20 grid grid-cols-1 xl:grid-cols-4 gap-16">
          <div className="xl:col-span-3 space-y-16">
            {categories.map(cat => (
              <div key={cat} className="menu-category space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-black text-charcoal tracking-tight">{cat}</h2>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {items.filter(i => i.category === cat).map(item => (
                    <div key={item.id} className="menu-item-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex gap-8 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all group relative overflow-hidden">
                      <div className="relative w-36 h-36 flex-shrink-0 overflow-hidden rounded-[2rem] shadow-lg">
                        <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={item.name} />
                        {item.isTopSelling && (
                          <div className="absolute top-3 left-3 bg-yellow-400 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20">POPULAR</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-black text-charcoal group-hover:text-[#FF4D4D] transition-colors leading-tight">{item.name}</h3>
                          </div>
                          <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-[#FF4D4D]">${item.price.toFixed(0)}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-12 h-12 rounded-2xl bg-orange-50 hover:orange-gradient text-orange-500 hover:text-white flex items-center justify-center transition-all shadow-sm border border-orange-100 hover:border-transparent active:scale-90"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Reviews */}
          <div className="space-y-10">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                <h3 className="text-2xl font-black text-charcoal flex items-center gap-3">
                  <i className="fas fa-star text-yellow-400"></i> Reviews
                </h3>
                <div className="space-y-6">
                  {restaurantReviews.length > 0 ? restaurantReviews.map(rev => (
                    <div key={rev.id} className="space-y-3 p-6 rounded-[2rem] bg-gray-50 border border-gray-100/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-charcoal uppercase tracking-widest">{rev.userName}</span>
                        <div className="flex text-yellow-400 text-[10px]">
                           {[...Array(5)].map((_, i) => (
                             <i key={i} className={`fas fa-star ${i < Math.floor(rev.rating) ? '' : 'text-gray-200'}`}></i>
                           ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"{rev.comment}"</p>
                      <p className="text-[10px] text-gray-300 font-bold uppercase">{new Date(rev.date).toLocaleDateString()}</p>
                    </div>
                  )) : (
                    <p className="text-center py-10 text-gray-400 font-bold">No reviews yet for this restaurant.</p>
                  )}
                </div>
                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-black text-xs hover:border-[#FF4D4D] hover:text-[#FF4D4D] transition-all uppercase tracking-widest">Write a Review</button>
              </div>

              {/* Delivery Promotion Card */}
              <div className="bg-charcoal p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                 <h4 className="text-xl font-black mb-4 relative z-10">Free Delivery!</h4>
                 <p className="text-gray-400 text-sm mb-8 relative z-10 leading-relaxed">Join our Premium Plan for zero delivery fees on all orders over $200.</p>
                 <button className="w-full bg-white text-charcoal py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:orange-gradient hover:text-white transition-all relative z-10">Upgrade Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;
