
import { Restaurant, MenuItem, User, Review } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'USER',
  avatar: 'https://picsum.photos/seed/alex/200'
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    ownerId: 'o1',
    name: 'Spice Route Kitchen',
    location: 'Adyar, Chennai',
    cuisine: ['South Indian', 'Chinese'],
    about: 'Experience the authentic taste of the South combined with Oriental zest. Our spices are sourced directly from Kerala farms.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    status: 'approved',
    createdAt: Date.now() - 10000000
  },
  {
    id: 'r2',
    ownerId: 'o2',
    name: 'Urban Tandoor',
    location: 'Indiranagar, Bangalore',
    cuisine: ['North Indian', 'Mughlai'],
    about: 'Gourmet North Indian cuisine featuring slow-cooked dals and charcoal-grilled kebabs in a modern setting.',
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=800',
    rating: 4.3,
    status: 'approved',
    createdAt: Date.now() - 50000000
  },
  {
    id: 'r3',
    ownerId: 'o3',
    name: 'Coastal Cravings',
    location: 'Fort Kochi, Kochi',
    cuisine: ['Seafood', 'Kerala'],
    about: 'Fresh catch from the Arabian Sea prepared with traditional coconut-based recipes from the backwaters.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    status: 'approved',
    createdAt: Date.now() - 20000000
  },
  {
    id: 'r4',
    ownerId: 'o4',
    name: 'Fire & Fork',
    location: 'Jubilee Hills, Hyderabad',
    cuisine: ['Continental', 'Fast Food'],
    about: 'Bold flavors meeting speed. Our artisanal burgers and wood-fired pizzas are the talk of the town.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    rating: 4.2,
    status: 'approved',
    createdAt: Date.now() - 5000000
  },
  {
    id: 'r5',
    ownerId: 'o5',
    name: 'Arabian Nights',
    location: 'Anna Nagar, Chennai',
    cuisine: ['Arabian', 'Grill'],
    about: 'The finest Mandi and Shawarma in the city. Savor the smoky flavors of our signature charcoal grills.',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800',
    rating: 4.4,
    status: 'approved',
    createdAt: Date.now() - 8000000
  }
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Restaurant 1: Spice Route
  { id: 'i1-1', restaurantId: 'r1', name: 'Ghee Roast Dosa', price: 120, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600', description: 'Crispy golden crepe roasted in pure cow ghee, served with 3 chutneys.', isTopSelling: true, rating: 4.8 },
  { id: 'i1-2', restaurantId: 'r1', name: 'Dragon Chicken', price: 280, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600', description: 'Spicy, tangy chicken strips tossed with cashews and bell peppers.', isTopSelling: true, rating: 4.7 },
  { id: 'i1-3', restaurantId: 'r1', name: 'Paneer Butter Masala', price: 240, category: 'Curries', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600', description: 'Creamy tomato-based gravy with soft cottage cheese cubes.', isTopSelling: false, rating: 4.5 },
  { id: 'i1-4', restaurantId: 'r1', name: 'Veg Fried Rice', price: 180, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600', description: 'Wok-tossed rice with seasonal vegetables and aromatic spices.', isTopSelling: false, rating: 4.2 },
  { id: 'i1-5', restaurantId: 'r1', name: 'Fresh Lime Soda', price: 60, category: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600', description: 'Refreshing summer cooler with a zesty kick.', isTopSelling: false, rating: 4.4 },
  { id: 'i1-6', restaurantId: 'r1', name: 'Butter Naan', price: 45, category: 'Breads', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce7a?auto=format&fit=crop&q=80&w=600', description: 'Soft, fluffy bread baked in tandoor with a glaze of butter.', isTopSelling: false, rating: 4.6 },

  // Restaurant 2: Urban Tandoor
  { id: 'i2-1', restaurantId: 'r2', name: 'Dal Makhani', price: 220, category: 'Mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600', description: 'Slow-cooked black lentils simmered overnight for a buttery texture.', isTopSelling: true, rating: 4.9 },
  { id: 'i2-2', restaurantId: 'r2', name: 'Chicken Tikka', price: 320, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600', description: 'Succulent chicken pieces marinated in yogurt and red spices.', isTopSelling: true, rating: 4.8 },
  { id: 'i2-3', restaurantId: 'r2', name: 'Mutton Rogan Josh', price: 450, category: 'Mains', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&q=80&w=600', description: 'Aromatic Kashmiri mutton curry cooked with alkanet root.', isTopSelling: false, rating: 4.6 },
  { id: 'i2-4', restaurantId: 'r2', name: 'Garlic Naan', price: 55, category: 'Breads', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600', description: 'Naan topped with roasted garlic and coriander.', isTopSelling: false, rating: 4.7 },
  { id: 'i2-5', restaurantId: 'r2', name: 'Mango Lassi', price: 120, category: 'Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=600', description: 'Thick yogurt drink blended with sweet Alphonso mangoes.', isTopSelling: false, rating: 4.5 },
  { id: 'i2-6', restaurantId: 'r2', name: 'Veg Seekh Kebab', price: 260, category: 'Starters', image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=600', description: 'Minced vegetable skewers grilled in a traditional clay oven.', isTopSelling: false, rating: 4.3 },

  // Restaurant 3: Coastal Cravings
  { id: 'i3-1', restaurantId: 'r3', name: 'Kerala Fish Curry', price: 380, category: 'Mains', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', description: 'Seer fish cooked in a tangy coconut and tamarind gravy.', isTopSelling: true, rating: 4.9 },
  { id: 'i3-2', restaurantId: 'r3', name: 'Appam (2 pcs)', price: 60, category: 'Breads', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', description: 'Lacy rice pancakes with a soft center, perfect with stews.', isTopSelling: true, rating: 4.8 },
  { id: 'i3-3', restaurantId: 'r3', name: 'Prawn Roast', price: 420, category: 'Starters', image: 'https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80&w=600', description: 'Juicy prawns sautéed with curry leaves and black pepper.', isTopSelling: true, rating: 4.7 },
  { id: 'i3-4', restaurantId: 'r3', name: 'Vegetable Stew', price: 220, category: 'Curries', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600', description: 'Mild coconut milk stew with garden fresh vegetables.', isTopSelling: false, rating: 4.5 },
  { id: 'i3-5', restaurantId: 'r3', name: 'Karimeen Pollichathu', price: 550, category: 'Mains', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600', description: 'Pearl spot fish marinated in spices and grilled in banana leaf.', isTopSelling: false, rating: 4.9 },
  { id: 'i3-6', restaurantId: 'r3', name: 'Tender Coconut Pudding', price: 150, category: 'Desserts', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600', description: 'Creamy dessert made with fresh coconut pulp.', isTopSelling: false, rating: 4.6 },

  // Restaurant 4: Fire & Fork
  { id: 'i4-1', restaurantId: 'r4', name: 'Monster Beef Burger', price: 350, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600', description: 'Double beef patty with cheddar, bacon, and signature sauce.', isTopSelling: true, rating: 4.9 },
  { id: 'i4-2', restaurantId: 'r4', name: 'Pepperoni Pizza', price: 480, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600', description: 'Classic wood-fired pizza with spicy pepperoni and mozzarella.', isTopSelling: true, rating: 4.8 },
  { id: 'i4-3', restaurantId: 'r4', name: 'Truffle Fries', price: 180, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600', description: 'Crispy fries drizzled with truffle oil and parmesan.', isTopSelling: false, rating: 4.4 },
  { id: 'i4-4', restaurantId: 'r4', name: 'BBQ Chicken Wings', price: 280, category: 'Starters', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=600', description: 'Glazed chicken wings with a smoky hickory sauce.', isTopSelling: false, rating: 4.6 },
  { id: 'i4-5', restaurantId: 'r4', name: 'Coke Float', price: 120, category: 'Beverages', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600', description: 'Chilled Coke topped with a scoop of vanilla bean ice cream.', isTopSelling: false, rating: 4.1 },
  { id: 'i4-6', restaurantId: 'r4', name: 'Classic Caesar Salad', price: 260, category: 'Healthy', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', description: 'Romaine lettuce, croutons, and parmesan with Caesar dressing.', isTopSelling: false, rating: 4.3 },

  // Restaurant 5: Arabian Nights
  { id: 'i5-1', restaurantId: 'r5', name: 'Chicken Mandi', price: 420, category: 'Mains', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600', description: 'Aromatic rice with smoked chicken, served with tomato salsa.', isTopSelling: true, rating: 4.9 },
  { id: 'i5-2', restaurantId: 'r5', name: 'Classic Shawarma', price: 150, category: 'Starters', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=600', description: 'Thinly sliced grilled chicken wrapped in soft kuboos.', isTopSelling: true, rating: 4.8 },
  { id: 'i5-3', restaurantId: 'r5', name: 'Hummus & Pita', price: 180, category: 'Sides', image: 'https://images.unsplash.com/photo-1577906046421-3214b39172f5?auto=format&fit=crop&q=80&w=600', description: 'Creamy chickpea dip served with warm freshly baked pita.', isTopSelling: false, rating: 4.6 },
  { id: 'i5-4', restaurantId: 'r5', name: 'Mutton Alfaham', price: 480, category: 'Grill', image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=600', description: 'Arabian style charcoal grilled mutton with Middle Eastern spices.', isTopSelling: true, rating: 4.7 },
  { id: 'i5-5', restaurantId: 'r5', name: 'Falafel Plate', price: 220, category: 'Starters', image: 'https://images.unsplash.com/photo-1593001874117-c99c4edb8150?auto=format&fit=crop&q=80&w=600', description: 'Deep fried chickpea balls served with tahini sauce.', isTopSelling: false, rating: 4.4 },
  { id: 'i5-6', restaurantId: 'r5', name: 'Kunafa', price: 280, category: 'Desserts', image: 'https://images.unsplash.com/photo-1542124948-dc391252a940?auto=format&fit=crop&q=80&w=600', description: 'Sweet cheese pastry soaked in sugar syrup and topped with pistachios.', isTopSelling: false, rating: 4.8 }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rev1', itemId: 'i1-1', userName: 'John Doe', rating: 5, comment: 'Literally the best ghee roast I have ever tasted! So crispy.', date: '2023-10-12' },
  { id: 'rev2', itemId: 'i2-1', userName: 'Jane Smith', rating: 5, comment: 'Dal Makhani was so rich and flavorful, definitely ordering again.', date: '2023-11-05' },
  { id: 'rev3', itemId: 'i4-1', userName: 'Mike Ross', rating: 4, comment: 'Good quantity and fast delivery, but slightly spicy.', date: '2023-11-20' },
  { id: 'rev4', itemId: 'i3-1', userName: 'Sarah Connor', rating: 5, comment: 'Fresh seafood, reminded me of the beach!', date: '2023-12-01' },
  { id: 'rev5', itemId: 'i5-1', userName: 'Harvey Specter', rating: 4.5, comment: 'Authentic Mandi. The smoky flavor is perfection.', date: '2023-12-10' },
  { id: 'rev6', itemId: 'i1-2', userName: 'Rachel Zane', rating: 4, comment: 'Dragon chicken was great, maybe a bit too much oil.', date: '2023-12-15' }
];
