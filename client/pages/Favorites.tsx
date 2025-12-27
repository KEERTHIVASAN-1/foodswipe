
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const [favItems, setFavItems] = useState<any[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get('/user/favorites');
      const data = res.data || res;
      const mapped = (data || []).map((i: any) => ({ id: i._id, restaurantId: i.restaurant, name: i.name, image: i.imageUrl, price: i.price, category: i.category, description: '', isTopSelling: i.isTopSelling, rating: i.rating || 0 }));
      setFavItems(mapped);
      setLoading(false);
    };
    load();
  }, [favorites.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            ❤️ Saved Selection
          </div>
          <h1 className="text-5xl font-black text-charcoal tracking-tight">Your Faves</h1>
          <p className="text-gray-400 font-bold text-lg">Delicious items waiting for you to hit order!</p>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-gray-100 shadow-sm text-center min-w-[150px]">
          <span className="text-3xl font-black text-charcoal">{favItems.length}</span>
          <span className="text-[10px] block font-black uppercase tracking-widest text-gray-400 mt-1">Saved Items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <AnimatePresence>
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-[2.5rem] h-80 border border-gray-100"></div>
          ))}
          {!loading && favItems.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50 group flex flex-col h-full"
            >
              <div className="relative h-56">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button 
                  disabled={pending === item.id}
                  onClick={async () => { setPending(item.id); await toggleFavorite(item.id); setPending(null); }}
                  className={`absolute top-6 right-6 w-12 h-12 rounded-2xl ${pending === item.id ? 'bg-gray-200 text-gray-400' : 'bg-white/95 text-red-500'} backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 transition-transform border border-white/20`}
                >
                  <i className="fas fa-heart text-lg"></i>
                </button>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font.black text-charcoal group-hover:text-[#FF4D4D] transition-colors leading-tight tracking-tight">{item.name}</h3>
                    <span className="font-black text-[#FF4D4D] tracking-tighter text-lg">${item.price.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{item.description}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full orange-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-2xl transform active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <i className="fas fa-shopping-basket"></i>
                  Move to Basket
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && favItems.length === 0 && (
          <div className="col-span-full py-40 text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify.center mx-auto text-gray-200 text-5xl">
                <i className="fas fa-heart"></i>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce">
                🍽️
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-charcoal tracking-tight">Your Faves list is empty</h2>
              <p className="text-gray-400 font-bold max-w-sm mx-auto">Start swiping items to find your next meal and save them here!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

