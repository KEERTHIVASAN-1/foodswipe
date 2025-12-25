import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ['USER', 'OWNER', 'ADMIN'], required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    cart: [CartItemSchema]
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);
