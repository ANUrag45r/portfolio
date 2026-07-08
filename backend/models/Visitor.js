import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstVisit: {
      type: Date,
      default: Date.now,
    },
    lastVisit: {
      type: Date,
      default: Date.now,
    },
    totalVisits: {
      type: Number,
      default: 1,
    },
    country: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    state: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    browser: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    browserVersion: {
      type: String,
      default: 'Unknown',
    },
    operatingSystem: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    deviceType: {
      type: String,
      default: 'desktop',
      enum: ['desktop', 'tablet', 'mobile'],
      index: true,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
    tablet: {
      type: Boolean,
      default: false,
    },
    desktop: {
      type: Boolean,
      default: true,
    },
    screenWidth: {
      type: Number,
      default: 0,
    },
    screenHeight: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'Unknown',
    },
    timezone: {
      type: String,
      default: 'Unknown',
    },
    referrer: {
      type: String,
      default: 'Direct',
      index: true,
    },
    landingPage: {
      type: String,
      default: '/',
    },
    lastPage: {
      type: String,
      default: '/',
    },
    totalSessionTime: {
      type: Number,
      default: 0, // In seconds
    },
    averageSessionTime: {
      type: Number,
      default: 0, // In seconds
    },
  },
  {
    timestamps: true,
  }
);

// Optimize country and device indexes for speed of aggregation pipelines
VisitorSchema.index({ country: 1, deviceType: 1 });
VisitorSchema.index({ createdAt: 1 });

const Visitor = mongoose.model('Visitor', VisitorSchema);
export default Visitor;
