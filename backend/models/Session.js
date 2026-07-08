import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    visitTime: {
      type: Date,
      default: Date.now,
    },
    exitTime: {
      type: Date,
      default: Date.now,
    },
    sessionDuration: {
      type: Number,
      default: 0, // In seconds
    },
    device: {
      type: String,
      default: 'Unknown',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    country: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    pagesVisited: {
      type: [String],
      default: [],
    },
    bounce: {
      type: Boolean,
      default: true, // Default to true until a second section/page view occurs
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index({ visitorId: 1, visitTime: -1 });
SessionSchema.index({ visitTime: 1 });

const Session = mongoose.model('Session', SessionSchema);
export default Session;
