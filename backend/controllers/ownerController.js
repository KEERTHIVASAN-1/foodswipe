import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import { restaurantSchema, itemAddSchema, itemUpdateSchema } from '../utils/validation.js';

export const registerRestaurant = async (req, res) => {
  const data = await restaurantSchema.validateAsync(req.body);
  const r = await Restaurant.create({ owner: req.user.id, name: data.name, location: data.location, cuisineTypes: data.cuisineTypes, about: data.about, contactInfo: data.contactInfo, status: 'PENDING' });
  await Notification.create({ forRole: 'ADMIN', type: 'OWNER_REGISTER', data: { restaurantId: r._id.toString(), ownerId: req.user.id } });
  res.json({ ok: true, data: r });
};

export const ownerDashboard = async (req, res) => {
  const resto = await Restaurant.findOne({ owner: req.user.id });
  if (!resto) return res.json({ ok: true, data: null });
  const items = await Item.find({ restaurant: resto._id });
  const reviews = await Review.find({ restaurant: resto._id }).select('rating');
  const avg = reviews.length ? reviews.reduce((a, c) => a + c.rating, 0) / reviews.length : 0;
  const top = items.slice().sort((a, b) => (b.rating + b.totalOrders) - (a.rating + a.totalOrders)).filter(i => i.isAvailable).slice(0, 10);
  res.json({ ok: true, data: { restaurant: resto, items, topSelling: top, reviewsCount: reviews.length, averageRating: avg } });
};

export const addItem = async (req, res) => {
  const data = await itemAddSchema.validateAsync(req.body);
  const resto = await Restaurant.findById(data.restaurantId);
  if (!resto || resto.owner.toString() !== req.user.id) return res.status(403).json({ ok: false });
  if (resto.status !== 'APPROVED') return res.status(400).json({ ok: false });
  const item = await Item.create({ restaurant: data.restaurantId, name: data.name, imageUrl: data.imageUrl, price: data.price, category: data.category, isAvailable: data.isAvailable });
  res.json({ ok: true, data: item });
};

export const updateItem = async (req, res) => {
  const data = await itemUpdateSchema.validateAsync(req.body);
  const item = await Item.findById(req.params.itemId).populate('restaurant');
  if (!item) return res.status(404).json({ ok: false });
  if (item.restaurant.owner.toString() !== req.user.id) return res.status(403).json({ ok: false });
  const updated = await Item.findByIdAndUpdate(req.params.itemId, data, { new: true });
  res.json({ ok: true, data: updated });
};

export const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.itemId).populate('restaurant');
  if (!item) return res.status(404).json({ ok: false });
  if (item.restaurant.owner.toString() !== req.user.id) return res.status(403).json({ ok: false });
  await Item.findByIdAndDelete(req.params.itemId);
  res.json({ ok: true });
};

export const ownerReviews = async (req, res) => {
  const resto = await Restaurant.findOne({ owner: req.user.id });
  if (!resto) return res.json({ ok: true, data: [] });
  const reviews = await Review.find({ restaurant: resto._id }).populate('item').populate('user', 'name');
  res.json({ ok: true, data: reviews });
};
