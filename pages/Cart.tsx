
import React, { useState } from 'react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useApp();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-charcoal mb-10">Your Basket</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((cartItem) => (
              <motion.div 
                key={cartItem.item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
              >
                <img src={cartItem.item.image} className="w-24 h-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-charcoal mb-1">{cartItem.item.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-1">{cartItem.item.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-xl px-2 py-1">
                      <button disabled={pendingId === cartItem.item.id} onClick={async () => { setPendingId(cartItem.item.id); await updateQuantity(cartItem.item.id, -1); setPendingId(null); }} className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-[#FF4D4D] disabled:opacity-50">-</button>
                      <span className="w-8 text-center font-bold">{cartItem.quantity}</span>
                      <button disabled={pendingId === cartItem.item.id} onClick={async () => { setPendingId(cartItem.item.id); await updateQuantity(cartItem.item.id, 1); setPendingId(null); }} className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-[#FF4D4D] disabled:opacity-50">+</button>
                    </div>
                    <button disabled={pendingId === cartItem.item.id} onClick={async () => { setPendingId(cartItem.item.id); await removeFromCart(cartItem.item.id); setPendingId(null); }} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest disabled:opacity-50">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#FF4D4D]">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-2xl">
                 <i className="fas fa-shopping-basket"></i>
               </div>
               <h3 className="text-2xl font-bold text-gray-400">Basket is empty</h3>
               <p className="text-gray-400 mt-2">Hungry? Discover something delicious!</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-extrabold text-charcoal mb-8">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-xl font-bold text-charcoal">Total</span>
                  <span className="text-3xl font-black text-[#FF4D4D]">${total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full orange-gradient text-white py-5 rounded-[2rem] font-bold shadow-xl hover:shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                   <i className="fas fa-shield-alt"></i>
                 </div>
                 <p className="text-xs text-gray-400 font-medium leading-relaxed">
                   Your payment is secure. We use industry-standard encryption to protect your data.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
