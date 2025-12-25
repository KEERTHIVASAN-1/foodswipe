import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

const issue = (user) => {
  const token = signToken({ id: user._id.toString(), role: user.role });
  return { ok: true, token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } };
};

export const registerUser = async (req, res) => {
  const data = await registerSchema.validateAsync(req.body);
  const exists = await User.findOne({ email: data.email });
  if (exists) return res.status(409).json({ ok: false });
  const pwd = await hashPassword(data.password);
  const user = await User.create({ name: data.name, email: data.email, password: pwd, address: data.address, role: 'USER' });
  res.json(issue(user));
};

export const loginUser = async (req, res) => {
  const data = await loginSchema.validateAsync(req.body);
  const user = await User.findOne({ email: data.email, role: 'USER' });
  if (!user) return res.status(401).json({ ok: false });
  const ok = await comparePassword(data.password, user.password);
  if (!ok) return res.status(401).json({ ok: false });
  res.json(issue(user));
};

export const registerOwner = async (req, res) => {
  const data = await registerSchema.validateAsync(req.body);
  const exists = await User.findOne({ email: data.email });
  if (exists) return res.status(409).json({ ok: false });
  const pwd = await hashPassword(data.password);
  const user = await User.create({ name: data.name, email: data.email, password: pwd, address: data.address, role: 'OWNER' });
  res.json(issue(user));
};

export const loginOwner = async (req, res) => {
  const data = await loginSchema.validateAsync(req.body);
  const user = await User.findOne({ email: data.email, role: 'OWNER' });
  if (!user) return res.status(401).json({ ok: false });
  const ok = await comparePassword(data.password, user.password);
  if (!ok) return res.status(401).json({ ok: false });
  res.json(issue(user));
};

export const loginAdmin = async (req, res) => {
  const data = await loginSchema.validateAsync(req.body);
  const user = await User.findOne({ email: data.email, role: 'ADMIN' });
  if (!user) return res.status(401).json({ ok: false });
  const ok = await comparePassword(data.password, user.password);
  if (!ok) return res.status(401).json({ ok: false });
  res.json(issue(user));
};
