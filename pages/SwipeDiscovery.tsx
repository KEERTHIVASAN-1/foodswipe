
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import SwipeCard from '../components/SwipeCard';
import ThreeBackground from '../components/ThreeBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '@/api';

const SwipeDiscovery: React.FC = () => {
  const { toggleFavorite, addToCart } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState<{type: 'like' | 'skip' | 'cart', active: boolean}>({type: 'like', active: false});
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/items/swipe');
        const data = res.data || res;
        const mapped = (data || []).map((i: any) => ({ id: i._id, restaurantId: i.restaurant, name: i.name, image: i.imageUrl, price: i.price, category: i.category, description: '', isTopSelling: i.isTopSelling, rating: i.rating || 0 }));
        setItems(mapped);
      } catch (e: any) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'right') {
      toggleFavorite(topSellers[currentIndex].id);
      triggerConf('like');
    } else if (direction === 'up') {
      addToCart(topSellers[currentIndex]);
      triggerConf('cart');
    } else {
      triggerConf('skip');
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const triggerConf = (type: 'like' | 'skip' | 'cart') => {
    setShowConfirmation({ type, active: true });
    setTimeout(() => setShowConfirmation({ type, active: false }), 1200);
  };

  const reset = () => setCurrentIndex(0);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden flex flex-col items-center justify-center bg-[#fcfcfc]">
      {/* Professional Three.js Ambient Particles */}
      <ThreeBackground />

      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-10 pointer-events-none space-y-2 px-6"
      >
        <div className="bg-orange-50 text-[#FF4D4D] text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full inline-block mb-3 border border-orange-100">Trending Now</div>
        <h1 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight">Top Selling Picks</h1>
        <p className="text-gray-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">Swipe right to save to favourites, or up to add to basket instantly.</p>
      </motion.div>

      {/* Swipe Stack */}
      <div className="relative z-10 w-full max-w-sm h-[520px] flex items-center justify-center perspective-1000">
        <AnimatePresence>
          {loading ? (
            <div className="animate-pulse bg-white p-12 rounded-[3.5rem] shadow-2xl text-center max-w-xs border border-gray-100 glass relative overflow-hidden h-64 w-80"></div>
          ) : currentIndex < items.length ? (
            <SwipeCard 
              key={items[currentIndex].id}
              item={items[currentIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center max-w-xs border border-gray-100 glass relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 orange-gradient"></div>
              <div className="w-20 h-20 orange-gradient rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-8 shadow-xl rotate-12">
                <i className="fas fa-check-double"></i>
              </div>
              <h2 className="text-3xl font-black text-charcoal mb-4 tracking-tight leading-tight">You're All Caught Up!</h2>
              <p className="text-gray-400 font-bold mb-10 text-sm leading-relaxed">New top-selling dishes are added daily from our expert kitchens. Check back soon!</p>
              <button 
                onClick={reset}
                className="w-full bg-charcoal text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all transform active:scale-95"
              >
                Restart Deck
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {currentIndex < items.length && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-12 flex gap-12 items-center"
        >
          <button 
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 text-xl border border-gray-50 hover:text-red-500 hover:bg-red-50 transition-all transform active:scale-90 shadow-md"
          >
            <i className="fas fa-xmark"></i>
          </button>
          <button 
             onClick={() => handleSwipe('up')}
             className="w-20 h-20 rounded-[2.5rem] orange-gradient shadow-2xl flex items-center justify-center text-white text-2xl border-4 border-white/40 hover:scale-110 transition-all transform active:scale-90"
          >
            <i className="fas fa-bag-shopping"></i>
          </button>
          <button 
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 text-xl border border-gray-50 hover:text-green-500 hover:bg-green-50 transition-all transform active:scale-90 shadow-md"
          >
            <i className="fas fa-heart"></i>
          </button>
        </motion.div>
      )}

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmation.active && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
             <div className={`px-8 py-5 rounded-[2.5rem] shadow-2xl font-black text-white flex items-center gap-4 border border-white/20 ${
               showConfirmation.type === 'like' ? 'bg-green-500/90' : 
               showConfirmation.type === 'cart' ? 'bg-orange-500/90' : 'bg-red-500/90'
             }`}>
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                 <i className={`fas fa-${showConfirmation.type === 'like' ? 'heart' : showConfirmation.type === 'cart' ? 'bag-shopping' : 'xmark'}`}></i>
               </div>
               <span className="uppercase tracking-[0.2em] text-xs font-black">
                 {showConfirmation.type === 'like' ? 'Favourite Saved' : 
                  showConfirmation.type === 'cart' ? 'Added to Basket' : 'Skipped Item'}
               </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipeDiscovery;
