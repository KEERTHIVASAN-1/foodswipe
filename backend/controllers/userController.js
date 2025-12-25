import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import Review from '../models/Review.js';
import { cartAddSchema, cartUpdateSchema } from '../utils/validation.js';

export const getApprovedRestaurants = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const cuisine = req.query.cuisine;
  const location = req.query.location;
  const minRating = parseFloat(req.query.minRating) || 0;
  const sort = req.query.sort || 'createdAt';
  const dir = req.query.dir === 'asc' ? 1 : -1;
  const filter = { status: 'APPROVED' };
  if (cuisine) filter['cuisineTypes'] = { $in: [cuisine] };
  if (location) filter['location'] = new RegExp(location, 'i');
  if (minRating) filter['rating'] = { $gte: minRating };
  const total = await Restaurant.countDocuments(filter);
  const sortObj = {}; sortObj[sort] = dir;
  const list = await Restaurant.find(filter).sort(sortObj).skip((page - 1) * limit).limit(limit);
  res.json({ ok: true, data: list, pagination: { page, limit, total } });
};

export const getRestaurantPublic = async (req, res) => {
  const id = req.params.restaurantId;
  const resto = await Restaurant.findById(id);
  if (!resto || resto.status !== 'APPROVED') return res.status(404).json({ ok: false });
  const items = await Item.find({ restaurant: id, isAvailable: true });
  res.json({ ok: true, data: { restaurant: resto, items } });
};

export const getSwipeItems = async (req, res) => {
  const approved = await Restaurant.find({ status: 'APPROVED' }).select('_id');
  const ids = approved.map(r => r._id);
  const items = await Item.find({ restaurant: { $in: ids }, isAvailable: true });
  const favCounts = await User.aggregate([
    { $unwind: '$favorites' },
    { $group: { _id: '$favorites', count: { $sum: 1 } } }
  ]);
  const favMap = new Map(favCounts.map(f => [f._id.toString(), f.count]));
  const scored = items.map(i => {
    const score = (i.rating || 0) * 0.6 + (favMap.get(i._id.toString()) || 0) * 0.2 + (i.totalOrders || 0) * 0.2;
    return { item: i, score };
  });
  scored.sort((a, b) => b.score - a.score);
  res.json({ ok: true, data: scored.slice(0, 50).map(s => s.item) });
};

export const addFavorite = async (req, res) => {
  const itemId = req.params.itemId;
  await User.updateOne({ _id: req.user.id }, { $addToSet: { favorites: itemId } });
  res.json({ ok: true });
};

export const listFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.json({ ok: true, data: user.favorites });
};

export const removeFavorite = async (req, res) => {
  const itemId = req.params.itemId;
  await User.updateOne({ _id: req.user.id }, { $pull: { favorites: itemId } });
  res.json({ ok: true });
};

export const addCart = async (req, res) => {
  const data = await cartAddSchema.validateAsync(req.body);
  const user = await User.findById(req.user.id);
  const existing = user.cart.find(c => c.item.toString() === data.itemId);
  if (existing) {
    existing.quantity += data.quantity;
  } else {
    user.cart.push({ item: data.itemId, quantity: data.quantity });
  }
  await user.save();
  res.json({ ok: true, data: user.cart });
};

export const updateCart = async (req, res) => {
  const data = await cartUpdateSchema.validateAsync(req.body);
  const user = await User.findById(req.user.id);
  const existing = user.cart.find(c => c.item.toString() === data.itemId);
  if (!existing) return res.status(404).json({ ok: false });
  existing.quantity = data.quantity;
  await user.save();
  res.json({ ok: true, data: user.cart });
};

export const removeCart = async (req, res) => {
  const itemId = req.body.itemId;
  await User.updateOne({ _id: req.user.id }, { $pull: { cart: { item: itemId } } });
  const user = await User.findById(req.user.id);
  res.json({ ok: true, data: user.cart });
};

export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.item');
  res.json({ ok: true, data: user.cart });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ ok: true, data: user });
};

export const updateProfile = async (req, res) => {
  const allowed = ['name', 'address'];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json({ ok: true, data: user });
};
