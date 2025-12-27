
import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface SwipeCardProps {
  item: any;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ item, onSwipe }) => {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);

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
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: exitX, y: exitY, opacity: 0 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className="bg-white p-8 rounded-[3.5rem] shadow-2xl text-center max-w-xs border border-gray-100 glass relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 orange-gradient"></div>
      <div className="relative w-full h-64 rounded-[2.5rem] overflow-hidden shadow-lg mb-8">
        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-2 shadow-xl border border-white/20">
          <i className="fas fa-star text-yellow-400 text-sm"></i>
          <span className="text-sm font-black text-charcoal">{item.rating}</span>
        </div>
      </div>
      <h3 className="text-2xl font-black text-charcoal mb-2">{item.name}</h3>
      <p className="text-gray-400 font-bold mb-8 text-sm">Only ${item.price.toFixed(0)}</p>
      <div className="flex items-center justify-center gap-6">
        <div className="bg-white text-gray-500 px-4 py-2 rounded-xl text-xs font-bold border border-gray-100">Category</div>
        <div className="bg-white text-[#FF4D4D] px-4 py-2 rounded-xl text-xs font-bold border border-gray-100">Top Pick</div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;

