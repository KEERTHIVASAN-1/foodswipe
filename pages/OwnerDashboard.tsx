
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { MenuItem, Restaurant } from '../types';
import { api } from '@/api';

const OwnerDashboard: React.FC = () => {
  const { currentUser, addMenuItem, removeMenuItem, addRestaurant } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<{ reviewsCount: number; averageRating: number }>({ reviewsCount: 0, averageRating: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    isTopSelling: false,
  });

  const [regData, setRegData] = useState<Partial<Restaurant>>({
    name: '',
    location: '',
    cuisine: [],
    about: '',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
  });

  const fetchOwner = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/owner/restaurant');
      const data = res.data || res;
      if (!data) {
        setRestaurant(null);
        setItems([]);
        setStats({ reviewsCount: 0, averageRating: 0 });
      } else {
        setRestaurant(data.restaurant);
        setItems(data.items || []);
        setStats({ reviewsCount: data.reviewsCount || 0, averageRating: data.averageRating || 0 });
      }
    } catch (e: any) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  const approved = (restaurant?.status || '').toLowerCase() === 'approved';
  const topSellingItems = items.filter((i: any) => i.isAvailable).sort((a: any, b: any) => (b.rating + (b.totalOrders || 0)) - (a.rating + (a.totalOrders || 0))).slice(0, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurant) {
      await addMenuItem({ ...newItem, restaurantId: restaurant._id });
      await fetchOwner();
      setShowAddForm(false);
      setNewItem({
        name: '', price: 0, category: '', description: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
        isTopSelling: false,
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRestaurant(regData);
    await fetchOwner();
    setShowRegisterForm(false);
  };

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-8 text-center">
        <div className="w-24 h-24 bg-orange-100 text-[#FF4D4D] rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-3xl shadow-lg">
          <i className="fas fa-store"></i>
        </div>
        <h2 className="text-4xl font-black text-charcoal mb-4">Become a Restaurant Owner</h2>
        <p className="text-gray-500 mb-12 text-lg max-w-lg mx-auto leading-relaxed font-medium">
          Join thousands of successful kitchens growing their brand with FoodSwipe. Experience the power of data-driven ordering.
        </p>
        <button 
          onClick={() => setShowRegisterForm(true)}
          className="orange-gradient text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl transform hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
        >
          Register Your Kitchen
        </button>

        {showRegisterForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="orange-gradient p-10 text-white relative">
                <h2 className="text-3xl font-black">Restaurant Registration</h2>
                <p className="opacity-80 text-sm font-bold uppercase tracking-widest text-white">Scale your vision</p>
                <button onClick={() => setShowRegisterForm(false)} className="absolute top-8 right-8 text-2xl">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleRegister} className="p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Restaurant Name</label>
                    <input required type="text" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="The Golden Grill" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Location</label>
                    <input required type="text" value={regData.location} onChange={e => setRegData({...regData, location: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="Downtown District" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Cuisine Type</label>
                    <input required type="text" onChange={e => setRegData({...regData, cuisine: [e.target.value]})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="Italian" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Description</label>
                    <textarea value={regData.about} onChange={e => setRegData({...regData, about: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 min-h-[100px] text-charcoal" placeholder="Describe your culinary specialty..." />
                  </div>
                </div>
                <button type="submit" className="w-full orange-gradient text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transform active:scale-95 transition-all">
                  Submit for Approval
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-8">
          <img src={restaurant.imageUrl || restaurant.image} className="w-24 h-24 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white" alt={restaurant.name} />
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-charcoal">{restaurant.name}</h1>
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {(restaurant.status || '').toString().toLowerCase()}
              </span>
            </div>
            <p className="text-gray-400 font-bold text-lg">{restaurant.location} • {(restaurant.cuisineTypes || restaurant.cuisine || []).join(', ')}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="orange-gradient text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 transform hover:scale-105 active:scale-95 transition-all"
        >
          <i className="fas fa-plus-circle text-lg"></i> Launch New Dish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
           {/* Menu Management */}
           <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black text-charcoal flex items-center gap-4">
                 <i className="fas fa-utensils text-[#FF4D4D]"></i> Active Menu
               </h2>
               <span className="text-xs font-black text-gray-400 bg-gray-50 px-5 py-2 rounded-xl uppercase tracking-widest border border-gray-100">{items.length} Total Dishes</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {items.map((item: any) => (
                 <div key={item._id} className="p-6 rounded-[2.5rem] border border-gray-50 hover:border-orange-200 hover:bg-orange-50/10 transition-all flex gap-6 relative group shadow-sm hover:shadow-lg">
                   <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-md">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="flex-1">
                     <h3 className="text-lg font-black text-charcoal mb-1">{item.name}</h3>
                     <p className="text-xs font-bold text-gray-400 mb-4">{item.category || 'General'}</p>
                     <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-[#FF4D4D]">${(item.price || 0).toFixed(0)}</p>
                        {item.isTopSelling && (
                          <div className="flex items-center gap-1.5 text-orange-500 font-black text-[9px] uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                             <i className="fas fa-fire-flame-curved"></i> Top Selling
                          </div>
                        )}
                     </div>
                   </div>
                   <button 
                    onClick={async () => { await removeMenuItem(item._id); setItems(prev => prev.filter(i => i._id !== item._id)); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center shadow-lg"
                   >
                     <i className="fas fa-trash-can text-xs"></i>
                   </button>
                 </div>
               ))}
               {items.length === 0 && (
                 <div className="col-span-2 text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                   <img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=400" className="w-32 h-32 rounded-full object-cover mx-auto mb-6 opacity-40 grayscale" alt="" />
                   <p className="text-gray-400 font-bold">Your kitchen is currently empty. Add your first dish to start selling!</p>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Sidebar Performance Analytics */}
        <div className="space-y-12">
           <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
             <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-charcoal">
               <i className="fas fa-chart-line text-[#FF4D4D]"></i> Performance
             </h2>
             <div className="space-y-6">
               <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Views</p>
                 <div className="flex justify-between items-end">
                   <p className="text-3xl font-black text-charcoal">2.4k</p>
                   <span className="text-green-500 font-black text-[10px] uppercase tracking-widest">+18%</span>
                 </div>
               </div>
               
               <div className="space-y-5 pt-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-3">Top Selling Items</h3>
                  {topSellingItems.length > 0 ? topSellingItems.map(item => (
                    <div key={item._id} className="flex items-center gap-4 group">
                       <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" alt="" />
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-charcoal group-hover:text-orange-500 transition-colors line-clamp-1">{item.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold">{item.rating || 0} Rating</p>
                       </div>
                    </div>
                  )) : (
                    <div className="py-6 text-center">
                       <p className="text-[10px] text-gray-400 font-bold">No items trending yet.</p>
                    </div>
                  )}
               </div>
             </div>
           </div>

           <div className="bg-charcoal rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <h2 className="text-xl font-black mb-4 relative z-10 text-white">Owner Support</h2>
             <p className="text-gray-400 text-xs mb-8 leading-relaxed relative z-10">Dedicated assistance for our kitchen partners. Reach out anytime.</p>
             <button className="w-full bg-white text-charcoal py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:orange-gradient hover:text-white transition-all relative z-10">
                Live Chat
             </button>
           </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="orange-gradient p-10 text-white relative">
              <h2 className="text-3xl font-black text-white">Add Menu Item</h2>
              <p className="opacity-80 text-sm font-bold uppercase tracking-widest text-white">Grow your collection</p>
              <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-2xl hover:scale-110 transition-transform">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Dish Name</label>
                  <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Price ($)</label>
                    <input required type="number" step="1" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Category</label>
                    <input required type="text" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Dish Description</label>
                  <textarea className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 min-h-[80px] text-charcoal font-medium" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                </div>
                <div className="flex items-center gap-3 bg-orange-50 p-5 rounded-[2rem] border border-orange-100">
                  <input type="checkbox" id="topSelling" checked={newItem.isTopSelling} onChange={e => setNewItem({...newItem, isTopSelling: e.target.checked})} className="w-5 h-5 accent-[#FF4D4D] rounded-lg" />
                  <label htmlFor="topSelling" className="text-[10px] font-black text-charcoal uppercase tracking-widest cursor-pointer">Mark as Top Selling Dish</label>
                </div>
              </div>
              <button type="submit" className="w-full orange-gradient text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transform active:scale-95 transition-all">
                Add to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
