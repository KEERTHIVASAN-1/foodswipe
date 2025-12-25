import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  const useMemory = process.env.MONGO_IN_MEMORY === 'true';
  const connectLocal = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodss';
    await mongoose.connect(uri, { autoIndex: true, serverSelectionTimeoutMS: 5000 });
  };
  const connectMemory = async () => {
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    await mongoose.connect(uri, { autoIndex: true });
  };
  try {
    if (useMemory) {
      await connectMemory();
    } else {
      await connectLocal();
    }
  } catch {
    try {
      if (useMemory) {
        await connectLocal();
      } else {
        await connectMemory();
      }
    } catch (e2) {
      throw e2;
    }
  }
};
