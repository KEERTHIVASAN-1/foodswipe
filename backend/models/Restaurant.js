import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    cuisineTypes: [{ type: String }],
    about: { type: String },
    contactInfo: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

RestaurantSchema.index({ status: 1 });

export default mongoose.model('Restaurant', RestaurantSchema);
