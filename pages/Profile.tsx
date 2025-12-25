
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { api } from '@/client/api';

const Profile: React.FC = () => {
  const { currentUser } = useApp();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/user/profile');
      const data = res.data || res;
      setName(data.name || currentUser?.name || '');
      setAddress(data.address || '');
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="orange-gradient h-48 relative">
           <div className="absolute -bottom-16 left-12">
              <div 
                className="w-32 h-32 rounded-[2rem] border-8 border-white bg-cover bg-center shadow-2xl" 
                style={{ backgroundImage: `url(${currentUser?.avatar})` }}
              ></div>
           </div>
        </div>
        
        <div className="pt-20 px-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-charcoal">{currentUser?.name}</h1>
              <p className="text-gray-400 font-medium">{currentUser?.email} • Member since Oct 2023</p>
            </div>
            <button onClick={() => setEditing(e => !e)} className="bg-charcoal text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all transform active:scale-95">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</p>
               <p className="text-2xl font-black text-charcoal">24</p>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Points</p>
               <p className="text-2xl font-black text-orange-400">1,450</p>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Reviews</p>
               <p className="text-2xl font-black text-blue-400">12</p>
            </div>
          </div>

          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-charcoal">Account Settings</h2>
             <div className="space-y-2">
                {editing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="px-4 py-3 rounded-xl border" />
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="px-4 py-3 rounded-xl border" />
                    <div className="md:col-span-2 flex gap-3">
                      <button disabled={saving} onClick={async () => { setSaving(true); setError(null); try { await api.put('/user/profile', { name, address }); } catch (e: any) { setError('Failed to save'); } finally { setSaving(false); setEditing(false); } }} className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50">Save</button>
                      {error && <span className="text-red-500 text-sm font-bold">{error}</span>}
                    </div>
                  </div>
                )}
                {[
                  { icon: 'map-marker-alt', label: 'Saved Addresses', color: 'text-red-400' },
                  { icon: 'credit-card', label: 'Payment Methods', color: 'text-blue-400' },
                  { icon: 'bell', label: 'Notifications', color: 'text-yellow-400' },
                  { icon: 'shield-alt', label: 'Security & Privacy', color: 'text-green-400' },
                  { icon: 'question-circle', label: 'Help & Support', color: 'text-purple-400' },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                        <i className={`fas fa-${item.icon}`}></i>
                      </div>
                      <span className="font-bold text-charcoal group-hover:text-charcoal/80">{item.label}</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-300 group-hover:translate-x-1 transition-transform"></i>
                  </button>
                ))}
             </div>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
            <button className="flex items-center gap-3 text-red-500 font-bold hover:underline">
               <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
