import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import Review from '../models/Review.js';
import { hashPassword } from './hash.js';

export const seedData = async () => {
  const count = await Restaurant.countDocuments();
  if (count > 0) return;

  const pwd = await hashPassword('password123');
  const owner1 = await User.create({ name: 'Owner One', email: 'owner1@foodss.local', password: pwd, role: 'OWNER' });
  const owner2 = await User.create({ name: 'Owner Two', email: 'owner2@foodss.local', password: pwd, role: 'OWNER' });
  const user1 = await User.create({ name: 'Alex Johnson', email: 'alex@foodss.local', password: pwd, role: 'USER' });
  const user2 = await User.create({ name: 'Priya Singh', email: 'priya@foodss.local', password: pwd, role: 'USER' });

  const r1 = await Restaurant.create({ owner: owner1._id, name: 'Spice Route Kitchen', location: 'Adyar, Chennai', cuisineTypes: ['South Indian', 'Chinese'], about: 'Authentic flavors.', contactInfo: '9999999999', status: 'APPROVED', rating: 4.5 });
  const r2 = await Restaurant.create({ owner: owner2._id, name: 'Urban Tandoor', location: 'Indiranagar, Bangalore', cuisineTypes: ['North Indian', 'Mughlai'], about: 'Slow-cooked dals.', contactInfo: '8888888888', status: 'APPROVED', rating: 4.3 });
  const r3 = await Restaurant.create({ owner: owner2._id, name: 'Coastal Cravings', location: 'Fort Kochi, Kochi', cuisineTypes: ['Seafood', 'Kerala'], about: 'Fresh catch.', contactInfo: '7777777777', status: 'APPROVED', rating: 4.6 });
  const r4 = await Restaurant.create({ owner: owner1._id, name: 'Bakery Bliss', location: 'Anna Nagar, Chennai', cuisineTypes: ['Bakery'], about: 'Fresh bakes.', contactInfo: '6666666666', status: 'PENDING', rating: 0 });

  const makeItem = async (rest, name, imageUrl, price, category, rating, orders, top) => {
    return Item.create({ restaurant: rest._id, name, imageUrl, price, category, rating, totalOrders: orders, isAvailable: true, isTopSelling: top });
  };

  const items = [];
  items.push(await makeItem(r1, 'Masala Dosa', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', 90, 'Mains', 4.8, 1200, true));
  items.push(await makeItem(r1, 'Gobi Manchurian', 'https://images.unsplash.com/photo-1543352634-8730b198d67b?auto=format&fit=crop&q=80&w=600', 140, 'Starters', 4.6, 900, true));
  items.push(await makeItem(r1, 'Idli Sambar', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', 60, 'Breakfast', 4.4, 700, false));
  items.push(await makeItem(r2, 'Butter Chicken', 'https://images.unsplash.com/photo-1604908176997-4319a6b1b617?auto=format&fit=crop&q=80&w=600', 280, 'Mains', 4.7, 1500, true));
  items.push(await makeItem(r2, 'Garlic Naan', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', 60, 'Breads', 4.5, 1800, false));
  items.push(await makeItem(r2, 'Dal Makhani', 'https://images.unsplash.com/photo-1642114816131-17ea2a3233be?auto=format&fit=crop&q=80&w=600', 220, 'Mains', 4.6, 1100, true));
  items.push(await makeItem(r3, 'Kerala Fish Curry', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', 380, 'Mains', 4.9, 800, true));
  items.push(await makeItem(r3, 'Appam (2 pcs)', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', 60, 'Breads', 4.8, 950, true));
  items.push(await makeItem(r3, 'Prawn Fry', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', 420, 'Starters', 4.7, 650, false));
  items.push(await makeItem(r4, 'Blueberry Muffin', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', 90, 'Bakery', 4.2, 300, false));
  items.push(await makeItem(r4, 'Chocolate Croissant', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', 120, 'Bakery', 4.4, 450, false));

  const makeReview = async (user, rest, item, rating, comment) => {
    return Review.create({ user: user._id, restaurant: rest._id, item: item._id, rating, comment });
  };

  await makeReview(user1, r1, items[0], 5, 'Perfectly crispy, flavorful filling.');
  await makeReview(user2, r2, items[3], 4, 'Rich and creamy, great with naan.');
  await makeReview(user1, r3, items[6], 5, 'Tangy and delicious!');
};
