
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { api } from '@/api';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, cart, favorites, logout } = useApp();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await api.get('/notifications');
      const data = res.data || res;
      setNotifications(data || []);
    } catch {}
    setNotifLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const getNavItems = () => {
    const items = [
      { id: 'user-home', label: 'Home', icon: 'fa-house', roles: ['USER', 'OWNER', 'ADMIN'] },
      { id: 'swipe-discovery', label: 'Discover', icon: 'fa-fire-flame-curved', roles: ['USER'] },
      { id: 'favorites', label: 'Favourites', icon: 'fa-heart', roles: ['USER'] },
      { id: 'top-selling', label: 'Top Selling', icon: 'fa-chart-line', roles: ['OWNER'] },
      { id: 'owner-dashboard', label: 'My Restaurant', icon: 'fa-store', roles: ['OWNER'] },
      { id: 'admin-dashboard', label: 'Moderation', icon: 'fa-shield-halved', roles: ['ADMIN'] },
    ];
    return items.filter(item => item.roles.includes(currentUser?.role || 'USER'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <nav className="glass sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab('user-home')}
        >
          <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
            <i className="fas fa-utensils text-lg"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-charcoal tracking-tight leading-none">Food<span className="text-[#FF4D4D]">Swipe</span></span>
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 mt-1">
              {currentUser?.role === 'OWNER' ? 'Restaurant Owner' : currentUser?.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-2">
            {getNavItems().map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-bold text-xs uppercase tracking-widest transition-all px-5 py-3 rounded-xl flex items-center gap-3 border ${
                  activeTab === item.id 
                  ? 'bg-orange-50 border-orange-100 text-[#FF4D4D] shadow-sm' 
                  : 'text-gray-400 hover:text-charcoal border-transparent hover:bg-gray-50'
                }`}
              >
                <i className={`fas ${item.icon} text-sm`}></i>
                {item.label}
                {item.id === 'favorites' && favorites.length > 0 && (
                  <span className="bg-[#FF4D4D] text-white text-[9px] px-1.5 py-0.5 rounded-md ml-1">{favorites.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button 
                onClick={() => { setNotifOpen(o => !o); if (!notifOpen) loadNotifications(); }} 
                className="relative p-3 rounded-xl transition-all border bg-gray-50 border-gray-100 text-charcoal"
              >
                <i className="fas fa-bell text-lg"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D4D] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-3">
                  <div className="px-4 py-2 border-b border-gray-50 mb-2 flex justify-between items-center">
                    <p className="text-xs font-black text-charcoal">Notifications</p>
                    <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-charcoal">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifLoading ? (
                      <div className="p-4 text-center text-gray-400 text-xs font-bold">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-xs font-bold">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <button
                          key={n._id}
                          onClick={async () => { if (!n.isRead) { await api.put(`/notifications/${n._id}/read`); setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, isRead: true } : x)); } }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-start gap-3 transition-colors ${n.isRead ? 'text-gray-500 hover:bg-gray-50' : 'text-charcoal bg-orange-50/40 hover:bg-orange-50'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.isRead ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-[#FF4D4D]'}`}>
                            <i className="fas fa-bell"></i>
                          </div>
                          <div className="flex-1">
                            <p className="line-clamp-2">
                              {n.type === 'ADMIN_APPROVE' ? 'Your restaurant has been approved.' :
                               n.type === 'ADMIN_REJECT' ? 'Your restaurant has been rejected.' :
                               n.type === 'OWNER_REGISTER' ? 'New restaurant registration received.' :
                               'Notification'}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#FF4D4D] mt-1"></span>}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setActiveTab('cart')} 
              className={`relative p-3 rounded-xl transition-all border ${
                activeTab === 'cart' ? 'bg-orange-50 border-orange-100 text-[#FF4D4D]' : 'bg-gray-50 border-gray-100 text-charcoal'
              }`}
            >
              <i className="fas fa-bag-shopping text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D4D] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative group/profile">
              <div 
                className="w-10 h-10 rounded-xl bg-cover bg-center cursor-pointer border-2 border-transparent group-hover/profile:border-[#FF4D4D] transition-all shadow-md overflow-hidden"
                style={{ backgroundImage: `url(${currentUser?.avatar})` }}
                onClick={() => setActiveTab('profile')}
              ></div>
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-3 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all translate-y-2 group-hover/profile:translate-y-0 origin-top-right">
                <div className="px-4 py-4 border-b border-gray-50 mb-2">
                   <p className="text-xs font-black text-charcoal truncate">{currentUser?.name}</p>
                   <p className="text-[10px] text-gray-400 font-bold truncate">{currentUser?.email}</p>
                </div>
                <button onClick={() => setActiveTab('profile')} className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-3 text-gray-600 transition-colors">
                  <i className="fas fa-user-circle"></i> View Profile
                </button>
                <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold hover:bg-red-50 text-red-500 flex items-center gap-3 mt-1 transition-colors">
                  <i className="fas fa-sign-out-alt"></i> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      <nav className="lg:hidden glass fixed bottom-0 left-0 right-0 py-4 px-6 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 rounded-t-[2.5rem] border-t border-gray-100">
        {getNavItems().slice(0, 4).map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${
              activeTab === item.id ? 'bg-orange-50 text-[#FF4D4D]' : 'text-gray-400'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;

