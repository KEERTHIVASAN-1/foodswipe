
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
      <div className="max-w-4xl mx.auto py-32 px-8 text-center">
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
                <p className="opacity-80 text-sm font.bold uppercase tracking-widest text.white">Scale your vision</p>
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
                    <input required type="text" value={regData.location} onChange={e => setRegData({...regData, location: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline.none focus:ring-2 ring-orange-400 text-charcoal" placeholder="Downtown District" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Cuisine Types</label>
                    <input type="text" value={(regData.cuisine || []).join(', ')} onChange={e => setRegData({...regData, cuisine: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="Arabian, Grill" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">About</label>
                    <textarea value={regData.about} onChange={e => setRegData({...regData, about: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal min-h-24" placeholder="Tell customers about your kitchen"></textarea>
                  </div>
                </div>
                <button type="submit" className="w-full orange-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx.auto px-4 md:px-12 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-charcoal">{restaurant?.name}</h1>
          <p className="text-gray-500 font-medium">{restaurant?.location}</p>
          <div className="flex gap-2">
            {approved ? (
              <span className="px-3 py-1 rounded-xl bg-green-50 text-green-600 text-xs font-black uppercase tracking-widest">Approved</span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-yellow-50 text-yellow-600 text-xs font-black uppercase tracking-widest">Pending Approval</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {topSellingItems.map((i: any) => (
            <div key={i._id} className="p-6 rounded-3xl bg-white shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{i.category}</p>
              <p className="text-2xl font-black text-charcoal">{i.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg.white rounded-[3rem] shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-charcoal">Menu Items</h2>
          <button onClick={() => setShowAddForm(true)} className="orange-gradient text.white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Add New</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((i: any) => (
            <div key={i._id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{i.category}</p>
              <p className="text-xl font-black text-charcoal">{i.name}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-black text-[#FF4D4D]">${(i.price || 0).toFixed(0)}</span>
                <button onClick={async () => { await removeMenuItem(i._id); await fetchOwner(); }} className="text-xs text-red-500 font-bold uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg.white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="orange-gradient p-10 text-white relative">
              <h2 className="text-3xl font-black">Add Menu Item</h2>
              <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-2xl">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Item Name</label>
                  <input required type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="Classic Shawarma" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Price</label>
                  <input required type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="150" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Category</label>
                  <input required type="text" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="Arabian" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Image URL</label>
                  <input required type="url" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-400 text-charcoal" placeholder="https://..." />
                </div>
              </div>
              <button type="submit" className="w-full orange-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;

