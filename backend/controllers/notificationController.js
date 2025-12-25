import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const role = req.user.role;
  const q = role === 'ADMIN' ? { forRole: 'ADMIN' } : { recipientUser: req.user.id };
  const list = await Notification.find(q).sort({ createdAt: -1 });
  res.json({ ok: true, data: list });
};

export const markRead = async (req, res) => {
  const id = req.params.id;
  await Notification.findByIdAndUpdate(id, { isRead: true });
  res.json({ ok: true });
};
