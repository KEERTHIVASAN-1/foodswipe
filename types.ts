
export type UserRole = 'USER' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  location: string;
  cuisine: string[];
  about: string;
  image: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isTopSelling: boolean;
  rating: number;
}

export interface Review {
  id: string;
  itemId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface AppState {
  currentUser: User | null;
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  cart: CartItem[];
  favorites: string[]; // item IDs
  reviews: Review[];
}
