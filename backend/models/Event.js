import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
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
    eventType: {
      type: String,
      required: true,
      index: true, // e.g. 'Resume Download', 'GitHub Click', 'Project Click'
    },
    eventLabel: {
      type: String,
      default: '', // details like project name, URL, or email
    },
    page: {
      type: String,
      default: '#top', // where the event occurred
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ eventType: 1, timestamp: -1 });

const EventModel = mongoose.model('Event', EventSchema);
export default EventModel;
