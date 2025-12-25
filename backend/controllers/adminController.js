import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const listRestaurants = async (req, res) => {
  const list = await Restaurant.find({}).populate('owner', 'name email');
  res.json({ ok: true, data: list });
};

export const getRestaurantAdmin = async (req, res) => {
  const id = req.params.restaurantId;
  const resto = await Restaurant.findById(id).populate('owner', 'name email');
  if (!resto) return res.status(404).json({ ok: false });
  const items = await Item.find({ restaurant: id });
  res.json({ ok: true, data: { restaurant: resto, items } });
};

export const approveRestaurant = async (req, res) => {
  const id = req.params.restaurantId;
  const resto = await Restaurant.findByIdAndUpdate(id, { status: 'APPROVED' }, { new: true }).populate('owner');
  if (!resto) return res.status(404).json({ ok: false });
  await Notification.create({ recipientUser: resto.owner._id, forRole: 'OWNER', type: 'ADMIN_APPROVE', data: { restaurantId: id } });
  res.json({ ok: true, data: resto });
};

export const rejectRestaurant = async (req, res) => {
  const id = req.params.restaurantId;
  const resto = await Restaurant.findByIdAndUpdate(id, { status: 'REJECTED' }, { new: true }).populate('owner');
  if (!resto) return res.status(404).json({ ok: false });
  await Notification.create({ recipientUser: resto.owner._id, forRole: 'OWNER', type: 'ADMIN_REJECT', data: { restaurantId: id } });
  res.json({ ok: true, data: resto });
};

export const deleteRestaurant = async (req, res) => {
  const id = req.params.restaurantId;
  await Item.deleteMany({ restaurant: id });
  await Restaurant.findByIdAndDelete(id);
  res.json({ ok: true });
};

export const deleteItemAdmin = async (req, res) => {
  const id = req.params.itemId;
  await Item.findByIdAndDelete(id);
  res.json({ ok: true });
};
