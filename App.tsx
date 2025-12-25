
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store';
import Layout from './components/Layout';
import UserHome from './pages/UserHome';
import SwipeDiscovery from './pages/SwipeDiscovery';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import RestaurantView from './pages/RestaurantView';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { AnimatePresence, motion } from 'framer-motion';

const Main: React.FC = () => {
  const { isLoggedIn, currentUser, favorites } = useApp();
  const [activeTab, setActiveTab] = useState('user-home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [showFavToast, setShowFavToast] = useState(false);
  const [prevFavCount, setPrevFavCount] = useState(favorites.length);

  // Fav Toast Trigger
  useEffect(() => {
    if (isLoggedIn && favorites.length > prevFavCount) {
      setShowFavToast(true);
      const timer = setTimeout(() => setShowFavToast(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevFavCount(favorites.length);
  }, [favorites.length, isLoggedIn, prevFavCount]);

  // Handle routing for different roles on mount/role change
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      if (currentUser.role === 'OWNER' && (activeTab === 'user-home' || activeTab === 'swipe-discovery')) {
        setActiveTab('owner-dashboard');
      } else if (currentUser.role === 'ADMIN' && (activeTab === 'user-home' || activeTab === 'swipe-discovery')) {
        setActiveTab('admin-dashboard');
      }
    }
  }, [isLoggedIn, currentUser?.role, activeTab]);

  if (!isLoggedIn) {
    return <Auth />;
  }

  const Denied = ({ role }: { role: string }) => (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-400">
        <i className="fas fa-lock"></i>
      </div>
      <h2 className="text-2xl font-black text-charcoal mb-2">Access Restricted</h2>
      <p className="text-gray-400 font-bold">This area requires {role} permissions.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'user-home':
        return <UserHome onSelectRestaurant={(id) => { setSelectedRestaurantId(id); setActiveTab('restaurant-view'); }} />;
      case 'swipe-discovery':
        return currentUser?.role === 'USER' ? <SwipeDiscovery /> : <Denied role="USER" />;
      case 'favorites':
        return currentUser?.role === 'USER' ? <Favorites /> : <Denied role="USER" />;
      case 'top-selling':
      case 'owner-dashboard':
        return currentUser?.role === 'OWNER' ? <OwnerDashboard /> : <Denied role="OWNER" />;
      case 'admin-dashboard':
        return currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <Denied role="ADMIN" />;
      case 'cart':
        return currentUser?.role === 'USER' ? <Cart /> : <Denied role="USER" />;
      case 'profile':
        return currentUser?.role === 'USER' ? <Profile /> : <Denied role="USER" />;
      case 'restaurant-view':
        return selectedRestaurantId ? (
          <RestaurantView 
            restaurantId={selectedRestaurantId} 
            onBack={() => setActiveTab('user-home')} 
          />
        ) : <UserHome onSelectRestaurant={(id) => { setSelectedRestaurantId(id); setActiveTab('restaurant-view'); }} />;
      default:
        return <UserHome onSelectRestaurant={(id) => { setSelectedRestaurantId(id); setActiveTab('restaurant-view'); }} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}

      <AnimatePresence>
        {showFavToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
            className="fixed bottom-28 left-1/2 z-[100] pointer-events-none"
          >
            <div className="bg-charcoal/95 backdrop-blur-xl text-white px-8 py-5 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center gap-5 border border-white/10">
              <div className="w-14 h-14 rounded-full orange-gradient flex items-center justify-center shadow-xl text-2xl animate-pulse">
                 ❤️
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-black text-sm uppercase tracking-[0.1em]">Saved to Faves!</span>
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Added to your collection</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
};

export default App;
