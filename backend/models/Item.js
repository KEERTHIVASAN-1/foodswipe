import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isTopSelling: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ItemSchema.index({ restaurant: 1 });

export default mongoose.model('Item', ItemSchema);
