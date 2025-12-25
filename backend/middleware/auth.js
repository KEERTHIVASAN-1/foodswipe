import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ ok: false });
  }
  try {
    const payload = verifyToken(parts[1]);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ ok: false });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    res.status(401).json({ ok: false });
  }
};
