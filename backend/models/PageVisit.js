import mongoose from 'mongoose';

const PageVisitSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      index: true, // e.g. '#profile', '#contact'
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    timeSpent: {
      type: Number,
      default: 0, // In seconds spent on the page/section
    },
    scrollPercentage: {
      type: Number,
      default: 0,
    },
    clickedButtons: [
      {
        buttonId: String,
        label: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

PageVisitSchema.index({ sessionId: 1, timestamp: 1 });

const PageVisit = mongoose.model('PageVisit', PageVisitSchema);
export default PageVisit;
