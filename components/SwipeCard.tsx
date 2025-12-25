
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MenuItem } from '../types';

interface SwipeCardProps {
  item: MenuItem;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ item, onSwipe }) => {
  const [exitX, setExitX] = useState<number>(0);
  const [exitY, setExitY] = useState<number>(0);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-30, 30]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);
  
  const heartOpacity = useTransform(x, [50, 180], [0, 1]);
  const crossOpacity = useTransform(x, [-50, -180], [0, 1]);
  const starOpacity = useTransform(y, [-50, -180], [0, 1]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 150) {
      setExitX(800);
      onSwipe('right');
    } else if (info.offset.x < -150) {
      setExitX(-800);
      onSwipe('left');
    } else if (info.offset.y < -150) {
      setExitY(-800);
      onSwipe('up');
    }
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, y: exitY }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileTap={{ scale: 1.02 }}
      className="absolute w-full max-w-sm h-[520px] cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.15)] border-[8px] border-white bg-white group">
        {/* Swipe Feedback Indicators */}
        <motion.div 
          style={{ opacity: heartOpacity }} 
          className="absolute top-12 left-12 z-30 bg-green-500 text-white font-black py-3 px-8 rounded-[2rem] border-4 border-white -rotate-12 shadow-2xl uppercase tracking-widest text-sm"
        >
          FAVE
        </motion.div>
        <motion.div 
          style={{ opacity: crossOpacity }} 
          className="absolute top-12 right-12 z-30 bg-red-500 text-white font-black py-3 px-8 rounded-[2rem] border-4 border-white rotate-12 shadow-2xl uppercase tracking-widest text-sm"
        >
          PASS
        </motion.div>
        <motion.div 
          style={{ opacity: starOpacity }} 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-orange-500 text-white font-black py-4 px-10 rounded-[2.5rem] border-4 border-white shadow-2xl uppercase tracking-widest text-sm whitespace-nowrap"
        >
          ORDER NOW
        </motion.div>

        {/* Image Content */}
        <div className="relative h-2/3 w-full overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-8 flex items-center gap-2">
            <div className="bg-yellow-400 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Trending</div>
            <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Hot Pick</div>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-8 space-y-4 bg-white relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-charcoal tracking-tight leading-tight">{item.name}</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{item.category}</p>
            </div>
            <span className="text-2xl font-black text-[#FF4D4D] tracking-tighter">${item.price.toFixed(0)}</span>
          </div>
          <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex text-yellow-400 gap-1">
               {[...Array(5)].map((_, i) => (
                 <i key={i} className={`fas fa-star text-[10px] ${i < Math.floor(item.rating) ? '' : 'text-gray-200'}`}></i>
               ))}
            </div>
            <span className="text-[10px] font-black text-charcoal uppercase tracking-widest opacity-60">{item.rating} Rating</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
