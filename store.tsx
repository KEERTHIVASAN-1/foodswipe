
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User, Restaurant, MenuItem, CartItem, UserRole } from './types';
import { INITIAL_USER, MOCK_RESTAURANTS, MOCK_MENU_ITEMS, MOCK_REVIEWS } from './constants';
import { api } from '@/client/api';

interface AppContextType extends AppState {
  isLoggedIn: boolean;
  login: (email: string, role: UserRole) => void;
  signup: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  toggleFavorite: (itemId: string) => void;
  approveRestaurant: (id: string) => void;
  rejectRestaurant: (id: string) => void;
  addRestaurant: (resto: Partial<Restaurant>) => void;
  addMenuItem: (item: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  useEffect(() => {
    const load = async () => {
      try {
        const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';
        const [rRes, mRes, vRes] = await Promise.all([
          fetch(`${API}/restaurants`),
          fetch(`${API}/items/swipe`), // load top-selling for initial discover; full items are fetched per restaurant view
          fetch(`${API}/restaurants/${encodeURIComponent('seed')}/reviews`).catch(() => Promise.resolve({ json: async () => MOCK_REVIEWS })) // placeholder endpoint for initial reviews load
        ]);
        const [rJson, mJson, vJson] = await Promise.all([
          rRes.json(),
          mRes.json(),
          vRes.json()
        ]);
        setRestaurants(rJson.data || rJson);
        setMenuItems(mJson.data || mJson);
        setReviews(vJson.data || vJson);
      } catch {
        setRestaurants(MOCK_RESTAURANTS);
        setMenuItems(MOCK_MENU_ITEMS);
        setReviews(MOCK_REVIEWS);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoggedIn) return;
      try {
        const fav = await api.get('/user/favorites');
        const cartRes = await api.get('/user/cart');
        setFavorites((fav.data || fav).map((i: any) => i._id));
        const itemsMap = new Map((menuItems || []).map(i => [i.id, i]));
        const cartFromApi = (cartRes.data || cartRes).map((c: any) => {
          const found = itemsMap.get(c.item?._id);
          return { item: found || { id: c.item?._id, name: '', image: '', price: 0, category: '', description: '', isTopSelling: false, rating: 0 }, quantity: c.quantity } as CartItem;
        });
        setCart(cartFromApi);
      } catch {}
    };
    loadUserData();
  }, [isLoggedIn]);

  const login = async (email: string, role: UserRole) => {
    const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';
    const endpoint = role === 'OWNER' ? '/auth/owner/login' : role === 'ADMIN' ? '/auth/admin/login' : '/auth/user/login';
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    const json = await res.json();
    if (json.ok && json.token) {
      localStorage.setItem('token', json.token);
      setUser(json.user);
      setIsLoggedIn(true);
    }
  };

  const signup = async (name: string, email: string, role: UserRole) => {
    const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';
    const endpoint = role === 'OWNER' ? '/auth/owner/register' : '/auth/user/register';
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: 'password123' })
    });
    const json = await res.json();
    if (json.ok && json.token) {
      localStorage.setItem('token', json.token);
      setUser(json.user);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
    localStorage.removeItem('token');
  };

  const setRole = (role: UserRole) => {
    if (user) setUser({ ...user, role });
  };

  const addToCart = async (item: MenuItem) => {
    await api.post('/user/cart/add', { itemId: item.id, quantity: 1 });
    const cartRes = await api.get('/user/cart');
    const itemsMap = new Map((menuItems || []).map(i => [i.id, i]));
    const cartFromApi = (cartRes.data || cartRes).map((c: any) => {
      const found = itemsMap.get(c.item?._id);
      return { item: found || { id: c.item?._id, name: '', image: '', price: 0, category: '', description: '', isTopSelling: false, rating: 0 }, quantity: c.quantity } as CartItem;
    });
    setCart(cartFromApi);
  };

  const removeFromCart = async (itemId: string) => {
    await api.del('/user/cart/remove', { itemId });
    const cartRes = await api.get('/user/cart');
    const itemsMap = new Map((menuItems || []).map(i => [i.id, i]));
    const cartFromApi = (cartRes.data || cartRes).map((c: any) => {
      const found = itemsMap.get(c.item?._id);
      return { item: found || { id: c.item?._id, name: '', image: '', price: 0, category: '', description: '', isTopSelling: false, rating: 0 }, quantity: c.quantity } as CartItem;
    });
    setCart(cartFromApi);
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    const current = cart.find(c => c.item.id === itemId)?.quantity || 1;
    const newQty = Math.max(1, current + delta);
    await api.put('/user/cart/update', { itemId, quantity: newQty });
    const cartRes = await api.get('/user/cart');
    const itemsMap = new Map((menuItems || []).map(i => [i.id, i]));
    const cartFromApi = (cartRes.data || cartRes).map((c: any) => {
      const found = itemsMap.get(c.item?._id);
      return { item: found || { id: c.item?._id, name: '', image: '', price: 0, category: '', description: '', isTopSelling: false, rating: 0 }, quantity: c.quantity } as CartItem;
    });
    setCart(cartFromApi);
  };

  const toggleFavorite = async (itemId: string) => {
    if (favorites.includes(itemId)) {
      await api.del(`/user/favorites/${itemId}`);
      setFavorites(prev => prev.filter(id => id !== itemId));
    } else {
      await api.post(`/user/favorites/${itemId}`);
      setFavorites(prev => [...prev, itemId]);
    }
  };

  const approveRestaurant = async (id: string) => {
    await api.put(`/admin/restaurants/${id}/approve`);
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const rejectRestaurant = async (id: string) => {
    await api.put(`/admin/restaurants/${id}/reject`);
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  const addRestaurant = async (resto: Partial<Restaurant>) => {
    const data = {
      name: resto.name || 'New Restaurant',
      location: resto.location || '',
      cuisineTypes: resto.cuisine || [],
      about: resto.about || '',
      contactInfo: ''
    };
    const res = await api.post('/owner/restaurant/register', data);
    const r = res.data || res;
    const newResto: Restaurant = {
      id: r._id,
      ownerId: user?.id || 'anon',
      name: r.name,
      location: r.location,
      cuisine: r.cuisineTypes || [],
      about: r.about || '',
      image: resto.image || 'https://picsum.photos/800/600',
      rating: r.rating || 0,
      status: (r.status || 'PENDING').toLowerCase() as any,
      createdAt: Date.now(),
    };
    setRestaurants(prev => [...prev, newResto]);
  };

  const addMenuItem = async (item: Partial<MenuItem>) => {
    const res = await api.post('/owner/items/add', {
      restaurantId: item.restaurantId || '',
      name: item.name || 'New Item',
      imageUrl: item.image || 'https://picsum.photos/600/600',
      price: item.price || 0,
      category: item.category || 'General',
      isAvailable: true
    });
    const created = res.data || res;
    const newItem: MenuItem = {
      id: created._id,
      restaurantId: created.restaurant,
      name: created.name,
      price: created.price,
      category: created.category,
      image: created.imageUrl,
      description: item.description || '',
      isTopSelling: created.isTopSelling || false,
      rating: created.rating || 0,
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const removeMenuItem = async (id: string) => {
    await api.del(`/owner/items/${id}`);
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const value = {
    isLoggedIn,
    currentUser: user,
    restaurants,
    menuItems,
    cart,
    favorites,
    reviews,
    login,
    signup,
    logout,
    setRole,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleFavorite,
    approveRestaurant,
    rejectRestaurant,
    addRestaurant,
    addMenuItem,
    removeMenuItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
