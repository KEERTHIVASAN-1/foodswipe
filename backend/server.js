import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db.js';
import app from './app.js';
import User from './models/User.js';
import { hashPassword } from './utils/hash.js';
import { seedData } from './utils/seedData.js';

const start = async () => {
  await connectDB();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodss.local';
  const adminPwd = process.env.ADMIN_PASSWORD || 'admin123';
  const exists = await User.findOne({ email: adminEmail, role: 'ADMIN' });
  if (!exists) {
    const pwd = await hashPassword(adminPwd);
    await User.create({ name: 'Admin', email: adminEmail, password: pwd, role: 'ADMIN' });
  }
  const port = process.env.PORT || 4000;
  if (process.env.SEED === 'true') {
    await seedData();
  }
  app.listen(port, () => {});
};

start();
