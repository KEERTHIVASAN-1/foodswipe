import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    forRole: { type: String, enum: ['ADMIN', 'OWNER', 'USER'] },
    type: { type: String, required: true },
    data: { type: Object },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);
