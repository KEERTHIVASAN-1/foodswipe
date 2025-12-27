
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { api } from '@/api';

const AdminDashboard: React.FC = () => {
  const { approveRestaurant, rejectRestaurant } = useApp();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/restaurants');
      const data = res.data || res;
      const mapped = (data || []).map((r: any) => ({
        id: r._id,
        name: r.name,
        location: r.location,
        cuisine: r.cuisineTypes || [],
        image: r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
        status: (r.status || 'PENDING').toLowerCase(),
        createdAt: r.createdAt || Date.now(),
      }));
      setRestaurants(mapped);
    } catch (e: any) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-charcoal mb-2">Admin Control Panel</h1>
        <p className="text-gray-500 font-medium">Manage restaurant applications and platform health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Total Restaurants</span>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black text-charcoal">{restaurants.length}</span>
             <span className="text-green-500 font-bold text-sm">+2 this week</span>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Pending Reviews</span>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black text-orange-400">{restaurants.filter(r => r.status === 'pending').length}</span>
             <span className="text-gray-400 font-bold text-sm">Action required</span>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Active Users</span>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black text-blue-400">4.2k</span>
             <span className="text-blue-500 font-bold text-sm">↑ 12% growth</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
           <h2 className="text-2xl font-bold text-charcoal">Restaurant Queue</h2>
           <div className="flex gap-2">
              <button className="bg-gray-100 text-charcoal px-4 py-2 rounded-xl text-xs font-bold">All</button>
              <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold">Pending Only</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Restaurant</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Cuisine</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {restaurants.map(resto => (
                <tr key={resto.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <img src={resto.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-charcoal">{resto.name}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(resto.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-600 font-medium">{resto.location}</td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                      {resto.cuisine.map(c => (
                        <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      resto.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      resto.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {resto.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {resto.status !== 'approved' && (
                        <button 
                          onClick={async () => { await approveRestaurant(resto.id); setRestaurants(prev => prev.map(r => r.id === resto.id ? { ...r, status: 'approved' } : r)); }}
                          className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      {resto.status !== 'rejected' && (
                        <button 
                          onClick={async () => { await rejectRestaurant(resto.id); setRestaurants(prev => prev.map(r => r.id === resto.id ? { ...r, status: 'rejected' } : r)); }}
                          className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
