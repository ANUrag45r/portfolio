import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  replySent: { type: Boolean, default: false },
  ipAddress: String,
  userAgent: String
}, { 
  timestamps: true 
});

export default mongoose.model('ContactMessage', ContactMessageSchema);
